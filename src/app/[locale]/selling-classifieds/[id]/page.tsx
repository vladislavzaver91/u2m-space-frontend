import type { Metadata } from 'next'
import { ClientClassifiedDetail } from './client-classified-detail'
import { apiService } from '@/services/api.service'
import { Classified } from '@/types'
import { getLocale } from 'next-intl/server'

type Props = {
	params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params
	const locale = await getLocale()

	try {
		const classified = await apiService.getClassifiedById(id)
		const title =
			classified.title.length > 50
				? `${classified.title.slice(0, 50)}...`
				: classified.title
		const description =
			classified.description.length > 100
				? `${classified.description.slice(0, 100)}...`
				: classified.description

		const canonicalUrl = `https://example.com/${locale}/selling-classifieds/${id}`
		const alternateUrls = [
			{
				hrefLang: 'uk',
				href: `https://example.com/uk/selling-classifieds/${id}`,
			},
			{
				hrefLang: 'en',
				href: `https://example.com/en/selling-classifieds/${id}`,
			},
			{
				hrefLang: 'pl',
				href: `https://example.com/pl/selling-classifieds/${id}`,
			},
		]

		return {
			title,
			description,
			robots: {
				index: false,
				follow: false,
			},
			other: {
				google: 'notranslate',
			},
			icons: {
				icon: '/favicon.ico',
			},
			openGraph: {
				title,
				description,
				url: canonicalUrl,
				type: 'website',
				images: [
					{
						url: classified.images[0] || 'https://example.com/og-image.jpg',
						width: 1200,
						height: 630,
						alt: title,
					},
				],
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
				images: [
					classified.images[0] || 'https://example.com/twitter-image.jpg',
				],
			},
			alternates: {
				canonical: canonicalUrl,
				languages: {
					uk: alternateUrls[0].href,
					en: alternateUrls[1].href,
					pl: alternateUrls[2].href,
				},
			},
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'Classifieds not found | U2M SPACE',
			description:
				'Sorry, the classifieds you are looking for is not available on U2M SPACE',
			robots: {
				index: false,
				follow: false,
			},
			other: {
				google: 'notranslate',
			},
			icons: {
				icon: '/favicon.ico',
			},
		}
	}
}

export default async function ClassifiedDetailPage({ params }: Props) {
	const { id } = await params
	let classified: Classified | null = null
	let classifieds: Classified[] = []
	let error: string | null = null

	try {
		classified = await apiService.getClassifiedById(id)
		classifieds = (await apiService.getClassifieds({ page: 1, limit: 10 }))
			.classifieds
	} catch (err: any) {
		console.error('Error fetching data:', err)
		error =
			err.response?.status === 404
				? 'Classifieds not found'
				: 'The classifieds could not be loaded. Please try again later.'
	}

	return (
		<ClientClassifiedDetail
			initialClassified={classified}
			initialClassifieds={classifieds}
			id={id}
		/>
	)
}
