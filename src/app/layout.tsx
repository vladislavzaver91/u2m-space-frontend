import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from './components/header'
import { AuthProvider } from './helpers/contexts/auth-context'
import { ModalProvider } from './helpers/contexts/modal-context'
import ClientLayout from './components/client-layout'

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: 'U2M SPACE',
	description: 'Your new simpler, reliable way to exchange.',
	icons: {
		icon: '/favicon.ico',
		apple: '/favicon.png', // Для Apple Touch Icon (опционально)
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${montserrat.variable} antialiased flex flex-col min-h-screen`}
			>
				<AuthProvider>
					<ModalProvider>
						<Header />
						<ClientLayout>{children}</ClientLayout>
					</ModalProvider>
					{/* <BottomButtons /> */}
				</AuthProvider>
			</body>
		</html>
	)
}
