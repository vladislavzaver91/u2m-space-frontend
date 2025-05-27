'use client'

import { useState } from 'react'

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
	const [isFocused, setIsFocused] = useState(false)

	return (
		<div className='relative w-full h-[86px]'>
			<label
				htmlFor={`${label.toLowerCase()}-select`}
				className={`absolute left-0 transition-all duration-300 ease-in-out ${
					isFocused || value
						? 'top-0 text-[13px] font-normal text-[#4f4f4f]'
						: 'top-[22px] text-[16px] font-bold text-[#4f4f4f]'
				}`}
			>
				{label}
			</label>
			<select
				id={`${label.toLowerCase()}-select`}
				value={value}
				onChange={e => onChange(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				className='w-full h-[38px] mt-[22px] text-[16px] font-bold text-[#4f4f4f] outline-none border-b border-[#bdbdbd] bg-transparent appearance-none'
			>
				<option value='' disabled>
					Select {label}
				</option>
				{options.map(option => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}
