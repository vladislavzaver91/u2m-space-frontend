'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Classified, User } from '@/types'
import { formatPhoneNumber } from '@/helpers/functions/format-phone-number'
import { ButtonCustom } from './button-custom'

interface ClassifiedSellerInfoProps {
	classified: Classified
	authUser: User | null
}

export const ClassifiedSellerInfo = ({
	classified,
	authUser,
}: ClassifiedSellerInfoProps) => {
	const tClassified = useTranslations('Classified')

	return (
		<div className='flex items-center gap-[30px]'>
			<div>
				<div className='relative min-w-[120px] w-fit min-h-[120px] h-fit'>
					<Image
						src={classified.user.avatarUrl}
						alt='user avatar'
						fill
						className='w-full h-full object-cover rounded-[13px]'
					/>
				</div>
				<div className='flex flex-col-reverse items-center mt-2 sm:hidden'>
					<p className='text-[16px] font-bold text-[#4f4f4f] text-center uppercase'>
						{tClassified('userButtons.tr')}
					</p>
					<p className='text-[16px] font-bold text-[#3486fe]'>
						{classified.user.bonuses}
					</p>
				</div>
			</div>
			<div className='space-y-4'>
				<div className='flex sm:items-center sm:gap-8'>
					<h2 className='text-[18px] font-bold uppercase tracking-[0.03em] text-[#4f4f4f]'>
						{classified.user.nickname}
					</h2>
					<div className='max-sm:hidden flex items-center gap-2'>
						<p className='text-[13px] font-bold uppercase text-[#4f4f4f]'>
							{tClassified('userButtons.tr')}
						</p>
						<p className='text-[16px] font-bold text-[#3486fe]'>
							{classified.user.trustRating}
						</p>
					</div>
				</div>
				{classified.user.phoneNumber ? (
					classified.user.showPhone || authUser ? (
						<p className='text-[16px] font-bold text-[#f9329c]'>
							{formatPhoneNumber(classified.user.phoneNumber!)}
						</p>
					) : (
						<p className='text-[16px] font-bold text-[#f9329c]'>
							{tClassified('loginToView')}
						</p>
					)
				) : (
					<p className='h-6'></p>
				)}
				<div className='flex items-center gap-4 max-sm:flex-col'>
					<ButtonCustom
						text={tClassified('userButtons.sendMessage')}
						className='max-2xs:text-[14px]! w-full px-4 border border-[#4f4f4f] hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] rounded-lg items-center justify-center h-10 text-nowrap'
					/>
					<ButtonCustom
						text={tClassified('userButtons.safeBuy/deal')}
						className='max-2xs:text-[14px]! w-full px-4 border border-[#4f4f4f] hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] rounded-lg items-center justify-center h-10 text-nowrap'
					/>
				</div>
			</div>
		</div>
	)
}
