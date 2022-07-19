import merge from 'lodash/merge';
import { Theme, lightTheme } from '@rainbow-me/rainbowkit';
import { RAINBOWKIT_COLORS } from './base';

const rainbowLightTheme = {
	colors: {
		accentColor: RAINBOWKIT_COLORS.whiteAlpha,
		accentColorForeground: 'none',
		actionButtonBorder: RAINBOWKIT_COLORS.whiteAlpha,
		actionButtonBorderMobile: RAINBOWKIT_COLORS.whiteAlpha,
		actionButtonSecondaryBackground: RAINBOWKIT_COLORS.whiteAlpha,
		closeButton: RAINBOWKIT_COLORS.whiteAlpha,
		closeButtonBackground: RAINBOWKIT_COLORS.whiteAlpha,
		connectButtonBackground: RAINBOWKIT_COLORS.white,
		connectButtonBackgroundError: RAINBOWKIT_COLORS.blackAlpha,
		connectButtonInnerBackground: 'linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))',
		connectButtonText: RAINBOWKIT_COLORS.blackAlpha,
		connectButtonTextError: RAINBOWKIT_COLORS.white,
		connectionIndicator: '#38B2AC',
		error: '#FC8181',
		generalBorder: RAINBOWKIT_COLORS.whiteAlpha,
		generalBorderDim: RAINBOWKIT_COLORS.blackAlpha,
		menuItemBackground: 'RGBA(0, 0, 0, 0.04)',
		modalBackdrop: 'RGBA(255, 255, 255, 0.48)',
		modalBackground: RAINBOWKIT_COLORS.white,
		modalBorder: 'transparent',
		modalText: '#25292E',
		modalTextDim: 'rgba(60, 66, 66, 0.3)',
		modalTextSecondary: 'rgba(60, 66, 66, 0.6)',
		profileAction: '#F7FAFC',
		profileActionHover: '#EDF2F7',
		profileForeground: RAINBOWKIT_COLORS.whiteAlpha,
		selectedOptionBorder: 'rgba(60, 66, 66, 0.1)',
		standby: '#F6E05E',
	},
	fonts: {
		body: RAINBOWKIT_COLORS.blackAlpha,
	},
};

// const accentColors: Record<AccentColorPreset, AccentColor> = {
// 	blue: { accentColor: '#0E76FD', accentColorForeground: '#FFF' },
// 	green: { accentColor: '#1DB847', accentColorForeground: '#FFF' },
// 	orange: { accentColor: '#FF801F', accentColorForeground: '#FFF' },
// 	pink: { accentColor: '#FF5CA0', accentColorForeground: '#FFF' },
// 	purple: { accentColor: '#5F5AFA', accentColorForeground: '#FFF' },
// 	red: { accentColor: '#FA423C', accentColorForeground: '#FFF' },
// };

// const defaultAccentColor = accentColors.blue;

// export const lightTheme = ({
// 	accentColor = defaultAccentColor.accentColor,
// 	accentColorForeground = defaultAccentColor.accentColorForeground,
// 	...baseThemeOptions
// }: ThemeOptions = {}) => ({
// 	...baseTheme(baseThemeOptions),
// 	colors: {
// 		accentColor,
// 		accentColorForeground,
// 		actionButtonBorder: 'rgba(0, 0, 0, 0.04)',
// 		actionButtonBorderMobile: 'rgba(0, 0, 0, 0.06)',
// 		actionButtonSecondaryBackground: 'rgba(0, 0, 0, 0.06)',
// 		closeButton: 'rgba(60, 66, 66, 0.8)',
// 		closeButtonBackground: 'rgba(0, 0, 0, 0.06)',
// 		connectButtonBackground: '#FFF',
// 		connectButtonBackgroundError: '#FF494A',
// 		connectButtonInnerBackground: 'linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))',
// 		connectButtonText: '#25292E',
// 		connectButtonTextError: '#FFF',
// 		connectionIndicator: '#30E000',
// 		error: '#FF494A',
// 		generalBorder: 'rgba(0, 0, 0, 0.06)',
// 		generalBorderDim: 'rgba(0, 0, 0, 0.03)',
// 		menuItemBackground: 'rgba(60, 66, 66, 0.1)',
// 		modalBackdrop: 'rgba(0, 0, 0, 0.3)',
// 		modalBackground: '#FFF',
// 		modalBorder: 'transparent',
// 		modalText: '#25292E',
// 		modalTextDim: 'rgba(60, 66, 66, 0.3)',
// 		modalTextSecondary: 'rgba(60, 66, 66, 0.6)',
// 		profileAction: '#FFF',
// 		profileActionHover: 'rgba(255, 255, 255, 0.5)',
// 		profileForeground: 'rgba(60, 66, 66, 0.06)',
// 		selectedOptionBorder: 'rgba(60, 66, 66, 0.1)',
// 		standby: '#FFD641',
// 	},
// 	shadows: {
// 		connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
// 		dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
// 		profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
// 		selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
// 		selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.12)',
// 		walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
// 	},
// });

// lightTheme.accentColors = accentColors;

const appLightTheme = merge(lightTheme(), rainbowLightTheme) as Theme;

export default appLightTheme;
