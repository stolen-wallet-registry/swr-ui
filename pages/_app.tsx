import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '../theme';
import { AppInitialProps, AppProps } from 'next/app';
import RainbowKitWagmiProvider from '@providers/RainbowWagmiProvider';
import NextIntlLocaleProvider from '@providers/NextIntlLocaleProvider';

function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<RainbowKitWagmiProvider>
				<NextIntlLocaleProvider pageProps={pageProps}>
					<Component {...pageProps} />
				</NextIntlLocaleProvider>
			</RainbowKitWagmiProvider>
		</ChakraProvider>
	);
}

export default App;
