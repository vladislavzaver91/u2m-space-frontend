'use client'

import { useEffect, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface CustomInputProps {
	label: string
	register: UseFormRegisterReturn
	maxLength: number
	value: string
	type?: string
	error?: string
	prefix?: string
}
export const CustomInput = ({
	label,
	register,
	maxLength,
	value,
	type,
	error,
	prefix,
}: CustomInputProps) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isFilled, setIsFilled] = useState<boolean>(false)

	useEffect(() => {
		setIsFilled(!!value)
	}, [value])

	const handleFocus = () => setIsFocused(true)
	const handleBlur = () => setIsFocused(false)

	const isMaxLengthReached = value?.length >= maxLength

	return (
		<div className='relative w-full h-[86px]'>
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
			<div className='relative'>
				{prefix && (
					<span
						className={`absolute left-0 top-[22px] text-[16px] font-bold text-[#4f4f4f] ${
							error ? 'text-red-500' : ''
						}`}
					>
						{prefix}
					</span>
				)}
				<input
					id={`${label.toLowerCase()}-input`}
					type={type}
					{...register}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className={`w-full h-[38px] mt-[22px] text-[#4f4f4f] outline-none border-b ${
						error ? 'border-red-500' : 'border-[#bdbdbd]'
					} bg-transparent ${
						label !== 'Description'
							? 'text-[16px] font-bold'
							: 'text-[16px] font-normal'
					} ${prefix ? 'pl-4' : ''}`}
				/>
			</div>
			<div className='absolute bottom-0 right-0 flex items-center gap-2'>
				{label !== 'Price' && (
					<span className='text-[13px] font-normal text-[#4f4f4f]'>
						{value?.length || 0}/{maxLength}
					</span>
				)}
				{isMaxLengthReached && (
					<span className='text-[13px] font-normal text-red-500'>
						Maximum character limit reached
					</span>
				)}
				{error && (
					<span className='text-[13px] font-normal text-red-500'>{error}</span>
				)}
			</div>
		</div>
	)
}
