'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/auth-context'

export function useVisitRedirect() {
	const router = useRouter()
	const pathname = usePathname()
	const { user } = useAuth()
	const [shouldRender, setShouldRender] = useState<boolean>(false)
	const [isRedirecting, setIsRedirecting] = useState<boolean>(false)

	useEffect(() => {
		const hasVisitedForAuthUser = localStorage.getItem('hasVisitedForAuthUser')

		if (!user) {
			console.log('Non-authenticated user, rendering:', pathname)
			setShouldRender(true)
			return
		}

		if (!hasVisitedForAuthUser) {
			console.log('First visit for authenticated user, rendering:', pathname)
			localStorage.setItem('hasVisitedForAuthUser', 'true')
			setShouldRender(true)
		} else if (pathname === '/' && !isRedirecting) {
			console.log(
				'Authenticated user on root, redirecting to /selling-classifieds'
			)
			setIsRedirecting(true)
			router.replace('/selling-classifieds')
		} else {
			console.log('Authenticated user, rendering:', pathname)
			setShouldRender(true)
		}
	}, [router, pathname, user, isRedirecting])

	useEffect(() => {
		if (isRedirecting && pathname === '/selling-classifieds') {
			console.log('Redirect completed, rendering /selling-classifieds')
			setIsRedirecting(false)
			setShouldRender(true)
		}
	}, [pathname, isRedirecting])

	return shouldRender
}
