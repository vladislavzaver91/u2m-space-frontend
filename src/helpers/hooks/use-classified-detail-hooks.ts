'use client'

import { Classified } from '@/types'
import { useState, useEffect, useLayoutEffect } from 'react'
import { useLanguage } from '../contexts/language-context'
import { useLoading } from '../contexts/loading-context'
import { classifiedsService } from '@/services/api/classifieds.service'
import { useUser } from '../contexts/user-context'
import { favoritesService } from '@/services/api/favorites.service'

interface ClassifiedDataProps {
	initialClassified: Classified | null
	initialClassifieds: Classified[]
	id: string
}

interface FavoritesProps {
	initialFavoritesBool: boolean
	initialFavorites: number | undefined
	classifiedId: string
}

export function useClassifiedData({
	initialClassified,
	initialClassifieds,
	id,
}: ClassifiedDataProps) {
	const { settings } = useLanguage()
	const { setIsLoading } = useLoading()

	const [classified, setClassified] = useState<Classified | null>(
		initialClassified
	)
	const [classifieds, setClassifieds] =
		useState<Classified[]>(initialClassifieds)
	const [isFetching, setIsFetching] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState(1)

	const limit = 10

	const fetchClassified = async () => {
		try {
			setIsFetching(true)
			setError(null)
			const data = await classifiedsService.getClassifiedById(id, {
				currency: settings.currencyCode,
			})
			console.log('getClassifiedById data:', data)
			setClassified(data)
		} catch (error: any) {
			console.error('Error fetching classified:', error)
			setError(
				error.response?.status === 404
					? 'Classified not found.'
					: 'An error occurred while fetching the classified.'
			)
		} finally {
			setIsFetching(false)
			setIsLoading(false)
		}
	}

	const fetchClassifieds = async () => {
		try {
			setIsFetching(true)
			const data = await classifiedsService.getClassifieds({
				limit,
				currency: settings.currencyCode,
			})
			console.log(data)
			setClassifieds(prev => {
				const newClassifieds = [
					...prev,
					...data.classifieds.largeFirst,
					...data.classifieds.largeSecond,
					...data.classifieds.small,
				]
				return newClassifieds
			})
		} catch (error) {
			console.error('Error fetching classifieds:', error)
		} finally {
			setIsFetching(false)
		}
	}

	useLayoutEffect(() => {
		if (initialClassified) {
			setClassified(initialClassified)
			setIsLoading(false)
		} else {
			fetchClassified()
		}
	}, [id, initialClassified, setIsLoading])

	useEffect(() => {
		if (page > 1 || initialClassifieds.length === 0) {
			fetchClassifieds()
		}
	}, [page, initialClassifieds])

	useLayoutEffect(() => {
		if (settings.currencyCode && initialClassified) {
			fetchClassified()
			setClassifieds([])
			fetchClassifieds()
		}
	}, [settings.currencyCode])

	return {
		classified,
		setClassified,
		classifieds,
		setClassifieds,
		isFetching,
		error,
		page,
		setPage,
		fetchClassified,
		fetchClassifieds,
	}
}

export function useFavorites({
	initialFavoritesBool,
	initialFavorites,
	classifiedId,
}: FavoritesProps) {
	const [favoritesBool, setFavoritesBool] =
		useState<boolean>(initialFavoritesBool)
	const [favorites, setFavorites] = useState<number | undefined>(
		initialFavorites
	)
	const { user, updateFavorites } = useUser()

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		if (!user) {
			console.log('User not authenticated, cannot toggle favorite')
			return
		}
		try {
			const res = await favoritesService.toggleFavorite(classifiedId)
			console.log('favoritesBool:', res.favoritesBool)
			setFavoritesBool(res.favoritesBool)
			setFavorites(res.favorites)
			updateFavorites(classifiedId, res.favoritesBool)
		} catch (error: unknown) {
			console.error('Error toggling favorite:', error)
		}
	}

	return {
		favoritesBool,
		favorites,
		handleFavoriteClick,
	}
}
