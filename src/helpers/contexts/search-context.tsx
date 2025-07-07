'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Classified } from '@/types'

interface PriceRange {
	convertedMin: number
	convertedMax: number
	convertedCurrency: string
}

interface SearchContextType {
	searchQuery: string
	setSearchQuery: (query: string) => void
	classifieds: Classified[]
	setClassifieds: (classifieds: Classified[]) => void
	city: string | null
	setCity: (city: string | null) => void
	availableCities: string[]
	setAvailableCities: (cities: string[]) => void
	minPrice: number | null
	setMinPrice: (price: number | null) => void
	maxPrice: number | null
	setMaxPrice: (price: number | null) => void
	tags: string[]
	setTags: (tags: string[]) => void
	sortBy: 'price' | 'createdAt'
	setSortBy: (sortBy: 'price' | 'createdAt') => void
	sortOrder: 'asc' | 'desc'
	setSortOrder: (sortOrder: 'asc' | 'desc') => void
	priceRange: PriceRange | null
	setPriceRange: (priceRange: PriceRange | null) => void
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
	const [availableCities, setAvailableCities] = useState<string[]>([])
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
	const [priceRange, setPriceRange] = useState<PriceRange | null>(null)

	const resetFilters = () => {
		setFilters({
			tags: [],
			minPrice: null,
			maxPrice: null,
			sortBy: 'createdAt',
			sortOrder: 'desc',
		})
		setCity(null)
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
				availableCities,
				setAvailableCities,
				minPrice: filters.minPrice,
				setMinPrice: price =>
					setFilters(prev => ({ ...prev, minPrice: price })),
				maxPrice: filters.maxPrice,
				setMaxPrice: price =>
					setFilters(prev => ({ ...prev, maxPrice: price })),
				tags: filters.tags,
				setTags: tags => setFilters(prev => ({ ...prev, tags })),
				sortBy: filters.sortBy,
				setSortBy: sortBy => setFilters(prev => ({ ...prev, sortBy })),
				sortOrder: filters.sortOrder,
				setSortOrder: sortOrder => setFilters(prev => ({ ...prev, sortOrder })),
				priceRange,
				setPriceRange,
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
