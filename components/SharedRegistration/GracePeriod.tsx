import { Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useTimer from '@hooks/useTimer';
import { useEffect } from 'react';
import { StateConfig } from '@utils/localStore';

interface GracePeriodInterface {
	setLocalState: (val: Partial<StateConfig>) => void;
}

const GracePeriod: React.FC<GracePeriodInterface> = ({ setLocalState }) => {
	const expireyTimestamp = new Date().getTime() + 1 * 5 * 1000;

	const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
		expiry: expireyTimestamp,
		onExpire: () => {
			console.log('onExpire');
			setLocalState({ step: 'register-and-pay' });
		},
	});

	useEffect(() => {
		start();
	}, []);

	useEffect(() => {
		if (!isRunning) {
			console.log('here test grace period');
			setLocalState({ step: 'register-and-pay' });
		}
	}, [isRunning]);

	return (
		<RegistrationSection title="Grace Period">
			<div style={{ fontSize: '100px' }}>
				<span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
			</div>
			<Flex>
				<Text mr={20}>Testing Grace Period</Text>
			</Flex>
		</RegistrationSection>
	);
};

export default GracePeriod;
