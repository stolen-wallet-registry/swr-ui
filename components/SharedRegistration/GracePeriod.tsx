import { Flex, Text } from '@chakra-ui/react';
import RegistrationSection from '@components/RegistrationSection';
import useTimer from '@hooks/useTimer';
import { useEffect } from 'react';
import { BigNumber } from 'ethers';
import { P2PRegistereeSteps, P2PRelayerSteps } from '@utils/types';

interface GracePeriodInterface {
	setNextStep: () => void;
	expirey: BigNumber | null;
	step?: P2PRelayerSteps | P2PRegistereeSteps;
}

const GracePeriod: React.FC<GracePeriodInterface> = ({ setNextStep, step, expirey }) => {
	if (!expirey) {
		return <></>;
	}

	const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
		expiry: expirey?.toNumber() * 1000,
		onExpire: () => {
			console.log('onExpire');
			setNextStep();
		},
	});

	useEffect(() => {
		start();
	}, []);

	useEffect(() => {
		if (!isRunning) {
			console.log('here test grace period');
			setNextStep();
		}
	}, [isRunning]);

	useEffect(() => {
		if (seconds === 0) {
			setNextStep();
		}
	}, [seconds]);

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
