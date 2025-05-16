'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../contexts/auth-context'
import { apiService } from '@/app/services/api.service'

export function useAuthExchange() {
	const { handleAuthSuccess } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()
	const [handled, setHandled] = useState(false)

	useEffect(() => {
		const handleAuthResult = async () => {
			if (handled) return
			setHandled(true)

			const state = searchParams.get('state')
			console.log('Search params:', searchParams.toString())

			if (state) {
				try {
					console.log('Fetching auth data with state:', state)
					const response = await apiService.exchangeAuthState(state)
					console.log('Auth data received:', response)

					const { user, accessToken, refreshToken } = response

					if (!user.id || !user.email || !user.provider) {
						throw new Error('Incomplete user data')
					}

					handleAuthSuccess({ user, accessToken, refreshToken }, true)
					router.replace('/selling-classifieds') // Очищаем URL и редиректим
				} catch (err) {
					console.error('Failed to exchange state:', err)
				}
			}
		}

		handleAuthResult()
	}, [searchParams, handleAuthSuccess, router, handled])
}
