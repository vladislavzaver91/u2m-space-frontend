import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from './components/header'
import { AuthProvider } from './helpers/contexts/auth-context'

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: 'U2M SPACE',
	description: 'Your new simpler, reliable way to exchange.',
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
					<Header />
					<main className='flex-1'>{children}</main>
				</AuthProvider>
			</body>
		</html>
	)
}
