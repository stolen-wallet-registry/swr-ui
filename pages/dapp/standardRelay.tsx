import { useAccount } from 'wagmi';
import useLocalStorage from '@hooks/useLocalStorage';
import Acknowledgement from '@components/SharedRegistration/Acknowledgement';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import RegisterAndPay from '@components/StandardRegistration/RegisterAndPay';
import DappLayout from '@components/DappLayout';
import { StandardSteps } from '@utils/types';
import { Flex } from '@chakra-ui/react';
import { useState } from 'react';

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

	const [localState, setLocalState] = useLocalStorage();
	const [tempRelayer, setTempRelayer] = useState('');

	const setNextStep = () => {
		setLocalState({
			step: StandardSteps.GracePeriod,
			trustedRelayer: tempRelayer,
		});
	};

	return (
		<DappLayout heading="Standard Relay" subHeading="pay and register on the same wallet">
			<Flex mt={20} mb={10} p={10} gap={5}>
				<CompletionSteps />
				{localState.step === StandardSteps.AcknowledgeAndPay && (
					<Acknowledgement
						setNextStep={setNextStep}
						tempRelayer={tempRelayer}
						setTempRelayer={setTempRelayer}
						// setTrustedRelayer={(value: string) => setLocalState({ trustedRelayer: value })}
						address={address as string}
						isConnected={isConnected}
						onOpen={onOpen}
					/>
				)}
				{localState.step === StandardSteps.GracePeriod && (
					<GracePeriod setLocalState={setLocalState} nextStep={StandardSteps.RegisterAndPay} />
				)}
				{localState.step === StandardSteps.RegisterAndPay && (
					<RegisterAndPay setLocalState={setLocalState} />
				)}
			</Flex>
		</DappLayout>
	);
};

export default StandardRegistration;
