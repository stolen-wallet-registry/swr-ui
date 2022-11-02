import React, { useEffect, useState } from 'react';

import { useAccount } from 'wagmi';

import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';

import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import SwitchAndPayAcknowledgement from '@components/SelfRelayRegistration/SwitchAndPayAcknowledgement';
import SwitchAndPayRegistration from '@components/SelfRelayRegistration/SwitchAndPayRegistration';
import Acknowledgement from '@components/SharedRegistration/Acknowledgement';
import RegisterAndSign from '@components/SelfRelayRegistration/RegisterAndSIgn';
import DappLayout from '@components/DappLayout';
import { SelfRelaySteps } from '@utils/types';
import { Flex } from '@chakra-ui/react';
interface SelfRelayRegistrationInterface {
	onOpen: () => void;
}

const SelfRelayRegistration: React.FC<SelfRelayRegistrationInterface> = ({ onOpen }) => {
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	const [localState, setLocalState] = useLocalStorage();
	const [tempRelayer, setTempRelayer] = useState('');

	const setNextStep = () => {
		setLocalState({
			step: SelfRelaySteps.SwitchAndPayOne,
			trustedRelayer: tempRelayer,
		});
	};

	return (
		<DappLayout
			heading="Relay with your own wallets"
			subHeading="sign wtih one wallet, pay with another"
		>
			<Flex mt={20} mb={10} p={10} gap={5}>
				<CompletionSteps />
				{localState.step === SelfRelaySteps.AcknowledgeAndSign && (
					<Acknowledgement
						setNextStep={setNextStep}
						tempRelayer={tempRelayer}
						setTempRelayer={setTempRelayer}
						address={address as string}
						onOpen={onOpen}
						isConnected={isConnected}
					/>
				)}
				{localState.step === SelfRelaySteps.SwitchAndPayOne && <SwitchAndPayAcknowledgement />}
				{localState.step === SelfRelaySteps.GracePeriod && (
					<GracePeriod setLocalState={setLocalState} nextStep={SelfRelaySteps.RegisterAndSign} />
				)}
				{localState.step === SelfRelaySteps.RegisterAndSign && <RegisterAndSign />}
				{localState.step === SelfRelaySteps.SwitchAndPayTwo && <SwitchAndPayRegistration />}
			</Flex>
		</DappLayout>
	);
};

export default SelfRelayRegistration;
