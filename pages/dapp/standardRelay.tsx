import { useAccount, useNetwork } from 'wagmi';
import useLocalStorage from '@hooks/useLocalStorage';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import RegisterAndPay from '@components/StandardRegistration/RegisterAndPay';
import DappLayout from '@components/DappLayout';
import { StandardSteps } from '@utils/types';
import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ACKNOWLEDGEMENT_KEY } from '@utils/signature';
import StandardAckowledgement from '@components/StandardRegistration/StandardAckowledgement';

// TODO expract this out into useModal
interface StandardRegistrationInterface {
	onOpen: () => void;
}

const StandardRegistration: React.FC<StandardRegistrationInterface> = ({ onOpen }) => {
	const { chain } = useNetwork();
	const { connector, address, isConnected } = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('Connected', { address, connector, isReconnected });
		},
	});

	const [localState, setLocalState] = useLocalStorage();
	const [tempRelayer, setTempRelayer] = useState('');

	const setNextStep = () => {
		setLocalState({ step: StandardSteps.GracePeriod });
	};

	useEffect(() => {
		setLocalState({ trustedRelayer: address });
	}, []);

	return (
		<DappLayout heading="Standard Relay" subHeading="pay and register on the same wallet">
			<Flex mt={20} mb={10} p={10} gap={5}>
				<CompletionSteps />
				{localState.step === StandardSteps.AcknowledgeAndPay && (
					<StandardAckowledgement
						setNextStep={setNextStep}
						tempRelayer={tempRelayer}
						setTempRelayer={setTempRelayer}
						address={address as string}
						onOpen={onOpen}
					/>
				)}
				{localState.step === StandardSteps.GracePeriod && (
					<GracePeriod
						setLocalState={setLocalState}
						nextStep={StandardSteps.RegisterAndPay}
						keyRef={ACKNOWLEDGEMENT_KEY}
						address={address as string}
						chainId={chain?.id!}
					/>
				)}
				{localState.step === StandardSteps.RegisterAndPay && (
					<RegisterAndPay setLocalState={setLocalState} />
				)}
			</Flex>
		</DappLayout>
	);
};

export default StandardRegistration;
