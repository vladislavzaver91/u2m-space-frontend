'use client'

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

interface User {
	id: string
	email: string
	name: string
	provider: string
}

interface AuthContextType {
	user: User | null
	accessToken: string | null
	refreshToken: string | null
	handleAuthSuccess: (data: {
		user: User
		accessToken: string
		refreshToken: string
	}) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

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
		}
	}, [])

	// Функция для обработки успешной авторизации
	const handleAuthSuccess = ({
		user,
		accessToken,
		refreshToken,
	}: {
		user: User
		accessToken: string
		refreshToken: string
	}) => {
		setUser(user)
		setAccessToken(accessToken)
		setRefreshToken(refreshToken)
		localStorage.setItem('accessToken', accessToken)
		localStorage.setItem('refreshToken', refreshToken)
		localStorage.setItem('user', JSON.stringify(user))
		router.push('/selling-classifieds')
	}

	// Функция для выхода
	const logout = () => {
		setUser(null)
		setAccessToken(null)
		setRefreshToken(null)
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('user')
		router.push('/login')
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
