'use client'

import { useTranslations, useLocale } from 'next-intl'
import Head from 'next/head'

interface SeoHeadProps {
	title?: string
	description?: string
	ogImage?: string
	twitterImage?: string
}

export const SeoHead = ({
	title = 'Маркетплейс обміну, продажу та аукціонів речей',
	description = 'Універсальний маркетплейс для продажу, обміну та аукціонів нових і вживаних речей. Безпечно, зручно та вигідно — приєднуйтесь зараз!',
	ogImage = 'https://example.com/og-image.jpg',
	twitterImage = 'https://example.com/twitter-image.jpg',
}: SeoHeadProps) => {
	const locale = useLocale()
	const t = useTranslations('Metadata')

	// Определяем переводы для разных языков
	const localizedTitles: { [key: string]: string } = {
		uk: t('title.uk') || title,
		en: t('title.en') || 'Marketplace for Trading, Selling & Auctions of Items',
		pl:
			t('title.pl') || 'Marketplace do wymiany, sprzedaży i aukcji przedmiotów',
	}

	const localizedDescriptions: { [key: string]: string } = {
		uk: t('description.uk') || description,
		en:
			t('description.en') ||
			'A universal marketplace to sell, trade or auction new and used items. Safe, easy and profitable — join now and start exchanging!',
		pl:
			t('description.pl') ||
			'Uniwersalny marketplace do sprzedaży, wymiany i aukcji nowych i używanych rzeczy. Bezpiecznie, wygodnie i korzystnie — dołącz już teraz!',
	}

	const canonicalUrl = `https://example.com/${locale}/`
	const alternateUrls = [
		{ hrefLang: 'uk', href: 'https://example.com/uk/' },
		{ hrefLang: 'en', href: 'https://example.com/en/' },
		{ hrefLang: 'pl', href: 'https://example.com/pl/' },
	]

	return (
		<Head>
			{/* Основные мета-теги */}
			<meta name='robots' content='noindex, nofollow' />
			<meta name='google' content='notranslate' />
			<link rel='icon' href='/favicon.ico' type='image/x-icon' />

			{/* Open Graph для соцсетей */}
			<meta property='og:title' content={localizedTitles[locale || 'uk']} />
			<meta
				property='og:description'
				content={localizedDescriptions[locale || 'uk']}
			/>
			<meta property='og:image' content={ogImage} />
			<meta property='og:url' content={canonicalUrl} />
			<meta property='og:type' content='website' />

			{/* Twitter Card */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={localizedTitles[locale || 'uk']} />
			<meta
				name='twitter:description'
				content={localizedDescriptions[locale || 'uk']}
			/>
			<meta name='twitter:image' content={twitterImage} />

			{/* Canonical и мультиязычность */}
			<link rel='canonical' href={canonicalUrl} />
			{alternateUrls.map(({ hrefLang, href }) => (
				<link key={hrefLang} rel='alternate' hrefLang={hrefLang} href={href} />
			))}
		</Head>
	)
}
