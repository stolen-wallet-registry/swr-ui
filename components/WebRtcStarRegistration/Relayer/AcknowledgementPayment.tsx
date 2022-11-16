import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import useLocalStorage, { accessLocalStorage, StateConfig } from '@hooks/useLocalStorage';
import { SelfRelaySteps } from '@utils/types';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { Contract, Signer, ethers } from 'ethers';
import {
	StolenWalletRegistryAbi,
	StolenWalletRegistryFactory,
} from '@wallet-hygiene/swr-contracts';
import { ACKNOWLEDGEMENT_KEY, getSignatureWithExpiry } from '@utils/signature';
import { PROTOCOLS, relayerPostBackMsg } from '@utils/libp2p';
import { Libp2p } from 'libp2p';

interface AcknowledgementPaymentProps {
	libp2p: Libp2p;
}

const AcknowledgementPayment: React.FC<AcknowledgementPaymentProps> = ({ libp2p }) => {
	const { isConnected } = useAccount();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const [localState, setLocalState] = useLocalStorage();
	const [isMounted, setIsMounted] = useState(false);

	const registryContract = StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
		signer!
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted || !isConnected) {
		return null;
	}

	const signAndPay = async () => {
		try {
			const storedSignature = getSignatureWithExpiry({
				keyRef: ACKNOWLEDGEMENT_KEY,
				chainId: chain?.id!,
				address: localState.trustedRelayerFor!,
			});

			const deadline = ethers.BigNumber.from(storedSignature.deadline);
			const nonce = ethers.BigNumber.from(storedSignature.nonce);
			const { v, r, s } = ethers.utils.splitSignature(storedSignature.value);

			const tx = await registryContract.acknowledgementOfRegistry(
				deadline,
				nonce,
				localState.trustedRelayerFor!,
				v,
				r,
				s
			);

			const receipt = await tx.wait();
			setLocalState({ acknowledgementReceipt: JSON.stringify(receipt) });
			await relayerPostBackMsg({
				libp2p: libp2p,
				localState: accessLocalStorage(),
				protocol: PROTOCOLS.REG_PAY,
			});
			console.log(receipt);
			setLocalState({ acknowledgementReceipt: JSON.stringify(receipt) });
			console.log(receipt);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<RegistrationSection title="Pay for Acknowledgement">
			<Flex flexDirection="column">
				<Text mb={5}>Sign and Pay for Acknowledgement from {localState.trustedRelayerFor}</Text>
			</Flex>
			<Flex justifyContent="flex-end" gap={5}>
				<Button onClick={signAndPay}>Sign and Pay</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default AcknowledgementPayment;
