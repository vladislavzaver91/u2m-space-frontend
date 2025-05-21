'use client'

import { Logo } from './components/ui/logo'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import './globals.css'
import { ButtonWithIcon } from './components/ui/button-with-icon'
import { BenefitsItemCard } from './components/ui/benefits-item-card'
import { IconCustom } from './components/ui/icon-custom'
import { useSliderHomeLogic } from './helpers/hooks/use-slider-home-logic'
import { SwiperPaginationService } from './services/swiper-pagination.service'

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
	const {
		isSliderOpen,
		handlePrevSlide,
		handleNextSlide,
		swiperRef,
		setCurrentSlide,
		currentSlide,
		handleOpenSlider,
		handleCloseSlider,
	} = useSliderHomeLogic()

	return (
		<div className='flex flex-col w-full overflow-hidden min-h-screen relative'>
			{isSliderOpen ? (
				<div className='fixed inset-0 min-h-screen bg-white z-20 md:max-w-[768px] mx-auto overflow-hidden'>
					<div className='relative flex flex-col min-h-screen overflow-hidden'>
						{/* Стрелка назад */}

						<ButtonWithIcon
							iconWrapperClass='w-6 h-6 flex items-center justify-center'
							icon={
								<IconCustom
									name='arrow-prev'
									className='w-[17px] h-3.5 text-[#4F4F4F] fill-none'
								/>
							}
							onClick={handleCloseSlider}
							isHover
							className='w-[88px] h-[88px] justify-center'
						/>

						{/* Слайдер */}
						<div className='flex-1 flex items-center pb-[88px]'>
							<Swiper
								modules={[Pagination]}
								spaceBetween={0}
								slidesPerView={1}
								speed={500}
								pagination={SwiperPaginationService.paginationBase}
								onSwiper={swiper => (swiperRef.current = swiper)}
								onSlideChange={swiper => {
									setCurrentSlide(swiper.activeIndex)
									SwiperPaginationService.updateBase(swiper)
								}}
								className='w-[310px] h-auto select-none slider-benefits'
							>
								{BENEFITS_ITEMS.map((item, index) => (
									<SwiperSlide
										key={index}
										className='flex justify-center items-center min-h-[200px] h-auto'
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

						{/* Кнопка Next / Let's start */}
						<div className='fixed bottom-0 right-0'>
							{currentSlide === BENEFITS_ITEMS.length - 1 ? (
								<ButtonWithIcon
									text="Let's start"
									iconWrapperClass='w-6 h-6'
									icon={
										<IconCustom
											name='arrow-next'
											hover={true}
											hoverColor='#f9329c'
											className='w-6 h-6 text-[#3486FE] stroke-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
										/>
									}
									href='/selling-classifieds'
									isHover
									className='flex-row-reverse p-8 min-w-[187px] w-fit'
								/>
							) : (
								<ButtonWithIcon
									text='Next'
									iconWrapperClass='w-6 h-6'
									icon={
										<IconCustom
											name='arrow-next'
											hover={true}
											hoverColor='#f9329c'
											className='w-6 h-6 text-[#3486FE] stroke-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
										/>
									}
									onClick={handleNextSlide}
									isHover
									className='flex-row-reverse p-[30px] min-w-[140px] w-fit'
								/>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className='flex-1 flex items-center justify-center pt-14 pb-[84px] md:pt-20 md:pb-[88px] '>
					<div className='home-content-wrapper max-sm:px-2 max-2xl:px-0 px-8 max-2xl:max-w-[443px] max-w-[1546px] mx-auto flex flex-col items-center md:justify-between md:gap-[100px] flex-grow'>
						<div className='flex flex-col items-center justify-center text-center md:space-y-8'>
							<Logo width={150} height={48} className='z-10' />
							<h1 className='font-bold text-[24px] text-[#4f4f4f] leading-7 max-md:pt-7 max-md:pb-[15px]'>
								Hi there, <br /> I’m U2M Space
							</h1>
							<p className='font-normal text-[16px] leading-6'>
								Your new simpler, reliable way <br />
								to exchange.
							</p>
						</div>

						<div className='max-md:hidden min-h-[200px] w-full'>
							<div className='hidden 2xl:grid h-[200px] grid-cols-3 gap-[128px]'>
								{BENEFITS_ITEMS.map((item, index) => (
									<BenefitsItemCard
										key={index}
										index={index}
										label={item.label}
										img={item.img}
									/>
								))}
							</div>

							<div className='max-md:hidden 2xl:hidden w-full'>
								<Swiper
									modules={[Pagination]}
									spaceBetween={0}
									slidesPerView={1}
									speed={500}
									pagination={SwiperPaginationService.paginationBase}
									onSwiper={swiper => (swiperRef.current = swiper)}
									onSlideChange={swiper => {
										setCurrentSlide(swiper.activeIndex)
										SwiperPaginationService.updateBase(swiper)
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
			)}

			{!isSliderOpen && (
				<div className='fixed bottom-0 right-0'>
					<ButtonWithIcon
						text="Let's meet"
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='arrow-next'
								hover={true}
								hoverColor='#f9329c'
								className='w-6 h-6 text-[#3486FE] stroke-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
							/>
						}
						onClick={handleOpenSlider}
						isHover
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
								hoverColor='#f9329c'
								className='w-6 h-6 text-[#3486FE] stroke-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
							/>
						}
						isHover
						className='flex-row-reverse p-8 min-w-[187px] w-fit max-md:hidden'
					/>
				</div>
			)}
		</div>
	)
}
