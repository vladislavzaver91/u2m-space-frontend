'use client'

import { useEffect, useRef, useState } from 'react'
import { ButtonWithIcon } from '../components/ui/button-with-icon'
import { CategoryTabs } from '../components/ui/category-tabs'
import { useAuth } from '../helpers/contexts/auth-context'
import { IconCustom } from '../components/ui/icon-custom'
import { Classified } from '../types'
import { apiService } from '../services/api.service'
import { Loader } from '../components/ui/loader'
import { MyClassifiedCard } from '../components/ui/my-classified-card'
import { AddClassifiedButton } from '../components/ui/add-classified-button'
import { useScrollStyle } from '../helpers/hooks/use-scroll-style'

export default function MyClassifieds() {
	const [activeCategory, setActiveCategory] = useState('All')
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [filteredClassifieds, setFilteredClassifieds] = useState<Classified[]>(
		[]
	)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [hasHiddenClassifieds, setHasHiddenClassifieds] = useState(false)
	const { user, logout } = useAuth()
	const loaderRef = useRef<HTMLDivElement>(null)
	const limit = 20

	const categories = ['All', 'Active', 'Hide']

	useEffect(() => {
		if (!user) return

		const fetchClassifieds = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getUserClassifieds({ page, limit })
				console.log('User classifieds:', data)
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
	}, [page, user])

	// Фильтрация по категориям
	useEffect(() => {
		setHasHiddenClassifieds(classifieds.some(item => !item.isActive))
		if (activeCategory === 'All') {
			setFilteredClassifieds(classifieds)
		} else if (activeCategory === 'Active') {
			setFilteredClassifieds(classifieds.filter(item => item.isActive))
		} else if (activeCategory === 'Hide') {
			setFilteredClassifieds(classifieds.filter(item => !item.isActive))
		}
	}, [classifieds, activeCategory])

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

	const handleToggleActive = async (id: string, currentIsActive: boolean) => {
		console.log('Toggling classified:', { id, currentIsActive })
		try {
			const updated = await apiService.toggleClassifiedActive(
				id,
				!currentIsActive
			)
			console.log('Updated classified:', updated)
			setClassifieds(prev => prev.map(c => (c.id === id ? updated : c)))
		} catch (error) {
			console.error('Error toggling classified:', error)
		}
	}

	if (!user) {
		return <div className='text-center mt-20'>Authorization required</div>
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
				<div className='flex max-2-5xl:flex-wrap max-2-5xl:items-center max-2-5xl:justify-start max-sm:mb-4 max-sm:pl-4 max-sm:py-[11px] max-2-5xl:pl-8 max-2-5xl:py-6 2-5xl:absolute 2-5xl:pl-32 2-5xl:flex-col gap-4'>
					<ButtonWithIcon
						text='My Classifieds'
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='note'
								className='w-[18px] h-[18px] fill-none text-white'
							/>
						}
						className='w-fit min-w-[183px] h-10 flex flex-row-reverse items-center justify-center rounded-lg text-white bg-[#3486fe]!'
					/>
					<ButtonWithIcon
						text='Logout'
						onClick={logout}
						className='w-fit min-w-[92px] h-10 flex items-center justify-center border border-[#4f4f4f] rounded-[8px] hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe]'
					/>
				</div>
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
				{isLoading && filteredClassifieds.length === 0 ? (
					<Loader />
				) : (
					<div className='w-full'>
						<div className='custom-container mx-auto'>
							<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 min-[769px]:gap-8 xl:gap-[60px]'>
								<div className='col-start-1 col-end-13 2xl:col-start-3 2xl:col-end-11 3xl:col-start-1! 3xl:col-end-13!'>
									<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 min-[769px]:gap-8 xl:gap-[60px]'>
										<div className='col-span-4 lg:col-span-3 xl:col-span-3 3xl:col-span-3'>
											<AddClassifiedButton />
										</div>
										{filteredClassifieds.map(item => (
											<div
												key={item.id}
												className='col-span-4 lg:col-span-3 xl:col-span-3 3xl:col-span-3! select-none'
											>
												<MyClassifiedCard
													id={item.id}
													title={item.title}
													price={item.price.toFixed(2)}
													image={item.images[0]}
													isActive={item.isActive}
													views={item.views}
													messages={item.messages}
													favorites={item.favorites}
													href={`/classifieds-edit/${item.id}`}
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
				)}
			</div>
		</div>
	)
}
