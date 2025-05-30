'use client'

import { Link } from '@/i18n/routing'
import { ReactNode } from 'react'

interface TextPart {
	text: string
	color?: string
}

interface ButtonCustom {
	textParts?: TextPart[]
	text?: string
	icon?: ReactNode
	href?: string
	isHover?: boolean
	onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
	className?: string
	textClass?: string
	iconWrapperClass?: string
	disableClass?: string
	disabled?: boolean
}

export const ButtonCustom = ({
	textParts,
	text,
	icon,
	href,
	isHover = false,
	onClick,
	className = '',
	textClass = '',
	iconWrapperClass = '',
	disableClass = '',
	disabled = false,
}: ButtonCustom) => {
	const iconStyles = 'gap-4'
	const hover = 'hover:bg-[#F7F7F7] max-lg:focus:bg-[#F7F7F7]'
	const baseStyles = `inline-flex items-center bg-transparent text-[#4f4f4f] font-bold text-[16px] cursor-pointer group transition-colors ${
		disabled ? `cursor-not-allowed! ${disableClass}` : ''
	}`

	const content = (
		<>
			<div className={iconWrapperClass}>{icon}</div>
			{textParts && (
				<span className='flex items-center gap-1 font-bold text-[16px]'>
					{textParts.map((part, index) => (
						<span
							key={index}
							className={part.color ? `text-${part.color}` : 'text-[#4f4f4f]'}
						>
							{part.text}
						</span>
					))}
				</span>
			)}
			{text && <p className={textClass}>{text}</p>}
		</>
	)

	if (href) {
		return (
			<Link
				href={href}
				rel='preload'
				className={` ${icon && iconStyles} ${baseStyles} ${
					isHover && hover
				} ${className} group select-none`}
				onClick={onClick}
			>
				{content}
			</Link>
		)
	}

	return (
		<button
			onClick={onClick}
			className={`${icon && iconStyles} ${baseStyles} ${
				isHover && hover
			} ${className} group select-none`}
			disabled={disabled}
		>
			{content}
		</button>
	)
}
