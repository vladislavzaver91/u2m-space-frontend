import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import '../globals.css'
import { AuthProvider } from '@/helpers/contexts/auth-context'
import { ModalProvider } from '@/helpers/contexts/modal-context'
import { routing } from '@/i18n/routing'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import ClientLayout from './client-layout'
import { ClassifiedFormProvider } from '@/helpers/contexts/classified-form-context'
import { LanguageProvider } from '@/helpers/contexts/language-context'
import { UserProvider } from '@/helpers/contexts/user-context'
import { ProfileFormProvider } from '@/helpers/contexts/profile-form-context'
import { LoadingProvider } from '@/helpers/contexts/loading-context'
import { SearchProvider } from '@/helpers/contexts/search-context'

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: 'U2M SPACE',
	description: 'Your new simpler, reliable way to exchange.',
	icons: {
		icon: '/favicon.ico',
		apple: '/favicon.png',
	},
	openGraph: {
		siteName: 'Маркетплейс для обмена и продажи', // Default value
		title: 'U2M SPACE',
		description: 'Your new simpler, reliable way to exchange.',
		type: 'website',
		url: typeof window === 'undefined' ? '' : window.location.href,
		images: [
			{
				url: '/og-image.jpg', // спросить у Дениса за изображение
				width: 1200,
				height: 630,
				alt: 'U2M SPACE Marketplace',
			},
		],
	},
	twitter: {
		creator: '@exxtremum',
	},
}

interface RootLayoutProps {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export default async function RootLayout({
	children,
	params,
}: RootLayoutProps) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	let messages
	try {
		messages = (await import(`../../messages/${locale}.json`)).default
	} catch (error) {
		notFound()
	}

	// Динамическое обновление og:siteName в зависимости от локали
	const siteNameByLocale: Record<string, string> = {
		ua: 'Маркетплейс для обмена и продажи',
		en: 'Marketplace for exchange and sale',
		pl: 'Rynek wymiany i sprzedaży',
	}
	const ogSiteName = siteNameByLocale[locale] || siteNameByLocale.ua

	// Обновляем metadata для текущей локали
	metadata.openGraph = {
		...metadata.openGraph,
		siteName: ogSiteName,
	}

	const isHomePage =
		typeof window === 'undefined' ? false : window.location.pathname === '/'
	const bodyClass = `${
		montserrat.variable
	} antialiased flex flex-col min-h-screen ${isHomePage ? '' : 'has-scroll'}`

	return (
		<html lang={locale}>
			<body className={bodyClass}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<LoadingProvider>
						<AuthProvider>
							<UserProvider>
								<LanguageProvider>
									<ModalProvider>
										<SearchProvider>
											<ClassifiedFormProvider>
												<ProfileFormProvider>
													<ClientLayout>{children}</ClientLayout>
												</ProfileFormProvider>
											</ClassifiedFormProvider>
										</SearchProvider>
									</ModalProvider>
								</LanguageProvider>
							</UserProvider>
						</AuthProvider>
					</LoadingProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
