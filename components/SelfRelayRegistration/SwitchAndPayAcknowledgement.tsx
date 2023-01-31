import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import useLocalStorage from '@hooks/useLocalStorage';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { ethers } from 'ethers';
import { StolenWalletRegistryFactory } from '@wallet-hygiene/swr-contracts';
import { ACKNOWLEDGEMENT_KEY, getSignatureWithExpiry } from '@utils/signature';

interface SwitchAndPayAcknowledgementProps {
	setNextStep: () => void;
}

const SwitchAndPayAcknowledgement: React.FC<SwitchAndPayAcknowledgementProps> = ({
	setNextStep,
}) => {
	const { address, isConnected } = useAccount();

	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const [localState, setLocalState] = useLocalStorage();
	const [isMounted, setIsMounted] = useState(false);
	console.log(signer);

	const registryContract = StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
		signer!
	);

	const signAndPay = async () => {
		try {
			const storedSignature = getSignatureWithExpiry({
				keyRef: ACKNOWLEDGEMENT_KEY,
				chainId: chain?.id!,
				address: localState.address!,
			});

			const { v, r, s } = ethers.utils.splitSignature(storedSignature.value);
			debugger;
			const tx = await registryContract.acknowledgementOfRegistry(
				storedSignature.deadline,
				storedSignature.nonce,
				localState.address!,
				v,
				r,
				s
			);

			const receipt = await tx.wait();

			setLocalState({ acknowledgementReceipt: JSON.stringify(receipt) });
			console.log(receipt);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (localState.acknowledgementReceipt) {
			setNextStep();
		}
	}, [localState.acknowledgementReceipt]);

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
				<Text> so you can pay for the acknowledgement step and proceed</Text>
			</RegistrationSection>
		);
	}

	return (
		<RegistrationSection title="Pay for Acknowledgement">
			<Flex flexDirection="column">
				<Text>Sign and Pay for Acknowledgement from {localState.trustedRelayer}</Text>
				<Text mb={5}>Sign and Pay for Acknowledgement from {localState.address}</Text>
			</Flex>
			<Flex justifyContent="flex-end" gap={5}>
				<Button onClick={signAndPay}>Sign and Pay</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default SwitchAndPayAcknowledgement;
