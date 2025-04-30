// import { NextRequest, NextResponse } from 'next/server'

// export function middleware(request: NextRequest) {
// 	const accessToken = request.cookies.get('accessToken')?.value
// 	const { pathname } = request.nextUrl

// 	// Если пользователь не авторизован и пытается зайти на защищенные страницы
// 	if (!accessToken && pathname !== '/login' && !pathname.startsWith('/api')) {
// 		const url = request.nextUrl.clone()
// 		url.pathname = '/login'
// 		return NextResponse.redirect(url)
// 	}

// 	// Если пользователь авторизован и пытается зайти на /login, перенаправляем на /selling-classifieds
// 	if (accessToken && pathname === '/login') {
// 		const url = request.nextUrl.clone()
// 		url.pathname = '/selling-classifieds'
// 		return NextResponse.redirect(url)
// 	}

// 	return NextResponse.next()
// }

// export const config = {
// 	matcher: ['/((?!_next|static|favicon.ico).*)'], // Применяем ко всем маршрутам, кроме статики
// }
