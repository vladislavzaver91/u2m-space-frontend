'use client'

import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'

interface ProfileTabsProps {
	tabs: string[]
	activeTab: string
	onTabChange: (tab: string) => void
	containerClass?: string
}

export const ProfileTabs = ({
	tabs,
	activeTab,
	onTabChange,
	containerClass,
}: ProfileTabsProps) => {
	const swiperRef = useRef<SwiperRef | null>(null)

	useEffect(() => {
		const index = tabs.findIndex(tab => tab === activeTab)
		if (swiperRef.current?.swiper && index !== -1) {
			swiperRef.current.swiper.slideTo(index)
		}
	}, [activeTab, tabs])

	return (
		<div className='max-[410px]:w-full'>
			{/* Слайдер для маленьких экранов (<410px) */}
			<div className='profile-tabs-slider block py-4 w-full min-[410px]:hidden overflow-hidden'>
				<Swiper
					slidesPerView='auto'
					spaceBetween={16}
					grabCursor={true}
					speed={500}
					freeMode={true}
					touchRatio={1.5}
					touchReleaseOnEdges
					slidesOffsetBefore={16}
					slidesOffsetAfter={16}
					className='select-none w-full h-auto'
					ref={swiperRef}
					breakpoints={{
						320: {
							slidesPerView: 'auto',
							spaceBetween: 16,
							slidesOffsetBefore: 16,
							slidesOffsetAfter: 16,
						},
					}}
				>
					{tabs.map((tab, index) => (
						<SwiperSlide
							key={index}
							className='transition-transform duration-300 select-none'
						>
							<button
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
							</button>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Табы для больших экранов (≥410px) */}
			<div
				className={`max-[410px]:hidden flex flex-wrap gap-3 2xs:gap-4 sm:gap-16 max-md:px-4 py-4 md:py-8 ${containerClass}`}
			>
				{tabs.map((tab, index) => (
					<button
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
					</button>
				))}
			</div>
		</div>
	)
}
