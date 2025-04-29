'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { MdClose } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { useAuth } from '../helpers/contexts/auth-context'
import $api from '../lib/http'
import { ButtonWithIcon } from '../components/ui/button-with-icon'

interface AuthLinkItem {
	icon: string
	name: string
	href?: string
}

interface User {
	id: string
	email: string
	name: string
	provider: string
}

const AUTH_LINK_ITEMS: AuthLinkItem[] = [
	{
		icon: '/icons/facebook.svg',
		name: 'Facebook',
		href: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/facebook`,
	},
	{
		icon: '/icons/apple.svg',
		name: 'Apple',
	},
	{
		icon: '/icons/google.svg',
		name: 'Google',
		href: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
	},
]

export default function Login() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { handleAuthSuccess } = useAuth()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [handled, setHandled] = useState<boolean>(false)

	const handleClose = () => {
		router.back()
	}

	const handleAuthClick = (provider: string) => {
		setIsLoading(true)
		setError(null)
	}

	// Обрабатываем результат OAuth
	useEffect(() => {
		const handleAuthResult = async () => {
			if (handled) return // Предотвращаем повторные вызовы
			setHandled(true)

			const success = searchParams.get('success')
			const errorMsg = searchParams.get('error')

			if (errorMsg) {
				setError(errorMsg)
				setIsLoading(false)
				return
			}

			if (success) {
				try {
					const response = await $api.get<{
						user: User
						accessToken: string
						refreshToken: string
					}>('/api/auth/data')

					const { user, accessToken, refreshToken } = response.data

					if (!user.id || !user.email || !user.provider) {
						throw new Error('Incomplete user data')
					}

					handleAuthSuccess({ user, accessToken, refreshToken })
					router.replace('/')
				} catch (err) {
					console.error('Failed to fetch auth data:', err)
					setError(err.response?.data?.error || 'Authentication failed')
					setIsLoading(false)
				}
			}
		}

		handleAuthResult()
	}, [searchParams, handleAuthSuccess, router, handled])

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleClose()
			}
		}
		window.addEventListener('keydown', handleEsc)
		return () => {
			window.removeEventListener('keydown', handleEsc)
		}
	}, [])

	return (
		<div className='fixed inset-0 bg-[#3486fe]/60 flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl shadow-lg w-[582px] max-w-[90%] p-8 flex flex-col items-center space-y-8'>
				{/* Кнопка закрытия */}
				<ButtonWithIcon
					onClick={handleClose}
					className='self-end text-[#4f4f4f] hover:text-gray-700'
					icon={<MdClose className='w-6 h-6' />}
				/>

				{/* Заголовок */}
				<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
					Welcome
				</h2>

				{/* Ошибка */}
				{error && (
					<div className='bg-red-100 text-red-700 p-4 rounded-lg w-full text-center animate-pulse'>
						{error}
					</div>
				)}

				{/* Лоадер или кнопки */}
				<div className='w-full'>
					<h3 className='text-[18px] text-[#4f4f4f] text-center mb-4'>
						Log in with
					</h3>
					{isLoading ? (
						<div className='flex justify-center items-center'>
							<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3486fe]'></div>
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
							{AUTH_LINK_ITEMS.map((item, index) => (
								<ButtonWithIcon
									key={index}
									text={item.name}
									icon={
										<Image
											src={item.icon}
											alt={`${item.name} logo`}
											width={32}
											height={32}
										/>
									}
									href={item.href}
									onClick={() => handleAuthClick(item.name)}
									className='flex items-center gap-4 p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-xl hover:bg-[#f7f7f7] hover:border-[#f9329c] transition-colors w-full justify-center'
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

// 'use client'

// import { useRouter, useSearchParams } from 'next/navigation'
// import { ButtonWithIcon } from '../components/ui/button-with-icon'
// import { MdClose } from 'react-icons/md'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useEffect, useState } from 'react'
// import { useAuth } from '../helpers/contexts/auth-context'
// import $api from '../lib/http'

// interface AuthLinkItem {
// 	icon: string
// 	name: string
// 	href?: string /* временно, пока не настроим apple */
// }

// interface User {
// 	id: string
// 	email: string
// 	name: string
// 	provider: string
// }

// const frontendUrl =
// 	typeof window !== 'undefined'
// 		? window.location.origin
// 		: 'http://localhost:3001'
// const AUTH_LINK_ITEMS: AuthLinkItem[] = [
// 	{
// 		icon: '/icons/facebook.svg',
// 		name: 'Facebook',
// 		href: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/facebook`,
// 	},
// 	{
// 		icon: '/icons/apple.svg',
// 		name: 'Apple',
// 	},
// 	{
// 		icon: '/icons/google.svg',
// 		name: 'Google',
// 		href: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
// 	},
// ]

// export default function Login() {
// 	const router = useRouter()
// 	const searchParams = useSearchParams()
// 	const [isLoading, setIsLoading] = useState<boolean>(false)
// 	const [error, setError] = useState<string | null>(null)
// 	const { handleAuthSuccess } = useAuth()

// 	const handleClose = () => {
// 		router.back()
// 	}

// 	const handleAuthClick = (provider: string) => {
// 		setIsLoading(true)
// 		setError(null)
// 	}

// 	useEffect(() => {
// 		const handleAuthResult = async () => {
// 			const success = searchParams.get('success')
// 			const errorMsg = searchParams.get('error')

// 			if (errorMsg) {
// 				setError(errorMsg)
// 				setIsLoading(false)
// 				return
// 			}

// 			if (success) {
// 				try {
// 					const response = await $api.get<{
// 						user: User
// 						accessToken: string
// 						refreshToken: string
// 					}>('/api/auth/data')

// 					const { user, accessToken, refreshToken } = response.data

// 					if (!user.id || !user.email || !user.provider) {
// 						throw new Error('Incomplete user data')
// 					}

// 					handleAuthSuccess({ user, accessToken, refreshToken })
// 					router.replace('/')
// 				} catch (error) {
// 					console.error('Failed to fetch auth data:', error)
// 					setError(error.response?.data?.error || 'Authentication failed')
// 					setIsLoading(false)
// 				}
// 			}
// 		}

// 		handleAuthResult()
// 	}, [searchParams, handleAuthSuccess, router])

// 	useEffect(() => {
// 		const handleEsc = (event: KeyboardEvent) => {
// 			if (event.key === 'Escape') {
// 				handleClose()
// 			}
// 		}
// 		window.addEventListener('keydown', handleEsc)
// 		return () => {
// 			window.removeEventListener('keydown', handleEsc)
// 		}
// 	}, [])

// 	return (
// 		<div className='fixed inset-0 bg-[#3486fe]/60 flex items-center justify-center z-50'>
// 			<div className='bg-white rounded-xl shadow-lg w-[582px] max-w-[90%] p-8 flex flex-col items-center space-y-8'>
// 				{/* Кнопка закрытия */}

// 				{/* Заголовок */}
// 				<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
// 					Welcome
// 				</h2>

// 				{/* Ошибка */}
// 				{error && (
// 					<div className='bg-red-100 text-red-700 p-4 rounded-lg w-full text-center animate-pulse'>
// 						{error}
// 					</div>
// 				)}

// 				<div>
// 					<h3 className='text-[18px] text-[#4f4f4f] text-center mb-4'>
// 						Log in with
// 					</h3>
// 					{isLoading ? (
// 						<div className='flex justify-center items-center'>
// 							<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3486fe]'></div>
// 						</div>
// 					) : (
// 						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
// 							{AUTH_LINK_ITEMS.map((item, index) => (
// 								<ButtonWithIcon
// 									key={index}
// 									text={item.name}
// 									icon={
// 										<Image
// 											src={item.icon}
// 											alt={`${item.name} logo`}
// 											width={32}
// 											height={32}
// 										/>
// 									}
// 									href={item.href}
// 									onClick={() => handleAuthClick(item.name)}
// 									className='flex items-center gap-4 p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-xl hover:bg-[#f7f7f7] hover:border-[#f9329c] transition-colors w-full justify-center'
// 								/>
// 							))}
// 						</div>
// 					)}
// 				</div>

// 				<ButtonWithIcon
// 					onClick={handleClose}
// 					className='text-[#4f4f4f] hover:text-gray-700'
// 					icon={<MdClose className='w-6 h-6' />}
// 				/>
// 			</div>
// 		</div>
// 	)
// }
