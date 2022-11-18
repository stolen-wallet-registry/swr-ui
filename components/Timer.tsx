import { Box, Flex } from '@chakra-ui/react';
import useTimer from '@hooks/useTimer';
import { BigNumber } from 'ethers';
import React, { useEffect } from 'react';
import useCurrentBlock from '@hooks/useCurrentBlock';
interface TimerProps {
	expiryBlock: BigNumber;
	setExpiryStep: () => void;
	fontSize?: string;
}

export const Timer: React.FC<TimerProps> = ({ expiryBlock, setExpiryStep, fontSize = '30px' }) => {
	const { currentBlock, estimatedBlocksLeft, timerExpiry, isExpired } =
		useCurrentBlock(expiryBlock);

	const { seconds, minutes, start, restart } = useTimer({
		expiry: timerExpiry || 0,
		onExpire: () => {},
	});

	useEffect(() => {
		start();
	}, []);

	useEffect(() => {
		if (timerExpiry) {
			restart(timerExpiry);
		}
	}, [timerExpiry]);

	useEffect(() => {
		if (isExpired) {
			setExpiryStep();
		}
	}, [isExpired]);

	if (currentBlock === null) {
		return null;
	}

	return (
		<Flex
			flexDirection="column"
			justifyContent="flex-end"
			alignItems="center"
			style={{ fontSize: '16px', padding: 5 }}
			mb={5}
		>
			<Box style={{ fontSize, fontWeight: 'bold' }}>
				{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds} Time Left
			</Box>
			<Box style={{ fontWeight: 'bold' }}>
				{estimatedBlocksLeft?.toString() || '--'} Blocks left - {currentBlock?.toNumber() || '--'}/
				{expiryBlock?.toNumber() || '--'}
			</Box>
			<Box style={{ fontSize: '12px', fontStyle: 'italic' }}>
				**the above time remaining and blocks remaining are based on{' '}
				<span style={{ fontWeight: 'bold' }}>Estimates only.</span>
			</Box>
		</Flex>
	);
};
