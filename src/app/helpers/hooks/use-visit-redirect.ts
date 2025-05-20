'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useVisitRedirect() {
	const router = useRouter()
	const pathname = usePathname()
	const [shouldRender, setShouldRender] = useState<boolean>(false)
	const [isRedirecting, setIsRedirecting] = useState<boolean>(false)
	const [target, setTarget] = useState<string>('/')

	useEffect(() => {
		const hasVisited = localStorage.getItem('hasVisited')
		setTarget(hasVisited ? '/selling-classifieds' : '/')

		if (!hasVisited) {
			// Первый визит
			console.log('First visit, rendering:', pathname)
			localStorage.setItem('hasVisited', 'true')
			setShouldRender(true)
		} else if (pathname === '/' && !isRedirecting) {
			// Повторный визит на '/': перенаправляем на /selling-classifieds
			console.log('Repeat visit on root, redirecting to /selling-classifieds')
			setIsRedirecting(true)
			router.replace('/selling-classifieds')
		} else {
			// Повторный визит на другую страницу: рендерим
			console.log('Repeat visit, rendering:', pathname)
			setShouldRender(true)
		}
	}, [router, pathname, isRedirecting])

	useEffect(() => {
		if (isRedirecting && pathname === '/selling-classifieds') {
			console.log('Redirect completed, rendering /selling-classifieds')
			setIsRedirecting(false)
			setShouldRender(true)
		}
	}, [pathname, isRedirecting])

	return { shouldRender, target }
}
