'use client'

import Image from 'next/image'

interface SearchInputProps {
	placeholder?: string
	disabled?: boolean
	className?: string
}

export const SearchInput = ({
	placeholder = "I'm looking for...",
	disabled,
	className = '',
}: SearchInputProps) => {
	return (
		<div className={`relative w-full ${className}`}>
			<div className='absolute inset-y-0 left-4 flex items-center'>
				<Image
					src='/icons/logo_input.svg'
					alt='logo icon'
					width={48}
					height={32}
				/>
			</div>
			<input
				type='text'
				placeholder={placeholder}
				disabled={disabled}
				className='w-full pl-20 pr-20 py-4 border border-[#bdbdbd] rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#4f4f4f]'
			/>
			<div className='max-md:hidden absolute inset-y-0 right-4 flex items-center gap-4'>
				<Image
					src='/icons/microphone.svg'
					alt='Microphone icon'
					width={32}
					height={32}
				/>
				<Image
					src='/icons/camera.svg'
					alt='Camera icon'
					width={32}
					height={32}
				/>
			</div>
		</div>
	)
}
