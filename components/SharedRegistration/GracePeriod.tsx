import { Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useTimer from '@hooks/useTimer';
import { RegistrationStateManagemenetProps } from '@interfaces/index';
import { useEffect } from 'react';

interface GracePeriodProps extends RegistrationStateManagemenetProps {
	expiryTimestamp: number;
}

const GracePeriod: React.FC<GracePeriodProps> = ({ setShowStep, expiryTimestamp }) => {
	const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
		expiry: expiryTimestamp,
		onExpire: () => setShowStep('register-and-pay'),
	});

	useEffect(() => {
		start();
	}, []);

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
