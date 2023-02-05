import { Theme } from '@rainbow-me/rainbowkit';
import { RAINBOWKIT_COLORS } from './base';

// import { AccentColor, AccentColorPreset, baseTheme, ThemeOptions } from './base';

const rainbowLightTheme = {
	colors: {
		accentColor: RAINBOWKIT_COLORS.gray,
		accentColorForeground: 'none',
		actionButtonBorder: RAINBOWKIT_COLORS.gray,
		actionButtonBorderMobile: RAINBOWKIT_COLORS.gray,
		actionButtonSecondaryBackground: RAINBOWKIT_COLORS.gray,
		closeButton: RAINBOWKIT_COLORS.gray,
		closeButtonBackground: RAINBOWKIT_COLORS.gray,
		connectButtonBackground: RAINBOWKIT_COLORS.white,
		connectButtonBackgroundError: RAINBOWKIT_COLORS.whiteAlpha,
		connectButtonInnerBackground: 'linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))',
		connectButtonText: RAINBOWKIT_COLORS.whiteAlpha,
		connectButtonTextError: RAINBOWKIT_COLORS.white,
		connectionIndicator: '#38B2AC',
		error: '#FC8181',
		generalBorder: RAINBOWKIT_COLORS.gray,
		generalBorderDim: RAINBOWKIT_COLORS.whiteAlpha,
		menuItemBackground: 'RGBA(0, 0, 0, 0.04)',
		modalBackdrop: 'RGBA(255, 255, 255, 0.48)',
		modalBackground: RAINBOWKIT_COLORS.white,
		modalBorder: 'transparent',
		modalText: '#25292E',
		modalTextDim: 'rgba(60, 66, 66, 0.3)',
		modalTextSecondary: 'rgba(60, 66, 66, 0.6)',
		profileAction: '#F7FAFC',
		profileActionHover: '#EDF2F7',
		profileForeground: RAINBOWKIT_COLORS.gray,
		selectedOptionBorder: 'rgba(60, 66, 66, 0.1)',
		standby: '#F6E05E',
	},
	fonts: {
		body: RAINBOWKIT_COLORS.whiteAlpha,
	},
};

// const darkGrey = '#1A1B1F';

// const accentColors: Record<AccentColorPreset, AccentColor> = {
// 	blue: { accentColor: '#3898FF', accentColorForeground: '#FFF' },
// 	green: { accentColor: '#4BD166', accentColorForeground: darkGrey },
// 	orange: { accentColor: '#FF983D', accentColorForeground: darkGrey },
// 	pink: { accentColor: '#FF7AB8', accentColorForeground: darkGrey },
// 	purple: { accentColor: '#7A70FF', accentColorForeground: '#FFF' },
// 	red: { accentColor: '#FF6257', accentColorForeground: '#FFF' },
// };

// const defaultAccentColor = accentColors.blue;

// export const darkTheme = ({
// 	accentColor = defaultAccentColor.accentColor,
// 	accentColorForeground = defaultAccentColor.accentColorForeground,
// 	...baseThemeOptions
// }: ThemeOptions = {}) => ({
// 	...baseTheme(baseThemeOptions),
// 	colors: {
// 		accentColor,
// 		accentColorForeground,
// 		actionButtonBorder: 'rgba(255, 255, 255, 0.04)',
// 		actionButtonBorderMobile: 'rgba(255, 255, 255, 0.08)',
// 		actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.08)',
// 		closeButton: 'rgba(224, 232, 255, 0.6)',
// 		closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
// 		connectButtonBackground: darkGrey,
// 		connectButtonBackgroundError: '#FF494A',
// 		connectButtonInnerBackground:
// 			'linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))',
// 		connectButtonText: '#FFF',
// 		connectButtonTextError: '#FFF',
// 		connectionIndicator: '#30E000',
// 		error: '#FF494A',
// 		generalBorder: 'rgba(255, 255, 255, 0.08)',
// 		generalBorderDim: 'rgba(255, 255, 255, 0.04)',
// 		menuItemBackground: 'rgba(224, 232, 255, 0.1)',
// 		modalBackdrop: 'rgba(0, 0, 0, 0.5)',
// 		modalBackground: '#1A1B1F',
// 		modalBorder: 'rgba(255, 255, 255, 0.08)',
// 		modalText: '#FFF',
// 		modalTextDim: 'rgba(224, 232, 255, 0.3)',
// 		modalTextSecondary: 'rgba(255, 255, 255, 0.6)',
// 		profileAction: 'rgba(224, 232, 255, 0.1)',
// 		profileActionHover: 'rgba(224, 232, 255, 0.2)',
// 		profileForeground: 'rgba(224, 232, 255, 0.05)',
// 		selectedOptionBorder: 'rgba(224, 232, 255, 0.1)',
// 		standby: '#FFD641',
// 	},
// 	shadows: {
// 		connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
// 		dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
// 		profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
// 		selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
// 		selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.24)',
// 		walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
// 	},
// });

// darkTheme.accentColors = accentColors;

export default {};
