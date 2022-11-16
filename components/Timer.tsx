import { Box } from '@chakra-ui/react';
import useTimer from '@hooks/useTimer';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface TimerProps {
	expiry: Date;
	setNextStep: () => void;
	fontSize?: string;
}

export const Timer: React.FC<TimerProps> = ({ expiry, setNextStep, fontSize = '30px' }) => {
	const { seconds, minutes, isRunning, start } = useTimer({
		expiry: expiry.getTime(),
		onExpire: () => setNextStep(),
	});

	useEffect(() => {
		start();
	}, []);

	useEffect(() => {
		if (!isRunning) {
			setNextStep();
		}
	}, [isRunning]);

	useEffect(() => {
		if (seconds === 0) {
			setNextStep();
		}
	}, [seconds]);

	return (
		<Box style={{ fontSize, padding: 5 }}>
			<span style={{ fontWeight: 'bold' }}>
				{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds} Time Left
			</span>
		</Box>
	);
};
