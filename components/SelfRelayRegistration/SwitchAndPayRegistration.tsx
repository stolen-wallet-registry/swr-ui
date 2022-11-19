import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import useLocalStorage from '@hooks/useLocalStorage';
import { SelfRelaySteps } from '@utils/types';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { ethers, Signer } from 'ethers';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { getSignatureWithExpiry, REGISTRATION_KEY } from '@utils/signature';
import { Timer } from '@components/Timer';
import useRegBlocksLeft from '@hooks/useRegBlocksLeft';

interface SwitchAndPayRegistrationProps {
	setNextStep: () => void;
	setExpiryStep: () => void;
	signer: Signer;
}

const SwitchAndPayRegistration: React.FC<SwitchAndPayRegistrationProps> = ({
	setNextStep,
	setExpiryStep,
	signer,
}) => {
	const [localState, setLocalState] = useLocalStorage();
	const { address, isConnected } = useAccount();
	const { chain } = useNetwork();
	const { expiryBlock } = useRegBlocksLeft(localState.address!, signer);

	const [isMounted, setIsMounted] = useState(false);

	const registryContract = StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
		signer!
	);

	const signAndPay = async () => {
		try {
			const storedSignature = getSignatureWithExpiry({
				keyRef: REGISTRATION_KEY,
				chainId: chain?.id!,
				address: localState.address!,
			});

			const { v, r, s } = ethers.utils.splitSignature(storedSignature.value);

			const tx = await registryContract.walletRegistration(
				storedSignature.deadline,
				storedSignature.nonce,
				localState.address!,
				v,
				r,
				s
			);

			const receipt = await tx.wait();

			setLocalState({ registrationReceipt: JSON.stringify(receipt) });
			console.log(receipt);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (localState.registrationReceipt) {
			setNextStep();
		}
	}, [localState.registrationReceipt]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted || !isConnected || !signer) {
		return null;
	}

	if (isConnected && address !== localState.trustedRelayer) {
		return (
			<RegistrationSection title="Waiting Trusted Relayer">
				<Text>Please switch to your other account ({localState.trustedRelayer})</Text>
				<Text> so you can pay for the registration step and proceed</Text>
			</RegistrationSection>
		);
	}

	return (
		<RegistrationSection title="Pay for Registration">
			{expiryBlock && <Timer expiryBlock={expiryBlock} setExpiryStep={setExpiryStep} />}
			<Flex flexDirection="column">
				<Text>Sign and Pay for Registration from {localState.trustedRelayer}</Text>
				<Text mb={5}>Sign and Pay for Registration from {localState.address}</Text>
			</Flex>
			<Flex justifyContent="flex-end" gap={5}>
				<Button onClick={signAndPay}>Sign and Pay</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default SwitchAndPayRegistration;
