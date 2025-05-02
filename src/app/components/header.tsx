'use client'

import { usePathname } from 'next/navigation'
import { ButtonWithIcon } from './ui/button-with-icon'
import { Logo } from './ui/logo'
import { useAuth } from '../helpers/contexts/auth-context'
import { useModal } from '../helpers/contexts/modal-context'
import { LoginModal } from './login-modal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SearchInput } from './ui/search-input'

export const Header = () => {
	const { user } = useAuth()
	const { isLoginModalOpen, openLoginModal } = useModal()
	const pathname = usePathname()
	const [isSearchVisible, setIsSearchVisible] = useState(false)

	// Отслеживание прокрутки
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY
			setIsSearchVisible(scrollPosition > 120) // Показывать SearchInput после 100px прокрутки
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<>
			<div className='fixed top-0 left-0 w-full px-8 py-7 flex items-center justify-between bg-white/10 backdrop-blur-md z-10'>
				<Logo width={100} height={32} />

				{/* SearchInput в центре */}
				<div
					className={`absolute left-1/2 transform -translate-x-1/2 w-full flex justify-center transition-all duration-300 ease-in-out ${
						isSearchVisible
							? 'opacity-100 translate-y-0'
							: 'opacity-0 -translate-y-4 pointer-events-none'
					}`}
				>
					<SearchInput className='max-w-[770px]' disabled />
				</div>

				<div className='flex items-center absolute top-0 right-0'>
					{pathname !== '/' && (
						<ButtonWithIcon
							text='Add'
							icon={
								<Image
									src='/icons/add_plus.svg'
									alt='icon plus'
									width={24}
									height={24}
									className='fill-[#3486fe]'
								/>
							}
							className='p-8 min-w-[139px] w-fit'
						/>
					)}
					{user ? (
						<ButtonWithIcon
							href='/my-space'
							text={user.name.charAt(0).toUpperCase()}
							icon={
								<Image
									src={user.avatarUrl || '/avatar.png'}
									alt={`${user.name} avatar`}
									width={32}
									height={32}
									className='rounded-[13px] object-cover'
								/>
							}
							className='px-8 py-7 min-w-[148px] w-fit text-[#3486fe]'
						/>
					) : (
						<ButtonWithIcon
							text='Log in'
							onClick={openLoginModal}
							icon={
								<Image
									src='/icons/user_square.svg'
									alt='user icon'
									width={24}
									height={24}
									className='fill-[#3486fe]'
								/>
							}
							className='p-8 min-w-[157px] w-fit'
						/>
					)}
				</div>
			</div>
			{isLoginModalOpen && <LoginModal />}
		</>
	)
}
