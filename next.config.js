/**
 * @type {import('next').NextConfig}
 **/

const i18n = {
	// These are all the locales you want to support in
	// your application
	locales: ['en', 'fr', 'es'],
	// This is the default locale you want to be used when visiting
	// a non-locale prefixed path e.g. `/hello`
	defaultLocale: 'en',
};

const nextConfig = {
	reactStrictMode: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				and: [/\.(js|ts)x?$/],
			},
			use: ['@svgr/webpack'],
		});

		return config;
	},
	i18n,
};

module.exports = nextConfig;
