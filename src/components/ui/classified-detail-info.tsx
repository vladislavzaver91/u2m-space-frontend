'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Classified, User } from '@/types'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'

interface ClassifiedDetailInfoProps {
	classified: Classified
	favoritesBool: boolean
	favorites: number | undefined
	handleFavoriteClick: (e: React.MouseEvent) => void
	user: User | null
}

export const ClassifiedDetailInfo = ({
	classified,
	favoritesBool,
	favorites,
	handleFavoriteClick,
	user,
}: ClassifiedDetailInfoProps) => {
	const symbol =
		classified.convertedCurrency === 'USD'
			? '$'
			: classified.convertedCurrency === 'UAH'
			? '₴'
			: '€'

	const INFO_AND_ANALYTICAL_DATA = [
		{
			icon: (
				<IconCustom name='show' className='w-6 h-6 fill-none text-[#3486FE]' />
			),
			data: classified.views,
		},
		{
			icon: (
				<IconCustom
					name='suitcase'
					className='w-6 h-6 fill-none text-[#3486FE]'
				/>
			),
			data: classified.user.successfulDeals,
		},
		{
			icon: (
				<IconCustom
					name='heart'
					hover={false}
					className={`w-6 h-6 ${
						favorites === 0
							? 'text-[#3486fe] fill-none'
							: 'text-[#F9329C] stroke-[#F9329C]'
					}`}
				/>
			),
			data: favorites,
		},
		{
			icon: (
				<IconCustom name='chat' className='w-6 h-6 fill-none text-[#3486FE]' />
			),
			data: classified.messages,
		},
	]

	return (
		<div className='space-y-4'>
			<h1 className='text-[24px] font-bold uppercase tracking-[0.03em] text-[#4f4f4f]'>
				{classified.title}
			</h1>
			<div className='flex items-center justify-between'>
				<h2 className='text-[24px] font-bold uppercase tracking-[0.03em] text-[#f9329c]'>
					{symbol}
					{classified.convertedPrice.toFixed(0)}
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
					disabled={!user}
				/>
			</div>
			<p className='text-[16px] font-normal text-[#4f4f4f]'>
				{classified.description}
			</p>
			<div className='flex flex-wrap gap-8'>
				{INFO_AND_ANALYTICAL_DATA.map((item, index) => (
					<div key={index} className='flex items-center gap-2'>
						<span className='w-6 h-6'>{item.icon}</span>
						<p className='font-bold text-[13px] text-[#4f4f4f]'>{item.data}</p>
					</div>
				))}
			</div>
		</div>
	)
}
