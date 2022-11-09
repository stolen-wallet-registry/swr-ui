import { useAccount, useNetwork } from 'wagmi';
import useLocalStorage from '@hooks/useLocalStorage';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import RegisterAndPay from '@components/StandardRegistration/RegisterAndPay';
import DappLayout from '@components/DappLayout';
import { StandardSteps } from '@utils/types';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ACKNOWLEDGEMENT_KEY } from '@utils/signature';
import StandardAckowledgement from '@components/StandardRegistration/StandardAckowledgement';

// TODO expract this out into useModal
interface StandardRegistrationInterface {}

const StandardRegistration: React.FC<StandardRegistrationInterface> = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { chain } = useNetwork();
	const { address } = useAccount();

	const [localState, setLocalState] = useLocalStorage();

	const setNextStep = () => {
		setLocalState({ step: StandardSteps.GracePeriod });
	};

	useEffect(() => {
		setLocalState({ trustedRelayer: localState.address });
	}, []);

	return (
		<DappLayout
			isOpen={isOpen}
			onClose={onClose}
			heading="Standard Relay"
			subHeading="pay and register on the same wallet"
		>
			<Flex mt={20} mb={10} p={10} gap={5}>
				<CompletionSteps />
				{localState.step === StandardSteps.AcknowledgeAndPay && (
					<StandardAckowledgement
						setNextStep={setNextStep}
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
