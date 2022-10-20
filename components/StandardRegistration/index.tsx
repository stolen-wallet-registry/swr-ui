import { useAccount } from 'wagmi';
import CompletionSteps from '../SharedRegistration/CompletionSteps';
import GracePeriod from '../SharedRegistration/GracePeriod';
import Requirements from '../SharedRegistration/Requirements';
import RegisterAndPay from './RegisterAndPay';
import Acknowledgement from '../SharedRegistration/Acknowledgement';
import useLocalStorage from '@hooks/useLocalStorage';

// TODO expract this out into useModal
interface StandardRegistrationInterface {
	onOpen: () => void;
}

const StandardRegistration: React.FC<StandardRegistrationInterface> = ({ onOpen }) => {
	const [localState, setLocalState] = useLocalStorage();
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	return (
		<>
			{localState.step === 'requirements' && (
				<Requirements
					handleBegin={() => setLocalState({ step: 'acknowledge-and-pay' })}
					address={address as string}
					isConnected={isConnected}
				/>
			)}
			{localState.step !== 'requirements' && <CompletionSteps />}
			{localState.step === 'acknowledge-and-pay' && (
				<Acknowledgement
					setNextStep={() => setLocalState({ step: 'grace-period' })}
					address={address as string}
					isConnected={isConnected}
					onOpen={onOpen}
				/>
			)}
			{localState.step === 'grace-period' && <GracePeriod setLocalState={setLocalState} />}
			{localState.step === 'register-and-pay' && <RegisterAndPay setLocalState={setLocalState} />}
		</>
	);
};

export default StandardRegistration;
