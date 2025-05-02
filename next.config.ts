import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
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
		],
		domains: [
			'developers.elementor.com',
			'lh3.googleusercontent.com',
			'googleusercontent.com',
			'u2m-space-backend-production.up.railway.app',
		],
	},
}

export default nextConfig
