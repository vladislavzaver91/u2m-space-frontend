'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
	width: number
	height: number
}

export const Logo = ({ width, height }: LogoProps) => {
	return (
		<div>
			<Link href='/'>
				<Image
					src='/icons/logo.svg'
					alt='logo image'
					width={width}
					height={height}
				/>
			</Link>
		</div>
	)
}
