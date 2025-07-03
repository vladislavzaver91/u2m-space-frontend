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
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
	const searchParams = useSearchParams()
	const initialQuery = searchParams.get('query') || ''
	const initialCity = searchParams.get('city') || null

	const [searchQuery, setSearchQuery] = useState(initialQuery)
	const [city, setCity] = useState<string | null>(initialCity)
	const [classifieds, setClassifieds] = useState<Classified[]>([])

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
