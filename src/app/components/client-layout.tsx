'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollStyle } from '../helpers/hooks/use-scroll-style'
import { useVisitRedirect } from '../helpers/hooks/use-visit-redirect'
import { Loader } from './ui/loader'
import { useAuth } from '../helpers/contexts/auth-context'
import { apiService } from '../services/api.service'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const { handleAuthSuccess } = useAuth()
	const shouldRender = useVisitRedirect()
	useScrollStyle()

	useEffect(() => {
		const checkLogin = async () => {
			if (process.env.ENVIRONMENT_URL === 'develop') {
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
					router.push('/selling-classifieds')
				} catch (error) {
					console.error('Login error:', error)
				}
			}
		}
		checkLogin()
	}, [router])

	if (!shouldRender) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return <main className='flex-1'>{children}</main>
}
