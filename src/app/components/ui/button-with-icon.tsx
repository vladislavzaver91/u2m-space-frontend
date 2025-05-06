'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonWithIconProps {
	text?: string
	icon?: ReactNode
	href?: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
	className?: string
	iconWrapperClass?: string
}

export const ButtonWithIcon = ({
	text,
	icon,
	href,
	onClick,
	className = '',
	iconWrapperClass = '',
}: ButtonWithIconProps) => {
	const iconStyles = 'gap-4'
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
				className={` ${icon && iconStyles} ${baseStyles} ${className} group`}
				onClick={onClick}
			>
				{content}
			</Link>
		)
	}

	return (
		<button
			onClick={onClick}
			className={`${icon && iconStyles} ${baseStyles} ${className} group`}
		>
			{content}
		</button>
	)
}
