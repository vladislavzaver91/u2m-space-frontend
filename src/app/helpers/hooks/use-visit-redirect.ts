'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useVisitRedirect() {
	const router = useRouter()
	const pathname = usePathname()
	const [shouldRender, setShouldRender] = useState<boolean>(false)
	const [isRedirecting, setIsRedirecting] = useState<boolean>(false)

	useEffect(() => {
		const hasVisited = localStorage.getItem('hasVisited')
		const isManualRedirect = localStorage.getItem('manualRedirect') === 'true'

		if (!hasVisited) {
			localStorage.setItem('hasVisited', 'true')
			setShouldRender(true)
		} else if (pathname === '/' && !isManualRedirect) {
			setIsRedirecting(true)
			router.replace('/selling-classifieds')
			setShouldRender(false)
		} else {
			setShouldRender(true)
			if (isManualRedirect) {
				localStorage.removeItem('manualRedirect')
			}
		}
	}, [router, pathname])

	useEffect(() => {
		if (isRedirecting && pathname === '/selling-classifieds') {
			setIsRedirecting(false)
			setShouldRender(true)
		}
	}, [pathname, isRedirecting])

	return shouldRender
}
