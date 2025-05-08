'use client'

import { useEffect, useState } from 'react'

interface CustomInputProps {
	label: string
	value: string
	onChange: (value: string) => void
	maxLength: number
	type?: string
}

export const CustomInput = ({
	label,
	value,
	onChange,
	maxLength,
	type,
}: CustomInputProps) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isFilled, setIsFilled] = useState<boolean>(false)

	useEffect(() => {
		setIsFilled(value.length > 0)
	}, [value])

	const handleFocus = () => setIsFocused(true)
	const handleBlur = () => setIsFocused(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		if (newValue.length <= maxLength) {
			onChange(newValue)
		}
	}

	const isMaxLengthReached = value.length === maxLength

	return (
		<div className='relative w-full h-[86px]'>
			{/* Лейбл */}
			<label
				htmlFor={`${label.toLowerCase()}-input`}
				className={`absolute left-0 transition-all duration-300 ease-in-out ${
					isFocused || isFilled
						? 'top-0 text-[13px] font-normal text-[#4f4f4f]'
						: 'top-[22px] text-[16px] font-bold text-[#4f4f4f]'
				}`}
			>
				{label}
			</label>

			{/* Инпут */}
			<input
				id={`${label.toLowerCase()}-input`}
				type={type}
				value={value}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`w-full h-[38px] mt-[22px] text-[#4f4f4f] outline-none border-b border-[#bdbdbd] bg-transparent ${
					label !== 'Description'
						? 'text-[16px] font-bold'
						: 'text-[16px] font-normal'
				}`}
			/>

			{/* Счётчик символов и сообщение об ошибке */}
			{label !== 'Price' && (
				<div className='absolute bottom-0 right-0 flex items-center gap-2'>
					<span className='text-[13px] font-normal text-[#4f4f4f]'>
						{value.length}/{maxLength}
					</span>
					{isMaxLengthReached && (
						<span className='text-[13px] font-normal text-red-500'>
							Maximum character limit reached
						</span>
					)}
				</div>
			)}
		</div>
	)
}
