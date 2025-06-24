'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { IconCustom } from './icon-custom'
import { LanguageOption } from '@/helpers/contexts/language-context'

interface CustomLanguageSelectProps {
	label: string
	options: LanguageOption[]
	value: 'en' | 'uk' | 'pl'
	onChange: (
		languageCode: 'en' | 'uk' | 'pl',
		countryCode: 'US' | 'UA' | 'PL'
	) => void
	onClick?: () => void
	onOpenChange?: (isOpen: boolean) => void
}

export const CustomLanguageSelect = ({
	label,
	options,
	value,
	onChange,
	onClick,
	onOpenChange,
}: CustomLanguageSelectProps) => {
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

	const handleOptionClick = (
		languageCode: 'en' | 'uk' | 'pl',
		countryCode: 'US' | 'UA' | 'PL',
		e: React.MouseEvent
	) => {
		e.preventDefault()
		e.stopPropagation()
		onChange(languageCode, countryCode)
		setIsOpen(false)
		setShowAsModal(false)
		setIsFocused(true)
		onOpenChange?.(false)
	}

	const renderOptionsView = () => (
		<>
			{options.map(option => (
				<div
					key={option.languageCode}
					className={`p-4 text-[16px] cursor-pointer hover:bg-[#F7F7F7] ${
						value === option.languageCode ? 'bg-[#F7F7F7]' : ''
					}`}
					onClick={e =>
						handleOptionClick(option.languageCode, option.countryCode, e)
					}
				>
					<p className='font-bold text-[16px] text-[#4F4F4F] leading-[18px]'>
						{option.language}
					</p>
					<p className='font-normal text-[14px] text-[#4F4F4F] leading-[18px]'>
						{option.country}
					</p>
				</div>
			))}
		</>
	)

	const selectedOption = options.find(opt => opt.languageCode === value)

	const renderNormalDropdown = () => (
		<motion.div
			className={`relative py-2 mt-8 h-[78px] ${
				isOpen ? 'rounded-t-[13px] w-full sm:w-[316px]' : 'w-full'
			} cursor-pointer`}
			transition={{ duration: 0.3 }}
			ref={containerRef}
			onClick={handleToggle}
		>
			<div
				id={`${label.toLowerCase()}-select`}
				className={`relative text-[16px] font-bold text-[#4f4f4f] outline-none border-b bg-transparent cursor-pointer flex justify-between items-center h-[38px] pl-2 pr-2 group ${
					isOpen
						? 'w-full sm:w-[316px] sm:pr-6 border-transparent'
						: 'w-full border-[#bdbdbd]'
				}`}
			>
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit transition-all duration-300 ease-in-out text-[16px] font-bold ${
						isOpen ? 'text-[#3486fe]' : 'text-[#4f4f4f]'
					} cursor-pointer`}
				>
					{selectedOption ? (
						<p className='font-bold text-[16px]'>
							{selectedOption.language} -{' '}
							<span className='font-normal text-[14px]'>
								{selectedOption.country}
							</span>
						</p>
					) : (
						label
					)}
				</label>
				<div className='flex justify-center items-center w-6 h-6'>
					<IconCustom
						name='arrow-down-select'
						className='w-6 h-6 fill-none text-[#3486fe]'
					/>
				</div>
			</div>
			{isOpen && !isOpening && (
				<div
					ref={dropdownRef}
					className='bg-white max-h-[200px] custom-scrollbar overflow-y-auto w-full sm:max-w-[316px] absolute top-[60px] left-0 shadow-custom-xl rounded-b-[13px] z-40'
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
				onClick={handleToggle}
			>
				{/* Label */}
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit absolute transition-all duration-300 ease-in-out text-[16px] font-bold top-9 left-2 ${
						isOpen ? 'text-transparent' : 'text-[#4f4f4f] '
					}`}
				>
					{selectedOption ? (
						<p className='font-bold text-[16px]'>
							{selectedOption.language} -{' '}
							<span className='font-normal text-[14px]'>
								{selectedOption.country}
							</span>
						</p>
					) : (
						label
					)}
				</label>

				{/* Select input */}
				<div
					id={`${label.toLowerCase()}-select`}
					className='relative text-[16px] font-bold text-[#4f4f4f] outline-none border-b bg-transparent cursor-pointer flex justify-end items-center w-full h-[38px] px-2 border-[#bdbdbd]'
				>
					<div className='flex justify-center items-center w-6 h-6'>
						<IconCustom
							name='arrow-down-select'
							className='w-6 h-6 fill-none text-[#3486fe]'
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
						className='bg-white shadow-custom-xl rounded-[13px] w-full sm:max-w-[316px] max-h-[60vh]'
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
									className='w-6 h-6 fill-none text-[#3486fe]'
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
