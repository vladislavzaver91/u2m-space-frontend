'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ButtonWithIcon } from './button-with-icon'
import { useState } from 'react'
import { IconCustom } from './icon-custom'
import { apiService } from '@/app/services/api.service'
import { useRouter } from 'next/navigation'

interface ClassifiedCardProps {
	classifiedId: string
	title: string
	price: string
	image?: string
	favorites?: number
	favoritesBool: boolean
	href: string
	isSmall?: boolean
}

interface ApiError {
	response?: {
		status?: number
		data?: {
			error?: string
		}
	}
	message?: string
}

export const ClassifiedCard = ({
	classifiedId,
	title,
	price,
	image,
	favorites: initialFavorites,
	favoritesBool: initialFavoritesBool,
	href,
	isSmall,
}: ClassifiedCardProps) => {
	const [favoritesBool, setFavoritesBool] = useState(initialFavoritesBool)
	const [favorites, setFavorites] = useState(initialFavorites)
	const router = useRouter()

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.preventDefault() // Предотвращаем переход по Link
		e.stopPropagation()

		try {
			const res = await apiService.toggleFavorite(classifiedId)
			setFavoritesBool(res.favoritesBool)
			setFavorites(res.favorites)
		} catch (error: unknown) {
			const apiError = error as ApiError
			if (apiError.response?.status === 401) {
			} else {
				console.error('Error toggling favorite:', error)
			}
		}
	}

	return (
		<Link
			href={href}
			className={`block border border-[#bdbdbd] rounded-xl transition-all duration-300 ease-in-out active:shadow-custom-2xl hover:shadow-custom-xl hover:border-transparent w-full ${
				isSmall ? 'min-h-[294px]' : 'h-[383px]'
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
					isSmall ? 'min-h-[140px]' : 'h-[130px]'
				} max-md:min-h-[140px]`}
			>
				<div className='flex items-center justify-between'>
					<h3
						className={` ${
							isSmall ? 'text-[18px] md:text-[24px]' : 'text-[24px]'
						} uppercase font-bold transition-all ${
							favoritesBool ? 'text-[#f9329c]' : 'text-[#4f4f4f]'
						}`}
					>
						${price}
					</h3>
					<ButtonWithIcon
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='heart'
								hover={false}
								className={`${
									favoritesBool
										? 'text-[#F9329C] stroke-[#F9329C]'
										: 'text-[#3486fe] fill-none'
								} w-6 h-6 `}
							/>
						}
						isHover
						onClick={handleFavoriteClick}
						className='w-10 h-10 flex items-center justify-center rounded-lg'
					/>
				</div>
				<p className='text-[#4f4f4f] text-[16px] font-bold leading-5 line-clamp-2'>
					{title}
				</p>
			</div>
		</Link>
	)
}
