import {
	Chain,
	chainId,
	alchemyRpcUrls,
	publicRpcUrls,
	infuraRpcUrls,
	etherscanBlockExplorers,
} from 'wagmi';

// bsc = 56,
// bsc_testnet = 97,
// xdai = 100,
// gnosis = 100,
// avalancheMainnet = 43114,
// avalancheFuji = 43113,
// etherlite = 111,
// fantom = 250,
// cronos = 25,

// MoonBeam MBEAM
// MoonRiver MOVR
// Auora AURO
// FUSE;
// MMEDA;
// BOBA;
// HONE;
// GTH;
// EVMOS;
// CELO;

// gnosis https://rpc.gnosischain.com/, Chain ID: 0x64, Symbol: xDai, Block Explorer URL: https://blockscout.com/xdai/mainnet/

const BLOCK_EXPLORER_URLS = {
  polygon: etherscanBlockExplorers.polygon,
  arbitrum: etherscanBlockExplorers.arbitrum,
  optimism: etherscanBlockExplorers.optimism,
  ropsten: etherscanBlockExplorers.ropsten,
  rinkeby: etherscanBlockExplorers.rinkeby,
  goerli: etherscanBlockExplorers.goerli,
  kovan: etherscanBlockExplorers.kovan,
  optimism: etherscanBlockExplorers.optimism,
  optimismKovan: etherscanBlockExplorers.optimismKovan,
  polygon: etherscanBlockExplorers.polygon,
  polygonMumbai: etherscanBlockExplorers.polygonMumbai,
  arbitrum: etherscanBlockExplorers.arbitrum,
  arbitrumRinkeby: etherscanBlockExplorers.arbitrumRinkeby,
  avalanche: {
    name: 'Snowtrace',
    url: 'https://snowtrace.io/',
  },
  avalancheFuji: {
    name: 'Snowtrace Testnet',
    url: 'https://testnet.snowtrace.io/',
  },
  aurora: {
    name: '',
    url: '',
  },
  auroraTestnet: {
    name: '',
    url: '',
  },
  gnosis: {
    name: 'Block Scout',
    url: 'https://blockscout.com/xdai/mainnet/',
  },
  fantom: {
    name: '',
    url: '',
  },
  moonbeam: {
    name: '',
    url: '',
  },
  moonriver: {
    name: '',
    url: '',
  },
  evmos: {
    name: '',
    url: '',
  },
  celo: {
    name: '',
    url: '',
  }
}
	//console.log(process.env);
	if (networkType === 'avalanche') return 'https://api.avax.network/ext/bc/C/rpc';
	else if (networkType === 'polygon')
		return `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
	else if (networkType === 'arbitrum')
		return `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
	else if (networkType === 'optimism')
		return `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
	else if (networkType === 'aurora') return `https://aurora-mainnet.infura.io/v3/${alchemyApiKey}`;
	else if (networkType === 'aurora-testnet')
		return `https://aurora-testnet.infura.io/v3/${alchemyApiKey}`;
	else if (networkType === 'gnosis') return `https://rpc.gnosischain.com/`;
	else if (networkType === 'fantom') return `https://rpc.ftm.tools/`;
	else return `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`;
}

function getNetworkUrl(networkType: string) {
	//console.log(process.env);
	if (networkType === 'avalanche') return 'https://api.avax.network/ext/bc/C/rpc';
	else if (networkType === 'polygon')
		return `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
	else if (networkType === 'arbitrum')
		return `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
	else if (networkType === 'optimism')
		return `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
	else if (networkType === 'aurora') return `https://aurora-mainnet.infura.io/v3/${alchemyApiKey}`;
	else if (networkType === 'aurora-testnet')
		return `https://aurora-testnet.infura.io/v3/${alchemyApiKey}`;
	else if (networkType === 'gnosis') return `https://rpc.gnosischain.com/`;
	else if (networkType === 'fantom') return `https://rpc.ftm.tools/`;
	else return `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`;
}

export const optimism: Chain = {
	id: chainId.optimism,
	name: 'Optimism',
	network: 'optimism',
	nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		alchemy: alchemyRpcUrls.optimism,
		default: publicRpcUrls.optimism,
		infura: infuraRpcUrls.optimism,
		public: publicRpcUrls.optimism,
	},
	blockExplorers: {
		etherscan: etherscanBlockExplorers.optimism,
		default: etherscanBlockExplorers.optimism,
	},
	multicall: {
		address: '0xca11bde05977b3631167028862be2a173976ca11',
		blockCreated: 4286263,
	},
};

export const avalancheChain: Chain = {
	id: 43_114,
	name: 'Avalanche',
	network: 'avalanche',
	nativeCurrency: {
		decimals: 18,
		name: 'Avalanche',
		symbol: 'AVAX',
	},
	rpcUrls: {
		default: 'https://api.avax.network/ext/bc/C/rpc',
	},
	blockExplorers: {
		default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
	},
	multicall: {
		address: '0xca11bde05977b3631167028862be2a173976ca11',
		blockCreated: 4286263,
	},
	testnet: false,
};
