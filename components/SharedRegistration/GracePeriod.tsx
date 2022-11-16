import { Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import { useEffect, useState } from 'react';
import { P2PRegistereeSteps, P2PRelayerSteps } from '@utils/types';
import useContractPeriods from '@hooks/useContractPeriods';
import { Timer } from '@components/Timer';
import useLocalStorage from '@hooks/useLocalStorage';

interface GracePeriodInterface {
	setNextStep: () => void;
}

const GracePeriod: React.FC<GracePeriodInterface> = ({ setNextStep }) => {
	const [localState, _] = useLocalStorage();
	const { expired, gracePeriodExpiration } = useContractPeriods(localState.address!);

	useEffect(() => {
		if (expired) {
			setNextStep();
		}
	}, [expired]);
	console.log('GracePeriod', gracePeriodExpiration);
	return (
		<RegistrationSection title="Grace Period">
			{gracePeriodExpiration && <Timer expiry={gracePeriodExpiration} setNextStep={setNextStep} />}
			<Flex flexDirection="column" gap={5}>
				<Text mr={20}>Please wait for the Grace Period to complete</Text>
				<Text mr={20}>Then you can Pay to Register your wallet as Stolen</Text>
			</Flex>
		</RegistrationSection>
	);
};

export default GracePeriod;
