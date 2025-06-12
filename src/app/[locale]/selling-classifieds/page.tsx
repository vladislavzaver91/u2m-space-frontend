import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import ClientSellingClassifieds from './client-selling-classifieds'

export async function generateMetadata(): Promise<Metadata> {
	try {
		const locale = await getLocale()
		const tMetadata = await getTranslations('Metadata')

		const title =
			tMetadata('title') ||
			'Marketplace for Trading, Selling & Auctions of Items'
		const description =
			tMetadata('description') ||
			'A universal marketplace to sell, trade or auction new and used items. Safe, easy and profitable — join now and start exchanging!'

		const canonicalUrl = `https://u2m.space/${locale}/selling-classifieds`

		const alternateUrls = [
			{ hrefLang: 'uk', href: `https://u2m.space/uk/selling-classifieds` },
			{ hrefLang: 'en', href: `https://u2m.space/en/selling-classifieds` },
			{ hrefLang: 'pl', href: `https://u2m.space/pl/selling-classifieds` },
		]

		return {
			title,
			description,
			robots: {
				index: true, // Разрешаем индексацию для списка
				follow: true, // Разрешаем следование по ссылкам
			},
			other: {
				google: 'notranslate', // Запрещаем Google переводить страницу
			},
			icons: {
				icon: '/favicon.ico', // Favicon для страницы
			},
			openGraph: {
				title,
				description,
				url: canonicalUrl,
				type: 'website',
				locale, // Указываем текущую локаль
				images: [
					{
						url: 'https://u2m.space/og-image.jpg', // Общая картинка для страницы списка
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
				images: ['https://u2m.space/twitter-image.jpg'], // Картинка для Twitter
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
		// Резервные метаданные в случае ошибки
		return {
			title: 'Selling Classifieds | U2M SPACE',
			description: 'Browse our collection of classifieds for sale on U2M SPACE',
			robots: {
				index: true,
				follow: true,
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

export default function SellingClassifiedsPage() {
	return <ClientSellingClassifieds />
}
