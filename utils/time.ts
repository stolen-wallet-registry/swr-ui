const getTimeFromSeconds = (secs: number) => {
	const totalSeconds = Math.ceil(secs);
	const days = Math.floor(totalSeconds / (60 * 60 * 24));
	const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
	const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	return {
		seconds,
		minutes,
		hours,
		days,
	};
};

const getSecondsFromExpiry = (expiry: number, shouldRound: boolean) => {
	const now = new Date().getTime();
	const milliSecondsDistance = expiry - now;
	if (milliSecondsDistance > 0) {
		const val = milliSecondsDistance / 1000;
		return shouldRound ? Math.round(val) : val;
	}
	return 0;
};

// const getSecondsFromPrevTime = (prevTime: number, shouldRound: boolean) => {
// 	const now = new Date().getTime();
// 	const milliSecondsDistance = now - prevTime;
// 	if (milliSecondsDistance > 0) {
// 		const val = milliSecondsDistance / 1000;
// 		return shouldRound ? Math.round(val) : val;
// 	}
// 	return 0;
// };

// const getSecondsFromTimeNow = () => {
// 	const now = new Date();
// 	const currentTimestamp = now.getTime();
// 	const offset = now.getTimezoneOffset() * 60;
// 	return currentTimestamp / 1000 - offset;
// };

// const getFormattedTimeFromSeconds = (totalSeconds: number, format?: '12-hour' | '24-hour') => {
// 	const { seconds: secondsValue, minutes, hours } = getTimeFromSeconds(totalSeconds);
// 	let ampm = '';
// 	let hoursValue = hours;

// 	if (format === '12-hour') {
// 		ampm = hours >= 12 ? 'pm' : 'am';
// 		hoursValue = hours % 12;
// 	}

// 	return {
// 		seconds: secondsValue,
// 		minutes,
// 		hours: hoursValue,
// 		ampm,
// 	};
// };

export {
	getTimeFromSeconds,
	getSecondsFromExpiry,
	// getSecondsFromPrevTime,
	// getSecondsFromTimeNow,
	// getFormattedTimeFromSeconds,
};
