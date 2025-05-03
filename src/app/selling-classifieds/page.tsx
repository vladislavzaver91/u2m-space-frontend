'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import '../globals.css'
import { SearchInput } from '../components/ui/search-input'
import { CategoryTabs } from '../components/ui/category-tabs'
import { ClassifiedCard } from '../components/ui/classified-card'
import { Pagination } from 'swiper/modules'
import { SwiperPaginationManager } from '../lib/swiper-pagination-manager'
import { useAuthExchange } from '../helpers/hooks/use-auth-exchange'
import { Classified } from '../types'
import { apiService } from '../services/api.service'
import { Loader } from '../components/ui/loader'

function AuthExchangeWrapper() {
	useAuthExchange()
	return null
}

export default function SellingClassifieds() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [activeCategory, setActiveCategory] = useState('Selling')
	const [isLoading, setIsLoading] = useState(true)
	const loaderRef = useRef<HTMLDivElement>(null)
	const swiperRef = useRef<SwiperClass | null>(null)

	const limit = 20

	useEffect(() => {
		const fetchClassifieds = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getClassifieds({ page, limit })
				console.log(data)
				setClassifieds(prev => [...prev, ...data.classifieds])
				setHasMore(data.hasMore)
			} catch (error) {
				console.error('Error fetching classifieds:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClassifieds()
	}, [page])

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
	}, [hasMore, isLoading])

	return (
		<div className='min-h-screen flex flex-col'>
			<Suspense fallback={<div>Loading authentication...</div>}>
				<AuthExchangeWrapper />
			</Suspense>

			<div className='flex-1 pt-14 md:pt-40'>
				{/* Поиск и категории */}
				<div className='pb-8 px-4 md:px-[22px] lg:px-8 flex flex-col gap-4 md:gap-8 items-center justify-between'>
					<SearchInput className='max-w-[770px] max-md:hidden' disabled />
					<CategoryTabs
						categories={['Selling', 'Category', 'Category']}
						activeCategory={activeCategory}
						onCategoryChange={setActiveCategory}
						disabled
					/>
				</div>

				{isLoading && classifieds.length === 0 ? (
					<Loader />
				) : (
					<>
						{/* Первые 8 карточек */}
						<div className='w-full px-0 mb-4 sm:mb-32'>
							<div className='hidden 2xl:grid'>
								<div className='custom-container mx-auto'>
									<div className='grid grid-cols-12 gap-0'>
										<div className='col-start-1 col-end-13'>
											<div className='grid grid-cols-12 lg:gap-[60px] gap-4'>
												{classifieds.slice(0, 8).map(item => (
													<div key={item.id} className='col-span-3'>
														<ClassifiedCard
															title={item.title}
															price={item.price.toFixed(2)}
															image={item.images[0]} // Первое изображение для карточки
															isFavorite={false} // Заглушка для "Избранное"
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
							<div className='slider-for-card 2xl:hidden'>
								<Swiper
									initialSlide={2}
									slidesPerView={1}
									spaceBetween={60}
									centeredSlides={true}
									loop={true}
									modules={[Pagination]}
									pagination={SwiperPaginationManager.pagination}
									onInit={swiper => {
										swiperRef.current = swiper
										SwiperPaginationManager.updateForCard(swiper)
									}}
									onSwiper={swiper => {
										swiperRef.current = swiper
										SwiperPaginationManager.updateForCard(swiper)
									}}
									onSlideChange={swiper => {
										setCurrentSlide(swiper.activeIndex)
										SwiperPaginationManager.updateForCard(swiper)
									}}
									className='w-full !h-auto'
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
											slidesPerView: 3,
											spaceBetween: 60,
										},
										1024: {
											initialSlide: 1,
											slidesPerView: 5,
											spaceBetween: 60,
										},
									}}
								>
									{classifieds.slice(0, 4).map((item, index) => (
										<SwiperSlide
											key={index}
											className='min-w-[295px] max-w-[355px] h-[372px] transition-transform duration-300 overflow-visible'
										>
											<ClassifiedCard
												title={item.title}
												price={item.price.toFixed(2)}
												image={item.images[0]}
												isFavorite={false}
												href={`/selling-classifieds/${item.id}`}
												isSmall={false}
											/>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</div>

						{/* Остальные карточки */}
						{classifieds.length > 8 && (
							<div className='w-full px-0'>
								<div className='custom-container mx-auto'>
									<div className='grid grid-cols-4 sm:grid-cols-12 gap-0'>
										<div className='col-start-1 col-end-13'>
											<div className='grid grid-cols-4 sm:grid-cols-12 2xl:gap-[60px] xl:gap-8 lg:gap-[60px] md:gap-8 gap-4'>
												{classifieds.slice(8).map((item, index) => (
													<div
														key={index}
														className='col-span-2 sm:col-span-4 lg:col-span-3 xl:col-span-2'
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
							</div>
						)}
					</>
				)}

				{isLoading && classifieds.length > 0 && (
					<div className='my-4'>
						<Loader />
					</div>
				)}
				<div ref={loaderRef} className='h-10' />
			</div>
		</div>
	)
}
