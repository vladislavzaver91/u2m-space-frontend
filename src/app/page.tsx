'use client'

import { Logo } from './components/ui/logo'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import './globals.css'
import { useRef, useState } from 'react'
import { ButtonWithIcon } from './components/ui/button-with-icon'
import { MdArrowForward } from 'react-icons/md'
import { SwiperPaginationManager } from './lib/swiper-pagination-manager'
import { BenefitsItemCard } from './components/ui/benefits-item-card'

const BENEFITS_ITEMS = [
	{
		label: 'Give your things a second life',
		img: '/images/item_1.png',
	},
	{
		label: 'We help to find each other',
		img: '/images/item_2.png',
	},
	{
		label: 'Fast communication for exchange or sale',
		img: '/images/item_3.png',
	},
]

export default function Home() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const swiperRef = useRef<SwiperClass | null>(null)

	return (
		<div className='flex flex-col w-full overflow-hidden h-screen relative'>
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='max-sm:px-2 max-xl:px-0 px-8 max-xl:max-w-[443px] max-w-[1546px] mx-auto flex flex-col items-center justify-between gap-[100px] flex-grow'>
					<div className='flex flex-col items-center justify-center text-center space-y-8'>
						<Logo width={150} height={48} />
						<h1 className='font-bold text-[24px] text-[#4f4f4f]'>
							Hi there, <br /> I’m U2M Space
						</h1>
						<p className='font-normal text-[16px] leading-6'>
							Your new simpler, reliable way <br />
							to exchange.
						</p>
					</div>

					<div className='min-h-[200px] w-full'>
						<div className='hidden xl:grid h-[200px] grid-cols-3 gap-[128px]'>
							{BENEFITS_ITEMS.map((item, index) => (
								<BenefitsItemCard
									key={index}
									index={index}
									label={item.label}
									img={item.img}
								/>
							))}
						</div>

						<div className='xl:hidden w-full'>
							<Swiper
								modules={[Pagination]}
								spaceBetween={0}
								slidesPerView={1}
								pagination={SwiperPaginationManager.pagination}
								onSwiper={swiper => (swiperRef.current = swiper)}
								onSlideChange={swiper => {
									setCurrentSlide(swiper.activeIndex)
									SwiperPaginationManager.updateBase(swiper)
								}}
							>
								{BENEFITS_ITEMS.map((item, index) => (
									<SwiperSlide
										key={index}
										className='max-sm:flex! flex justify-center items-center h-auto min-h-[200px]'
									>
										<BenefitsItemCard
											index={index}
											label={item.label}
											img={item.img}
											isSlider
										/>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>
				</div>
			</div>

			<div className='absolute bottom-0 right-0'>
				<ButtonWithIcon
					text="Let's start"
					icon={<MdArrowForward className='fill-[#3486fe] w-6 h-6' />}
					href='/selling-classifieds'
					className='flex-row-reverse p-8 min-w-[187px] w-fit'
				/>
			</div>
		</div>
	)
}
