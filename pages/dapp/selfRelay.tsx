import React, { useState } from 'react';

import { Flex, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useAccount, useSigner } from 'wagmi';

import { SelfRelaySteps } from '@utils/types';
import useLocalStorage from '@hooks/useLocalStorage';

import DappLayout from '@components/DappLayout';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import SelfRelayAcknowledgement from '@components/SelfRelayRegistration/SelfRelayAcknowledgement';
import SwitchAndSignRegistration from '@components/SelfRelayRegistration/SwitchAndSignRegistration';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import SwitchAndPayAcknowledgement from '@components/SelfRelayRegistration/SwitchAndPayAcknowledgement';
import SwitchAndPayRegistration from '@components/SelfRelayRegistration/SwitchAndPayRegistration';
import { SessionExpired, Success } from '@components/SharedRegistration/DisplayPrompts';

interface SelfRelayRegistrationInterface {}

const SelfRelayRegistration: React.FC<SelfRelayRegistrationInterface> = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { data: signer } = useSigner();
	const { address } = useAccount();

	const [localState, setLocalState] = useLocalStorage();
	const [tempRelayer, setTempRelayer] = useState('');

	const [isSmallerThan1000] = useMediaQuery('(max-width: 1200px)', {
		ssr: true,
		fallback: false, // return false on the server, and re-evaluate on the client side
	});

	const setNextStep = () => {
		setLocalState({
			address: address!,
			trustedRelayer: tempRelayer,
			step: SelfRelaySteps.SwitchAndPayOne,
		});
	};

	if (!signer) {
		return null;
	}

	return (
		<DappLayout
			isOpen={isOpen}
			onClose={onClose}
			heading="Relay with your own wallets"
			subHeading="sign wtih one wallet, pay with another"
		>
			<Flex
				mt={3}
				mb={10}
				p={5}
				gap={5}
				flexDirection={isSmallerThan1000 ? 'column' : 'row'}
				justifyContent="center"
				alignItems="center"
			>
				<CompletionSteps />
				{localState.step === SelfRelaySteps.AcknowledgeAndSign && (
					<SelfRelayAcknowledgement
						setNextStep={setNextStep}
						tempRelayer={tempRelayer}
						setTempRelayer={setTempRelayer}
						address={address!}
						onOpen={onOpen}
					/>
				)}
				{localState.step === SelfRelaySteps.SwitchAndPayOne && (
					<SwitchAndPayAcknowledgement
						setNextStep={() => setLocalState({ step: SelfRelaySteps.GracePeriod })}
					/>
				)}
				{localState.step === SelfRelaySteps.GracePeriod && (
					<GracePeriod
						setExpiryStep={() => setLocalState({ step: SelfRelaySteps.RegisterAndSign })}
						address={address!}
						signer={signer}
					/>
				)}
				{localState.step === SelfRelaySteps.RegisterAndSign && (
					<SwitchAndSignRegistration
						signer={signer!}
						setExpiryStep={() => setLocalState({ step: SelfRelaySteps.Expired })}
						address={address!}
						onOpen={onOpen}
						setNextStep={() => {
							setLocalState({ step: SelfRelaySteps.SwitchAndPayTwo });
						}}
					/>
				)}
				{localState.step === SelfRelaySteps.SwitchAndPayTwo && (
					<SwitchAndPayRegistration
						signer={signer!}
						setExpiryStep={() => setLocalState({ step: SelfRelaySteps.Expired })}
						setNextStep={() => {
							setLocalState({ step: SelfRelaySteps.Success });
						}}
					/>
				)}
				{localState.step === SelfRelaySteps.Success && <Success />}
				{localState.step === SelfRelaySteps.Expired && <SessionExpired />}
			</Flex>
		</DappLayout>
	);
};

export default SelfRelayRegistration;
