import { addSeconds } from 'date-fns';
import { BigNumber } from 'ethers';
import React from 'react';
import { useState, useEffect } from 'react';
import { useProvider } from 'wagmi';

const AVERAGE_BLOCK_TIME = 15; // seconds

const useCurrentBlock = (expiryBlock: BigNumber) => {
	const provider = useProvider();
	const [currentBlock, setCurrentBlock] = useState<BigNumber | null>(null);
	const [estimatedBlocksLeft, setEstimatedBlocksLeft] = React.useState<BigNumber | null>(null);
	const [avgBlockTime, setAvgBlockTime] = React.useState<number>(AVERAGE_BLOCK_TIME);
	const [expiry, setExpiry] = useState<BigNumber | null>(null);
	const [timerExpiry, setTimerExpiry] = useState<number | null>(null);
	const [isExpired, setIsExpired] = useState(false);

	const getAverageBlockTime = async () => {
		const currentNumber = await provider.getBlockNumber();
		const span = 5;
		const currentBlock = await provider.getBlock(currentNumber);
		const firstBlock = await provider.getBlock(currentNumber - span);
		const avg = Math.round((currentBlock.timestamp - firstBlock.timestamp) / (span * 1.0));

		setAvgBlockTime(avg);
	};

	const refetchBlockNumber = async () => {
		const blockNumber = BigNumber.from(await provider.getBlockNumber());

		setCurrentBlock(blockNumber);

		if (expiryBlock.gt(blockNumber)) {
			const timeLeft = expiryBlock.sub(blockNumber).mul(avgBlockTime);
			setExpiry(timeLeft);
			setEstimatedBlocksLeft(expiryBlock.sub(blockNumber));
			setTimerExpiry(addSeconds(new Date(), timeLeft.toNumber()).getTime());
		} else {
			setIsExpired(true);
		}
	};

	useEffect(() => {
		getAverageBlockTime();
		refetchBlockNumber();
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timer | null = null;

		if (provider) {
			interval = setInterval(() => {
				refetchBlockNumber();
			}, 10000);
		}

		return () => {
			interval && clearInterval(interval);
		};
	}, [provider]);

	useEffect(() => {
		let interval: NodeJS.Timer | null = null;

		if (estimatedBlocksLeft) {
			interval = setInterval(() => {
				if (estimatedBlocksLeft.gt(0)) {
					setEstimatedBlocksLeft(estimatedBlocksLeft.sub(1));
				} else {
					setEstimatedBlocksLeft(BigNumber.from(0));
				}
			}, avgBlockTime);
		}

		return () => {
			interval && clearInterval(interval);
		};
	}, [currentBlock]);

	return {
		currentBlock,
		estimatedBlocksLeft,
		expiry,
		timerExpiry,
		isExpired,
	};
};

export default useCurrentBlock;
