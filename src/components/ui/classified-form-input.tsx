'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface ClassifiedFormInputProps {
	label: string
	register: UseFormRegisterReturn
	maxLength: number
	value: string
	type?: string
	error?: string
	prefix?: string
}
export const ClassifiedFormInput = ({
	label,
	register,
	maxLength,
	value,
	type,
	error,
	prefix,
}: ClassifiedFormInputProps) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isFilled, setIsFilled] = useState<boolean>(false)
	const tComponents = useTranslations('Components')

	useEffect(() => {
		setIsFilled(!!value)
	}, [value])

	const handleFocus = () => setIsFocused(true)
	const handleBlur = () => setIsFocused(false)

	const isMaxLengthReached = value?.length >= maxLength
	const showPrefix = prefix && (isFocused || isFilled)

	return (
		<div className='relative w-full h-[86px]'>
			<label
				htmlFor={`${label.toLowerCase()}-input`}
				className={`absolute left-0 transition-all duration-300 ease-in-out ${
					isFocused || isFilled
						? 'top-0 left-0 text-[13px] font-normal text-[#4f4f4f]'
						: 'top-[22px] left-2 text-[16px] font-bold text-[#4f4f4f]'
				}`}
			>
				{label}
			</label>
			<div className='relative'>
				{showPrefix && (
					<span
						className={`absolute left-0 top-[28px] text-[16px] font-bold text-[#4f4f4f] ${
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
					className={`w-full h-[38px] mt-[22px] px-2 text-[#4f4f4f] outline-none border-b ${
						error ? 'border-red-500' : 'border-[#bdbdbd]'
					} bg-transparent ${
						label !== 'Description'
							? 'text-[16px] font-bold'
							: 'text-[16px] font-normal'
					} ${showPrefix ? 'pl-3' : ''}`}
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
						{tComponents('inputs.error')}
					</span>
				)}
				{error && (
					<span className='text-[13px] font-normal text-red-500'>{error}</span>
				)}
			</div>
		</div>
	)
}
