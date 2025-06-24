'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import '../../globals.css'
import { Pagination } from 'swiper/modules'
import { useAuthExchange } from '@/helpers/hooks/use-auth-exchange'
import { Classified } from '@/types'
import { apiService } from '@/services/api.service'
import { SearchInput } from '@/components/ui/search-input'
import { CategoryTabs } from '@/components/ui/category-tabs'
import { Loader } from '@/components/ui/loader'
import { ClassifiedCard } from '@/components/ui/classified-card'
import { SwiperPaginationService } from '@/services/swiper-pagination.service'
import { useTranslations } from 'next-intl'
import { useLanguage } from '@/helpers/contexts/language-context'
import { useLoading } from '@/helpers/contexts/loading-context'

function AuthExchangeWrapper() {
	useAuthExchange()
	return null
}

export default function ClientSellingClassifieds() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [isFetching, setIsFetching] = useState(true)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const loaderRef = useRef<HTMLDivElement>(null)
	const swiperRef = useRef<SwiperClass | null>(null)
	const tSellingClassifieds = useTranslations('SellingClassifieds')
	const [activeCategory, setActiveCategory] = useState(
		tSellingClassifieds('tabs.selling')
	)
	const { settings } = useLanguage()
	const { isLoading } = useLoading()

	const limit = 20

	useEffect(() => {
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
				setHasMore(data.hasMore)
			} catch (error) {
				console.error('Error fetching classifieds:', error)
			} finally {
				setIsFetching(false)
			}
		}

		fetchClassifieds()
	}, [page, settings.currencyCode])

	// Обновление цен при смене валюты
	// useEffect(() => {
	// 	setClassifieds(prev =>
	// 		prev.map(item => ({
	// 			...item,
	// 			convertedCurrency: selectedCurrency.code,
	// 		}))
	// 	)
	// }, [selectedCurrency.code])

	// Infinite Scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					setPage(prev => prev + 1)
				}
			},
			{ threshold: 0.1 }
		)

		if (loaderRef.current) {
			observer.observe(loaderRef.current)
		}

		return () => {
			if (loaderRef.current) {
				observer.unobserve(loaderRef.current)
			}
		}
	}, [hasMore, setIsFetching])

	if (isLoading || (isFetching && classifieds.length === 0)) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Suspense fallback={<div>Loading authentication...</div>}>
				<AuthExchangeWrapper />
			</Suspense>

			<div className='flex-1 pt-14 pb-16 md:pt-[88px] 2-5xl:pt-40!'>
				{/* Поиск и категории */}
				<div className='pb-4 md:pb-8 md:px-4 flex flex-col 2xl:gap-8 items-center justify-between'>
					<SearchInput
						className='w-full max-2xl:py-3 2xl:max-w-[770px] max-md:hidden'
						disabled
					/>
					<CategoryTabs
						categories={[
							tSellingClassifieds('tabs.selling'),
							tSellingClassifieds('tabs.category'),
							tSellingClassifieds('tabs.category'),
						]}
						activeCategory={activeCategory}
						onCategoryChange={setActiveCategory}
						disabled
						shouldSlider
					/>
				</div>

				<>
					{/* Первые 8 карточек */}
					<div className='max-[1513px]:hidden w-full px-0 mb-32'>
						<div className='hidden min-[1513px]:grid custom-container mx-auto'>
							<div className='grid grid-cols-12 gap-[60px]'>
								<div className='col-start-1 col-end-13'>
									<div className='grid grid-cols-12 lg:gap-[60px] gap-4 select-none'>
										{classifieds.slice(0, 8).map((item, index) => (
											<div key={index} className='col-span-3'>
												<ClassifiedCard
													classifiedId={item.id}
													title={item.title}
													convertedPrice={item.convertedPrice}
													convertedCurrency={item.convertedCurrency}
													image={item.images[0]}
													favoritesBool={item.favoritesBool}
													favorites={item.favorites}
													href={`/selling-classifieds/${item.id}`}
													isSmall={false}
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='slider-for-card mb-4 md:mb-16 min-[1513px]:hidden'>
						<Swiper
							initialSlide={2}
							slidesPerView={1}
							spaceBetween={60}
							centeredSlides
							grabCursor={true}
							speed={500}
							freeMode={true}
							touchRatio={1.5}
							touchReleaseOnEdges
							modules={[Pagination]}
							pagination={SwiperPaginationService.paginationForCard}
							onInit={swiper => {
								swiperRef.current = swiper
								SwiperPaginationService.updateForCard(swiper)
							}}
							onSwiper={swiper => {
								swiperRef.current = swiper
								SwiperPaginationService.updateForCard(swiper)
							}}
							onSlideChange={swiper => {
								setCurrentSlide(swiper.activeIndex)
								SwiperPaginationService.updateForCard(swiper)
							}}
							className='w-full !h-auto select-none'
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
									slidesPerView: 2.5,
									spaceBetween: 16,
								},
								769: {
									slidesPerView: 4,
									spaceBetween: 32,
								},
								1024: {
									initialSlide: 2,
									slidesPerView: 5,
									spaceBetween: 60,
								},
								1280: {
									initialSlide: 2,
									slidesPerView: 'auto',
									spaceBetween: 60,
								},
							}}
						>
							{classifieds.slice(0, 8).map((item, index) => (
								<SwiperSlide
									key={index}
									className='min-w-[295px] max-w-[355px] h-[383px] transition-transform duration-300 overflow-visible'
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
										isSmall={false}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					{/* Остальные карточки */}
					{classifieds.length > 8 && (
						<div className='w-full px-0'>
							<div className='custom-container mx-auto'>
								<div className='grid grid-cols-4 sm:grid-cols-12 gap-0'>
									<div className='col-start-1 col-end-13'>
										<div className='grid grid-cols-4 sm:grid-cols-12 2xl:gap-[60px] xl:gap-[60px] lg:gap-[60px] min-[769px]:gap-8 gap-4 select-none'>
											{classifieds.slice(8).map((item, index) => (
												<div
													key={index}
													className='col-span-2 sm:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2'
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
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</>

				{isFetching && classifieds.length > 0 && (
					<div className='my-4'>
						<Loader />
					</div>
				)}
				<div ref={loaderRef} className='h-10' />
			</div>
		</div>
	)
}
