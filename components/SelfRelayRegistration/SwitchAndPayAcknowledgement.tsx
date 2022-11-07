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

interface SwitchAndPayAcknowledgementProps {}

const SwitchAndPayAcknowledgement: React.FC<SwitchAndPayAcknowledgementProps> = ({}) => {
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const [localState, setLocalState] = useLocalStorage();
	const [isMounted, setIsMounted] = useState(false);
	const provider = useProvider();
	const [deadline, setDeadline] = useState<ethers.BigNumber | null>(null);
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
				address: localState.address!,
			});

			// const deadline = ethers.BigNumber.from(new Date(storedSignature.deadline).getTime());
			const { v, r, s } = ethers.utils.splitSignature(storedSignature.value);
			// storedSignature.deadline,
			const tx = await registryContract.acknowledgementOfRegistry(localState.address!, v, r, s);

			const receipt = await tx.wait();
			console.log(receipt);
		} catch (error) {
			console.error(error);
		}
	};

	const backButtonAction = () => {
		setLocalState({ step: SelfRelaySteps.AcknowledgeAndSign });
	};

	if (isConnected && address !== localState.trustedRelayer) {
		return (
			<RegistrationSection title="Waiting Trusted Relayer">
				<Text>Please switch to your other account ({localState.trustedRelayer})</Text>
				<Text> so you can pay for the acknowledgement step and proceed</Text>
				<Button onClick={backButtonAction}>Back</Button>
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
				<Button onClick={backButtonAction}>Back</Button>
				<Button onClick={signAndPay}>Sign and Pay</Button>
			</Flex>
		</RegistrationSection>
	);
};

export default SwitchAndPayAcknowledgement;
