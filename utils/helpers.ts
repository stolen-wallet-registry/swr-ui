export const HIGHLIGHT_STYLE = {
	px: '1',
	py: '1',
	rounded: 'full',
	color: 'white',
	bg: 'blackAlpha.900',
};

export const secondsFromNow = (seconds: number) => Math.floor((Date.now() + seconds * 1000) / 1000);
