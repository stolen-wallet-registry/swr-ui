import { ChakraProvider } from '@chakra-ui/react';

import theme from '../theme';
import { AppProps } from 'next/app';
import RainbowKitWagmiProvider from '../contexts/RainbowWagmiProvider';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<RainbowKitWagmiProvider>
				<Component {...pageProps} />
			</RainbowKitWagmiProvider>
		</ChakraProvider>
	);
}

export default MyApp;
