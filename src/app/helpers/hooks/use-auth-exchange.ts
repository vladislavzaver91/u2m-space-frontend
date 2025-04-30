'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../contexts/auth-context'
import $api from '@/app/lib/http'

interface User {
	id: string
	email: string
	name: string
	provider: string
}

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
					const response = await $api.get<{
						user: User
						accessToken: string
						refreshToken: string
					}>('/api/auth/exchange', { params: { state } })
					console.log('Auth data received:', response.data)

					const { user, accessToken, refreshToken } = response.data

					if (!user.id || !user.email || !user.provider) {
						throw new Error('Incomplete user data')
					}

					handleAuthSuccess({ user, accessToken, refreshToken })
					router.replace('/selling-classifieds') // Очищаем URL и редиректим
				} catch (err) {
					console.error('Failed to exchange state:', err)
					router.push('/login?error=Authentication failed')
				}
			}
		}

		handleAuthResult()
	}, [searchParams, handleAuthSuccess, router, handled])
}
