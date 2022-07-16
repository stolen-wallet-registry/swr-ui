import '@rainbow-me/rainbowkit/styles.css';
import merge from 'lodash.merge';

import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
	wallet,
	lightTheme,
	darkTheme,
	DisclaimerComponent,
	Theme,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { Text, Link } from '@chakra-ui/react';

import rainbowLightTheme from '../theme/rainbowkit-themes/light';
import React from 'react';

const testnets = [
	chain.rinkeby,
	chain.goerli,
	chain.optimismKovan,
	chain.polygonMumbai,
	chain.arbitrumRinkeby,
	chain.foundry,
];

const livenets = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const { chains, provider, webSocketProvider } = configureChains(livenets, [
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

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

type RainbowKitWagmiProviderProps = {
	children?: React.ReactNode;
};

const appLightTheme = merge(lightTheme(), rainbowLightTheme) as Theme;
console.log(appLightTheme);
const RainbowKitWagmiProvider: React.FC<RainbowKitWagmiProviderProps> = ({ children }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} appInfo={demoAppInfo} theme={appLightTheme}>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default RainbowKitWagmiProvider;
