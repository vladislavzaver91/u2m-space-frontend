'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import { apiService } from '@/services/api.service'
import { useSearchParams, usePathname } from 'next/navigation'
import { useRouter } from '@/i18n/routing'

export function useAuthExchange() {
	const { handleAuthSuccess, isLoading, setIsLoading } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
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
					// Если произошла ошибка при обмене состояния, остаемся на текущей странице
					// Только если мы не на странице авторизации, перенаправляем на /selling-classifieds
					if (pathname.includes('/auth') || pathname.includes('/login')) {
						// Попытаемся вернуть пользователя на страницу, с которой он начал авторизацию
						const returnUrl =
							localStorage.getItem('returnUrl') || '/selling-classifieds'
						localStorage.removeItem('returnUrl')
						router.push(returnUrl)
					}
					// Иначе остаемся на текущей странице
				}
			} else {
				// Если нет параметра state, это может быть обычная загрузка страницы
				// Не перенаправляем пользователя, если он не на странице авторизации
				if (pathname.includes('/auth') || pathname.includes('/login')) {
					console.log(
						'No state parameter on auth page, redirecting to selling-classifieds'
					)
					// Попытаемся вернуть пользователя на страницу, с которой он начал авторизацию
					const returnUrl =
						localStorage.getItem('returnUrl') || '/selling-classifieds'
					localStorage.removeItem('returnUrl')
					router.push(returnUrl)
				}
				// Если пользователь на обычной странице без параметра state, ничего не делаем
			}
			setIsLoading(false)
		}

		handleAuthResult()
	}, [searchParams, isLoading, handleAuthSuccess, router, handled, pathname])
}
