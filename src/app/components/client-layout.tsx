'use client'

import { useEffect, useState } from 'react'
import { useScrollStyle } from '../helpers/hooks/use-scroll-style'
import { useVisitRedirect } from '../helpers/hooks/use-visit-redirect'
import { Loader } from './ui/loader'
import { apiService } from '../services/api.service'
import { useAuth } from '../helpers/contexts/auth-context'
import { useRouter } from 'next/navigation'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const shouldRender = useVisitRedirect()
	useScrollStyle()
	const { user, handleAuthSuccess } = useAuth()
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const checkLogin = async () => {
			if (process.env.NEXT_PUBLIC_ENVIRONMENT_URL === 'develop' && !user) {
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
				} catch (error: any) {
					console.error('Login error:', error)
					setError(error.response?.data?.error || 'Failed to login')
				}
			}
		}
		checkLogin()
	}, [user, handleAuthSuccess, router])

	if (!shouldRender) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<div className='bg-red-100 text-red-700 p-4 rounded-lg text-center'>
					{error}
				</div>
			</div>
		)
	}

	return <main className='flex-1'>{children}</main>
}
