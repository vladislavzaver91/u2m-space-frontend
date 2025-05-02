'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ButtonWithIcon } from './button-with-icon'
import { useState } from 'react'

interface ClassifiedCardProps {
	title: string
	price: string
	image?: string
	isFavorite: boolean
	href: string
	isSmall?: boolean
}

export const ClassifiedCard = ({
	title,
	price,
	image,
	isFavorite: initialIsFavorite,
	href,
	isSmall,
}: ClassifiedCardProps) => {
	const [isFavorite, setIsFavorite] = useState(initialIsFavorite)

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.preventDefault() // Предотвращаем переход по Link
		e.stopPropagation()
		setIsFavorite(!isFavorite)
	}

	return (
		<Link
			href={href}
			className={`block border border-[#bdbdbd] rounded-xl transition-all hover:shadow-custom-xl hover:border-none min-w-full max-[769px]:min-w-[343px] max-[769px]:w-fit ${
				isSmall ? 'min-h-[283px]' : 'h-[372px]'
			}`}
		>
			<div className={`relative ${isSmall ? 'h-[154px]' : 'h-[253px]'}`}>
				{image ? (
					<Image
						src={image}
						alt={title}
						fill
						className='h-full w-full object-cover object-center rounded-t-xl'
					/>
				) : (
					<div className='h-full bg-gray-200 rounded-t-xl' />
				)}
			</div>
			<div
				className={`p-4 flex flex-col gap-2 ${
					isSmall ? 'min-h-[129px]' : 'h-[119px]'
				}`}
			>
				<div className='flex items-center justify-between'>
					<h3
						className={`text-[24px] uppercase font-semibold transition-all ${
							isFavorite ? 'text-[#f9329c]' : 'text-[#4f4f4f]'
						}`}
					>
						${price}
					</h3>
					<ButtonWithIcon
						icon={
							<Image
								src={
									isFavorite ? '/icons/heart_active.svg' : '/icons/heart.svg'
								}
								alt='Favorite icon'
								width={24}
								height={24}
							/>
						}
						onClick={handleFavoriteClick}
					/>
				</div>
				<p className='text-[#4f4f4f] text-[16px] font-bold leading-5 line-clamp-2'>
					{title}
				</p>
			</div>
		</Link>
	)
}
