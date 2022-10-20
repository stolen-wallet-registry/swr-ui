import { Flex, Button, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useLocalStorage, { StateConfig } from '@hooks/useLocalStorage';
import useTimer from '@hooks/useTimer';
import { useState, useEffect } from 'react';

interface GracePeriodInterface {
	setLocalState: (val: Partial<StateConfig>) => void;
}

const RegisterAndPay: React.FC<GracePeriodInterface> = ({ setLocalState }) => {
	const [expired, setExpired] = useState(false);
	const expireyTimestamp = new Date().getTime() + 1 * 5 * 1000;
	const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
		expiry: expireyTimestamp,
		onExpire: () => {
			console.log('onExpire');
			setExpired(true);
		},
	});

	useEffect(() => {
		start();
	}, []);

	useEffect(() => {
		if (!isRunning) {
			console.log('here');
			setExpired(true);
		}
	}, [isRunning]);

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
			<Button disabled={!expired} onClick={() => setLocalState({ step: 'requirements' })}>
				Restart
			</Button>
		</RegistrationSection>
	);
};

export default RegisterAndPay;
