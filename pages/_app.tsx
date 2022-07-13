import { ChakraProvider, localStorageManager } from '@chakra-ui/react';

import { theme } from '../theme';
import { AppProps } from 'next/app';
import RainbowKitWagmiProvider from '../contexts/RainbowWagmiProvider';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme} resetCSS>
			<RainbowKitWagmiProvider>
				<Component {...pageProps} />
			</RainbowKitWagmiProvider>
		</ChakraProvider>
	);
}

export default MyApp;
