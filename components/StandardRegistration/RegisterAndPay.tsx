import { Flex, Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useTimer from '@hooks/useTimer';
import { RegistrationStateManagemenetProps } from '@interfaces/index';
import { useState, useEffect } from 'react';

const RegisterAndPay: React.FC<RegistrationStateManagemenetProps> = ({ setShowStep }) => {
	const [expiryTimestamp, setExpiryTimestamp] = useState<number>(
		new Date().getTime() + 1 * 5 * 1000
	);
	const [expired, setExpired] = useState(false);
	const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
		expiry: expiryTimestamp,
		onExpire: () => setExpired(true),
	});

	useEffect(() => {
		start();
	}, []);

	return (
		<RegistrationSection title="Register and Pay">
			<div style={{ fontSize: '100px' }}>
				<span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
			</div>
			<Flex mb={5}>
				<Text mr={20}>Testing Register And Pay</Text>
			</Flex>
			{expired && <Text mb={5}>Your registration window expired, please restart.</Text>}
			<Button mb={5} disabled={expired}>
				Sign and Pay
			</Button>
			<Button disabled={!expired} onClick={() => setShowStep('acknowledge-and-pay')}>
				Restart
			</Button>
		</RegistrationSection>
	);
};

export default RegisterAndPay;
