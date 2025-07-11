'use client'

import { useLayoutEffect, useState } from 'react'

export function useScreenResize() {
	const [isMobile, setIsMobile] = useState<boolean>(false)
	const [isTablet, setIsTablet] = useState<boolean>(false)

	useLayoutEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
			setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1024)
		}

		handleResize() // Initial check on mount
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return { isMobile, isTablet }
}
