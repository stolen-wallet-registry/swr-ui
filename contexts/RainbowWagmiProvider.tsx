import '@rainbow-me/rainbowkit/styles.css';

import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
	wallet,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
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

const demoAppInfo = {
	appName: 'RainbowKit Demo',
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

const RainbowKitWagmiProvider: React.FC<RainbowKitWagmiProviderProps> = ({ children }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default RainbowKitWagmiProvider;
