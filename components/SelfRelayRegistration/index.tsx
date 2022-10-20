import React from 'react';

import { useAccount } from 'wagmi';

import useLocalStorage from '@hooks/useLocalStorage';

import RegisterAndSign from './RegisterAndSIgn';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import Requirements from '@components/SharedRegistration/Requirements';
import SwitchAndPayAcknowledgement from '@components/SelfRelayRegistration/SwitchAndPayAcknowledgement';
import SwitchAndPayRegistration from '@components/SelfRelayRegistration/SwitchAndPayRegistration';
import Acknowledgement from '@components/SharedRegistration/Acknowledgement';
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

	return (
		<>
			{localState.step === 'requirements' && (
				<Requirements
					handleBegin={() => setLocalState({ step: 'acknowledge-and-sign' })}
					address={address as string}
					isConnected={isConnected}
				/>
			)}
			{localState.step !== 'requirements' && <CompletionSteps />}
			{localState.step === 'acknowledge-and-sign' && (
				<Acknowledgement
					setNextStep={() => setLocalState({ step: 'switch-and-pay-one' })}
					address={address as string}
					isConnected={isConnected}
					onOpen={onOpen}
				/>
			)}
			{localState.step === 'switch-and-pay-one' && <SwitchAndPayAcknowledgement />}
			{localState.step === 'grace-period' && <GracePeriod setLocalState={setLocalState} />}
			{localState.step === 'register-and-sign' && <RegisterAndSign />}
			{localState.step === 'switch-and-pay-two' && <SwitchAndPayRegistration />}
		</>
	);
};

export default SelfRelayRegistration;
