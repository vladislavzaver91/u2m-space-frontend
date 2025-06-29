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
										<ClassifiedFormProvider>
											<ProfileFormProvider>
												<ClientLayout>{children}</ClientLayout>
											</ProfileFormProvider>
										</ClassifiedFormProvider>
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
