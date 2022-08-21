import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import Requirements from '@components/SharedRegistration/Requirements';
import SwitchAndPay from '@components/SelfRelayRegistration/SwitchAndPay';
import AcknowledgeAndSign from '@components/SelfRelayRegistration/AcknowledgeAndSign';
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
					registrationType="selfRelay"
					setShowStep={setShowStep}
					address={address as string}
					isConnected={isConnected}
				/>
			)}
			{showStep !== 'requirements' && <CompletionSteps registrationType="selfRelay" />}
			{showStep === 'acknowledge-and-sign' && <AcknowledgeAndSign />}

			{showStep === 'switch-and-pay' && <SwitchAndPay />}
			{showStep === 'grace-period' && (
				<GracePeriod setShowStep={setShowStep} expiryTimestamp={expiryTimestamp} />
			)}
			{showStep === 'register-and-sign' && <RegisterAndSign />}
			{showStep === 'switch-and-pay' && <SwitchAndPay />}
		</>
	);
};

export default SelfRelayRegistration;
