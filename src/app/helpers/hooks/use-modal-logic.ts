'use client'

import { useState } from 'react'

export interface ModalControls {
	isLoginModalOpen: boolean
	openLoginModal: () => void
	closeLoginModal: () => void
	handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void
	initializeEscListener: () => () => void
}

export function useModalLogic(): ModalControls {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

	const openLoginModal = () => {
		setIsLoginModalOpen(true)
	}

	const closeLoginModal = () => {
		setIsLoginModalOpen(false)
	}

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			closeLoginModal()
		}
	}

	const initializeEscListener = () => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeLoginModal()
			}
		}
		window.addEventListener('keydown', handleEsc)
		return () => window.removeEventListener('keydown', handleEsc)
	}

	return {
		isLoginModalOpen,
		openLoginModal,
		closeLoginModal,
		handleOverlayClick,
		initializeEscListener,
	}
}
