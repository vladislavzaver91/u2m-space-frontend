'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
	width: number
	height: number
	isSmall?: boolean
	className?: string
}

export const Logo = ({ width, height, isSmall, className }: LogoProps) => {
	return (
		<div className={className}>
			<Link href='/'>
				<Image
					src={isSmall ? '/icons/logo-sm.svg' : '/icons/logo.svg'}
					alt='logo image'
					width={width}
					height={height}
				/>
			</Link>
		</div>
	)
}
