'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import Image from 'next/image'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'
import { SwiperPaginationService } from '@/services/swiper-pagination.service'

interface SliderImagesModalProps {
	isOpen: boolean
	onClose: () => void
	images: string[]
	title?: string
	onSlideChange?: (index: number) => void
}

export const SliderImagesModal = ({
	isOpen,
	onClose,
	images,
	title,
	onSlideChange,
}: SliderImagesModalProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isDesktop, setIsDesktop] = useState(false)
	const swiperRef = useRef<SwiperClass | null>(null)

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 768)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		},
		[onClose]
	)

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	const handleSlideChange = (swiper: SwiperClass) => {
		const newIndex = swiper.realIndex
		setCurrentImageIndex(newIndex)
		SwiperPaginationService.updateForCard(swiper)
		if (onSlideChange) {
			onSlideChange(newIndex)
		}
	}

	const handleImageClick = (
		e: React.MouseEvent<HTMLDivElement>,
		swiper: SwiperClass
	) => {
		if (!isDesktop) return

		const rect = e.currentTarget.getBoundingClientRect()
		const clickX = e.clientX - rect.left
		const halfWidth = rect.width / 2

		if (clickX < halfWidth) {
			swiper.slidePrev()
		} else {
			swiper.slideNext()
		}
	}

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			document.body.style.overflow = 'hidden'
		}
		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = 'auto'
		}
	}, [isOpen, handleEscape])

	if (!isOpen) return null

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				onClick={handleOverlayClick}
				className='fixed inset-0 z-50 bg-[#3486fe]/60 flex items-center justify-center max-[1281px]:px-0 min-[1281px]:px-8'
			>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='relative w-full min-[1281px]:max-w-[1600px] h-full min-[1281px]:max-h-[1099px] bg-white min-[1281px]:rounded-[13px] overflow-hidden pb-14 md:pb-[72px] slider-images-modal'
				>
					<Swiper
						initialSlide={1}
						slidesPerView={1}
						spaceBetween={60}
						centeredSlides
						grabCursor={!isDesktop}
						speed={500}
						freeMode={!isDesktop}
						touchRatio={isDesktop ? 0 : 1.5}
						touchReleaseOnEdges={!isDesktop}
						pagination={
							isDesktop ? SwiperPaginationService.paginationForCard : false
						}
						zoom={isDesktop ? false : { maxRatio: 3, minRatio: 1 }}
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
						className='w-full h-full select-none'
					>
						{images.map((image, index) => (
							<SwiperSlide key={index}>
								<div
									className={`relative h-full ${
										isDesktop ? 'cursor-pointer' : ''
									}`}
									onClick={e =>
										swiperRef.current && handleImageClick(e, swiperRef.current)
									}
								>
									<div
										className={`${!isDesktop ? 'swiper-zoom-container' : ''}`}
									>
										<Image
											src={image}
											alt={`${title} - ${index + 1}`}
											fill
											className='w-full h-full max-[1281px]:object-contain min-[1281px]:object-cover max-[1281px]:rounded-[13px]'
										/>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
					<div className='absolute bottom-4 left-0 right-0 flex items-center justify-between w-full z-10 px-4'>
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
						<ButtonCustom
							onClick={onClose}
							iconWrapperClass='w-6 h-6 flex items-center justify-center'
							icon={
								<IconCustom
									name='close'
									className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
									hover={true}
									hoverColor='#f9329c]'
								/>
							}
							isHover
							className='w-10 h-10 flex items-center justify-center rounded-lg'
						/>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}
