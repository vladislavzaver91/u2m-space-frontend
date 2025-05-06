'use client'

import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Classified } from '@/app/types'
import { apiService } from '@/app/services/api.service'
import { Loader } from '@/app/components/ui/loader'
import { CategoryTabs } from '@/app/components/ui/category-tabs'
import { ButtonWithIcon } from '@/app/components/ui/button-with-icon'
import { IconCustom } from '../../components/ui/icon-custom'
import { ClassifiedCard } from '@/app/components/ui/classified-card'
import { SliderImagesModal } from '@/app/components/ui/slider-images-modal'
import { SwiperPaginationService } from '@/app/services/swiper-pagination.service'

const INFO_AND_ANALYTICAL_DATA = [
	{
		icon: (
			<IconCustom name='show' className='w-6 h-6 fill-none text-[#3486FE]' />
		),
		data: 1471,
	},
	{
		icon: (
			<IconCustom
				name='suitcase'
				className='w-6 h-6 fill-none text-[#3486FE]'
			/>
		),
		data: 356,
	},
	{
		icon: (
			<IconCustom
				name='heart'
				className='w-6 h-6 text-[#F9329C] stroke-[#F9329C]'
			/>
		),
		data: 257,
	},
	{
		icon: (
			<IconCustom name='chat' className='w-6 h-6 fill-none text-[#3486FE]' />
		),
		data: 922,
	},
]

export default function ClassifiedDetail() {
	const [classified, setClassified] = useState<Classified | null>(null)
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [activeCategory, setActiveCategory] = useState('Selling')
	const [isLoading, setIsLoading] = useState(true)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [page, setPage] = useState(1)
	const params = useParams()
	const swiperRef = useRef<SwiperClass | null>(null)
	const id = params.id as string
	const limit = 10

	useEffect(() => {
		const fetchClassified = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getClassifiedById(id)
				setClassified(data)
			} catch (error) {
				console.error('Error fetching classified:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClassified()
	}, [id])

	useEffect(() => {
		const fetchClassifieds = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getClassifieds({ page, limit })
				console.log(data)
				setClassifieds(prev => [...prev, ...data.classifieds])
			} catch (error) {
				console.error('Error fetching classifieds:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClassifieds()
	}, [page])

	const handleBack = () => {
		window.history.back()
	}

	const handleOpenModal = () => {
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const handleSlideChange = (swiper: SwiperClass) => {
		setCurrentImageIndex(swiper.realIndex)
		SwiperPaginationService.updateForCard(swiper)
		setCurrentSlide(swiper.activeIndex)
	}

	if (isLoading) {
		return <Loader />
	}

	if (!classified) {
		return <div className='text-center mt-20'>Classified not found</div>
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-10 md:pt-[120px] lg:pt-40'>
				<div className='flex max-md:flex-col flex-wrap max-md:justify-center items-baseline w-full'>
					<ButtonWithIcon
						onClick={handleBack}
						text='Back'
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='arrow-prev'
								hover={true}
								className='w-6 h-6 text-[#3486FE] fill-none'
							/>
						}
						className='flex justify-start px-8 py-2.5 min-w-[147px] w-fit'
					/>
					<div className='max-sm:hidden flex-1 flex justify-center w-full'>
						<div className='pb-4 md:pb-8 flex flex-col items-center justify-center max-md:max-w-[768px] max-md:min-w-fit md:w-[768px] min-w-full'>
							<CategoryTabs
								categories={['Selling', 'Category', 'Category']}
								activeCategory={activeCategory}
								onCategoryChange={setActiveCategory}
								disabled
							/>
						</div>
					</div>
				</div>

				{/* информация о продукте */}
				<div className='w-full px-0 mb-8 max-sm:mt-4 md:mb-16 lg:mb-8'>
					<div className='md:px-8 xl:max-w-[1664px] mx-auto'>
						<div className='grid grid-cols-4 md:grid-cols-12 gap-0'>
							<div className='col-start-1 col-end-13'>
								{classified && (
									<div className='grid grid-cols-4 gap-y-0 md:grid-cols-12 lg:gap-[60px] md:gap-x-4 gap-x-8'>
										{/* слайдер изображение */}
										<div className='slider-classified-info col-start-1 col-end-5 md:col-end-13 lg:col-end-7 xl:col-end-6 2xl:col-end-5 relative'>
											<Swiper
												initialSlide={1}
												slidesPerView={1}
												centeredSlides
												grabCursor={true}
												speed={800}
												freeMode={false}
												touchRatio={0.5}
												pagination={SwiperPaginationService.pagination}
												onInit={swiper => {
													swiperRef.current = swiper
													SwiperPaginationService.updateForCard(swiper)
												}}
												onSwiper={swiper => {
													swiperRef.current = swiper
													SwiperPaginationService.updateForCard(swiper)
												}}
												onSlideChange={handleSlideChange}
												modules={[Pagination]}
												breakpoints={{
													320: {
														initialSlide: 2,
														slidesPerView: 1.2,
														spaceBetween: 16,
													},
													480: {
														slidesPerView: 1.5,
														spaceBetween: 16,
													},
													640: {
														slidesPerView: 2.5,
														spaceBetween: 16,
													},
													768: {
														slidesPerView: 1,
														spaceBetween: 16,
													},
													769: {
														slidesPerView: 1,
														spaceBetween: 32,
													},
													1024: {
														slidesPerView: 1,
														spaceBetween: 60,
													},
												}}
												className='w-full h-auto!'
											>
												{classified.images.map((image, index) => (
													<SwiperSlide key={index}>
														<div className='relative h-[352px]'>
															<Image
																src={image}
																alt={`${classified.title} - ${index + 1}`}
																fill
																style={{ objectFit: 'cover' }}
																className='w-full h-full rounded-[13px]'
															/>
														</div>
													</SwiperSlide>
												))}
											</Swiper>
											<div className='max-md:hidden absolute bottom-9 left-0 right-0 flex items-center justify-between w-full z-10'>
												<div className='flex items-center'>
													<span className='text-[18px] font-bold tracking-[0.03em] uppercase text-[#f9329c]'>
														{String(currentImageIndex + 1).padStart(2, '0')}
													</span>
													<span className='w-6 h-6'>
														<IconCustom
															name='arrow-next'
															className='w-6 h-6 text-[#bdbdbd] stroke-none'
														/>
													</span>
													<span className='text-[18px] font-bold tracking-[0.03em] uppercase text-[#3486fe]'>
														{String(classified.images.length)}
													</span>
												</div>
												<ButtonWithIcon
													iconWrapperClass='w-6 h-6'
													icon={
														<IconCustom
															name='expand'
															hover={true}
															className='w-6 h-6 text-[#4f4f4f] fill-none'
														/>
													}
													className='p-2 min-w-[40px] w-fit'
													onClick={handleOpenModal}
												/>
											</div>
										</div>
										<div className='col-start-1 col-end-5 md:col-end-13 lg:col-start-7 lg:col-end-13 xl:col-start-6 xl:col-end-12 2xl:col-start-5 2xl:col-end-9 space-y-8 max-md:px-4'>
											{/* заголовок, цена, описание, инфо-аналитические иконки с данными */}
											<div className='space-y-4'>
												<h3 className='text-[24px] font-bold uppercase tracking-[0.03em] text-[#4f4f4f]'>
													{classified.title}
												</h3>
												<p className='text-[24px] font-bold uppercase tracking-[0.03em] text-[#f9329c]'>
													${classified.price}
												</p>
												<p className='text-[16px] font-normal text-[#4f4f4f]'>
													{classified.description}
												</p>
												<div className='flex flex-wrap gap-8'>
													{INFO_AND_ANALYTICAL_DATA.map((item, index) => (
														<div
															key={index}
															className='flex items-center gap-2'
														>
															<span className='w-6 h-6'>{item.icon}</span>
															<p className='font-bold text-[13px] text-[#4f4f4f]'>
																{item.data}
															</p>
														</div>
													))}
												</div>
											</div>
											{/* инфо о продавце */}
											<div className='flex items-center gap-[30px]'>
												<div>
													<div className='relative min-w-[120px] w-fit min-h-[120px] h-fit rounded-[13px]'>
														<Image
															src='/user-prod.jpg'
															alt='user avatar'
															fill
															className='w-full h-full object-cover'
														/>
													</div>
													<div className='flex flex-col-reverse items-center mt-2 sm:hidden'>
														<p className='text-[16px] font-bold uppercase text-[#4f4f4f]'>
															Trust rating
														</p>
														<span className='text-[16px] font-bold text-[#3486fe]'>
															50
														</span>
													</div>
												</div>
												<div className='space-y-4'>
													<div className='flex sm:items-center sm:gap-8'>
														<h4 className='text-[18px] font-bold uppercase tracking-[0.03em] text-[#4f4f4f]'>
															Fox
														</h4>
														<div className='max-sm:hidden flex items-center gap-2'>
															<p className='text-[13px] font-bold uppercase text-[#4f4f4f]'>
																tr
															</p>
															<span className='text-[16px] font-bold text-[#3486fe]'>
																50
															</span>
														</div>
													</div>
													<p className='text-[16px] font-bold text-[#f9329c]'>
														+380 96 42 07 202
													</p>
													<div className='flex items-center gap-4 max-sm:flex-col '>
														<ButtonWithIcon
															text='Send message'
															className='min-w-[178px] sm:min-w-[155px] w-fit border border-[#4f4f4f] rounded-lg items-center justify-center h-10'
														/>
														<ButtonWithIcon
															text='Safe buy/deal'
															className='min-w-[178px]  sm:min-w-[145px] w-fit border border-[#4f4f4f] rounded-lg items-center justify-center h-10'
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* похожие предложения */}
				<div className='w-full px-0'>
					<div className='hidden lg:grid custom-container mx-auto'>
						<h3 className='text-[24px] font-bold uppercase text-[#4f4f4f] inline-block'>
							Similar offers
						</h3>
						<div className='grid grid-cols-4 md:grid-cols-12 gap-0 mt-4 lg:mt-8'>
							<div className='col-start-1 col-end-13'>
								<div className='grid grid-cols-4 md:grid-cols-12 2xl:gap-[60px] xl:gap-[60px] lg:gap-[60px] min-[769px]:gap-8 gap-4'>
									{classifieds.slice(0, 6).map((item, index) => (
										<div
											key={index}
											className='col-span-2 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2'
										>
											<ClassifiedCard
												title={item.title}
												price={item.price.toFixed(2)}
												image={item.images[0]}
												isFavorite={false}
												href={`/selling-classifieds/${item.id}`}
												isSmall={true}
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className='mb-4 lg:hidden'>
						<Swiper
							slidesPerView={1}
							spaceBetween={16}
							grabCursor={true}
							centeredSlides
							speed={800}
							freeMode={false}
							touchRatio={0.5}
							className='w-full h-[285px]'
							breakpoints={{
								320: {
									slidesPerView: 1.2,
									spaceBetween: 16,
								},
								420: {
									slidesPerView: 1.5,
									spaceBetween: 16,
								},
								640: {
									slidesPerView: 3.2,
									spaceBetween: 16,
								},
								769: {
									slidesPerView: 4,
									spaceBetween: 32,
								},
							}}
						>
							{classifieds.slice(0, 6).map((item, index) => (
								<SwiperSlide
									key={index}
									className='min-w-[206px] max-w-[224px] min-h-[278px] max-h-[283px] transition-transform duration-300 overflow-visible'
								>
									<ClassifiedCard
										title={item.title}
										price={item.price.toFixed(2)}
										image={item.images[0]}
										isFavorite={false}
										href={`/selling-classifieds/${item.id}`}
										isSmall={true}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</div>

			<SliderImagesModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				images={classified?.images || []}
				title={classified?.title}
				onSlideChange={index => setCurrentSlide(index)}
			/>
		</div>
	)
}
