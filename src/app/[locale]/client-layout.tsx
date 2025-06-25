'use client'

import { useEffect, useState } from 'react'
import { useScrollStyle } from '../../helpers/hooks/use-scroll-style'
import { useVisitRedirect } from '../../helpers/hooks/use-visit-redirect'
import { apiService } from '../../services/api.service'
import { useAuth } from '../../helpers/contexts/auth-context'
import { Loader } from '@/components/ui/loader'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Header } from '@/components/header'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const shouldRender = useVisitRedirect()
	useScrollStyle()
	const { authUser, handleAuthSuccess, isLoading, setIsLoading } = useAuth()
	const router = useRouter()
	const pathname = usePathname()
	const locale = useLocale()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const checkLogin = async () => {
			if (authUser) return

			setIsLoading(true)

			if (process.env.NEXT_PUBLIC_ENVIRONMENT_URL === 'develop' && !authUser) {
				console.log(
					'Attempting to login with environment:',
					process.env.NEXT_PUBLIC_ENVIRONMENT_URL,
					'API_URL:',
					process.env.NEXT_PUBLIC_API_URL
				)
				try {
					const res = await apiService.login({
						email: 'user@user.com',
						password: '1234qwer',
					})
					handleAuthSuccess({
						user: res.user,
						accessToken: res.accessToken,
						refreshToken: res.refreshToken,
					})
					console.log('Success login:', res)
					if (pathname === `/${locale}` || pathname === '/') {
						router.push(`${locale}/selling-classifieds`)
					}
				} catch (error: any) {
					console.error('Login error:', error)
					setError(error.response?.data?.error || 'Failed to login')
					setIsLoading(false)
				}
			}
		}
		checkLogin()
	}, [authUser, isLoading, handleAuthSuccess, router])

	if (isLoading || !shouldRender) {
		return (
			<div className='flex-1 flex items-center justify-center min-h-[calc(100vh-88px)]'>
				<Loader />
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex-1 flex items-center justify-center min-h-[calc(100vh-88px)]'>
				<div className='bg-red-100 text-red-700 p-4 rounded-lg text-center'>
					{error}
				</div>
			</div>
		)
	}

	return (
		<>
			<Header />
			<main className='flex-1 min-h-[calc(105vh)]'>{children}</main>
		</>
	)
}
