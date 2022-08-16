/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	webpack(config: any) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				and: [/\.(js|ts)x?$/],
			},
			use: ['@svgr/webpack'],
		});

		return config;
	},
	i18n: {
		locales: ['en', 'de'],
		defaultLocale: 'en',
	},
};

export default nextConfig;
