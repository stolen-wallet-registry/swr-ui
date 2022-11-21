import React, { useState } from 'react';

import { useAccount, useNetwork, useSigner } from 'wagmi';

import useLocalStorage from '@hooks/useLocalStorage';

import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import SwitchAndPayAcknowledgement from '@components/SelfRelayRegistration/SwitchAndPayAcknowledgement';
import SwitchAndPayRegistration from '@components/SelfRelayRegistration/SwitchAndPayRegistration';
import DappLayout from '@components/DappLayout';
import { SelfRelaySteps } from '@utils/types';
import { Flex, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import SelfRelayAcknowledgement from '@components/SelfRelayRegistration/SelfRelayAcknowledgement';
import Success from '@components/SharedRegistration/Success';
import { SessionExpired } from '@components/SharedRegistration/SessionExpired';
import SwitchAndSignRegistration from '@components/SelfRelayRegistration/SwitchAndSignRegistration';

interface SelfRelayRegistrationInterface {}

const SelfRelayRegistration: React.FC<SelfRelayRegistrationInterface> = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { data: signer } = useSigner();
	const { chain } = useNetwork();
	const { address } = useAccount();

	const [localState, setLocalState] = useLocalStorage();
	const [tempRelayer, setTempRelayer] = useState('');

	const [isSmallerThan1000] = useMediaQuery('(max-width: 1200px)', {
		ssr: true,
		fallback: false, // return false on the server, and re-evaluate on the client side
	});

	const setNextStep = () => {
		setLocalState({
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
