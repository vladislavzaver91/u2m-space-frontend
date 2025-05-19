'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import Image from 'next/image'
import { IconCustom } from './icon-custom'
import { SwiperPaginationService } from '@/app/services/swiper-pagination.service'
import { ButtonWithIcon } from './button-with-icon'
import { MdClose } from 'react-icons/md'

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
	const swiperRef = useRef<SwiperClass | null>(null)

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
				className='fixed inset-0 z-50 bg-[#3486fe]/60 flex items-center justify-center max-md:px-0 max-xl:px-8'
			>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='relative w-full max-w-[1216px] 2xl:max-w-[1393px] h-full md:max-h-[1010px] bg-white rounded-3xl overflow-hidden px-6 pt-6 pb-[88px] slider-images-modal'
				>
					<Swiper
						initialSlide={1}
						slidesPerView={1}
						spaceBetween={60}
						centeredSlides
						grabCursor={true}
						speed={800}
						freeMode={false}
						touchRatio={0.5}
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
						className='w-full h-full  select-none'
					>
						{images.map((image, index) => (
							<SwiperSlide key={index}>
								<div className='relative h-full'>
									<Image
										src={image}
										alt={`${title} - ${index + 1}`}
										fill
										style={{ objectFit: 'cover' }}
										className='w-full h-full rounded-[13px]'
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
					<div className='absolute bottom-9 left-0 right-0 flex items-center justify-between w-full z-10 px-6'>
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
							onClick={onClose}
							iconWrapperClass='w-6 h-6 flex items-center justify-center'
							icon={
								<IconCustom
									name='close'
									className='w-3 h-3 fill-none text-[#4f4f4f]'
									hover={true}
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
