'use client'

import Image from 'next/image'
import { ButtonCustom } from './button-custom'
import { useState } from 'react'
import { IconCustom } from './icon-custom'
import { apiService } from '@/services/api.service'
import { Link, useRouter } from '@/i18n/routing'
import { useUser } from '@/helpers/contexts/user-context'

interface MyFavoritesCardProps {
	id: string
	title: string
	convertedPrice: number
	convertedCurrency: 'USD' | 'UAH' | 'EUR'
	image?: string
	href: string
	favoritesBool: boolean
	favorites?: number
	onFavoriteToggle: (id: string, isFavorite: boolean) => void
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

export const MyFavoritesCard = ({
	id,
	title,
	convertedPrice,
	convertedCurrency,
	image,
	href,
	favoritesBool: initialFavoritesBool,
	favorites: initialFavorites,
	onFavoriteToggle,
}: MyFavoritesCardProps) => {
	const [favoritesBool, setFavoritesBool] = useState(initialFavoritesBool)
	const [favorites, setFavorites] = useState(initialFavorites)
	const router = useRouter()

	const { updateFavorites } = useUser()

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.preventDefault() // Предотвращаем переход по Link
		e.stopPropagation()

		try {
			const res = await apiService.toggleFavorite(id)
			setFavoritesBool(res.favoritesBool)
			setFavorites(res.favorites)
			updateFavorites(id, res.favoritesBool)
			onFavoriteToggle(id, res.favoritesBool)
		} catch (error: unknown) {
			const apiError = error as ApiError
			if (apiError.response?.status === 401) {
			} else {
				console.error('Error toggling favorite:', error)
			}
		}
	}

	const symbol =
		convertedCurrency === 'USD' ? '$' : convertedCurrency === 'UAH' ? '₴' : '€'

	const containerProps = {
		className:
			'block border border-[#bdbdbd] rounded-[13px] transition-all active:shadow-custom-2xl hover:shadow-custom-xl hover:border-transparent min-w-full max-sm:min-h-[383px] sm:h-[294px] 3xl:h-[375px]! sm:w-[224px] lg:w-[259px] 2xl:w-[217px] 3xl:w-[355px]! cursor-pointer',
	}

	return (
		<Link href={href} {...containerProps}>
			<div className='relative w-full max-sm:h-[253px] sm:h-[154px] 3xl:h-[253px]'>
				{image ? (
					<Image
						src={image}
						alt={title}
						fill
						className='h-full w-full object-cover object-center rounded-t-[13px]'
					/>
				) : (
					<div className='h-full bg-gray-200 rounded-t-[13px]' />
				)}
			</div>
			<div className='flex flex-col gap-2 p-4 3xl:p-3.5! max-sm:h-[130px] sm:h-[140px] 3xl:h-[130px]!'>
				<div className='flex items-center justify-between'>
					<h2
						className={`text-[18px]
						uppercase font-bold transition-all ${
							favoritesBool ? 'text-[#f9329c]' : 'text-[#4f4f4f]'
						}`}
					>
						{symbol}
						{convertedPrice.toFixed(0)}
					</h2>
					<ButtonCustom
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
