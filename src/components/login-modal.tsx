'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ButtonCustom } from './ui/button-custom'
import { AuthLinkItem } from '../types'
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

	const AUTH_LINK_ITEMS: AuthLinkItem[] = [
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

	const handleAuthClick = (provider: string) => {
		setIsLoading(true)
		setError(null)
		if (provider === 'Google') {
			logout()
		}
	}

	useEffect(() => {
		const errorMsg = searchParams.get('error')
		const success = searchParams.get('success')

		if (errorMsg) {
			setError(errorMsg)
			setIsLoading(false)
		} else if (!success && isLoading) {
			// Если нет успеха и загрузка активна, сбрасываем и закрываем
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

						<div className='relative w-full min-h-[64px] flex items-center justify-center'>
							{isLoading ? (
								<Loader />
							) : (
								<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full'>
									{AUTH_LINK_ITEMS.map((item, index) => (
										<ButtonCustom
											key={index}
											text={item.name}
											icon={
												<img
													src={item.icon}
													alt={`${item.name} logo`}
													width={32}
													height={32}
												/>
											}
											href={item.href}
											onClick={() => handleAuthClick(item.name)}
											isHover
											className='flex items-center gap-4 p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-xl hover:border-[#f9329c] transition-colors min-w-[162px] w-fit h-[64px]'
										/>
									))}
								</div>
							)}
						</div>
					</div>

					<ButtonCustom
						onClick={handleClose}
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='close'
								className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
								hover={true}
								hoverColor='#f9329c'
							/>
						}
						isHover
						className='w-10 h-10 flex items-center justify-center rounded-lg'
					/>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}
