'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'
import { useTranslations } from 'next-intl'
import { cityService } from '@/services/cities.service'

interface CustomSearchSelectProps {
	label: string
	options: string[]
	value: string
	onChange: (value: string) => void
	languageCode: 'en' | 'uk' | 'pl'
	onOpenChange?: (isOpen: boolean) => void
	onClick?: () => void
}

export const CustomSearchSelect = ({
	label,
	options,
	value,
	onChange,
	languageCode,
	onOpenChange,
	onClick,
}: CustomSearchSelectProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [showAsModal, setShowAsModal] = useState(false)
	const [isOpening, setIsOpening] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredOptions, setFilteredOptions] = useState<string[]>(options)

	const containerRef = useRef<HTMLDivElement>(null)
	const modalContainerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const tComponents = useTranslations('Components')

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
				setSearchTerm('')
				onOpenChange?.(false)
				onClick?.()
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [onOpenChange, onClick])

	// Фокус на инпуте при открытии
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isOpen])

	// Обновление отфильтрованных опций при изменении поискового запроса
	useEffect(() => {
		if (searchTerm) {
			const filtered = cityService
				.searchCities(searchTerm, languageCode)
				.map(city => city.name)
			setFilteredOptions(filtered)
		} else {
			setFilteredOptions(options)
		}
	}, [searchTerm, options, languageCode])

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

	// Обновляем режим при скролле
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
			setSearchTerm('')
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
			setSearchTerm('')
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
		setSearchTerm('')
		onOpenChange?.(false)
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	const handleConfirmSearch = () => {
		if (searchTerm.trim()) {
			onChange(searchTerm)
			setIsOpen(false)
			setShowAsModal(false)
			setIsFocused(true)
			setSearchTerm('')
			onOpenChange?.(false)
		}
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	const renderOptionsView = () => (
		<>
			{filteredOptions.length > 0 ? (
				filteredOptions.map(option => (
					<div
						key={option}
						className={`p-4 text-[16px] font-bold text-[#4f4f4f] cursor-pointer hover:bg-[#F7F7F7] ${
							value === option ? 'bg-[#F7F7F7]' : ''
						}`}
						onClick={e => handleOptionClick(option, e)}
					>
						{option}
					</div>
				))
			) : (
				<div className='p-4 text-[16px] font-normal text-[#4f4f4f]'>
					{tComponents('inputs.noCitiesFound')}
				</div>
			)}
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
				className={`w-fit absolute transition-all duration-300 ease-in-out text-[13px] font-normal text-[#4f4f4f] ${
					isOpen ? 'opacity-0 top-0 left-0' : 'opacity-100 top-0 left-0'
				}`}
			>
				{label}
			</label>
			<label
				htmlFor={`${label.toLowerCase()}-select`}
				className={`w-fit absolute transition-all duration-300 ease-in-out text-[16px] font-bold ${
					isOpen
						? 'text-[#3486fe] left-[18px] top-4'
						: 'top-9 left-2 text-[#4f4f4f]'
				}`}
			>
				{value || label}
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
					className='bg-white max-h-[250px] custom-scrollbar overflow-y-auto w-full max-w-[316px] absolute top-[60px] left-0 shadow-custom-xl rounded-b-[13px] z-40'
				>
					<div className='relative flex items-center p-2 border-b border-[#bdbdbd] h-14'>
						<div className='absolute inset-y-0 left-4 right-4 flex items-center'>
							<IconCustom
								name='search-glass'
								className='w-6 h-6 fill-none text-[#BDBDBD]'
							/>
							<input
								ref={inputRef}
								type='text'
								value={searchTerm}
								onChange={handleSearchChange}
								placeholder={tComponents('placeholders.search')}
								className='w-full h-10 pl-4 text-[16px] font-normal text-[#4f4f4f] outline-none bg-transparent'
							/>
							{searchTerm && (
								<ButtonCustom
									onClick={handleConfirmSearch}
									iconWrapperClass='w-6 h-6 flex items-center justify-center'
									icon={
										<IconCustom
											name='check'
											className='w-6 h-6 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
											hover={true}
											hoverColor='#f9329c'
										/>
									}
									isHover
									className='min-w-10 h-10 flex items-center justify-center rounded-lg'
								/>
							)}
						</div>
					</div>
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
			>
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit absolute transition-all duration-300 ease-in-out text-[13px] font-normal text-[#4f4f4f] ${
						isOpen || value
							? 'opacity-0 top-0 left-2'
							: 'opacity-100 top-0 left-2'
					}`}
				>
					{label}
				</label>
				<label
					htmlFor={`${label.toLowerCase()}-select`}
					className={`w-fit absolute transition-all duration-300 ease-in-out text-[16px] font-bold ${
						isOpen
							? 'text-transparent top-9 left-2'
							: 'top-9 left-2 text-[#4f4f4f]'
					}`}
				>
					{value || label}
				</label>
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
						<div className='p-4 border-b border-transparent bg-transparent flex items-center justify-between'>
							<div className='text-[16px] font-bold text-[#3486fe]'>
								{label}
							</div>
							<div className='flex justify-center items-center w-6 h-6'>
								<IconCustom
									name='arrow-down-select'
									className='w-2.5 h-1.5 fill-none text-[#3486fe]'
								/>
							</div>
						</div>
						<div className='relative flex items-center p-2 border-b border-[#bdbdbd] h-14'>
							<div className='absolute inset-y-0 left-4 flex items-center'>
								<IconCustom
									name='search-glass'
									className='w-6 h-6 fill-none text-[#BDBDBD]'
								/>
								<input
									ref={inputRef}
									type='text'
									value={searchTerm}
									onChange={handleSearchChange}
									placeholder={tComponents('placeholders.search')}
									className='w-full h-10 px-2 pl-10 text-[16px] font-normal text-[#4f4f4f] outline-none bg-transparent'
								/>
								{searchTerm && (
									<ButtonCustom
										onClick={handleConfirmSearch}
										iconWrapperClass='w-6 h-6 flex items-center justify-center'
										icon={
											<IconCustom
												name='check'
												className='w-6 h-6 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
												hover={true}
												hoverColor='#f9329c'
											/>
										}
										isHover
										className='w-10 h-10 flex items-center justify-center rounded-lg'
									/>
								)}
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
