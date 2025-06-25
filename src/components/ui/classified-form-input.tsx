'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface ClassifiedFormInputProps {
	label: string
	register: UseFormRegisterReturn
	maxLength?: number
	type?: string
	error?: string
	prefix?: string
	fieldValue: string // Новый проп для значения поля
}

export const ClassifiedFormInput = ({
	label,
	register,
	maxLength,
	type = 'text',
	error,
	prefix,
	fieldValue,
}: ClassifiedFormInputProps) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isFilled, setIsFilled] = useState<boolean>(false)
	const tComponents = useTranslations('Components')

	// Используем fieldValue для проверки заполненности
	useEffect(() => {
		setIsFilled(!!fieldValue)
	}, [fieldValue])

	const handleFocus = () => setIsFocused(true)
	const handleBlur = () => setIsFocused(false)

	const isMaxLengthReached =
		maxLength && type !== 'number' && fieldValue?.length >= maxLength
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
						className={`absolute left-0 top-[29px] text-[16px] font-bold text-[#4f4f4f] ${
							error ? 'text-[#F9329C]' : ''
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
					onBlur={e => {
						handleBlur()
						register.onBlur(e) // Передаем событие onBlur в react-hook-form
					}}
					onChange={e => {
						console.log('Input onChange:', e.target.value)
						register.onChange(e) // Передаем событие onChange в react-hook-form
					}}
					className={`w-full h-[38px] mt-[22px] px-2 text-[#4f4f4f] outline-none border-b border-[#bdbdbd] ${
						error ? 'text-[#F9329C]' : ''
					} bg-transparent ${
						label !== 'Description'
							? 'text-[16px] font-bold'
							: 'text-[16px] font-normal'
					} ${showPrefix ? 'pl-3' : ''}`}
				/>
			</div>
			<div className='absolute bottom-0 right-0 flex items-center justify-between gap-2 w-full'>
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
				{label !== 'Price' && maxLength && type !== 'number' && (
					<span className='text-[13px] font-normal text-[#4f4f4f]'>
						{fieldValue?.length || 0}/{maxLength}
					</span>
				)}
			</div>
		</div>
	)
}
