'use client'

import { SwiperPaginationService } from '@/app/services/swiper-pagination.service'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { ButtonWithIcon } from './button-with-icon'
import { IconCustom } from './icon-custom'
import { SkeletonImage } from './skeleton-image'

interface ImageSliderProps {
	images: string[]
	title: string
	onOpenModal?: () => void
	className?: string
	paginationClass?: string
}

export const ImageSlider = ({
	images,
	title,
	onOpenModal,
	className,
	paginationClass,
}: ImageSliderProps) => {
	const swiperRef = useRef<SwiperClass | null>(null)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isDesktop, setIsDesktop] = useState(false)
	const [imageLoaded, setImageLoaded] = useState<boolean[]>(
		new Array(images.length).fill(false)
	)

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 769)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleSlideChange = (swiper: SwiperClass) => {
		setCurrentImageIndex(swiper.realIndex)
		SwiperPaginationService.updateForCard(swiper)
		setCurrentSlide(swiper.activeIndex)
	}

	const handleImageClick = (e: React.MouseEvent) => {
		if (isDesktop && onOpenModal) {
			e.stopPropagation()
			onOpenModal()
		}
	}

	const handleImageLoad = (index: number) => {
		setImageLoaded(prev => {
			const newLoaded = [...prev]
			newLoaded[index] = true
			return newLoaded
		})
	}

	if (images.length === 1) {
		return (
			<>
				<div className='relative h-[228px] md:h-[470px] lg:h-[352px]'>
					{!imageLoaded[0] && (
						<SkeletonImage className='absolute inset-0' borderRadius='13px' />
					)}
					<Image
						src={images[0]}
						alt={`${title} - 1`}
						fill
						style={{ objectFit: 'cover' }}
						className='w-full h-full rounded-[13px]'
						onLoad={() => handleImageLoad(0)}
					/>
				</div>
				<div className='relative pt-8 pb-7'>
					{onOpenModal && (
						<div className='max-md:hidden absolute bottom-0 left-0 right-0 flex items-center justify-between w-full z-10 h-[72px]'>
							<div className='flex items-center'>
								<span className='text-[18px] font-bold tracking-[0.03em] uppercase text-[#f9329c]'>
									{String(currentImageIndex + 1).padStart(2, '0')}
								</span>
								<span className='w-6 h-6'>
									<IconCustom
										name='arrow-next'
										className='w-6 h-6 text-[#bdbdbd] stroke-none'
									/>
								</span>
								<span className='text-[18px] font-bold tracking-[0.03em] uppercase text-[#3486fe]'>
									{String(images.length)}
								</span>
							</div>
							<ButtonWithIcon
								iconWrapperClass='w-6 h-6 flex items-center justify-center'
								icon={
									<IconCustom
										name='expand'
										hover={true}
										className='w-6 h-6 text-[#4f4f4f] fill-none'
									/>
								}
								isHover
								className='max-[769px]:hidden rounded-lg  inline-flex p-2 w-10 h-10'
								onClick={onOpenModal}
							/>
						</div>
					)}
				</div>
			</>
		)
	}

	return (
		<div className={`${className} relative w-full`}>
			<Swiper
				slidesPerView={1}
				centeredSlides
				grabCursor={true}
				speed={500}
				freeMode={false}
				touchRatio={1}
				pagination={SwiperPaginationService.paginationForCard}
				onInit={swiper => {
					swiperRef.current = swiper
					SwiperPaginationService.updateForCard(swiper)
				}}
				onSwiper={swiper => {
					swiperRef.current = swiper
					SwiperPaginationService.updateForCard(swiper)
				}}
				onSlideChange={handleSlideChange}
				modules={[Pagination]}
				breakpoints={{
					320: {
						slidesPerView: 1.2,
						spaceBetween: 16,
					},
					480: {
						slidesPerView: 1.5,
						spaceBetween: 16,
					},
					640: {
						slidesPerView: 2,
						spaceBetween: 16,
					},
					768: {
						slidesPerView: 1,
						spaceBetween: 16,
					},
					769: {
						slidesPerView: 1,
						spaceBetween: 32,
					},
					1024: {
						slidesPerView: 1,
						spaceBetween: 60,
					},
				}}
				className='w-full h-auto! select-none'
			>
				{images.map((image, index) => (
					<SwiperSlide key={index}>
						<div
							onClick={handleImageClick}
							className='relative h-[228px] md:h-[470px] lg:h-[352px]'
						>
							{!imageLoaded[index] && (
								<SkeletonImage
									className='absolute inset-0'
									borderRadius='13px'
								/>
							)}
							<Image
								src={image}
								alt={`${title} - ${index + 1}`}
								fill
								style={{ objectFit: 'cover' }}
								className='w-full h-full rounded-[13px]'
								onLoad={() => handleImageLoad(index)}
								priority={index === 0}
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<div
				className={`${paginationClass} max-md:hidden absolute bottom-2 left-0 right-0 flex items-center justify-between w-full z-10 h-[72px]`}
			>
				<div className='flex items-center'>
					<span className='text-[18px] font-bold tracking-[0.03em] uppercase text-[#f9329c]'>
						{String(currentImageIndex + 1).padStart(2, '0')}
					</span>
					<span className='w-6 h-6'>
						<IconCustom
							name='arrow-next'
							className='w-6 h-6 text-[#bdbdbd] stroke-none'
						/>
					</span>
					<span className='text-[18px] font-bold tracking-[0.03em] uppercase text-[#3486fe]'>
						{String(images.length)}
					</span>
				</div>
				{onOpenModal && (
					<ButtonWithIcon
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='expand'
								hover={true}
								className='w-6 h-6 text-[#4f4f4f] fill-none'
							/>
						}
						isHover
						className='rounded-lg max-[769px]:hidden inline-flex p-2 w-10 h-10'
						onClick={onOpenModal}
					/>
				)}
			</div>
		</div>
	)
}
