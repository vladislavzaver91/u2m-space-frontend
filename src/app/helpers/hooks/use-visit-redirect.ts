'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useVisitRedirect() {
	const router = useRouter()
	const pathname = usePathname()
	const [shouldRender, setShouldRender] = useState<boolean>(false)

	useEffect(() => {
		const hasVisited = localStorage.getItem('hasVisited')

		if (!hasVisited) {
			// Первый визит: устанавливаем флаг и рендерим текущую страницу
			console.log('First visit, rendering:', pathname)
			localStorage.setItem('hasVisited', 'true')
			setShouldRender(true)
		} else if (pathname === '/') {
			// Повторный визит на '/': редирект на /selling-classifieds
			console.log('Repeat visit on root, redirecting to /selling-classifieds')
			router.replace('/selling-classifieds')
		} else {
			// Повторный визит на другую страницу: рендерим
			console.log('Repeat visit, rendering:', pathname)
			setShouldRender(true)
		}
	}, [router, pathname])

	return shouldRender
}
