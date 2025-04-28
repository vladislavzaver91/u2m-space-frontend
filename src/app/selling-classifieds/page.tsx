'use client'

import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { SearchInput } from '../components/ui/search-input'
import { CategoryTabs } from '../components/ui/category-tabs'
import { ClassifiedCard } from '../components/ui/classified-card'

interface Classified {
	id: number
	title: string
	price: string
	createdAt: Date
}

const mockClassifieds: Classified[] = Array.from(
	{ length: 40 },
	(_, index) => ({
		id: index + 1,
		title: `Item ${index + 1}`,
		price: (100 + index * 10).toFixed(2),
		createdAt: new Date(2025, 3, 28 - index),
	})
).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

export default function SellingClassifieds() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [classifieds, setClassifieds] = useState<Classified[]>(
		mockClassifieds.slice(0, 8)
	)
	const [page, setPage] = useState(1)
	const [activeCategory, setActiveCategory] = useState('Selling')
	const loaderRef = useRef<HTMLDivElement>(null)
	const swiperRef = useRef<SwiperClass | null>(null)

	// Infinite Scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (
					entries[0].isIntersecting &&
					classifieds.length < mockClassifieds.length
				) {
					const nextPage = page + 1
					const newItems = mockClassifieds.slice(
						classifieds.length,
						classifieds.length + 8
					)
					setClassifieds(prev => [...prev, ...newItems])
					setPage(nextPage)
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
	}, [page, classifieds.length])

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-20'>
				{/* Поиск и категории */}
				<div className='py-6 flex flex-col gap-8 items-center justify-between'>
					<SearchInput className='max-w-[770px]' disabled />
					<CategoryTabs
						categories={['Selling', 'Category 1', 'Category 2']}
						activeCategory={activeCategory}
						onCategoryChange={setActiveCategory}
						disabled
					/>
				</div>

				{/* Первые 8 карточек */}
				<div className='w-full px-0 mb-32'>
					<div className='hidden custom-container xl:grid grid-cols-4 gap-14'>
						{classifieds.slice(0, 8).map(item => (
							<ClassifiedCard
								key={item.id}
								id={item.id}
								title={item.title}
								price={item.price}
							/>
						))}
					</div>
					<div className='max-sm:px-8 xl:hidden'>
						<Swiper
							slidesPerView={1}
							spaceBetween={60}
							centeredSlides
							loop={false}
							onSwiper={swiper => (swiperRef.current = swiper)}
							onSlideChange={swiper => setCurrentSlide(swiper.activeIndex)}
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
							{classifieds.slice(0, 4).map(item => (
								<SwiperSlide
									key={item.id}
									className='min-w-[355px] h-auto transition-transform duration-300'
								>
									<ClassifiedCard
										id={item.id}
										title={item.title}
										price={item.price}
									/>
								</SwiperSlide>
							))}
						</Swiper>

						{/* Кастомная пагинация */}
						<div className='flex justify-center mt-24'>
							{classifieds.slice(0, 4).map((_, index) => (
								<span
									key={index}
									onClick={() => swiperRef.current?.slideTo(index)}
									className={`inline-block mx-2 transition-all duration-300 cursor-pointer ${
										currentSlide === index
											? 'w-6 h-2 bg-pink-500 rounded-full'
											: index === 0
											? 'w-3 h-3 bg-blue-500 rounded-full'
											: index === 1
											? 'w-2 h-2 bg-blue-500 rounded-full'
											: 'w-1.5 h-1.5 bg-gray-500 rounded-full'
									}`}
								></span>
							))}
						</div>
					</div>
				</div>

				{/* Остальные карточки */}
				{classifieds.length > 8 && (
					<div className='w-full px-0'>
						<div className='custom-container grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-14'>
							{classifieds.slice(8).map(item => (
								<ClassifiedCard
									key={item.id}
									id={item.id}
									title={item.title}
									price={item.price}
								/>
							))}
						</div>
					</div>
				)}

				{/* Элемент для Infinite Scroll */}
				<div ref={loaderRef} className='h-10' />
			</div>
		</div>
	)
}
