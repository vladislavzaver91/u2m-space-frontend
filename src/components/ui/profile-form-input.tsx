'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface ProfileFormInputProps {
	label: string
	maxLength?: number
	value: string
	onChange: (value: string) => void
	type?: string
	error?: string
	prefix?: string
}
export const ProfileFormInput = ({
	label,
	maxLength,
	value,
	onChange,
	type,
	error,
	prefix,
}: ProfileFormInputProps) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isFilled, setIsFilled] = useState<boolean>(false)
	const tComponents = useTranslations('Components')

	useEffect(() => {
		setIsFilled(!!value)
	}, [value])

	const handleFocus = () => setIsFocused(true)
	const handleBlur = () => setIsFocused(false)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const isMaxLengthReached = maxLength && value?.length >= maxLength
	const showPrefix = prefix && (isFocused || isFilled)

	return (
		<div className='relative w-full h-[102px]'>
			<label
				htmlFor={`${label.toLowerCase()}-input`}
				className={`absolute left-2 transition-all duration-300 ease-in-out ${
					isFocused || isFilled
						? 'top-0 text-[13px] font-normal text-[#4f4f4f]'
						: 'top-[32px] text-[16px] font-bold text-[#4f4f4f]'
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
					value={value}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className={`w-full h-[38px] mt-8 px-2 text-[#4f4f4f] outline-none border-b ${
						error ? 'border-red-500' : 'border-[#bdbdbd]'
					} bg-transparent ${
						label !== 'Description'
							? 'text-[16px] font-bold'
							: 'text-[16px] font-normal'
					} ${showPrefix ? 'pl-3' : ''}`}
				/>
			</div>
			{maxLength && (
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
						<span className='text-[13px] font-normal text-red-500'>
							{error}
						</span>
					)}
				</div>
			)}
		</div>
	)
}
