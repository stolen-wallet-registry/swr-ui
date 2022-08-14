export const secondsFromNow = (seconds: number) => Math.floor((Date.now() + seconds * 1000) / 1000);
