'use client'

import { useVisitRedirect } from '@/app/helpers/hooks/use-visit-redirect'
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
	const shouldRender = useVisitRedirect()

	const handleClick = () => {
		localStorage.setItem('manualRedirect', 'true')
		shouldRender ? router.push('/selling-classifieds') : router.push('/')
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
				<div
					onClick={handleClick}
					className={`cursor-pointer select-none ${className}`}
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
			)}
		</>
	)
}
