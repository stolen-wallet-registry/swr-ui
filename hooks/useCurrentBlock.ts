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
	const [expiry, setExpiry] = useState<BigNumber | null>(null);
	const [timerExpiry, setTimerExpiry] = useState<number | null>(null);
	const [isExpired, setIsExpired] = useState(false);

	const refetchBlockNumber = async () => {
		const blockNumber = BigNumber.from(await provider.getBlockNumber());

		setCurrentBlock(blockNumber);

		if (expiryBlock.gt(blockNumber)) {
			const timeLeft = expiryBlock.sub(blockNumber).mul(AVERAGE_BLOCK_TIME);
			setExpiry(timeLeft);
			setEstimatedBlocksLeft(expiryBlock.sub(blockNumber));
			setTimerExpiry(addSeconds(new Date(), timeLeft.toNumber()).getTime());
		} else {
			setIsExpired(true);
		}
	};

	useEffect(() => {
		let interval: NodeJS.Timer | null = null;

		if (provider) {
			interval = setInterval(() => {
				refetchBlockNumber();
			}, 5000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
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
			}, 13000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
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
