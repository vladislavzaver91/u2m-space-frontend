'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ButtonWithIcon } from './button-with-icon'

interface ClassifiedCardProps {
	id: number
	title: string
	price: string
}

export const ClassifiedCard = ({ id, title, price }: ClassifiedCardProps) => {
	const [isFavorite, setIsFavorite] = useState(false)

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.preventDefault() // Предотвращаем переход по Link
		setIsFavorite(!isFavorite)
	}

	return (
		<Link
			href={`/classified/${id}`}
			className={`block border border-[#bdbdbd] rounded-xl transition-all hover:shadow-lg hover:border-transparent min-h-full h-[372px]`}
		>
			<div className='h-2/3 bg-gray-200' /> {/* Заглушка для картинки */}
			<div className='p-4 space-y-2'>
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
				<p className='text-[#4f4f4f] text-[16px] font-bold'>{title}</p>
			</div>
		</Link>
	)
}
