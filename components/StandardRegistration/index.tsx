import { StandardSteps } from '@utils/types';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import CompletionSteps from '../SharedRegistration/CompletionSteps';
import GracePeriod from '../SharedRegistration/GracePeriod';
import Requirements from '../SharedRegistration/Requirements';
import RegisterAndPay from './RegisterAndPay';
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

	const [expiryTimestamp, setExpiryTimestamp] = useState<number>(0);
	const [showStep, setShowStep] = useState<StandardSteps>('requirements');

	useEffect(() => {
		setExpiryTimestamp(new Date().getTime() + 1 * 5 * 1000);
	}, []);

	return (
		<>
			{showStep === 'requirements' && (
				<Requirements
					registrationType="standard"
					setShowStep={setShowStep}
					address={address as string}
					isConnected={isConnected}
				/>
			)}
			{showStep !== 'requirements' && <CompletionSteps registrationType="standard" />}
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
