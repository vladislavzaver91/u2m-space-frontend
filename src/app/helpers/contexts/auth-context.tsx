'use client'

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/app/types'
import axios from 'axios'

interface ApiError {
	response?: {
		status?: number
		data?: {
			error?: string
		}
	}
	message?: string
}

interface AuthContextType {
	user: User | null
	accessToken: string | null
	refreshToken: string | null
	handleAuthSuccess: (
		data: {
			user: User
			accessToken: string
			refreshToken: string
		},
		isInitialLogin?: boolean
	) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

const API_URL =
	process.env.NEXT_PUBLIC_ENVIRONMENT_URL === 'develop'
		? 'http://localhost:3000'
		: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null)
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState<string | null>(null)
	const router = useRouter()

	// Проверяем токены при загрузке приложения
	useEffect(() => {
		const storedAccessToken = localStorage.getItem('accessToken')
		const storedRefreshToken = localStorage.getItem('refreshToken')
		const storedUser = localStorage.getItem('user')
		if (storedAccessToken && storedRefreshToken && storedUser) {
			setAccessToken(storedAccessToken)
			setRefreshToken(storedRefreshToken)
			setUser(JSON.parse(storedUser) as User)
			console.log('Loaded tokens from localStorage:', {
				accessToken: storedAccessToken,
				refreshToken: storedRefreshToken,
			})
		}
	}, [])

	useEffect(() => {
		const refreshInterval = setInterval(async () => {
			if (refreshToken) {
				console.log('Attempting proactive token refresh at:', new Date())
				try {
					const res = await axios.post(
						`${API_URL}/api/auth/refresh`,
						{ refreshToken },
						{
							headers: {
								'Refresh-Token': refreshToken,
							},
							withCredentials: false,
						}
					)
					const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
						res.data
					setAccessToken(newAccessToken)
					setRefreshToken(newRefreshToken)
					localStorage.setItem('accessToken', newAccessToken)
					localStorage.setItem('refreshToken', newRefreshToken)
					console.log('Token refresh successful:', {
						newAccessToken,
						newRefreshToken,
					})
				} catch (error: unknown) {
					console.error('Proactive token refresh failed:', error)
					const apiError = error as ApiError
					if (apiError.response) {
						console.error('Server response:', apiError.response.data)
					}
					logout()
				}
			}
		}, 240 * 1000) // Каждые 4 минуты

		return () => clearInterval(refreshInterval)
	}, [refreshToken])

	// Функция для обработки успешной авторизации
	const handleAuthSuccess = (
		{
			user,
			accessToken,
			refreshToken,
		}: {
			user: User
			accessToken: string
			refreshToken: string
		},
		isInitialLogin: boolean = true
	) => {
		setUser(user)
		setAccessToken(accessToken)
		setRefreshToken(refreshToken)
		localStorage.setItem('accessToken', accessToken)
		localStorage.setItem('refreshToken', refreshToken)
		localStorage.setItem('user', JSON.stringify(user))
		if (isInitialLogin) {
			router.push('/selling-classifieds')
		}
	}

	// Функция для выхода
	const logout = () => {
		setUser(null)
		setAccessToken(null)
		setRefreshToken(null)
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('user')
		localStorage.removeItem('hasVisitedForAuthUser')
		router.push('/')
	}

	return (
		<AuthContext.Provider
			value={{ user, accessToken, refreshToken, handleAuthSuccess, logout }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
