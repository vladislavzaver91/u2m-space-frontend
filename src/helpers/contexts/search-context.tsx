'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Classified } from '@/types'

interface SearchContextType {
	searchQuery: string
	setSearchQuery: (query: string) => void
	classifieds: Classified[]
	setClassifieds: (classifieds: Classified[]) => void
	city: string | null
	setCity: (city: string | null) => void
	resetFilters: () => void
	isFocused: boolean
	setIsFocused: (focused: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
	const searchParams = useSearchParams()
	const initialQuery = searchParams.get('query') || ''
	const initialCity = searchParams.get('city') || null

	const [searchQuery, setSearchQuery] = useState(initialQuery)
	const [isFocused, setIsFocused] = useState(false)
	const [city, setCity] = useState<string | null>(initialCity)
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [filters, setFilters] = useState<{
		tags: string[]
		minPrice: number | null
		maxPrice: number | null
		sortBy: 'price' | 'createdAt'
		sortOrder: 'asc' | 'desc'
	}>({
		tags: [],
		minPrice: null,
		maxPrice: null,
		sortBy: 'createdAt',
		sortOrder: 'desc',
	})

	const resetFilters = () => {
		setFilters({
			tags: [],
			minPrice: null,
			maxPrice: null,
			sortBy: 'createdAt',
			sortOrder: 'desc',
		})
	}

	useEffect(() => {
		const query = searchParams.get('query') || ''
		const cityParam = searchParams.get('city') || null
		setSearchQuery(query)
		setCity(cityParam)
	}, [searchParams])

	return (
		<SearchContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				classifieds,
				setClassifieds,
				city,
				setCity,
				resetFilters,
				isFocused,
				setIsFocused,
			}}
		>
			{children}
		</SearchContext.Provider>
	)
}

export const useSearch = () => {
	const context = useContext(SearchContext)
	if (!context) {
		throw new Error('useSearch must be used within a SearchProvider')
	}
	return context
}
