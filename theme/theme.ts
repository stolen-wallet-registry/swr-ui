import { extendTheme, ThemeConfig } from '@chakra-ui/react';

export const COLOR_TRANSITION_DELAY = 2000;
const fonts = { mono: 'Hack, monospace', body: 'Hack, monospace', heading: 'Hack, monospace' };
const breakpoints = {
	sm: '40em',
	md: '52em',
	lg: '64em',
	xl: '80em',
};

const config: ThemeConfig = {
	initialColorMode: 'light',
	useSystemColorMode: true,
};

const baseStylePopper = {
	w: '100%',
	maxW: 'xs',
	zIndex: 10,
};

const theme = extendTheme({
	config,
	colors: {
		black: '#16161D',
	},
	fonts,
	breakpoints,
	components: {
		Popover: {
			baseStyle: {
				popper: ({ width }: { width: string | number }) => ({
					...baseStylePopper,
					maxW: width ? width : baseStylePopper.maxW,
				}),
			},
		},
	},
});

export { theme };
