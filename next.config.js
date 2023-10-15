/** @type {import('next').NextConfig} */
const en = require ('./lang/en.json')
const fr = require ('./lang/fr.json')


const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,

	i18n: {
		locales: ["fr", "en",],
		defaultLocale: "fr",
	},
	async rewrites() {
		// rewrites localized url to fr components
		return [
			...Object.entries(en).map(([key, value]) =>
				key[0] === "/"
					? {
							source: `${value}`,
							destination: `${key}`,
					  }
					: null
			),
			...Object.entries(fr).map(([key, value]) =>
				key[0] === "/"
					? {
							source: `${value}`,
							destination: `${key}`,
					  }
					: null
			),
		].filter((i) => i !== null);
	},
};

module.exports = nextConfig;
