'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import { useAuth } from './auth-context'
import { apiService } from '@/services/api.service'

interface UserContextType {
	user: User | null
	loading: boolean
	error: string | null
	updateUser: (updatedUser: User) => void
	fetchUser: (id: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
	const { user: authUser } = useAuth()
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const fetchUser = async (id: string) => {
		setLoading(true)
		setError(null)
		try {
			const userData = await apiService.getUserProfile(id)
			setUser(userData)
		} catch (err: any) {
			setError(err.message || 'Failed to fetch user profile')
		} finally {
			setLoading(false)
		}
	}

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser)
	}

	// Загружаем данные пользователя при монтировании, если есть authUser
	useEffect(() => {
		if (authUser?.id) {
			fetchUser(authUser.id)
		}
	}, [authUser])

	return (
		<UserContext.Provider
			value={{ user, loading, error, updateUser, fetchUser }}
		>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error('useUser must be used within a UserProvider')
	}
	return context
}
