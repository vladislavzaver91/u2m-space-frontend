'use client'

import { CategoryTabs } from '@/components/ui/category-tabs'
import { Loader } from '@/components/ui/loader'
import { MyFavoritesCard } from '@/components/ui/my-favorites-card'
import { NavigationButtons } from '@/components/ui/navigation-buttons'
import { useAuth } from '@/helpers/contexts/auth-context'
import { useLanguage } from '@/helpers/contexts/language-context'
import { apiService } from '@/services/api.service'
import { Classified } from '@/types'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

export default function FavoritesPage() {
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [filteredClassifieds, setFilteredClassifieds] = useState<Classified[]>(
		[]
	)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [hasHiddenClassifieds, setHasHiddenClassifieds] = useState(false)
	const { authUser } = useAuth()
	const { settings } = useLanguage()
	const loaderRef = useRef<HTMLDivElement>(null)
	const limit = 20
	const tFavorites = useTranslations('Favorites')
	const tMyClassifieds = useTranslations('MyClassifieds')
	const [activeCategory, setActiveCategory] = useState(tFavorites('tabs.all'))

	const categories = [
		tFavorites('tabs.all'),
		tFavorites('tabs.selling'),
		tFavorites('tabs.bidding'),
		tFavorites('tabs.barter'),
	]

	useEffect(() => {
		if (!authUser) {
			setIsLoading(false)
			setClassifieds([])
			setFilteredClassifieds([])
			return
		}

		const fetchFavorites = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getUserFavorites({ page, limit })
				console.log('User favorites:', data)
				setClassifieds(prev => {
					const newClassifieds = [...prev, ...data.classifieds].filter(
						(item, index, self) =>
							index === self.findIndex(t => t.id === item.id)
					)
					return newClassifieds
				})
				setHasMore(data.hasMore)
			} catch (error: any) {
				console.error('Error fetching user favorites:', error)
				if (error.response?.status === 404) {
					setHasMore(false) // Останавливаем загрузку, если данных больше нет
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchFavorites()
	}, [page, authUser])

	// Фильтрация по категориям
	useEffect(() => {
		setHasHiddenClassifieds(classifieds.some(item => !item.isActive))
		if (activeCategory === tFavorites('tabs.all')) {
			setFilteredClassifieds(classifieds)
		} else if (activeCategory === tFavorites('tabs.selling')) {
			setFilteredClassifieds(classifieds.filter(item => item.isActive))
		} else if (activeCategory === tFavorites('tabs.bidding')) {
			setFilteredClassifieds(classifieds.filter(item => !item.isActive))
		} else if (activeCategory === tFavorites('tabs.barter')) {
			setFilteredClassifieds(classifieds.filter(item => !item.isActive))
		}
	}, [classifieds, activeCategory])

	// Обновление цен при смене валюты
	useEffect(() => {
		setClassifieds(prev =>
			prev.map(item => ({
				...item,
				convertedCurrency: settings.currencyCode,
			}))
		)
	}, [settings.currencyCode])

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

	// Сброс состояния при возвращении на страницу
	useEffect(() => {
		const handlePopstate = () => {
			setIsLoading(true)
			setPage(1) // Сбрасываем страницу
			setClassifieds([]) // Очищаем данные
			setFilteredClassifieds([]) // Очищаем отфильтрованные данные
		}

		window.addEventListener('popstate', handlePopstate)
		return () => window.removeEventListener('popstate', handlePopstate)
	}, [])

	const handleFavoriteToggle = (id: string, isFavorite: boolean) => {
		if (!isFavorite) {
			// Если объявление удалено из избранного, убираем его из списка
			setClassifieds(prev => prev.filter(item => item.id !== id))
		}
	}

	return (
		<div className='min-h-screen flex flex-col'>
			{isLoading ? (
				<div className='min-h-screen flex flex-col items-center justify-center'>
					<Loader />
				</div>
			) : (
				<div className='flex-1 pt-14 pb-16 md:pt-[88px] 2-5xl:pt-40!'>
					<NavigationButtons activePage={tMyClassifieds('buttons.favorites')} />

					<div className='flex-1 flex sm:justify-center w-full'>
						<div className='pb-4 md:pb-8 flex flex-col sm:items-center justify-center max-md:max-w-[768px] max-md:min-w-fit md:w-[768px] min-w-full'>
							<CategoryTabs
								categories={categories.map(category => category)}
								activeCategory={activeCategory}
								onCategoryChange={setActiveCategory}
								disabled={!hasHiddenClassifieds}
								mySpacePages
								containerClass='max-md:pl-4! max-md:pr-2!'
							/>
						</div>
					</div>

					{/* список продуктов */}

					<div className='w-full'>
						<div className='px-4 md:px-8 xl:max-w-[1280px] 2xl:max-w-[1112px] 3xl:max-w-[1664px]! mx-auto'>
							<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 min-[769px]:gap-8 xl:gap-[60px]'>
								<div className='col-start-1 col-end-5 sm:col-start-1 sm:col-end-13'>
									<div className='flex flex-wrap justify-center gap-4 min-[769px]:gap-8 xl:gap-[60px] w-full'>
										{filteredClassifieds.map((item, index) => (
											<div key={item.id} className='max-sm:w-full select-none'>
												<MyFavoritesCard
													id={item.id}
													title={item.title}
													convertedPrice={item.convertedPrice}
													convertedCurrency={item.convertedCurrency}
													image={item.images[0]}
													favoritesBool={item.favoritesBool}
													favorites={item.favorites}
													onFavoriteToggle={handleFavoriteToggle}
													href={`/selling-classifieds/${item.id}`}
												/>
											</div>
										))}
									</div>
								</div>
							</div>
							{hasMore && (
								<div ref={loaderRef} className='h-10 flex justify-center'>
									{isLoading && <Loader />}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
