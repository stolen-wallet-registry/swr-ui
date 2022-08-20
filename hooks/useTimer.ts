import { useState } from 'react';
import useInterval from './useInterval';

import { getTimeFromSeconds, getSecondsFromExpiry } from '../utils/time';

const DEFAULT_DELAY = 1000;
const getDelayFromExpiryTimestamp = (expiryTimestamp: number) => {
	const expirey = new Date(expiryTimestamp).getTime() > 0;
	if (!expirey) {
		return null;
	}

	const seconds = getSecondsFromExpiry(expiryTimestamp, true);
	const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000);
	return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY;
};

interface UseTimerProps {
	expiry: number;
	onExpire: () => void;
	autoStart?: boolean;
}

const useTimer = ({ expiry, onExpire, autoStart = true }: UseTimerProps) => {
	const [expiryTimestamp, setExpiryTimestamp] = useState(expiry);
	const [seconds, setSeconds] = useState(getSecondsFromExpiry(expiryTimestamp, true));
	const [isRunning, setIsRunning] = useState(autoStart);
	const [didStart, setDidStart] = useState(autoStart);
	const [delay, setDelay] = useState(getDelayFromExpiryTimestamp(expiryTimestamp));

	const handleExpire = () => {
		onExpire();
		setIsRunning(false);
		setDelay(null);
	};

	const pause = () => {
		setIsRunning(false);
	};

	const restart = (newExpiryTimestamp: number, newAutoStart = true) => {
		setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
		setDidStart(newAutoStart);
		setIsRunning(newAutoStart);
		setExpiryTimestamp(newExpiryTimestamp);
		setSeconds(getSecondsFromExpiry(newExpiryTimestamp, true));
	};

	const resume = () => {
		const time = new Date();
		time.setMilliseconds(time.getMilliseconds() + seconds * 1000);
		restart(time.getTime());
	};

	const start = () => {
		if (didStart) {
			setSeconds(getSecondsFromExpiry(expiryTimestamp, true));
			setIsRunning(true);
		} else {
			resume();
		}
	};

	useInterval(
		() => {
			if (delay !== DEFAULT_DELAY) {
				setDelay(DEFAULT_DELAY);
			}
			const secondsValue = getSecondsFromExpiry(expiryTimestamp, true);
			setSeconds(secondsValue);
			if (secondsValue <= 0) {
				handleExpire();
			}
		},
		isRunning ? delay : null
	);

	return {
		...getTimeFromSeconds(seconds),
		start,
		pause,
		resume,
		restart,
		isRunning,
	};
};

export default useTimer;
