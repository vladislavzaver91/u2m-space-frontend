'use client'

import { useRef, useState } from 'react'
import { ButtonWithIcon } from './button-with-icon'
import { IconCustom } from './icon-custom'
import { SwiperClass } from 'swiper/react'
import { useSliderHomeLogic } from '@/app/helpers/hooks/use-slider-home-logic'

export const BottomButtons = () => {
	const { handleOpenSlider } = useSliderHomeLogic()

	return (
		<div className='fixed bottom-0 right-0'>
			<ButtonWithIcon
				text="Let's meet"
				iconWrapperClass='w-6 h-6'
				icon={
					<IconCustom
						name='arrow-next'
						hover={true}
						className='w-6 h-6 text-[#3486FE] stroke-none'
					/>
				}
				onClick={handleOpenSlider}
				className='flex-row-reverse p-8 min-w-[187px] w-fit md:hidden'
			/>
			<ButtonWithIcon
				text="Let's start"
				href='/selling-classifieds'
				iconWrapperClass='w-6 h-6'
				icon={
					<IconCustom
						name='arrow-next'
						hover={true}
						className='w-6 h-6 text-[#3486FE] stroke-none'
					/>
				}
				className='flex-row-reverse p-8 min-w-[187px] w-fit max-md:hidden'
			/>
		</div>
	)
}
