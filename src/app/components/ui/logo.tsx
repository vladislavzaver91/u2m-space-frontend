'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface LogoProps {
	width: number
	height: number
	isSmall?: boolean
	inHeader?: boolean
	className?: string
}

export const Logo = ({
	width,
	height,
	isSmall,
	inHeader,
	className,
}: LogoProps) => {
	const router = useRouter()

	const handleClick = () => {
		localStorage.setItem('manualRedirect', 'true')
		router.push('/')
	}

	return (
		<>
			{inHeader ? (
				<div
					onClick={handleClick}
					className='hidden md:absolute md:flex min-w-[164px] w-fit py-7 px-8 left-0 top-0 hover:bg-[#f7f7f7] focus:bg-[#f7f7f7] cursor-pointer'
				>
					<Image
						src={isSmall ? '/icons/logo-sm.svg' : '/icons/logo.svg'}
						alt='logo image'
						width={width}
						height={height}
					/>
				</div>
			) : (
				<div onClick={handleClick} className={`cursor-pointer ${className}`}>
					<Image
						src={isSmall ? '/icons/logo-sm.svg' : '/icons/logo.svg'}
						alt='logo image'
						width={width}
						height={height}
					/>
				</div>
			)}
		</>
	)
}
