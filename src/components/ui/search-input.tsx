'use client'

import Image from 'next/image'
import { IconCustom } from './icon-custom'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

interface SearchInputProps {
	placeholder?: string
	disabled?: boolean
	className?: string
	inputClass?: string
	smallWidth?: boolean
	logoActive?: boolean
}

export const SearchInput = ({
	placeholder,
	disabled,
	className = '',
	inputClass = '',
	smallWidth,
	logoActive = false,
}: SearchInputProps) => {
	const tComponents = useTranslations('Components')

	const initPlaceholder = tComponents('placeholders.imLookingFor')

	const target =
		typeof window !== 'undefined' && localStorage.getItem('hasVisited')
			? '/selling-classifieds'
			: '/'

	return (
		<div className={`relative w-full select-none ${className}`}>
			<div className='absolute inset-y-0 left-4 flex items-center'>
				{logoActive ? (
					<Link href={target}>
						<Image
							src='/icons/logo_input.svg'
							alt='logo icon'
							width={48}
							height={32}
						/>
					</Link>
				) : (
					<Image
						src='/icons/logo_input.svg'
						alt='logo icon'
						width={48}
						height={32}
					/>
				)}
			</div>
			<input
				type='text'
				placeholder={placeholder ? placeholder : initPlaceholder}
				disabled={disabled}
				className={`${inputClass} w-full h-16 pl-20 pr-20 py-4 ${
					smallWidth
						? 'border-none bg-transparent'
						: 'border border-[#bdbdbd] rounded-4xl focus:ring-2 focus:ring-blue-500'
				} focus:outline-none placeholder:text-[#4f4f4f] text-[18px]`}
			/>
			<div className='max-md:hidden absolute inset-y-0 right-4 flex items-center gap-4'>
				<div className='w-10 h-10 flex items-center justify-center'>
					<IconCustom
						name='microphone'
						className='w-6 h-6 fill-none text-[#f9329c]'
					/>
				</div>
				<div className='w-10 h-10 flex items-center justify-center'>
					<IconCustom
						name='camera'
						className='w-6 h-6 fill-none text-[#3486fe]'
					/>
				</div>
			</div>
		</div>
	)
}
