'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonWithIconProps {
	text?: string
	icon?: ReactNode
	href?: string
	isHover?: boolean
	onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
	className?: string
	iconWrapperClass?: string
	disabled?: boolean
}

export const ButtonWithIcon = ({
	text,
	icon,
	href,
	isHover = false,
	onClick,
	className = '',
	iconWrapperClass = '',
	disabled = false,
}: ButtonWithIconProps) => {
	const iconStyles = 'gap-4'
	const hover = 'hover:bg-[#F7F7F7] max-lg:focus:bg-[#F7F7F7]'
	const baseStyles =
		'inline-flex items-center bg-transparent text-[#4f4f4f] font-bold text-[16px] cursor-pointer group transition-colors'

	const content = (
		<>
			<div className={iconWrapperClass}>{icon}</div>
			{text && <span>{text}</span>}
		</>
	)

	if (href) {
		return (
			<Link
				href={href}
				className={` ${icon && iconStyles} ${baseStyles} ${
					isHover && hover
				} ${className} group`}
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
			} ${className} group`}
		>
			{content}
		</button>
	)
}
