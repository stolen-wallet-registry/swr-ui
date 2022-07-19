// Source: https://css-tricks.com/snippets/css/system-font-stack

import { Theme } from '@rainbow-me/rainbowkit';

// Note that quotes have been removed to avoid escaping and server/client mismatch issues
const systemFontStack =
	'Hack, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
const fontStacks = {
	rounded: `Hack, SFRounded, ui-rounded, "SF Pro Rounded", ${systemFontStack}`,
	system: systemFontStack,
} as const;
type FontStack = keyof typeof fontStacks;

export const RAINBOWKIT_COLORS = {
	whiteAlpha: 'RGBA(255, 255, 255, 0.24)',
	blackAlpha: 'RGBA(0, 0, 0, 0.80)',
	white: '#FFFFFF',
	black: '#000000',
};

type RadiusScale = 'large' | 'medium' | 'small' | 'none';
const radiusScales: Record<
	RadiusScale,
	{
		actionButton: string;
		connectButton: string;
		modal: string;
		modalMobile: string;
	}
> = {
	large: {
		actionButton: '9999px',
		connectButton: '12px',
		modal: '24px',
		modalMobile: '28px',
	},
	medium: {
		actionButton: '10px',
		connectButton: '8px',
		modal: '16px',
		modalMobile: '18px',
	},
	none: {
		actionButton: '0px',
		connectButton: '0px',
		modal: '0px',
		modalMobile: '0px',
	},
	small: {
		actionButton: '4px',
		connectButton: '4px',
		modal: '8px',
		modalMobile: '8px',
	},
};

type Blurs = 'large' | 'small' | 'none';
const blurs: Record<
	Blurs,
	{
		modalOverlay: string;
	}
> = {
	large: {
		modalOverlay: 'blur(20px)',
	},
	none: {
		modalOverlay: 'blur(0px)',
	},
	small: {
		modalOverlay: 'blur(4px)',
	},
};

interface BaseThemeOptions {
	borderRadius?: RadiusScale;
	fontStack?: FontStack;
	overlayBlur?: Blurs;
}

type Vars = Theme;

export const baseTheme = ({
	borderRadius = 'large',
	fontStack = 'rounded',
	overlayBlur = 'none',
}: // from source: Pick<ThemeVars, 'radii' | 'fonts' | 'blurs'>
BaseThemeOptions): Pick<any, 'radii' | 'fonts' | 'blurs'> => ({
	blurs: {
		modalOverlay: blurs[overlayBlur].modalOverlay,
	},
	fonts: {
		body: fontStacks[fontStack],
	},
	radii: {
		actionButton: radiusScales[borderRadius].actionButton,
		connectButton: radiusScales[borderRadius].connectButton,
		menuButton: radiusScales[borderRadius].connectButton,
		modal: radiusScales[borderRadius].modal,
		modalMobile: radiusScales[borderRadius].modalMobile,
	},
});

export interface AccentColor {
	accentColor: string;
	accentColorForeground: string;
}

export type AccentColorPreset = 'blue' | 'green' | 'red' | 'purple' | 'pink' | 'orange';

export interface ThemeOptions extends BaseThemeOptions {
	accentColor?: string;
	accentColorForeground?: string;
}
