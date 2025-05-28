'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconCustom } from './icon-custom'

interface CustomSelectProps {
	label: string
	options: string[]
	value: string
	onChange: (value: string) => void
}

export const CustomSelect = ({
	label,
	options,
	value,
	onChange,
}: CustomSelectProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// Закрытие списка при клике вне селекта
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
				setIsFocused(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleToggle = () => {
		setIsOpen(!isOpen)
		setIsFocused(!isOpen)
	}

	const handleOptionClick = (option: string) => {
		onChange(option)
		setIsOpen(false)
		setIsFocused(true)
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
			{isOpen && (
				<div
					className={`absolute z-10 bg-white shadow-custom-xl rounded-b-[13px] max-h-[200px] custom-scrollbar ${
						isOpen ? 'w-[316px]' : 'w-full'
					}`}
				>
					{options.map(option => (
						<div
							key={option}
							className={`p-4 text-[16px] font-bold text-[#4f4f4f] cursor-pointer hover:bg-[#F7F7F7] ${
								value === option ? 'bg-[#F7F7F7]' : ''
							}`}
							onClick={() => handleOptionClick(option)}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</motion.div>
	)
}
