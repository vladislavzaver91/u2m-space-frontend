'use client'

import { useEffect, useRef, useState } from 'react'
import { SwiperClass } from 'swiper/react'

export function useSliderHomeLogic() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isSliderOpen, setIsSliderOpen] = useState(false)
	const swiperRef = useRef<SwiperClass | null>(null)

	const handleOpenSlider = () => {
		setIsSliderOpen(true)
		setCurrentSlide(0) // Сбрасываем слайд на первый
	}

	const handleCloseSlider = () => {
		setIsSliderOpen(false)
	}

	const handlePrevSlide = () => {
		if (currentSlide === 0) {
			handleCloseSlider()
		} else {
			swiperRef.current?.slidePrev()
		}
	}

	const handleNextSlide = () => {
		if (swiperRef.current) {
			swiperRef.current.slideNext()
		}
	}

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768 && isSliderOpen) {
				setIsSliderOpen(false)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [isSliderOpen])

	return {
		swiperRef,
		currentSlide,
		setCurrentSlide,
		isSliderOpen,
		setIsSliderOpen,
		handleOpenSlider,
		handleCloseSlider,
		handlePrevSlide,
		handleNextSlide,
	}
}
