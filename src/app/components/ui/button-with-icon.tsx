'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonWithIconProps {
	text?: string
	icon?: ReactNode
	href?: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
	className?: string
}

export const ButtonWithIcon = ({
	text,
	icon,
	href,
	onClick,
	className = '',
}: ButtonWithIconProps) => {
	const baseStyles =
		'inline-flex items-center gap-4 bg-transparent text-[#4f4f4f] font-bold text-[16px] cursor-pointer'

	const content = (
		<>
			{icon}
			{text && <span>{text}</span>}
		</>
	)

	if (href) {
		return (
			<Link
				href={href}
				className={`${baseStyles} ${className}`}
				onClick={onClick}
			>
				{content}
			</Link>
		)
	}

	return (
		<button onClick={onClick} className={`${baseStyles} ${className}`}>
			{content}
		</button>
	)
}
