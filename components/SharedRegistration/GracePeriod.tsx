import { Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useTimer from '@hooks/useTimer';
import { RegistrationStateManagemenetProps } from '@interfaces/index';
import { useEffect, useState } from 'react';

const GracePeriod: React.FC<RegistrationStateManagemenetProps> = ({ setShowStep }) => {
	const [expiryTimestamp, setExpiryTimestamp] = useState<number>(
		new Date().getTime() + 1 * 5 * 1000
	);

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
