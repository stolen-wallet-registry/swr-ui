import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import { SelfRelaySteps } from '@utils/types';
import { CONTRACT_ADDRESSES } from '@utils/constants';
import { Contract, Signer, ethers } from 'ethers';
import {
	StolenWalletRegistryAbi,
	StolenWalletRegistryFactory,
} from '@wallet-hygiene/swr-contracts';
import { ACKNOWLEDGEMENT_KEY, getSignatureWithExpiry } from '@utils/signature';

interface AcknowledgementPaymentProps {}

const AcknowledgementPayment: React.FC<AcknowledgementPaymentProps> = ({}) => {
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const [localState, setLocalState] = useLocalStorage();
	const [isMounted, setIsMounted] = useState(false);
	console.log(signer);

	const registryContract = StolenWalletRegistryFactory.connect(
		CONTRACT_ADDRESSES?.[chain?.name!].StolenWalletRegistry,
		signer!
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// useEffect(() => {
	// 	const getDeadline = async () => {
	// 		const deadline = await registryContract['getDeadline(address)'](localState.address!);
	// 		debugger;
	// 		setDeadline(deadline);
	// 	};
	// 	getDeadline();
	// }, []);

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
			console.log(receipt);
			setLocalState({ acknowledgementReceipt: JSON.stringify(receipt) });
			console.log(receipt);
		} catch (error) {
			console.error(error);
		}
	};

	const backButtonAction = () => {
		setLocalState({ step: SelfRelaySteps.AcknowledgeAndSign });
	};

	return (
		<RegistrationSection title="Pay for Acknowledgement">
			<Flex flexDirection="column">
				<Text mb={5}>Sign and Pay for Acknowledgement from {localState.trustedRelayerFor}</Text>
			</Flex>
			<Flex justifyContent="flex-end" gap={5}>
				<Button onClick={backButtonAction}>Back</Button>
				<Button onClick={signAndPay}>Sign and Pay</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default AcknowledgementPayment;
