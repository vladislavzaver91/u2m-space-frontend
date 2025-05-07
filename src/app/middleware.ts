import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const hasVisited = request.cookies.get('hasVisited')?.value === 'true'
	const url = request.nextUrl.clone()

	// Если пользователь уже посещал сайт и пытается зайти на /home, перенаправляем на /selling-classifieds
	if (hasVisited && url.pathname === '/') {
		url.pathname = '/selling-classifieds'
		return NextResponse.redirect(url)
	}

	// Если пользователь впервые на сайте, устанавливаем куки
	if (!hasVisited) {
		const response = NextResponse.next()
		response.cookies.set('hasVisited', 'true', {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 год
		})
		return response
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/'], // Применяем middleware к /home и корневому пути
}
