'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Loader } from './ui/loader'
import { useModal } from '../helpers/contexts/modal-context'
import { IconCustom } from './ui/icon-custom'
import { useAuth } from '../helpers/contexts/auth-context'
import { useLocale, useTranslations } from 'next-intl'

export const LoginModal = () => {
	const router = useRouter()
	const { logout } = useAuth()
	const searchParams = useSearchParams()
	const { closeLoginModal } = useModal()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const tLoginModal = useTranslations('LoginModal')
	const locale = useLocale()

	const AUTH_LINK_ITEMS = [
		{
			icon: '/icons/facebook.svg',
			name: 'Facebook',
			href: `${
				process.env.NEXT_PUBLIC_API_URL
			}/api/auth/facebook?locale=${encodeURIComponent(locale)}`,
		},
		{
			icon: '/icons/apple.svg',
			name: 'Apple',
			// href: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/apple?locale=${encodeURIComponent(locale)}`,
		},
		{
			icon: '/icons/google.svg',
			name: 'Google',
			href: `${
				process.env.NEXT_PUBLIC_API_URL
			}/api/auth/google?prompt=${encodeURIComponent(
				'select_account'
			)}&locale=${encodeURIComponent(locale)}`,
		},
	]

	const handleClose = () => {
		closeLoginModal()
		setIsLoading(false)
		router.replace(window.location.pathname)
	}

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			handleClose()
		}
	}

	const handleAuthClick = (href: string, provider: string) => {
		console.log('Auth provider clicked:', { provider, href })
		setIsLoading(true)
		setError(null)
		if (provider === 'Google') {
			logout()
		}
		if (href && href.startsWith('http')) {
			router.push(href) // Navigate in the same tab
		} else {
			console.log('Invalid href:', { href })
			setIsLoading(false)
			setError('Invalid authentication URL.')
		}
	}

	useEffect(() => {
		console.log('AUTH_LINK_ITEMS:', AUTH_LINK_ITEMS)
		const errorMsg = searchParams.get('error')
		const success = searchParams.get('success')

		if (errorMsg) {
			setError(errorMsg)
			setIsLoading(false)
		} else if (!success && isLoading) {
			const timeout = setTimeout(() => {
				setIsLoading(false)
				setError('Authorization failed. Please try again.')
				handleClose()
			}, 10000)
			return () => clearTimeout(timeout)
		} else if (success) {
			setIsLoading(false)
			handleClose()
		}
	}, [searchParams, isLoading])

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
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				className='fixed inset-0 bg-[#3486fe]/60 flex items-center justify-center z-50 px-[22px]'
				onClick={handleOverlayClick}
			>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='bg-white rounded-xl shadow-lg w-[582px] max-w-full p-8 flex flex-col items-center space-y-8'
				>
					<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
						{tLoginModal('welcome')}
					</h2>

					{error && (
						<div className='bg-red-100 text-red-700 p-4 rounded-lg w-full text-center animate-pulse'>
							{error}
						</div>
					)}

					<div>
						<h3 className='text-[18px] text-[#4f4f4f] text-center mb-4'>
							{tLoginModal('logInWith')}
						</h3>

						<div className='relative w-full min-h-[64px] flex flex-col items-center justify-center'>
							{isLoading ? (
								<Loader />
							) : (
								<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-sm:justify-items-center'>
									{AUTH_LINK_ITEMS.map((item, index) =>
										item.href ? (
											<a
												key={index}
												href={item.href}
												className='flex items-center justify-center gap-4 p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-xl hover:border-[#f9329c] transition-colors min-w-[162px] h-[64px] select-none'
												onClick={e => {
													e.preventDefault() // Prevent default <a> navigation
													handleAuthClick(item.href, item.name)
												}}
											>
												<span className='flex-shrink-0 w-8 h-8'>
													<img
														src={item.icon}
														alt={`${item.name} logo`}
														width={32}
														height={32}
														className='w-full h-full object-contain'
													/>
												</span>
												<span className='truncate'>{item.name}</span>
											</a>
										) : (
											<div
												key={index}
												className='flex items-center justify-center gap-4 p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-xl opacity-50 cursor-not-allowed min-w-[162px] h-[64px] select-none'
											>
												<span className='flex-shrink-0 w-8 h-8'>
													<img
														src={item.icon}
														alt={`${item.name} logo`}
														width={32}
														height={32}
														className='w-full h-full object-contain'
													/>
												</span>
												<span className='truncate'>{item.name}</span>
											</div>
										)
									)}
								</div>
							)}
						</div>
					</div>

					<button
						onClick={handleClose}
						className='w-10 h-10 cursor-pointer flex items-center justify-center rounded-lg hover:bg-[#F7F7F7] transition-colors'
					>
						<IconCustom
							name='close'
							className='w-6 h-6 fill-none text-[#4f4f4f] hover:text-[#f9329c]'
							hover={true}
							hoverColor='#f9329c'
						/>
					</button>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}
