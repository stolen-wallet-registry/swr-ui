import { Chain } from '@rainbow-me/rainbowkit';

// chain.mainnet
// chain.ropsten
// chain.rinkeby
// chain.goerli
// chain.kovan
// chain.sepolia
// chain.optimism
// chain.optimismGoerli
// chain.optimismKovan
// chain.polygon
// chain.polygonMumbai
// chain.arbitrum
// chain.arbitrumRinkeby
// chain.localhost
// chain.hardhat

// declare type Chain = {
//   id: number;
//   name: string;
//   network: string;
//   nativeCurrency?: AddEthereumChainParameter['nativeCurrency'];
//   rpcUrls: {
//       [key: 'alchemy' | 'infura' | 'public']: string;
//       default: string;
//   };
//   blockExplorers?: {
//       [key in BlockExplorerName]?: BlockExplorer;
//   } & {
//       [key: string]: BlockExplorer;
//       default: BlockExplorer;
//   };
//   ens?: {
//       address: Address;
//   };
//   /**
//    * Chain [multicall3 contract](https://github.com/mds1/multicall)
//    */
//   multicall?: {
//       address: Address;
//       blockCreated: number;
//   };
//   testnet?: boolean;

// id: number;
// iconUrl?: string | (() => Promise<string>) | null;
// iconBackground?: string;
// };

const arbitrumNovaChain: Chain = {
	name: 'Arbitrum Nova',
	id: 42170,
	network: 'Arbitrum Nova',
	nativeCurrency: {
		name: 'Ether',
		symbol: 'ETH',
		decimals: 18,
	},
	rpcUrls: { default: 'https://nova.arbitrum.io/rpc' },
	iconUrl: 'https://defillama.com/chain-icons/rsz_arbitrum.jpg',
	blockExplorers: {
		default: {
			name: 'Arbitrum Nova Chain Explorer',
			url: 'https://nova-explorer.arbitrum.io',
		},
	},
};

const avalancheTestnet: Chain = {
	name: 'Avalanche Fuji Testnet',
	rpcUrls: {
		default: 'https://api.avax-test.network/ext/bc/C/rpc',
	},
	nativeCurrency: {
		name: 'Avalanche',
		symbol: 'AVAX',
		decimals: 18,
	},
	id: 43113,
	network: 'AVAX Fuji Testnet',
	iconUrl: 'https://defillama.com/chain-icons/rsz_avalanche.jpg',
	blockExplorers: {
		default: {
			name: 'snowtrace',
			url: 'https://testnet.snowtrace.io',
		},
	},
};

const avalancheMainnet: Chain = {
	name: 'Avalanche C-Chain',
	rpcUrls: {
		default: 'https://api.avax.network/ext/bc/C/rpc',
	},
	nativeCurrency: {
		name: 'Avalanche',
		symbol: 'AVAX',
		decimals: 18,
	},
	id: 43114,
	network: 'AVAX C-Chain',
	iconUrl: 'https://defillama.com/chain-icons/rsz_avalanche.jpg',
	blockExplorers: {
		default: {
			name: 'snowtrace',
			url: 'https://snowtrace.io',
		},
	},
};

const evmosChain: Chain = {
	name: 'Evmos',
	rpcUrls: {
		default: 'https://eth.bd.evmos.org:8545',
	},
	nativeCurrency: {
		name: 'Evmos',
		symbol: 'EVMOS',
		decimals: 18,
	},
	id: 9001,
	network: 'Evmos',
	iconUrl: 'https://defillama.com/chain-icons/rsz_evmos.jpg',
	blockExplorers: {
		default: {
			name: 'Evmos EVM Explorer (Blockscout)',
			url: 'https://evm.evmos.org',
		},
		etherscan: {
			name: 'Evmos Cosmos Explorer (Mintscan)',
			url: 'https://www.mintscan.io/evmos',
		},
	},
};

const evmosTestnet: Chain = {
	name: 'Evmos Testnet',
	rpcUrls: {
		default: 'https://eth.bd.evmos.dev:8545',
	},
	nativeCurrency: {
		name: 'test-Evmos',
		symbol: 'tEVMOS',
		decimals: 18,
	},
	id: 9000,
	network: 'tEVMOS',
	iconUrl: 'https://defillama.com/chain-icons/rsz_evmos.jpg',
	blockExplorers: {
		default: {
			name: 'Evmos EVM Explorer',
			url: 'https://evm.evmos.dev',
		},
		etherscan: {
			name: 'Evmos Cosmos Explorer',
			url: 'https://explorer.evmos.dev',
		},
	},
};

const binanceChain: Chain = {
	name: 'Binance Chain',
	rpcUrls: {
		default: 'https://bsc-dataseed1.binance.org',
		// "https://bsc-dataseed2.binance.org",
		// "https://bsc-dataseed3.binance.org",
		// "https://bsc-dataseed4.binance.org",
		// "https://bsc-dataseed1.defibit.io",
		// "https://bsc-dataseed2.defibit.io",
		// "https://bsc-dataseed3.defibit.io",
		// "https://bsc-dataseed4.defibit.io",
		// "https://bsc-dataseed1.ninicoin.io",
		// "https://bsc-dataseed2.ninicoin.io",
		// "https://bsc-dataseed3.ninicoin.io",
		// "https://bsc-dataseed4.ninicoin.io",
		public: 'wss://bsc-ws-node.nariox.org',
	},
	nativeCurrency: {
		name: 'Binance Chain Native Token',
		symbol: 'BNB',
		decimals: 18,
	},
	id: 56,
	network: 'Binance Chain',
	iconUrl: 'https://defillama.com/chain-icons/rsz_binance.jpg',
	blockExplorers: {
		default: {
			name: 'bscscan',
			url: 'https://bscscan.com',
		},
	},
};
const moonBeam: Chain = {
	name: 'Moonbeam',
	rpcUrls: {
		default: 'https://rpc.api.moonbeam.network',
	},
	nativeCurrency: {
		name: 'Glimmer',
		symbol: 'GLMR',
		decimals: 18,
	},
	id: 1284,
	network: 'Moonbeam',
	iconUrl: 'https://defillama.com/chain-icons/rsz_moonbeam.jpg',
	blockExplorers: {
		default: {
			name: 'moonscan',
			url: 'https://moonbeam.moonscan.io',
		},
	},
};
const moonRiver: Chain = {
	name: 'Moonriver',
	rpcUrls: {
		default: 'https://rpc.api.moonriver.moonbeam.network',
	},
	nativeCurrency: {
		name: 'Moonriver',
		symbol: 'MOVR',
		decimals: 18,
	},
	id: 1285,
	network: 'MoonRiver',
	iconUrl: 'https://defillama.com/chain-icons/rsz_moonriver.jpg',
	blockExplorers: {
		default: {
			name: 'moonscan',
			url: 'https://moonriver.moonscan.io',
		},
	},
};
const bobaTestnet: Chain = {
	name: 'Boba Network Bobabase',
	rpcUrls: {
		default: 'https://bobabase.boba.network',
		public: 'wss://replica-wss.bobabase.boba.network',
	},
	nativeCurrency: {
		name: 'Boba Token',
		symbol: 'BOBA',
		decimals: 18,
	},
	id: 1297,
	network: 'Boba',
	iconUrl: 'https://defillama.com/chain-icons/rsz_boba.jpg',
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://blockexplorer.bobabase.boba.network',
		},
	},
};
const celoChain: Chain = {
	name: 'Celo',
	id: 42220,
	network: 'CELO',
	nativeCurrency: {
		name: 'CELO',
		symbol: 'CELO',
		decimals: 18,
	},
	iconUrl: 'https://defillama.com/chain-icons/rsz_celo.jpg',
	rpcUrls: {
		default: 'https://forno.celo.org',
		public: 'wss://forno.celo.org/ws',
	},
	blockExplorers: {
		default: {
			name: 'blockscout',
			url: 'https://explorer.celo.org',
		},
	},
};

const celoTestnet: Chain = {
	name: 'Celo Alfajores Testnet',
	id: 44787,
	network: 'CELO',
	testnet: true,
	nativeCurrency: {
		name: 'CELO',
		symbol: 'CELO',
		decimals: 18,
	},
	iconUrl: 'https://defillama.com/chain-icons/rsz_celo.jpg',
	rpcUrls: {
		default: 'https://alfajores-forno.celo-testnet.org',
		public: 'wss://alfajores-forno.celo-testnet.org/ws',
	},
	blockExplorers: {
		default: {
			url: 'https://alfajores-blockscout.celo-testnet.org',
			name: 'blockscout',
		},
	},
};

const cronosChain: Chain = {
	name: 'Cronos',
	network: 'CRO',
	rpcUrls: {
		default: 'https://evm.cronos.org',
	},
	nativeCurrency: {
		name: 'Cronos',
		symbol: 'CRO',
		decimals: 18,
	},
	id: 25,
	iconUrl: 'https://defillama.com/chain-icons/rsz_cronos.jpg',
	blockExplorers: {
		default: {
			name: 'Cronos Explorer',
			url: 'https://cronos.org/explorer',
		},
	},
};

const cronosTestnet: Chain = {
	name: 'Cronos Testnet',
	network: 'CRO',
	testnet: true,
	rpcUrls: {
		default: 'https://cronos-testnet-3.crypto.org:8545',
		public: 'wss://cronos-testnet-3.crypto.org:8546',
	},
	nativeCurrency: {
		name: 'Crypto.org Test Coin',
		symbol: 'TCRO',
		decimals: 18,
	},
	id: 338,
	iconUrl: 'https://defillama.com/chain-icons/rsz_cronos.jpg',
	blockExplorers: {
		default: {
			name: 'Cronos Testnet Explorer',
			url: 'https://cronos.crypto.org/explorer/testnet3',
		},
	},
};

const gnosisChain: Chain = {
	name: 'Gnosis Chain',
	network: 'GNO',
	rpcUrls: {
		// "https://rpc.ankr.com/gnosis",
		// "https://gnosischain-rpc.gateway.pokt.network",
		// "https://gnosis-mainnet.public.blastapi.io",
		default: 'https://rpc.gnosischain.com',
		public: 'wss://rpc.gnosischain.com/wss',
	},
	nativeCurrency: {
		name: 'xDAI',
		symbol: 'xDAI',
		decimals: 18,
	},
	iconUrl: 'https://defillama.com/chain-icons/rsz_xdai.jpg',
	id: 100,
	blockExplorers: {
		default: {
			name: 'blockscout',
			url: 'https://blockscout.com/xdai/mainnet',
		},
	},
};

const fantomChian: Chain = {
	name: 'Fantom',
	rpcUrls: { default: 'https://rpc.ftm.tools' },
	nativeCurrency: {
		name: 'Fantom',
		symbol: 'FTM',
		decimals: 18,
	},
	id: 250,
	network: 'Fantom Opera',
	iconUrl: 'https://defillama.com/chain-icons/rsz_fantom.jpg',
	blockExplorers: {
		default: {
			name: 'ftmscan',
			url: 'https://ftmscan.com',
		},
	},
};

const fantomTestnet: Chain = {
	name: 'Fantom Testnet',
	rpcUrls: { default: 'https://rpc.testnet.fantom.network' },
	nativeCurrency: {
		name: 'Fantom',
		symbol: 'FTM',
		decimals: 18,
	},
	id: 4002,
	network: 'Fantom Testnet',
	iconUrl: 'https://defillama.com/chain-icons/rsz_fantom.jpg',
	blockExplorers: {
		default: {
			name: 'ftmscan',
			url: 'https://testnet.ftmscan.com',
		},
	},
};

const fuseChain: Chain = {
	name: 'Fuse Mainnet',
	rpcUrls: { default: 'https://rpc.fuse.io' },
	nativeCurrency: {
		name: 'Fuse',
		symbol: 'FUSE',
		decimals: 18,
	},
	id: 122,
	network: 'Fuse',
	iconUrl: 'https://defillama.com/chain-icons/rsz_fuse.jpg',
};

const fuseTestnet: Chain = {
	name: 'Fuse Sparknet',
	rpcUrls: { default: 'https://rpc.fusespark.io' },
	nativeCurrency: {
		name: 'Spark',
		symbol: 'SPARK',
		decimals: 18,
	},
	id: 123,
	network: 'Fuse Spark',
	iconUrl: 'https://defillama.com/chain-icons/rsz_fuse.jpg',
};

const gatherChain: Chain = {
	name: 'Gather Network',
	rpcUrls: { default: 'https://mainnet.gather.network' },
	nativeCurrency: {
		name: 'Gather',
		symbol: 'GTH',
		decimals: 18,
	},
	id: 192837465,
	network: 'Gather Network',
	iconUrl: 'https://pbs.twimg.com/profile_images/1460197829868236804/6k4coRDQ_400x400.jpg',
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://explorer.gather.network',
		},
	},
};

const gatherTestnet: Chain = {
	name: 'Gather Testnet Network',
	rpcUrls: { default: 'https://testnet.gather.network' },
	nativeCurrency: {
		name: 'Test Gather',
		symbol: 'tGTH',
		decimals: 18,
	},
	id: 356256156,
	network: 'Gather Testnet',
	iconUrl: 'https://pbs.twimg.com/profile_images/1460197829868236804/6k4coRDQ_400x400.jpg',
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://testnet-explorer.gather.network',
		},
	},
};

const binanceTestnet: Chain = {
	name: 'Binance Smart Chain Testnet',
	rpcUrls: {
		default: 'https://data-seed-prebsc-1-s1.binance.org:8545',
		// "https://data-seed-prebsc-2-s1.binance.org:8545",
		// "https://data-seed-prebsc-1-s2.binance.org:8545",
		// "https://data-seed-prebsc-2-s2.binance.org:8545",
		// "https://data-seed-prebsc-1-s3.binance.org:8545",
		// "https://data-seed-prebsc-2-s3.binance.org:8545"
	},
	nativeCurrency: {
		name: 'Binance Chain Native Token',
		symbol: 'tBNB',
		decimals: 18,
	},
	id: 97,
	network: 'Binance Testnet',
	iconUrl: 'https://defillama.com/chain-icons/rsz_binance.jpg',
	blockExplorers: {
		default: {
			name: 'bscscan-testnet',
			url: 'https://testnet.bscscan.com',
		},
	},
};

const mooorockTestnet: Chain = {
	name: 'Moonrock',
	rpcUrls: {
		default: 'https://rpc.api.moonrock.moonbeam.network',
		public: 'wss://wss.api.moonrock.moonbeam.network',
	},
	iconUrl: 'https://defillama.com/chain-icons/rsz_moonbeam.jpg',
	nativeCurrency: {
		name: 'Rocs',
		symbol: 'ROC',
		decimals: 18,
	},
	id: 1288,
	network: 'Moonrock',
};

const moonbaseAlphaTestnet: Chain = {
	name: 'Moonbase Alpha',
	rpcUrls: {
		default: 'https://rpc.api.moonbase.moonbeam.network',
		public: 'wss://wss.api.moonbase.moonbeam.network',
	},
	nativeCurrency: {
		name: 'Dev',
		symbol: 'DEV',
		decimals: 18,
	},
	id: 1287,
	iconUrl: 'https://defillama.com/chain-icons/rsz_moonbeam.jpg',
	network: 'Moonbase Alpha',
	blockExplorers: {
		default: {
			name: 'moonscan',
			url: 'https://moonbase.moonscan.io',
		},
	},
};

const bobaChain: Chain = {
	name: 'Boba Network',
	rpcUrls: { default: 'https://mainnet.boba.network/' },
	nativeCurrency: {
		name: 'Ether',
		symbol: 'ETH',
		decimals: 18,
	},
	id: 288,
	network: 'Boba Network',
	iconUrl: 'https://defillama.com/chain-icons/rsz_boba.jpg',
	blockExplorers: {
		default: {
			name: 'Bobascan',
			url: 'https://bobascan.com',
		},
		etherscan: {
			name: 'Blockscout',
			url: 'https://blockexplorer.boba.network',
		},
	},
};

const customChains = {
	arbitrumNovaChain,
	avalancheTestnet,
	avalancheMainnet,
	gatherChain,
	gatherTestnet,
	fuseChain,
	fuseTestnet,
	fantomChian,
	fantomTestnet,
	evmosChain,
	evmosTestnet,
	binanceChain,
	binanceTestnet,
	moonBeam,
	moonRiver,
	mooorockTestnet,
	moonbaseAlphaTestnet,
	bobaChain,
	bobaTestnet,
	celoChain,
	celoTestnet,
	cronosChain,
	cronosTestnet,
	gnosisChain,
};

export default customChains;

// [X] BNB;
// [ ] MATIC;
// [X] AVAX;
// [X] FTM;
// [ ] GNO;
// [X] ARB;
// [X] NOVA;
// [X] OPT;
// [X] MBEAM;
// [X] MOVR;
// [X] FUSE;
// [ ] MMEDA;
// [X] BOBA;
// [X] GTH;
// [X] CRO;
// [X] EVMOS;
