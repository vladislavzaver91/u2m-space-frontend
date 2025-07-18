'use client'

import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'

interface PaymentTabsProps {
	tabs: string[]
	activeTab: string
	onTabChange: (tab: string) => void
	containerClass?: string
}

export const PaymentTabs = ({
	tabs,
	activeTab,
	onTabChange,
	containerClass,
}: PaymentTabsProps) => {
	return (
		<div
			className={`flex flex-wrap gap-3 2xs:gap-4 sm:gap-16 max-md:px-4 py-4 md:py-8 ${containerClass}`}
		>
			{tabs.map((tab, index) => (
				<h1
					key={index}
					onClick={() => onTabChange(tab)}
					className={`relative pb-2 md:pb-3 tracking-[0.022em] text-[16px] 2xs:text-[18px] md:text-[24px] font-bold uppercase cursor-pointer transition-colors border-b-2 border-transparent select-none ${
						activeTab === tab
							? 'text-[#3486fe] border-[#f9329c]'
							: 'text-[#BDBDBD] sm:text-[#4f4f4f] hover:text-[#3486fe] hover:border-[#f9329c]'
					}`}
				>
					{tab}
					<span
						className={`absolute bottom-0 left-0 h-[2px] bg-[#f9329c] transition-all duration-300 ${
							activeTab === tab ? 'w-full' : 'w-0 group-hover:w-full'
						}`}
					/>
				</h1>
			))}
		</div>
	)
}
