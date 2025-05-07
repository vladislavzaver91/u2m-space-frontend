'use client'

import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

export function useVisitRedirect() {
	const router = useRouter()

	useLayoutEffect(() => {
		const hasVisited = localStorage.getItem('hasVisited')
		if (!hasVisited) {
			localStorage.setItem('hasVisited', 'true')
		} else {
			router.replace('/selling-classifieds')
		}
	}, [router])
}
