'use client'

import { Logo } from './components/ui/logo'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useState } from 'react'
import { ButtonWithIcon } from './components/ui/button-with-icon'
import { MdArrowForward } from 'react-icons/md'

const ITEMS = [
	'Give your things a second life',
	'We help to find each other',
	'Fast communication for exchange or sale',
]

export default function Home() {
	const [currentSlide, setCurrentSlide] = useState(0)

	return (
		<div className='flex flex-col w-full overflow-hidden h-screen relative'>
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='custom-container max-xl:max-w-[443px] max-w-[1546px] mx-auto flex flex-col items-center justify-between gap-24 flex-grow'>
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

					<div className='text-[24px] font-bold text-[#4f4f4f] min-h-[200px] w-full'>
						<div className='hidden xl:grid h-full grid-cols-3 gap-[128px]'>
							{ITEMS.map((item, index) => (
								<div key={index} className='flex justify-end h-full'>
									<div className='max-2xl:w-2/3 w-1/2 h-full'>{item}</div>
								</div>
							))}
						</div>

						<div className='xl:hidden w-full'>
							<Swiper
								modules={[Pagination]}
								spaceBetween={0}
								slidesPerView={1}
								onSlideChange={swiper => setCurrentSlide(swiper.activeIndex)}
							>
								{ITEMS.map((item, index) => (
									<SwiperSlide key={index}>
										<div className='flex justify-end'>
											<div className='w-1/2'>{item}</div>
										</div>
									</SwiperSlide>
								))}
							</Swiper>

							{/* Кастомная пагинация */}
							<div className='flex justify-center mt-24'>
								{ITEMS.map((_, index) => (
									<span
										key={index}
										className={`inline-block mx-2 transition-all duration-300 ${
											currentSlide === index
												? 'w-6 h-2 bg-pink-500 rounded-full'
												: 'w-2 h-2 bg-blue-500 rounded-full'
										}`}
									></span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='absolute bottom-4 right-4'>
				<ButtonWithIcon
					text="Let's start"
					icon={<MdArrowForward className='fill-[#3486fe] w-6 h-6' />}
					href='/selling-classifieds'
					className='flex-row-reverse'
				/>
			</div>
		</div>
	)
}
