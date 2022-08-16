import { ChakraProvider } from '@chakra-ui/react';
import { NextIntlProvider } from 'next-intl';

import { theme } from '../theme';
import { AppProps } from 'next/app';
import RainbowKitWagmiProvider from '../contexts/RainbowWagmiProvider';

function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<RainbowKitWagmiProvider>
				<NextIntlProvider messages={pageProps.messages}>
					<Component {...pageProps} />
				</NextIntlProvider>
			</RainbowKitWagmiProvider>
		</ChakraProvider>
	);
}

export default App;
