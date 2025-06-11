'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import { useAuth } from './auth-context'
import { apiService } from '@/services/api.service'
import { useRouter } from '@/i18n/routing'

interface UserContextType {
	user: User | null
	loading: boolean
	error: string | null
	updateUser: (updatedUser: User) => void
	updateFavorites: (classifiedId: string, add: boolean) => void
	fetchUser: (id: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
	const { authUser } = useAuth()
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const router = useRouter()

	const fetchUser = async (id: string) => {
		setLoading(true)
		setError(null)
		try {
			const userData = await apiService.getUserProfile(id)
			setUser(userData)

			if (!userData.nickname && authUser) {
				router.push(`/profile/${id}`)
			} else {
				router.push('/selling-classifieds')
			}
		} catch (err: any) {
			setError(err.message || 'Failed to fetch user profile')
		} finally {
			setLoading(false)
		}
	}

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser)
	}

	const updateFavorites = (classifiedId: string, add: boolean) => {
		setUser(prev => {
			if (!prev) return prev
			const newFavorites = add
				? [...(prev.favorites || []), classifiedId]
				: (prev.favorites || []).filter(id => id !== classifiedId)
			return { ...prev, favorites: newFavorites }
		})
	}

	// Загружаем данные пользователя при монтировании, если есть authUser
	useEffect(() => {
		if (authUser?.id) {
			fetchUser(authUser.id)
		}
	}, [authUser])

	return (
		<UserContext.Provider
			value={{ user, loading, error, updateUser, updateFavorites, fetchUser }}
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
