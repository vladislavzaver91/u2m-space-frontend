'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { IconCustom } from './icon-custom'
import { useScreenResize } from '@/helpers/hooks/use-screen-resize'

interface CustomSelectProps {
	label: string
	options: string[]
	value: string
	onChange: (value: string) => void
	onClick?: () => void
	onOpenChange?: (isOpen: boolean) => void
	showLabel?: boolean
}

export const CustomSelect = ({
	label,
	options,
	value,
	onChange,
	onClick,
	onOpenChange,
	showLabel = false,
}: CustomSelectProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [showAsModal, setShowAsModal] = useState(false)
	const [isOpening, setIsOpening] = useState(false)

	const { isMobile } = useScreenResize()

	const containerRef = useRef<HTMLDivElement>(null)
	const modalContainerRef = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Закрытие списка при клике вне селекта
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const isOutsideContainer =
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			const isOutsideModal =
				modalContainerRef.current &&
				!modalContainerRef.current.contains(event.target as Node)

			if (isOutsideContainer && (showAsModal ? isOutsideModal : true)) {
				setIsOpen(false)
				setIsFocused(false)
				setShowAsModal(false)
				onOpenChange?.(false)
				onClick?.()
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [onOpenChange, onClick, showAsModal])

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
			setShowAsModal(false)
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
			{options.map((option, index) => (
				<div
					key={`${option}-${index}`}
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
			className={`relative py-2 mt-8 h-[78px] ${
				isOpen ? 'rounded-t-[13px] w-full sm:w-[316px]' : 'w-full'
			} cursor-pointer`}
			transition={{ duration: 0.3 }}
			ref={containerRef}
			onClick={handleToggle}
		>
			{showLabel && (
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit absolute transition-all duration-300 ease-in-out text-[13px] font-normal text-[#4f4f4f] ${
						isOpen ? 'opacity-0 -top-8 left-0' : 'opacity-100 -top-8 left-0'
					}`}
				>
					{label}
				</label>
			)}

			<div
				id={`${label.toLowerCase()}-select`}
				className={`relative text-[16px] font-bold text-[#4f4f4f] outline-none border-b bg-white cursor-pointer flex justify-between items-center h-[38px] pl-4 pr-2 group ${
					isOpen
						? 'w-full sm:w-[316px] sm:pr-6 border-transparent'
						: 'w-full border-[#bdbdbd]'
				}`}
			>
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit transition-all duration-300 ease-in-out text-[16px] font-bold group ${
						isOpen ? 'text-[#3486fe]' : 'text-[#4f4f4f]'
					} cursor-pointer`}
				>
					{value || label}
				</label>
				<div className='flex justify-center items-center w-6 h-6 group'>
					<IconCustom
						name='arrow-down-select'
						className='w-6 h-6 fill-none text-[#3486fe] group'
					/>
				</div>
			</div>
			{isOpen && !isOpening && (
				<div
					ref={dropdownRef}
					className='bg-white max-h-[200px] custom-scrollbar overflow-y-auto w-full sm:max-w-[316px] absolute top-[54px] left-0 z-40 rounded-b-[13px] shadow-custom-xl'
				>
					{renderOptionsView()}
				</div>
			)}
		</motion.div>
	)

	const renderModalDropdown = () => (
		<>
			<motion.div
				className='relative h-[102px] w-full pt-8'
				transition={{ duration: 0.3 }}
				ref={containerRef}
				onClick={handleToggle}
			>
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit absolute transition-all duration-300 ease-in-out text-[16px] font-bold top-9 left-2 ${
						isOpen ? 'text-transparent' : 'text-[#4f4f4f]'
					}`}
				>
					{value || label}
				</label>
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit absolute top-9 left-2 transition-all duration-300 ease-in-out text-[16px] font-bold ${
						isOpen ? 'text-transparent ' : ' text-[#4f4f4f]'
					}`}
				>
					{value || label}
				</label>
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

			{isOpen && !isOpening && (
				<div
					className='fixed inset-0 z-50 flex items-end max-sm:justify-start sm:justify-end pb-4 px-4'
					onClick={handleOverlayClick}
				>
					<motion.div
						className='bg-white shadow-custom-xl rounded-[13px] w-full sm:max-w-[316px] max-h-[60vh]'
						transition={{ duration: 0.3 }}
						ref={modalContainerRef}
					>
						<div className='p-4 border-b border-transparent bg-transparent flex items-center justify-between'>
							<div className='text-[16px] font-bold text-[#3486fe]'>
								{value}
							</div>
							<div className='flex justify-center items-center w-6 h-6'>
								<IconCustom
									name='arrow-down-select'
									className='w-6 h-6 fill-none text-[#3486fe]'
								/>
							</div>
						</div>
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
