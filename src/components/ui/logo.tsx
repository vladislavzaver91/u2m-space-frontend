'use client'

import { useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import Image from 'next/image'

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
	const locale = useLocale()

	const target =
		typeof window !== 'undefined' && localStorage.getItem('hasVisited')
			? `/selling-classifieds`
			: `/`

	const handleClick = () => {
		router.push(target)
	}

	return (
		<>
			{inHeader ? (
				<div
					onClick={handleClick}
					className='hidden md:absolute md:flex min-w-[164px] w-fit py-7 px-8 left-0 top-0 hover:bg-[#f7f7f7] focus:bg-[#f7f7f7] cursor-pointer select-none'
				>
					<Image
						src={isSmall ? '/icons/logo-sm.svg' : '/icons/logo.svg'}
						alt='logo image'
						width={width}
						height={height}
						className='select-none'
						onDragStart={e => e.preventDefault()}
					/>
				</div>
			) : (
				<div className={`cursor-pointer select-none ${className}`}>
					<Image
						src={isSmall ? '/icons/logo-sm.svg' : '/icons/logo.svg'}
						alt='logo image'
						width={width}
						height={height}
						className='select-none'
						onDragStart={e => e.preventDefault()}
					/>
				</div>
			)}
		</>
	)
}
