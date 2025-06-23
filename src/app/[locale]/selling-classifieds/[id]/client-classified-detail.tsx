'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Classified } from '@/types'
import { apiService } from '@/services/api.service'
import { IconCustom } from '@/components/ui/icon-custom'
import { Loader } from '@/components/ui/loader'
import { ButtonCustom } from '@/components/ui/button-custom'
import { CategoryTabs } from '@/components/ui/category-tabs'
import { ImageSlider } from '@/components/ui/image-slider'
import { ClassifiedCard } from '@/components/ui/classified-card'
import { SliderImagesModal } from '@/components/ui/slider-images-modal'
import { useLocale } from 'next-intl'
import { useTranslations } from 'use-intl'
import { useLanguage } from '@/helpers/contexts/language-context'
import { useUser } from '@/helpers/contexts/user-context'
import { formatPhoneNumber } from '@/helpers/functions/format-phone-number'
import { useLoading } from '@/helpers/contexts/loading-context'
import { useAuth } from '@/helpers/contexts/auth-context'

interface ApiError {
	response?: {
		status?: number
		data?: {
			error?: string
		}
	}
	message?: string
}

interface ClientClassifiedDetailProps {
	initialClassified: Classified | null
	initialClassifieds: Classified[]
	id: string
}

export function ClientClassifiedDetail({
	initialClassified,
	initialClassifieds,
	id,
}: ClientClassifiedDetailProps) {
	const [classified, setClassified] = useState<Classified | null>(
		initialClassified
	)
	const [classifieds, setClassifieds] =
		useState<Classified[]>(initialClassifieds)
	const [isFetching, setIsFetching] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [favoritesBool, setFavoritesBool] = useState<boolean>(
		initialClassified?.favoritesBool || false
	)
	const [favorites, setFavorites] = useState<number | undefined>(
		initialClassified?.favorites || 0
	)
	const [page, setPage] = useState(1)

	const { authUser } = useAuth()
	const { user, updateFavorites } = useUser()
	const { settings } = useLanguage()
	const { isLoading, setIsLoading } = useLoading()

	const router = useRouter()
	const locale = useLocale()
	const tClassified = useTranslations('Classified')
	const tSellingClassifieds = useTranslations('SellingClassifieds')
	const [activeCategory, setActiveCategory] = useState(
		tSellingClassifieds('tabs.selling')
	)
	const limit = 10

	const fetchClassified = async () => {
		try {
			setIsFetching(true)
			setError(null)
			const data = await apiService.getClassifiedById(id, {
				currency: settings.currencyCode,
			})
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
			setIsFetching(false)
			setIsLoading(false)
		}
	}

	const fetchClassifieds = async () => {
		try {
			setIsFetching(true)
			const data = await apiService.getClassifieds({
				page,
				limit,
				currency: settings.currencyCode,
			})
			console.log(data)
			setClassifieds(prev => [...prev, ...data.classifieds])
		} catch (error) {
			console.error('Error fetching classifieds:', error)
		} finally {
			setIsFetching(false)
		}
	}

	useLayoutEffect(() => {
		if (initialClassified) {
			setClassified(initialClassified)
			setIsLoading(false)
		} else {
			fetchClassified()
		}
	}, [id, initialClassified, setIsLoading])

	useEffect(() => {
		if (page > 1 || initialClassifieds.length === 0) {
			fetchClassifieds()
		}
	}, [page, initialClassifieds])

	useLayoutEffect(() => {
		if (settings.currencyCode && initialClassified) {
			fetchClassified() // Перезагружаем основное объявление
			setClassifieds([]) // Сбрасываем похожие объявления
			fetchClassifieds() // Загружаем новые похожие объявления
		}
	}, [settings.currencyCode])

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
				updateFavorites(classified.id, res.favoritesBool)
			}
		} catch (error: unknown) {
			const apiError = error as ApiError
			if (apiError.response?.status === 401) {
			} else {
				console.error('Error toggling favorite:', error)
			}
		}
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

	if (isLoading || isFetching || !classified) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

	const symbol =
		classified.convertedCurrency === 'USD'
			? '$'
			: classified.convertedCurrency === 'UAH'
			? '₴'
			: '€'

	// const isOwner = user && classified && user.id === classified.user.id

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-16 md:pt-[88px] 2-5xl:pt-40!'>
				<div className='flex max-2-5xl:flex-col flex-wrap max-2-5xl:justify-center items-baseline w-full'>
					<div className='max-sm:hidden flex-1 flex justify-center w-full'>
						<div className='pb-4 md:pb-8 flex flex-col items-center justify-center max-md:max-w-[768px] max-md:min-w-fit md:w-[768px] min-w-full'>
							<CategoryTabs
								categories={[
									tSellingClassifieds('tabs.selling'),
									tSellingClassifieds('tabs.category'),
									tSellingClassifieds('tabs.category'),
								]}
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
													<div className='relative min-w-[120px] w-fit min-h-[120px] h-fit'>
														<Image
															src={classified.user.avatarUrl}
															alt='user avatar'
															fill
															className='w-full h-full object-cover rounded-[13px]'
														/>
													</div>
													<div className='flex flex-col-reverse items-center mt-2 sm:hidden'>
														<p className='text-[16px] font-bold text-[#4f4f4f] text-center'>
															{tClassified('userButtons.trustRating')}
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
																{formatPhoneNumber(
																	classified.user.phoneNumber!
																)}
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
															className='max-2xs:text-[14px]!  w-full px-4 border border-[#4f4f4f] hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] rounded-lg items-center justify-center h-10 text-nowrap'
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
					{isFetching && classifieds.length === 0 ? (
						<Loader />
					) : (
						<>
							<div className='hidden lg:grid custom-container mx-auto'>
								<h2 className='text-[24px] font-bold uppercase text-[#4f4f4f] inline-block'>
									{tClassified('similarOffers')}
								</h2>
								<div className='grid grid-cols-4 md:grid-cols-12 gap-0 mt-4 lg:mt-8'>
									<div className='col-start-1 col-end-13'>
										<div className='grid grid-cols-4 md:grid-cols-12 2xl:gap-[60px] xl:gap-[60px] lg:gap-[60px] min-[769px]:gap-8 gap-4 select-none'>
											{classifieds.slice(0, 6).map((item, index) => {
												console.log(
													'classifieds convertedPrice:',
													item.convertedPrice
												)
												console.log(
													'classifieds convertedCurrency:',
													item.convertedCurrency
												)
												return (
													<div
														key={index}
														className='col-span-2 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2'
													>
														<ClassifiedCard
															classifiedId={item.id}
															title={item.title}
															convertedPrice={item.convertedPrice}
															convertedCurrency={item.convertedCurrency}
															image={item.images[0]}
															favoritesBool={item.favoritesBool}
															favorites={item.favorites}
															href={`/selling-classifieds/${item.id}`}
															isSmall={true}
														/>
													</div>
												)
											})}
										</div>
									</div>
								</div>
							</div>
							<div className='w-full lg:hidden'>
								<h2 className='text-[24px] px-4 md:px-8 mb-4 font-bold uppercase text-[#4f4f4f] inline-block'>
									{tClassified('similarOffers')}
								</h2>
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
									className='h-[300px] select-none'
									breakpoints={{
										320: {
											slidesPerView: 'auto',
											spaceBetween: 16,
											slidesOffsetBefore: 16,
										},
										420: {
											slidesPerView: 'auto',
											spaceBetween: 16,
										},
										640: {
											slidesPerView: 3.2,
											spaceBetween: 16,
										},
										768: {
											slidesPerView: 'auto',
											spaceBetween: 32,
											slidesOffsetBefore: 32,
											slidesOffsetAfter: 32,
										},
									}}
								>
									{classifieds.slice(0, 6).map((item, index) => (
										<SwiperSlide
											key={index}
											className='min-w-[206px] max-w-[224px] min-h-[278px] max-h-[283px] transition-transform duration-300 overflow-visible select-none'
										>
											<ClassifiedCard
												classifiedId={item.id}
												title={item.title}
												convertedPrice={item.convertedPrice}
												convertedCurrency={item.convertedCurrency}
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
						</>
					)}
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
