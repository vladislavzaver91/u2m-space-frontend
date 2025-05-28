'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
	isLoginModalOpen: boolean
	openLoginModal: () => void
	closeLoginModal: () => void
	isModalOpen: boolean
	openModal: () => void
	closeModal: () => void
	handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void
	initializeEscListener: () => () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProviderProps {
	children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openLoginModal = () => setIsLoginModalOpen(true)
	const closeLoginModal = () => setIsLoginModalOpen(false)
	const openModal = () => setIsModalOpen(true)
	const closeModal = () => setIsModalOpen(false)

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			closeModal()
		}
	}

	const initializeEscListener = () => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeModal()
			}
		}
		window.addEventListener('keydown', handleEsc)
		return () => window.removeEventListener('keydown', handleEsc)
	}

	return (
		<ModalContext.Provider
			value={{
				isLoginModalOpen,
				openLoginModal,
				closeLoginModal,
				isModalOpen,
				openModal,
				closeModal,
				handleOverlayClick,
				initializeEscListener,
			}}
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
