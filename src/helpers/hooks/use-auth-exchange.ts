'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import { apiService } from '@/services/api.service'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/routing'

export function useAuthExchange() {
	const { handleAuthSuccess, isLoading, setIsLoading } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()
	const [handled, setHandled] = useState(false)

	useEffect(() => {
		const handleAuthResult = async () => {
			if (handled) return
			setHandled(true)
			setIsLoading(true)

			const state = searchParams.get('state')
			console.log('Search params:', searchParams.toString())

			if (state) {
				try {
					console.log('Fetching auth data with state:', state)
					const res = await apiService.exchangeAuthState(state)
					console.log('Auth data received:', res)
					const { user, accessToken, refreshToken } = res

					if (!user.id || !user.email || !user.provider) {
						throw new Error('Incomplete user data')
					}

					handleAuthSuccess({ user, accessToken, refreshToken }, true)
				} catch (err) {
					console.error('Failed to exchange state:', err)
					router.push('/selling-classifieds')
				}
			} else {
				console.error('Invalid parameter of state')
				router.push('/selling-classifieds')
			}
			setIsLoading(false)
		}

		handleAuthResult()
	}, [searchParams, isLoading, handleAuthSuccess, router, handled])
}
