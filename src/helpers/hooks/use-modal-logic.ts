'use client'

import { useState } from 'react'

export interface ModalControls {
	isModalOpen: boolean
	openModal: () => void
	closeModal: () => void
	handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void
	initializeEscListener: () => () => void
}

export function useModalLogic(): ModalControls {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

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

	return {
		isModalOpen,
		openModal,
		closeModal,
		handleOverlayClick,
		initializeEscListener,
	}
}
