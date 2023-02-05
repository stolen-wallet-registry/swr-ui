import { String0x } from "./types";

const CONTRACT_ADDRESSES: { [key: string]: { [address: string]: String0x } } = {
	Localhost: {
		MockV3Provider: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
		StolenWalletRegistry: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
	},
	Goerli: {
		MockV3Provider: '0x8e4fc8bb14d36d5bedf8760e936a32beac0ded09',
		StolenWalletRegistry: '0x675b6cc0844c8879189126f7B77C5F62E17409eB',
	},
	// Polygon: {
	// 	MockV3Provider: '',
	// 	StolenWalletRegistry: '',
	// },
	// Optimism: {
	// 	MockV3Provider: '',
	// 	StolenWalletRegistry: '',
	// },
	// ArbitrumOne: {
	// 	MockV3Provider: '',
	// 	StolenWalletRegistry: '',
	// },
	// OptimismKovan: {
	// 	MockV3Provider: '',
	// 	StolenWalletRegistry: '',
	// },
	// PolygonMumbai: {
	// 	MockV3Provider: '',
	// 	StolenWalletRegistry: '',
	// },
	// ArbitrumRinkeby: {
	// 	MockV3Provider: '',
	// 	StolenWalletRegistry: '',
	// },
	Foundry: {
		MockV3Provider: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
		StolenWalletRegistry: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
	},
};

export { CONTRACT_ADDRESSES };
