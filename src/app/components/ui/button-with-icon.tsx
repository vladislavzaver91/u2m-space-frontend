// 'use client'

// import Link from 'next/link'
// import { ReactNode } from 'react'

// interface ButtonWithIconProps {
// 	text?: string
// 	icon?: ReactNode
// 	href?: string
// 	onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
// 	className?: string
// 	iconWrapperClass?: string
// 	hoverIconColor?: string
// }

// export const ButtonWithIcon = ({
// 	text,
// 	icon,
// 	href,
// 	onClick,
// 	className = '',
// 	iconWrapperClass = '',
// 	hoverIconColor = '#F9329C',
// }: ButtonWithIconProps) => {
// 	const baseStyles = `inline-flex items-center gap-4 bg-transparent text-[#4f4f4f] font-bold text-[16px] cursor-pointer transition-colors duration-300 group-hover:text-[#F9329C]!`

// 	const content = (
// 		<>
// 			<div
// 				className={` ${hoverIconColor} ${iconWrapperClass} group-hover:fill-[#F9329C]!`}
// 			>
// 				{icon}
// 			</div>

// 			{text && <span>{text}</span>}
// 		</>
// 	)

// 	if (href) {
// 		return (
// 			<Link
// 				href={href}
// 				className={`${baseStyles} ${className} ${hoverIconColor} group-hover:fill-[#F9329C]! group`}
// 				onClick={onClick}
// 			>
// 				{content}
// 			</Link>
// 		)
// 	}

// 	return (
// 		<button onClick={onClick} className={`${baseStyles} ${className} group`}>
// 			{content}
// 		</button>
// 	)
// }

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
	const baseStyles =
		'inline-flex items-center gap-4 bg-transparent text-[#4f4f4f] font-bold text-[16px] cursor-pointer group transition-colors'

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
				className={`${baseStyles} ${className} group`}
				onClick={onClick}
			>
				{content}
			</Link>
		)
	}

	return (
		<button onClick={onClick} className={`${baseStyles} ${className} group`}>
			{content}
		</button>
	)
}
