import '@rainbow-me/rainbowkit/styles.css';

import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
	wallet,
	lightTheme,
	darkTheme,
	DisclaimerComponent,
	Theme,
	AvatarComponent,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { Text, Link } from '@chakra-ui/react';

import appLightTheme from '../theme/rainbowkit-themes/light';

import { Image } from '../components/NextChalkraImage';

import React from 'react';

import { RAINBOWKIT_COLORS } from '../theme/rainbowkit-themes/base';

export const testnets = [
	chain.rinkeby,
	chain.goerli,
	chain.optimismKovan,
	chain.polygonMumbai,
	chain.arbitrumRinkeby,
	chain.foundry,
];

export const supporttedChains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const { chains, provider, webSocketProvider } = configureChains(supporttedChains, [
	infuraProvider({ infuraId: process.env.INFURA_ID }),
	publicProvider(),
]);

const { wallets } = getDefaultWallets({
	appName: 'RainbowKit Demo',
	chains,
});

const Disclaimer: DisclaimerComponent = () => (
	<Text>
		By connecting your wallet, you agree to the{' '}
		<Link href="https://termsofservice.xyz">Terms of Service</Link> and acknowledge you have read
		and understand the protocol <Link href="https://disclaimer.xyz">Disclaimer</Link>
	</Text>
);

const demoAppInfo = {
	appName: 'The Stollen Wallet Registry',
	learnMoreUrl: 'https://docs.swi.xyz/',
	disclaimer: Disclaimer,
};

const connectors = connectorsForWallets([
	...wallets,
	{
		groupName: 'Other',
		wallets: [wallet.argent({ chains }), wallet.trust({ chains })],
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
