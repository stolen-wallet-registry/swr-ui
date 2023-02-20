import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';

import {
	RainbowKitProvider,
	connectorsForWallets,
	DisclaimerComponent,
	AvatarComponent,
} from '@rainbow-me/rainbowkit';

import {
	injectedWallet,
	rainbowWallet,
	metaMaskWallet,
	coinbaseWallet,
	walletConnectWallet,
	argentWallet,
	trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import appLightTheme from '../../theme/rainbowkit-themes/light';

import {
	mainnet,
	arbitrum,
	avalanche,
	bsc,
	evmos,
	fantom,
	gnosis,
	optimism,
	polygon,
	moonbeam,
	moonriver,
	sepolia,
	zkSync,
	foundry,
	goerli,
	filecoinCalibration,
	moonbaseAlpha,
	arbitrumGoerli,
	avalancheFuji,
	bscTestnet,
	evmosTestnet,
	fantomTestnet,
	optimismGoerli,
	polygonMumbai,
	zkSyncTestnet,
} from 'wagmi/chains';

import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { Text, Link } from '@chakra-ui/react';
import { Image } from '../../components/NextChalkraImage';

import { RAINBOWKIT_COLORS } from '../../theme/rainbowkit-themes/base';
import customChains from './customChains';

const APP_NAME = 'The Stollen Wallet Registry';

const testnets = [
	foundry,
	arbitrumGoerli,
	avalancheFuji,
	bscTestnet,
	evmosTestnet,
	fantomTestnet,
	moonbaseAlpha,
	optimismGoerli,
	polygonMumbai,
	zkSyncTestnet,
	filecoinCalibration,
	goerli,
	customChains.celoTestnet,
	customChains.binanceTestnet,
	customChains.mooorockTestnet,
	customChains.cronosTestnet,
	customChains.gatherTestnet,
	customChains.bobaTestnet,
];

const supporttedChains = [
	// mainnet,
	// arbitrum,
	// avalanche,
	// bsc,
	// evmos,
	// fantom,
	// gnosis,
	// optimism,
	// polygon,
	// sepolia,
	// zkSync,
	// customChains.arbitrumNovaChain,
	// customChains.gnosisChain,
	// customChains.evmosChain,
	// customChains.binanceChain,
	// customChains.moonBeam,
	// customChains.moonRiver,
	// customChains.celoChain,
	// customChains.fantomChian,
	// customChains.cronosChain,
	// customChains.bobaChain,
	// customChains.gatherChain,
	...testnets,
];

const { chains, provider, webSocketProvider } = configureChains(supporttedChains, [
	alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
	publicProvider(),
]);

const Disclaimer: DisclaimerComponent = () => (
	<Text>
		By connecting your wallet, you agree to the{' '}
		<Link href="https://termsofservice.xyz">Terms of Service</Link> and acknowledge you have read
		and understand the protocol <Link href="https://disclaimer.xyz">Disclaimer</Link>
	</Text>
);

const demoAppInfo = {
	appName: APP_NAME,
	learnMoreUrl: 'https://docs.swi.xyz/',
	disclaimer: Disclaimer,
};

const connectors = connectorsForWallets([
	{
		groupName: 'Popular',
		wallets: [
			injectedWallet({ chains: supporttedChains }),
			rainbowWallet({ chains: supporttedChains }),
			metaMaskWallet({ chains: supporttedChains }),
			coinbaseWallet({ chains: supporttedChains, appName: APP_NAME }),
			walletConnectWallet({ chains: supporttedChains }),
		],
	},
	{
		groupName: 'Other',
		wallets: [
			argentWallet({ chains: supporttedChains }),
			trustWallet({ chains: supporttedChains }),
		],
	},
]);

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	return ensImage ? (
		<Image src={ensImage} width={size} height={size} borderRadius={999} alt="ens profile" />
	) : (
		<div
			style={{
				backgroundColor: RAINBOWKIT_COLORS.whiteAlpha,
				borderRadius: 999,
				height: size,
				width: size,
			}}
		></div>
	);
};

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

type RainbowKitWagmiProviderProps = {
	children?: React.ReactNode;
};

const RainbowKitWagmiProvider: React.FC<RainbowKitWagmiProviderProps> = ({ children }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				appInfo={demoAppInfo}
				theme={appLightTheme}
				avatar={CustomAvatar}
			>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default RainbowKitWagmiProvider;
