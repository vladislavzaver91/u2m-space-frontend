'use client'

import { Loader } from '@/components/ui/loader'
import { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingContextType {
	isLoading: boolean
	setIsLoading: (isLoading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(false)

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{children}
			{isLoading && (
				<div className='fixed inset-0 bg-white min-h-screen flex items-center justify-center z-50'>
					<Loader />
				</div>
			)}
		</LoadingContext.Provider>
	)
}

export function useLoading() {
	const context = useContext(LoadingContext)
	if (!context) {
		throw new Error('useLoading must be used within a LoadingProvider')
	}
	return context
}
