import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'u2m-space-backend-production.up.railway.app',
				pathname: '/public/**',
			},
			{
				protocol: 'https',
				hostname: 'azmnxvguxjnosdgbkovr.supabase.co',
				pathname: '/storage/v1/object/public/classified-images/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				pathname: '/public/**',
			},
		],
		domains: [
			'developers.elementor.com',
			'lh3.googleusercontent.com',
			'googleusercontent.com',
			'u2m-space-backend-production.up.railway.app',
			'azmnxvguxjnosdgbkovr.supabase.co',
			'localhost',
		],
	},
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
