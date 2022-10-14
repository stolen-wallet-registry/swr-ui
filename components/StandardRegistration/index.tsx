import { StandardSteps } from '@utils/types';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import CompletionSteps from '../SharedRegistration/CompletionSteps';
import GracePeriod from '../SharedRegistration/GracePeriod';
import Requirements from '../SharedRegistration/Requirements';
import RegisterAndPay from './RegisterAndPay';
import Acknowledgement from '../SharedRegistration/Acknowledgement';

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

	const [showStep, setShowStep] = useState<StandardSteps>('requirements');

	return (
		<>
			{showStep === 'requirements' && (
				<Requirements
					handleBegin={() => setShowStep('acknowledge-and-pay')}
					registrationType="standard"
					setShowStep={setShowStep}
					address={address as string}
					isConnected={isConnected}
				/>
			)}
			{showStep !== 'requirements' && <CompletionSteps registrationType="standard" />}
			{showStep === 'acknowledge-and-pay' && (
				<Acknowledgement
					registrationType="standard"
					setNextStep={() => setShowStep('grace-period')}
					address={address as string}
					isConnected={isConnected}
					onOpen={onOpen}
				/>
			)}
			{showStep === 'grace-period' && <GracePeriod setShowStep={setShowStep} />}
			{showStep === 'register-and-pay' && <RegisterAndPay setShowStep={setShowStep} />}
		</>
	);
};

export default StandardRegistration;