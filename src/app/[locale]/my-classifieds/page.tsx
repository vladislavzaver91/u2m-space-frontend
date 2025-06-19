'use client'

import { AddClassifiedButton } from '@/components/ui/add-classified-button'
import { CategoryTabs } from '@/components/ui/category-tabs'
import { Loader } from '@/components/ui/loader'
import { MyClassifiedCard } from '@/components/ui/my-classified-card'
import { NavigationButtons } from '@/components/ui/navigation-buttons'
import { useAuth } from '@/helpers/contexts/auth-context'
import { useLanguage } from '@/helpers/contexts/language-context'
import { apiService } from '@/services/api.service'
import { Classified } from '@/types'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

export default function MyClassifieds() {
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
	const tMyClassifieds = useTranslations('MyClassifieds')
	const [activeCategory, setActiveCategory] = useState(
		tMyClassifieds('tabs.all')
	)

	const categories = [
		tMyClassifieds('tabs.all'),
		tMyClassifieds('tabs.active'),
		tMyClassifieds('tabs.hide'),
	]

	useEffect(() => {
		if (!authUser) {
			setIsLoading(false)
			return
		}

		const fetchClassifieds = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getUserClassifieds({ page, limit })

				if (process.env.NODE_ENV !== 'production') {
					console.log('User classifieds:', data)
				}

				setClassifieds(prev => {
					const newClassifieds = [...prev, ...data.classifieds].filter(
						(item, index, self) =>
							index === self.findIndex(t => t.id === item.id)
					)
					return newClassifieds
				})
				setHasMore(data.hasMore)
			} catch (error: any) {
				console.error('Error fetching user classifieds:', error)
				if (error.response?.status === 404) {
					setHasMore(false) // Останавливаем загрузку, если данных больше нет
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchClassifieds()
	}, [page, authUser])

	// Фильтрация по категориям
	useEffect(() => {
		setHasHiddenClassifieds(classifieds.some(item => !item.isActive))
		if (activeCategory === tMyClassifieds('tabs.all')) {
			setFilteredClassifieds(classifieds)
		} else if (activeCategory === tMyClassifieds('tabs.active')) {
			setFilteredClassifieds(classifieds.filter(item => item.isActive))
		} else if (activeCategory === tMyClassifieds('tabs.hide')) {
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

	const handleToggleActive = async (id: string, currentIsActive: boolean) => {
		if (process.env.NODE_ENV !== 'production') {
			console.log('Toggling classified:', { id, currentIsActive })
		}
		try {
			const updated = await apiService.toggleClassifiedActive(
				id,
				!currentIsActive
			)
			if (process.env.NODE_ENV !== 'production') {
				console.log('Updated classified:', updated)
			}
			setClassifieds(prev =>
				prev.map(c => {
					if (c.id === id) {
						return {
							...c,
							isActive: updated.isActive,
							convertedPrice:
								c.convertedPrice ?? updated.convertedPrice ?? c.price,
							convertedCurrency: c.convertedCurrency ?? settings.currencyCode,
						}
					}
					return c
				})
			)
		} catch (error) {
			console.error('Error toggling classified:', error)
		}
	}

	return (
		<div className='min-h-screen flex flex-col'>
			{isLoading ? (
				<div className='min-h-screen flex flex-col items-center justify-center'>
					<Loader />
				</div>
			) : (
				<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
					<NavigationButtons
						activePage={tMyClassifieds('buttons.myClassifieds')}
					/>

					<div className='flex-1 flex sm:justify-center w-full'>
						<div className='pb-4 md:pb-8 flex flex-col items-center justify-center max-md:max-w-[768px] max-md:min-w-fit md:w-[768px] min-w-full'>
							<CategoryTabs
								categories={categories.map(category => category)}
								activeCategory={activeCategory}
								onCategoryChange={setActiveCategory}
								isHideDisabled={!hasHiddenClassifieds}
							/>
						</div>
					</div>

					{/* список продуктов */}

					<div className='w-full'>
						<div className='custom-container mx-auto'>
							<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 min-[769px]:gap-8 xl:gap-[60px]'>
								<div className='col-start-1 col-end-13 2xl:col-start-3 2xl:col-end-11 3xl:col-start-1! 3xl:col-end-13!'>
									<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 min-[769px]:gap-8 xl:gap-[60px]'>
										<div className='col-span-4 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 3xl:col-span-3'>
											<AddClassifiedButton />
										</div>
										{filteredClassifieds.map(item => (
											<div
												key={item.id}
												className='col-span-4 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 3xl:col-span-3! select-none'
											>
												<MyClassifiedCard
													id={item.id}
													title={item.title}
													convertedPrice={item.convertedPrice}
													convertedCurrency={item.convertedCurrency}
													image={item.images[0]}
													isActive={item.isActive}
													views={item.views}
													messages={item.messages}
													favorites={item.favorites}
													href={`/selling-classifieds/${item.id}`}
													onToggleActive={() =>
														handleToggleActive(item.id, item.isActive)
													}
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
