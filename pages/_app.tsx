import { ChakraProvider } from '@chakra-ui/react';

import theme from '../theme';
import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import RainbowKitProvider from '../contexts/RainbowWagmiProvider';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<RainbowKitProvider>
				<Component {...pageProps} />
			</RainbowKitProvider>
		</ChakraProvider>
	);
}

export default MyApp;
