'use client'

import { useEffect, useRef, useState } from 'react'
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
}

export const CustomSearchSelect = ({
	label,
	options,
	value,
	onChange,
	languageCode,
}: CustomSearchSelectProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredOptions, setFilteredOptions] = useState<string[]>(options)
	const containerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const tComponents = useTranslations('Components')

	// Закрытие списка при клике вне селекта
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
				setIsFocused(false)
				setSearchTerm('')
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

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

	const handleToggle = () => {
		setIsOpen(!isOpen)
		setIsFocused(!isOpen)
		if (!isOpen) {
			setSearchTerm('')
		}
	}

	const handleOptionClick = (option: string) => {
		onChange(option)
		setIsOpen(false)
		setIsFocused(true)
		setSearchTerm('')
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	const handleClearSearch = () => {
		setSearchTerm('')
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	return (
		<motion.div
			className={`relative h-[102px] ${
				isOpen ? 'shadow-custom-xl rounded-[13px] w-[316px]' : 'w-full pt-8'
			}`}
			transition={{ duration: 0.2 }}
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
			{isOpen && (
				<div
					className={`absolute z-10 bg-white shadow-custom-xl rounded-b-[13px] max-h-[250px] overflow-y-auto custom-scrollbar w-[316px]`}
				>
					{/* Инпут для поиска */}
					<div className='relative flex items-center p-2 border-b border-[#bdbdbd] h-14'>
						<div className='absolute inset-y-0 left-4 flex items-center'>
							<IconCustom
								name='search-glass'
								className='w-6 h-6 fill-none text-[#BDBDBD] '
							/>
							<input
								ref={inputRef}
								type='text'
								value={searchTerm}
								onChange={handleSearchChange}
								placeholder={tComponents('placeholders.search')}
								className='w-full h-10 px-2 text-[16px] font-normal text-[#4f4f4f] outline-none bg-transparent'
							/>

							{searchTerm && (
								<ButtonCustom
									onClick={handleClearSearch}
									iconWrapperClass='w-6 h-6 flex items-center justify-center'
									icon={
										<IconCustom
											name='close'
											className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
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

					{/* Список опций */}
					{filteredOptions.length > 0 ? (
						filteredOptions.map(option => (
							<div
								key={option}
								className={`p-4 text-[16px] font-bold text-[#4f4f4f] cursor-pointer hover:bg-[#F7F7F7] ${
									value === option ? 'bg-[#F7F7F7]' : ''
								}`}
								onClick={() => handleOptionClick(option)}
							>
								{option}
							</div>
						))
					) : (
						<div className='p-4 text-[16px] font-normal text-[#4f4f4f]'>
							{tComponents('inputs.noCitiesFound')}
						</div>
					)}
				</div>
			)}
		</motion.div>
	)
}
