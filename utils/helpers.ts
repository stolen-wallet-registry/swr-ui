export const HIGHLIGHT_STYLE = {
	px: '1',
	py: '1',
	rounded: 'full',
	color: 'white',
	bg: 'blackAlpha.900',
};

export const secondsFromNow = (seconds: number) => Math.floor((Date.now() + seconds * 1000) / 1000);

export const randomNumber = () => {
	return Math.floor(Math.random() * 4);
};

export const nativeTokenList: { [chainId: string]: string } = {
	'0x1': 'ETH', // Mainnet
	'0xa4b1': 'AETH', // Arbitrum
	'0x89': 'MATIC', // Polygon
	'0xa': 'ETH', // Optimism
	'0x38': 'BNB', // Binance
	'0x61': 'TBD', //
	'0x64': 'xDai',
	'0xa86a': 'TBD',
	'0xa869': 'TBD',
	'0xa4ec': 'CELO', // CELO
	'0x6f': 'TBD',
	'0xfa': 'FTM',
	'0x19': 'CRO',
	'0x505': 'MOVR',
	'0x504': 'GLMR',
	'0x2329': 'EVMOS',
	// testnets
	'0x5': 'ETH',
	'0xaa36a7': 'SEP', // Sepolia
	'0x1a4': 'ETH', // optimism Goerli
	// localhost
	'0x539': 'ETH',
	'0x7a69': 'ETH',
};
