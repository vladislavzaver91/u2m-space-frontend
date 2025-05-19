'use client'

import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
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
import { ImageSlider } from '@/app/components/ui/image-slider'
import { useAuth } from '@/app/helpers/contexts/auth-context'

interface ApiError {
	response?: {
		status?: number
		data?: {
			error?: string
		}
	}
	message?: string
}

export default function ClassifiedDetail() {
	const [classified, setClassified] = useState<Classified | null>(null)
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [activeCategory, setActiveCategory] = useState('Selling')
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [favoritesBool, setFavoritesBool] = useState<boolean>(false)
	const [favorites, setFavorites] = useState<number | undefined>(0)
	const [page, setPage] = useState(1)
	const { user } = useAuth()
	const params = useParams()
	const id = params.id as string
	const limit = 10

	useEffect(() => {
		const fetchClassified = async () => {
			try {
				setIsLoading(true)
				setError(null)
				console.log('Fetching classified, user:', user)
				const data = await apiService.getClassifiedById(id)
				console.log('getClassifiedById data:', data)
				setClassified(data)
				setFavoritesBool(data.favoritesBool)
				setFavorites(data.favorites)
				console.log('favoritesBool:', data.favoritesBool)
			} catch (error: any) {
				console.error('Error fetching classified:', error)
				setError(
					error.response?.status === 404
						? 'Объявление не найдено'
						: 'Не удалось загрузить объявление. Пожалуйста, попробуйте позже.'
				)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClassified()
	}, [id, user])

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

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		if (!user) {
			console.log('User not authenticated, cannot toggle favorite')
			return
		}
		try {
			if (classified) {
				const res = await apiService.toggleFavorite(classified.id)
				console.log('favoritesBool:', res.favoritesBool)
				setFavoritesBool(res.favoritesBool)
				setFavorites(res.favorites)
				setClassified(prev =>
					prev
						? {
								...prev,
								favoritesBool: res.favoritesBool,
								favorites: res.favorites,
						  }
						: prev
				)
			}
		} catch (error: unknown) {
			const apiError = error as ApiError
			if (apiError.response?.status === 401) {
			} else {
				console.error('Error toggling favorite:', error)
			}
		}
	}

	const handleBack = () => {
		window.history.back()
	}

	const handleOpenModal = () => {
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	if (error) {
		return <div className='text-center mt-20 text-red-500'>{error}</div>
	}

	// if (!classified) {
	// 	return <div className='text-center mt-20'>Classified not found</div>
	// }

	const INFO_AND_ANALYTICAL_DATA = [
		{
			icon: (
				<IconCustom name='show' className='w-6 h-6 fill-none text-[#3486FE]' />
			),
			data: classified?.views,
		},
		{
			icon: (
				<IconCustom
					name='suitcase'
					className='w-6 h-6 fill-none text-[#3486FE]'
				/>
			),
			data: classified?.user.successfulDeals,
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
			data: classified?.messages,
		},
	]

	console.log('user data:', user)
	console.log('classified user data id:', classified?.user.id)

	const isOwner = user && classified && user.id === classified.user.id

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
				<div className='flex max-2-5xl:flex-col flex-wrap max-2-5xl:justify-center items-baseline w-full'>
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
						isHover
						className='flex justify-start px-8 py-2.5 min-w-[147px] w-fit h-[88px]'
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

				{isLoading ? (
					<div className='flex items-center justify-center'>
						<Loader />
					</div>
				) : (
					<div className='w-full px-0 mb-8 max-sm:mt-4 md:mb-16 lg:mb-8'>
						<div className='md:px-8 xl:max-w-[1664px] mx-auto'>
							<div className='grid grid-cols-4 md:grid-cols-12 gap-0'>
								<div className='col-start-1 col-end-13'>
									{classified && (
										<div className='grid grid-cols-4 gap-y-0 md:grid-cols-12 lg:gap-[60px] md:gap-x-4 gap-x-8'>
											{/* слайдер изображение */}
											<div className='col-start-1 col-end-5 md:col-end-13 lg:col-end-7 xl:col-end-6 2xl:col-end-5 relative'>
												<ImageSlider
													images={classified.images}
													title={classified?.title || ''}
													onOpenModal={handleOpenModal}
													className='slider-classified-info'
												/>
											</div>
											<div className='col-start-1 col-end-5 md:col-end-13 lg:col-start-7 lg:col-end-13 xl:col-start-6 xl:col-end-12 2xl:col-start-5 2xl:col-end-9 space-y-8 max-md:px-4'>
												{/* заголовок, цена, описание, инфо-аналитические иконки с данными */}
												<div className='space-y-4'>
													<h3 className='text-[24px] font-bold uppercase tracking-[0.03em] text-[#4f4f4f]'>
														{classified.title}
													</h3>
													<div className='flex items-center justify-between'>
														<p className='text-[24px] font-bold uppercase tracking-[0.03em] text-[#f9329c]'>
															${classified.price}
														</p>
														<ButtonWithIcon
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
													{/* информация показывается для авторизованного владельца своего объявления */}
													{isOwner && (
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
													)}
												</div>
												{/* инфо о продавце */}
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
															<p className='text-[16px] font-bold uppercase text-[#4f4f4f] text-center'>
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
																{classified.user.name}
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
														{classified.user.phoneNumber ? (
															<p className='text-[16px] font-bold text-[#f9329c]'>
																{classified.user.phoneNumber}
															</p>
														) : (
															<p className='text-[16px] font-bold text-[#f9329c]'>
																+380 96 42 07 202
															</p>
														)}
														<div className='flex items-center gap-4 max-sm:flex-col'>
															<ButtonWithIcon
																text='Send message'
																className='max-sm:max-w-[178px] max-sm:w-full sm:min-w-[155px] sm:w-fit border border-[#4f4f4f] hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] rounded-lg items-center justify-center h-10'
															/>
															<ButtonWithIcon
																text='Safe buy/deal'
																className='max-sm:max-w-[178px] max-sm:w-full   sm:min-w-[145px] sm:w-fit border border-[#4f4f4f] hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] rounded-lg items-center justify-center h-10'
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
				)}

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
												classifiedId={item.id}
												title={item.title}
												price={item.price.toFixed(2)}
												image={item.images[0]}
												favoritesBool={item.favoritesBool}
												favorites={item.favorites}
												href={`/selling-classifieds/${item.id}`}
												isSmall={true}
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className='mb-4 lg:hidden '>
						<Swiper
							slidesPerView={1}
							spaceBetween={16}
							grabCursor={true}
							centeredSlides
							speed={800}
							freeMode={false}
							touchRatio={0.5}
							className='w-full h-[300px] select-none'
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
										classifiedId={item.id}
										title={item.title}
										price={item.price.toFixed(2)}
										image={item.images[0]}
										favoritesBool={item.favoritesBool}
										favorites={item.favorites}
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
