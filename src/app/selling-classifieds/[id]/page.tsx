'use client'

import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Classified } from '@/app/types'
import { apiService } from '@/app/services/api.service'
import { Loader } from '@/app/components/ui/loader'
import { CategoryTabs } from '@/app/components/ui/category-tabs'
import { ButtonWithIcon } from '@/app/components/ui/button-with-icon'
import { IconCustom } from '@/app/components/ui/icon-custom'

export default function ClassifiedDetail() {
	const [classified, setClassified] = useState<Classified | null>(null)
	const [activeCategory, setActiveCategory] = useState('Selling')
	const [isLoading, setIsLoading] = useState(true)
	const params = useParams()
	const id = params.id as string

	useEffect(() => {
		const fetchClassified = async () => {
			try {
				setIsLoading(true)
				const data = await apiService.getClassifiedById(id)
				setClassified(data)
			} catch (error) {
				console.error('Error fetching classified:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClassified()
	}, [id])

	if (isLoading) {
		return <Loader />
	}

	if (!classified) {
		return <div className='text-center mt-20'>Classified not found</div>
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 md:pt-40'>
				<div className='pb-4 md:pb-8 flex items-center justify-center min-w-[770px] w-fit'>
					<ButtonWithIcon
						text='Back'
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='arrow-prev'
								hover={true}
								className='w-6 h-6 text-[#3486FE] fill-none'
							/>
						}
						className='px-8 py-2.5 min-w-[147px] w-fit'
					/>
					<CategoryTabs
						categories={['Selling', 'Category', 'Category']}
						activeCategory={activeCategory}
						onCategoryChange={setActiveCategory}
						disabled
					/>
				</div>
			</div>
		</div>
	)
}

// <div className='custom-container mx-auto'>
// 	<h1 className='text-3xl font-bold text-[#4f4f4f] mb-6'>
// 		{classified.title}
// 	</h1>
// 	<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
// 		{/* Слайдер изображений */}
// 		<div>
// 			<Swiper
// 				slidesPerView={1}
// 				spaceBetween={10}
// 				pagination={{ clickable: true }}
// 				modules={[Pagination]}
// 				className='w-full h-[400px]'
// 			>
// 				{classified.images.map((image, index) => (
// 					<SwiperSlide key={index}>
// 						<Image
// 							src={image}
// 							alt={`${classified.title} - ${index + 1}`}
// 							fill
// 							style={{ objectFit: 'cover' }}
// 							className='w-full h-full'
// 						/>
// 					</SwiperSlide>
// 				))}
// 			</Swiper>
// 		</div>
// 		{/* Информация об объявлении */}
// 		<div>
// 			<p className='text-2xl font-bold text-[#3486fe] mb-4'>
// 				${classified.price.toFixed(2)}
// 			</p>
// 			<p className='text-gray-600 mb-4'>{classified.description}</p>
// 			<p className='text-gray-500'>Posted by: {classified.user.name}</p>
// 			<p className='text-gray-500'>
// 				Created: {new Date(classified.createdAt).toLocaleDateString()}
// 			</p>
// 		</div>
// 	</div>
// </div>
