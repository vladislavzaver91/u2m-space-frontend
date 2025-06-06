'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { IconCustom } from './icon-custom'

interface CustomSelectProps {
	label: string
	options: string[]
	value: string
	onChange: (value: string) => void
	onClick?: () => void
	onOpenChange?: (isOpen: boolean) => void
}

export const CustomSelect = ({
	label,
	options,
	value,
	onChange,
	onClick,
	onOpenChange,
}: CustomSelectProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [showAsModal, setShowAsModal] = useState(false)
	const [isOpening, setIsOpening] = useState(false)

	const containerRef = useRef<HTMLDivElement>(null)
	const modalContainerRef = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Закрытие списка при клике вне селекта
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node) &&
				modalContainerRef.current &&
				!modalContainerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
				setIsFocused(false)
				onOpenChange?.(false)
				onClick?.()
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [onOpenChange, onClick])

	// Обработчик изменения размера окна
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const checkShouldShowModal = useCallback(() => {
		if (isMobile && containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect()
			const windowHeight = window.innerHeight
			return rect.top >= windowHeight / 2
		}
		return false
	}, [isMobile])

	// Обновляем режим при скролле (только если селект уже открыт)
	useEffect(() => {
		const handleScroll = () => {
			if (isOpen) {
				const shouldShowModal = checkShouldShowModal()
				setShowAsModal(shouldShowModal)
			}
		}

		if (isOpen) {
			window.addEventListener('scroll', handleScroll)
			return () => window.removeEventListener('scroll', handleScroll)
		}
	}, [isOpen, checkShouldShowModal])

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			setIsOpen(false)
			setIsFocused(false)
			onOpenChange?.(false)
			onClick?.()
		}
	}

	const handleToggle = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isOpen) {
			const shouldShowModal = checkShouldShowModal()
			setShowAsModal(shouldShowModal)
			setIsOpening(true)

			requestAnimationFrame(() => {
				setIsOpen(true)
				setIsOpening(false)
				onOpenChange?.(true)
			})
		} else {
			setIsOpen(false)
			setShowAsModal(false)
			onOpenChange?.(false)
		}
		onClick?.()
	}

	const handleOptionClick = (option: string, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onChange(option)
		setIsOpen(false)
		setShowAsModal(false)
		setIsFocused(true)
		onOpenChange?.(false)
	}

	const renderOptionsView = () => (
		<>
			{options.map(option => (
				<div
					key={option}
					className={`p-4 text-[16px] font-bold text-[#4f4f4f] cursor-pointer hover:bg-[#F7F7F7] ${
						value === option ? 'bg-[#F7F7F7]' : ''
					}`}
					onClick={e => handleOptionClick(option, e)}
				>
					{option}
				</div>
			))}
		</>
	)

	const renderNormalDropdown = () => (
		<motion.div
			className={`relative h-[102px] ${
				isOpen ? 'shadow-custom-xl rounded-[13px] w-[316px]' : 'w-full pt-8'
			}`}
			transition={{ duration: 0.3 }}
			ref={containerRef}
		>
			<label
				htmlFor={`${label.toLowerCase()}-select`}
				className={`w-fit absolute transition-all duration-300 ease-in-out text-[16px] font-bold ${
					isOpen
						? 'text-[#3486fe] left-[18px] top-4'
						: 'top-9 left-2 text-[#4f4f4f]'
				}`}
			>
				{label}
			</label>
			<div
				id={`${label.toLowerCase()}-select`}
				className={`relative text-[16px] font-bold text-[#4f4f4f] outline-none border-b bg-transparent cursor-pointer flex justify-end items-center ${
					isOpen
						? 'w-[316px] h-14 py-[18px] px-4 border-transparent'
						: 'w-full h-[38px] px-2 border-[#bdbdbd]'
				}`}
				onClick={handleToggle}
			>
				<div className='flex justify-center items-center w-6 h-6'>
					<IconCustom
						name='arrow-down-select'
						className='w-2.5 h-1.5 fill-none text-[#3486fe]'
					/>
				</div>
			</div>
			{isOpen && !isOpening && (
				<div
					ref={dropdownRef}
					className='bg-white max-h-[200px] custom-scrollbar overflow-y-auto w-full max-w-[316px] absolute top-[60px] left-0 shadow-custom-xl rounded-[13px] z-40'
				>
					{renderOptionsView()}
				</div>
			)}
		</motion.div>
	)

	const renderModalDropdown = () => (
		<>
			{/* Обычный селект (закрытое состояние) */}
			<motion.div
				className='relative h-[102px] w-full pt-8'
				transition={{ duration: 0.3 }}
				ref={containerRef}
			>
				{/* Label */}
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit absolute transition-all duration-300 ease-in-out text-[16px] font-bold top-9 left-2 ${
						isOpen ? 'text-transparent' : 'text-[#4f4f4f] '
					}`}
				>
					{label}
				</label>

				{/* Select input */}
				<div
					id={`${label.toLowerCase()}-select`}
					className='relative text-[16px] font-bold text-[#4f4f4f] outline-none border-b bg-transparent cursor-pointer flex justify-end items-center w-full h-[38px] px-2 border-[#bdbdbd]'
					onClick={handleToggle}
				>
					<div className='flex justify-center items-center w-6 h-6'>
						<IconCustom
							name='arrow-down-select'
							className='w-2.5 h-1.5 fill-none text-[#3486fe]'
						/>
					</div>
				</div>
			</motion.div>

			{/* Модальное окно с опциями */}
			{isOpen && !isOpening && (
				<div
					className='fixed inset-0 z-50 flex items-end max-sm:justify-start sm:justify-end pb-4 px-4'
					onClick={handleOverlayClick}
				>
					<motion.div
						className='bg-white shadow-custom-xl rounded-[13px] w-full max-w-[316px] max-h-[60vh]'
						transition={{ duration: 0.3 }}
						ref={modalContainerRef}
						onClick={handleToggle}
					>
						{/* Header модального окна */}
						<div className='p-4 border-b border-transparent bg-transparent flex items-center justify-between'>
							<div className='text-[16px] font-bold text-[#3486fe] '>
								{label}
							</div>
							<div className='flex justify-center items-center w-6 h-6'>
								<IconCustom
									name='arrow-down-select'
									className='w-2.5 h-1.5 fill-none text-[#3486fe]'
								/>
							</div>
						</div>

						{/* Опции в модальном окне */}
						<div className='bg-white max-h-[200px] custom-scrollbar overflow-y-auto'>
							{renderOptionsView()}
						</div>
					</motion.div>
				</div>
			)}
		</>
	)

	const shouldRenderAsModal = isMobile && showAsModal

	if (shouldRenderAsModal) {
		return renderModalDropdown()
	} else {
		return renderNormalDropdown()
	}
}
