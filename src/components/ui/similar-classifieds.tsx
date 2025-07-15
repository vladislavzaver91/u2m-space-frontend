'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Classified } from '@/types'
import { Loader } from './loader'
import { ClassifiedCard } from './classified-card'

interface SimilarClassifiedsProps {
	classifieds: Classified[]
	isFetching: boolean
}

export const SimilarClassifieds = ({
	classifieds,
	isFetching,
}: SimilarClassifiedsProps) => {
	const tClassified = useTranslations('Classified')

	if (isFetching && classifieds.length === 0) {
		return <Loader />
	}

	return (
		<div className='w-full px-0'>
			<>
				<div className='hidden lg:grid custom-container mx-auto'>
					<h2 className='text-[24px] font-bold uppercase text-[#4f4f4f] inline-block'>
						{tClassified('similarOffers')}
					</h2>
					<div className='grid grid-cols-4 md:grid-cols-12 gap-0 mt-4 lg:mt-8'>
						<div className='col-start-1 col-end-13'>
							<div className='grid grid-cols-4 md:grid-cols-12 2xl:gap-[60px] xl:gap-[60px] lg:gap-[60px] min-[769px]:gap-8 gap-4 select-none'>
								{classifieds.slice(0, 6).map((item, index) => (
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
								))}
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
		</div>
	)
}
