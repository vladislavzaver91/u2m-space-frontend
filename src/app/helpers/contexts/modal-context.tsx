'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
	isLoginModalOpen: boolean
	openLoginModal: () => void
	closeLoginModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProviderProps {
	children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

	const openLoginModal = () => setIsLoginModalOpen(true)
	const closeLoginModal = () => setIsLoginModalOpen(false)

	return (
		<ModalContext.Provider
			value={{ isLoginModalOpen, openLoginModal, closeLoginModal }}
		>
			{children}
		</ModalContext.Provider>
	)
}

export function useModal(): ModalContextType {
	const context = useContext(ModalContext)
	if (!context) {
		throw new Error('useModal must be used within a ModalProvider')
	}
	return context
}
