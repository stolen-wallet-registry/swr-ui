import { useAccount, useSigner } from 'wagmi';
import useLocalStorage from '@hooks/useLocalStorage';
import CompletionSteps from '@components/SharedRegistration/CompletionSteps';
import GracePeriod from '@components/SharedRegistration/GracePeriod';
import RegisterAndPay from '@components/StandardRegistration/RegisterAndPay';
import DappLayout from '@components/DappLayout';
import { StandardSteps } from '@utils/types';
import { Flex, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useEffect } from 'react';
import { KEY_REF_TYPES } from '@utils/signature';
import StandardAckowledgement from '@components/StandardRegistration/StandardAckowledgement';
import { SessionExpired } from '@components/SharedRegistration/SessionExpired';
import Success from '@components/SharedRegistration/Success';

// TODO expract this out into useModal
interface StandardRegistrationInterface {
	keyRef: KEY_REF_TYPES;
}

const StandardRegistration: React.FC<StandardRegistrationInterface> = ({ keyRef }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { address } = useAccount();
	const { data: signer } = useSigner();

	const [localState, setLocalState] = useLocalStorage();

	const [isSmallerThan1000] = useMediaQuery('(max-width: 1200px)', {
		ssr: true,
		fallback: false, // return false on the server, and re-evaluate on the client side
	});

	const setNextStep = () => {
		setLocalState({ step: StandardSteps.GracePeriod });
	};

	useEffect(() => {
		setLocalState({ trustedRelayer: localState.address });
	}, []);

	if (!signer) {
		return null;
	}

	return (
		<DappLayout
			isOpen={isOpen}
			onClose={onClose}
			heading="Standard Relay"
			subHeading="pay and register on the same wallet"
		>
			<Flex
				mt={3}
				mb={10}
				p={5}
				gap={5}
				flexDirection={isSmallerThan1000 ? 'column' : 'row'}
				justifyContent="center"
				alignItems="center"
			>
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
						setExpiryStep={() => setLocalState({ step: StandardSteps.RegisterAndPay })}
						address={address!}
						signer={signer}
					/>
				)}
				{localState.step === StandardSteps.RegisterAndPay && (
					<RegisterAndPay
						setExpiryStep={() => setLocalState({ step: StandardSteps.Expired })}
						setNextStep={() => setLocalState({ step: StandardSteps.Success })}
						onOpen={onOpen}
						signer={signer}
						setLocalState={setLocalState}
					/>
				)}
				{localState.step === StandardSteps.Success && <Success />}
				{localState.step === StandardSteps.Expired && <SessionExpired />}
			</Flex>
		</DappLayout>
	);
};

export default StandardRegistration;
