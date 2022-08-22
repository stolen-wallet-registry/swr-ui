import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import Requirements from '@components/SharedRegistration/Requirements';
import SwitchAndPayAcknowledgement from '@components/SelfRelayRegistration/SwitchAndPayAcknowledgement';
import SwitchAndPayRegistration from '@components/SelfRelayRegistration/SwitchAndPayRegistration';
import Acknowledgement from '@components/SharedRegistration/Acknowledgement';
import { SelfRelaySteps } from '@utils/types';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import RegisterAndSign from './RegisterAndSIgn';

interface SelfRelayRegistrationInterface {
	onOpen: () => void;
}

const SelfRelayRegistration: React.FC<SelfRelayRegistrationInterface> = ({ onOpen }) => {
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	const [expiryTimestamp, setExpiryTimestamp] = useState<number>(0);
	const [showStep, setShowStep] = useState<SelfRelaySteps>('requirements');

	useEffect(() => {
		setExpiryTimestamp(new Date().getTime() + 1 * 5 * 1000);
	}, []);

	return (
		<>
			{showStep === 'requirements' && (
				<Requirements
					handleBegin={() => setShowStep('acknowledge-and-sign')}
					registrationType="selfRelay"
					setShowStep={setShowStep}
					address={address as string}
					isConnected={isConnected}
				/>
			)}
			{showStep !== 'requirements' && <CompletionSteps registrationType="selfRelay" />}
			{showStep === 'acknowledge-and-sign' && (
				<Acknowledgement
					registrationType="selfRelay"
					setNextStep={() => setShowStep('switch-and-pay-one')}
					address={address as string}
					isConnected={isConnected}
					onOpen={onOpen}
				/>
			)}
			{showStep === 'switch-and-pay-one' && (
				<SwitchAndPayAcknowledgement setShowStep={setShowStep} />
			)}
			{showStep === 'grace-period' && <GracePeriod setShowStep={setShowStep} />}
			{showStep === 'register-and-sign' && <RegisterAndSign />}
			{showStep === 'switch-and-pay-two' && <SwitchAndPayRegistration setShowStep={setShowStep} />}
		</>
	);
};

export default SelfRelayRegistration;
