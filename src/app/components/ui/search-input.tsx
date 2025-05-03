'use client'

import Image from 'next/image'

interface SearchInputProps {
	placeholder?: string
	disabled?: boolean
	className?: string
	inputClass?: string
	smallWidth?: boolean
}

export const SearchInput = ({
	placeholder = "I'm looking for...",
	disabled,
	className = '',
	inputClass = '',
	smallWidth,
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
				className={`${inputClass} w-full pl-20 pr-20 py-4 ${
					smallWidth
						? 'border-none bg-transparent'
						: 'border border-[#bdbdbd] rounded-4xl focus:ring-2 focus:ring-blue-500'
				} focus:outline-none placeholder:text-[#4f4f4f]`}
			/>
			<div className='max-md:hidden absolute inset-y-0 right-4 flex items-center gap-4'>
				<div className='w-8 h-8'>
					<Image
						src='/icons/microphone.svg'
						alt='Microphone icon'
						width={32}
						height={32}
					/>
				</div>
				<div className='w-8 h-8'>
					<Image
						src='/icons/camera.svg'
						alt='Camera icon'
						width={32}
						height={32}
					/>
				</div>
			</div>
		</div>
	)
}
