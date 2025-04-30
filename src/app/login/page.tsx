'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MdClose } from 'react-icons/md'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'
import { useModal } from '../helpers/contexts/modal-context'
import { ButtonWithIcon } from '../components/ui/button-with-icon'

interface AuthLinkItem {
	icon: string
	name: string
	href?: string /* временно, пока не настроим apple */
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

function SearchParamsHandler() {
	const searchParams = useSearchParams()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const errorMsg = searchParams.get('error')
		if (errorMsg) {
			setError(errorMsg)
		}
	}, [searchParams])

	return error ? (
		<div className='bg-red-100 text-red-700 p-4 rounded-lg w-full text-center animate-pulse'>
			{error}
		</div>
	) : null
}

export default function Login() {
	const router = useRouter()
	const { closeLoginModal } = useModal()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleClose = () => {
		closeLoginModal()
		router.replace(window.location.pathname)
	}

	const handleAuthClick = (provider: string) => {
		setIsLoading(true)
	}

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

				{/* Заголовок */}
				<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
					Welcome
				</h2>

				{/* Ошибка */}
				<Suspense fallback={<div>Loading...</div>}>
					<SearchParamsHandler />
				</Suspense>

				<div>
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

				<ButtonWithIcon
					onClick={handleClose}
					className='text-[#4f4f4f] hover:text-gray-700'
					icon={<MdClose className='w-6 h-6' />}
				/>
			</div>
		</div>
	)
}
