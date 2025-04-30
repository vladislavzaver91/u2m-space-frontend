'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import '../globals.css'
import { SearchInput } from '../components/ui/search-input'
import { CategoryTabs } from '../components/ui/category-tabs'
import { ClassifiedCard } from '../components/ui/classified-card'
import { Pagination } from 'swiper/modules'
import { SwiperPaginationManager } from '../lib/swiper-pagination-manager'
import { useAuthExchange } from '../helpers/hooks/use-auth-exchange'
import { Classified } from '../types'
import { apiService } from '../services/api.service'

function AuthExchangeWrapper() {
	useAuthExchange()
	return null
}

// const mockClassifieds: Classified[] = Array.from(
// 	{ length: 40 },
// 	(_, index) => ({
// 		id: index + 1,
// 		title: `Item ${index + 1}`,
// 		price: (100 + index * 10).toFixed(2),
// 		createdAt: new Date(2025, 3, 28 - index),
// 	})
// ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

export default function SellingClassifieds() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [page, setPage] = useState(1)
	const [activeCategory, setActiveCategory] = useState('Selling')
	const [isLoading, setIsLoading] = useState(true)
	const loaderRef = useRef<HTMLDivElement>(null)
	const swiperRef = useRef<SwiperClass | null>(null)

	useEffect(() => {
		const fetchClassifieds = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getClassifieds()
				setClassifieds(data)
			} catch (error) {
				console.error('Error fetching classifieds:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClassifieds()
	}, [])

	// Infinite Scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && !isLoading) {
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
	}, [isLoading])

	return (
		<div className='min-h-screen flex flex-col'>
			<Suspense fallback={<div>Loading authentication...</div>}>
				<AuthExchangeWrapper />
			</Suspense>

			<div className='flex-1 pt-20'>
				{/* Поиск и категории */}
				<div className='py-6 px-8 flex flex-col gap-8 items-center justify-between'>
					<SearchInput className='max-w-[770px]' disabled />
					<CategoryTabs
						categories={['Selling', 'Category 1', 'Category 2']}
						activeCategory={activeCategory}
						onCategoryChange={setActiveCategory}
						disabled
					/>
				</div>

				{isLoading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3486fe]'></div>
					</div>
				) : (
					<>
						{/* Первые 8 карточек */}
						<div className='w-full px-0 mb-32'>
							<div className='hidden custom-container xl:grid grid-cols-4 gap-14'>
								{classifieds.slice(0, 8).map(item => (
									<ClassifiedCard
										key={item.id}
										title={item.title}
										price={item.price.toFixed(2)}
										image={item.images[0]} // Первое изображение для карточки
										isFavorite={false} // Заглушка для "Избранное"
										href={`/selling-classifieds/${item.id}`}
									/>
								))}
							</div>
							<div className='slider-for-card max-sm:px-8 xl:hidden'>
								<Swiper
									slidesPerView={1}
									spaceBetween={60}
									centeredSlides
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
										640: {
											slidesPerView: 2,
											spaceBetween: 16,
										},
										768: {
											slidesPerView: 2,
											spaceBetween: 16,
										},
										1024: {
											slidesPerView: 4,
											spaceBetween: 60,
										},
									}}
								>
									{classifieds.slice(0, 4).map((item, index) => (
										<SwiperSlide
											key={index}
											className='min-w-[295px] md:min-w-[355px] h-[372px] transition-transform duration-300 overflow-visible'
										>
											<ClassifiedCard
												title={item.title}
												price={item.price.toFixed(2)}
												image={item.images[0]}
												isFavorite={false}
												href={`/selling-classifieds/${item.id}`}
											/>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</div>

						{/* Остальные карточки */}
						{classifieds.length > 8 && (
							<div className='w-full px-0'>
								<div className='custom-container grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-14'>
									{classifieds.slice(8).map(item => (
										<ClassifiedCard
											key={item.id}
											title={item.title}
											price={item.price.toFixed(2)}
											image={item.images[0]}
											isFavorite={false}
											href={`/selling-classifieds/${item.id}`}
										/>
									))}
								</div>
							</div>
						)}
					</>
				)}

				{/* Элемент для Infinite Scroll */}
				<div ref={loaderRef} className='h-10' />
			</div>
		</div>
	)
}
