'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { IconCustom } from './icon-custom'

interface ProfileFormInputProps {
	label: string
	maxLength?: number
	value: string
	onChange: (value: string) => void
	onClick?: () => void
	type?: string
	prefix?: string
	error?: string
	isValid?: boolean
}
export const ProfileFormInput = ({
	label,
	maxLength,
	value,
	onChange,
	onClick,
	type,
	prefix,
	error,
	isValid,
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
	const showPrefix =
		prefix && (prefix === '+' ? isFocused && !value : isFocused || isFilled)
	const pricePrefix = `${prefix === '+' && 'top-[40px] left-0'}`

	return (
		<div className='relative w-full h-[102px]' onClick={onClick}>
			<label
				htmlFor={`${label.toLowerCase()}-input`}
				className={`absolute left-0 transition-all duration-300 ease-in-out ${
					isFocused || isFilled
						? 'top-0 text-[13px] font-normal text-[#4f4f4f]'
						: 'top-[32px] text-[16px] font-bold text-[#4f4f4f]'
				} `}
			>
				{label}
			</label>
			<div className='relative'>
				{showPrefix && (
					<span
						className={`absolute left-0 top-[28px] ${pricePrefix} text-[16px] font-bold text-[#4f4f4f] ${
							error ? 'text-[#F9329C] text-[13px] font-normal' : ''
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
					className={`w-full h-[38px] mt-8 px-2 text-[#4f4f4f] outline-none border-b border-[#bdbdbd] bg-transparent ${
						label !== 'Description'
							? 'text-[16px] font-bold'
							: 'text-[16px] font-normal'
					} ${showPrefix ? 'pl-3' : ''} ${isValid ? 'pr-8' : ''} ${
						error ? 'text-[#F9329C]' : ''
					}`}
				/>
				{isValid && (
					<IconCustom
						name='check'
						className='fill-none text-[#6FCF97] absolute right-2 bottom-2'
					/>
				)}
			</div>
			{maxLength && (
				<div className='absolute bottom-0 flex items-center justify-between gap-2 w-full'>
					{isMaxLengthReached && (
						<span className='text-[13px] font-normal text-[#F9329C]'>
							{tComponents('inputs.error')}
						</span>
					)}
					{error && (
						<span className='text-[13px] font-normal text-[#F9329C]'>
							{error}
						</span>
					)}

					{label !== 'Price' && (
						<span className='text-[13px] font-normal text-[#4f4f4f]'>
							{value?.length || 0}/{maxLength}
						</span>
					)}
				</div>
			)}
		</div>
	)
}
