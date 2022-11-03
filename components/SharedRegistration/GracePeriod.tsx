import { Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useTimer from '@hooks/useTimer';
import { useEffect } from 'react';
import { StateConfig } from '@utils/localStore';
import { RegistrationValues } from '@utils/types';
import { getSignatureWithExpiry } from '@utils/signature';
import { id } from 'ethers/lib/utils';
import { useAccount, useNetwork } from 'wagmi';

interface GracePeriodInterface {
	setLocalState: (val: Partial<StateConfig>) => void;
	nextStep: RegistrationValues;
	address: string;
	chainId: number;
	keyRef: string;
}

const GracePeriod: React.FC<GracePeriodInterface> = ({
	setLocalState,
	nextStep,
	keyRef,
	address,
	chainId,
}) => {
	const { value, expiry } = getSignatureWithExpiry({ chainId, address, keyRef });

	const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
		expiry: new Date(expiry).getTime(),
		onExpire: () => {
			console.log('onExpire');
			setLocalState({ step: nextStep });
		},
	});

	useEffect(() => {
		start();
	}, []);

	useEffect(() => {
		if (!isRunning) {
			console.log('here test grace period');
			setLocalState({ step: nextStep });
		}
	}, [isRunning]);

	return (
		<RegistrationSection title="Grace Period">
			<div style={{ paddingBottom: '10px', fontSize: '30px' }}>
				<span>{minutes}</span>:<span>{seconds}</span> Minutes Left
			</div>
			<Flex flexDirection="column" gap={5}>
				<Text mr={20}>Please wait for the Grace Period to complete</Text>
				<Text mr={20}>Then you can Pay to Register your wallet as Stolen</Text>
			</Flex>
		</RegistrationSection>
	);
};

export default GracePeriod;
