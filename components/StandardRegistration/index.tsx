import { StandardSteps } from '@utils/types';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import CompletionSteps from './CompletionSteps';
import GracePeriod from './GracePeriod';
import RegisterAndPay from './RegisterAndPay';
import Requirements from './Requirements';
import StandardAcknowledgement from './StandardAcknowledgement';

// TODO expract this out into useModal
interface StandardRegistrationInterface {
	onOpen: () => void;
}

const StandardRegistration: React.FC<StandardRegistrationInterface> = ({ onOpen }) => {
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	const [expiryTimestamp, setExpiryTimestamp] = useState<number>(
		new Date().getTime() + 1 * 5 * 1000
	);
	const [showStep, setShowStep] = useState<StandardSteps>('requirements');

	return (
		<>
			{showStep === 'requirements' && (
				<Requirements
					setShowStep={setShowStep}
					address={address as string}
					isConnected={isConnected}
				/>
			)}
			{showStep !== 'requirements' && <CompletionSteps />}
			{showStep === 'acknowledge-and-pay' && (
				<StandardAcknowledgement
					setShowStep={setShowStep}
					address={address as string}
					isConnected={isConnected}
					onOpen={onOpen}
				/>
			)}
			{showStep === 'grace-period' && (
				<GracePeriod setShowStep={setShowStep} expiryTimestamp={expiryTimestamp} />
			)}
			{showStep === 'register-and-pay' && (
				<RegisterAndPay setShowStep={setShowStep} expiryTimestamp={expiryTimestamp} />
			)}
		</>
	);
};

export default StandardRegistration;
