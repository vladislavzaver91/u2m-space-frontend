import type { Metadata } from 'next'
import { ClientClassifiedDetail } from './client-classified-detail'
import { apiService } from '@/services/api.service'
import { Classified } from '@/types'
import { getLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { Loader } from '@/components/ui/loader'

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

		const canonicalUrl = `https://u2m.space/${locale}/selling-classifieds/${id}`
		const alternateUrls = [
			{
				hrefLang: 'ua',
				href: `https://u2m.space/uk/selling-classifieds/${id}`,
			},
			{
				hrefLang: 'en',
				href: `https://u2m.space/en/selling-classifieds/${id}`,
			},
			{
				hrefLang: 'pl',
				href: `https://u2m.space/pl/selling-classifieds/${id}`,
			},
		]

		return {
			title,
			description,
			robots: {
				index: false,
				follow: false,
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
						url: classified.images[0] || 'https://u2m.space/og-image.jpg',
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
				images: [classified.images[0] || 'https://u2m.space/twitter-image.jpg'],
			},
			alternates: {
				canonical: canonicalUrl,
				languages: {
					uk: alternateUrls[0].href,
					en: alternateUrls[1].href,
					pl: alternateUrls[2].href,
				},
			},
			other: {
				...{
					google: 'notranslate',
				},
				// Кастомные link теги для правильных hrefLang
				'link:alternate:ua': `<link rel="alternate" hrefLang="ua" href="${alternateUrls[0].href}" />`,
				'link:alternate:en': `<link rel="alternate" hrefLang="en" href="${alternateUrls[1].href}" />`,
				'link:alternate:pl': `<link rel="alternate" hrefLang="pl" href="${alternateUrls[2].href}" />`,
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
		;[classified, { classifieds }] = await Promise.all([
			apiService.getClassifiedById(id),
			apiService.getClassifieds({ page: 1, limit: 10 }),
		])
	} catch (err: any) {
		console.error('Error fetching data:', err)
		error =
			err.response?.status === 404
				? 'Classifieds not found'
				: 'The classifieds could not be loaded. Please try again later.'
	}

	return (
		<Suspense fallback={<Loader />}>
			<ClientClassifiedDetail
				initialClassified={classified}
				initialClassifieds={classifieds}
				id={id}
			/>
		</Suspense>
	)
}
