import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '../theme';
import Script from 'next/script';
export default class Document extends NextDocument {
	render() {
		return (
			<Html>
				<Head>
					<link
						rel="stylesheet"
						href="//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css"
					/>
					<Script src="noflash.js" />
				</Head>
				<body>
					{/* Make Color mode to persists when you refresh the page. */}
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
