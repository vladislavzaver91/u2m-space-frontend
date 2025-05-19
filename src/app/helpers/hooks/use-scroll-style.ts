'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function useScrollStyle() {
	const pathname = usePathname()

	useEffect(() => {
		const body = document.body
		if (pathname !== '/') {
			body.classList.add('has-scroll')
		} else {
			body.classList.remove('has-scroll')
		}
	}, [pathname])
}
