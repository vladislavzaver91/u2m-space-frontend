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

export default function MySpace() {
	const [activeCategory, setActiveCategory] = useState('All')
	const [classifieds, setClassifieds] = useState<Classified[]>([])
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const { user, logout } = useAuth()
	const loaderRef = useRef<HTMLDivElement>(null)
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
			<div className='flex-1 pt-14 pb-10 md:pt-40'>
				<div className='flex max-xl:items-center max-sm:justify-start max-xl:justify-center max-sm:mb-4 max-xl:mb-8 max-sm:pl-4 max-sm:py-[11px] xl:absolute xl:pl-32 xl:flex-col gap-4'>
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
						className='w-fit min-w-[92px] h-10 flex items-center justify-center border border-[#4f4f4f] rounded-[8px] hover:bg-[#f7f7f7] hover:border-[#3486fe]'
					/>
				</div>
				<div className='flex-1 flex sm:justify-center w-full'>
					<div className='pb-4 md:pb-8 flex flex-col items-center justify-center max-md:max-w-[768px] max-md:min-w-fit md:w-[768px] min-w-full'>
						<CategoryTabs
							categories={['All', 'Active', 'Hide']}
							activeCategory={activeCategory}
							onCategoryChange={setActiveCategory}
							disabled
						/>
					</div>
				</div>

				{/* список продуктов */}
				{isLoading && classifieds.length === 0 ? (
					<Loader />
				) : (
					<div className='w-full mt-8'>
						<div className='custom-container mx-auto'>
							<div className='grid grid-cols-12 gap-[60px]'>
								<div className='col-start-1 col-end-13 2xl:col-start-3! 2xl:col-end-11! 3xl:col-start-1 3xl:col-end-13'>
									<div className='grid grid-cols-4 sm:grid-cols-12 2xl:grid-cols-8 3xl:grid-cols-12 2xl:gap-[60px] xl:gap-[60px] lg:gap-[60px] min-[769px]:gap-8 gap-4'>
										{classifieds.slice(0, 4).map(item => (
											<div
												key={item.id}
												className='col-span-2 sm:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2 3xl:col-span-3'
											>
												<MyClassifiedCard
													title={item.title}
													price={item.price.toFixed(2)}
													image={item.images[0]}
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
