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

	// Функция для обработки ошибки загрузки изображения
	const handleImageError = (
		e: React.SyntheticEvent<HTMLImageElement, Event>
	) => {
		e.currentTarget.src = '/avatar.png' // Локальный запасной аватар
	}

	return (
		<>
			<div className='fixed top-0 left-0 w-full flex items-center justify-between bg-white/10 backdrop-blur-md z-10'>
				<div
					className={`${
						isSearchVisible && 'max-lg:hidden'
					} px-4 md:px-8 py-3 md:py-7`}
				>
					<div className='block md:hidden'>
						<Logo width={48} height={32} isSmall={true} />
					</div>
					<div className='hidden md:block'>
						<Logo width={100} height={32} />
					</div>
				</div>

				{/* SearchInput в центре */}
				<div
					className={`relative w-full max-w-1/2 lg:max-w-[500px] xl:max-w-[770px] transition-all duration-300 ease-in-out ${
						isSearchVisible
							? 'opacity-100 translate-y-0'
							: 'max-lg:hidden opacity-0 -translate-y-4 pointer-events-none'
					}`}
				>
					<SearchInput className='lg:max-w-[770px]' disabled />
				</div>

				<div className='flex items-center justify-end'>
					{pathname !== '/' && (
						<>
							<div className='flex md:hidden'>
								<ButtonWithIcon
									icon={
										<Image
											src='/icons/add_plus.svg'
											alt='icon plus'
											width={24}
											height={24}
											className='fill-[#3486fe]'
										/>
									}
									className='p-4 min-w-[56px] w-fit'
								/>
							</div>
							<div className='hidden md:flex'>
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
							</div>
						</>
					)}
					{user ? (
						<>
							<div className='block md:hidden'>
								<ButtonWithIcon
									href='/my-space'
									icon={
										<Image
											src={user.avatarUrl || '/avatar.png'}
											alt={`${user.name} avatar`}
											width={32}
											height={32}
											onError={handleImageError}
											className='flex-row-reverse rounded-[13px] object-cover'
										/>
									}
									className='px-3 py-4 min-w-[64px] w-fit'
								/>
							</div>
							<div className='hidden md:block'>
								<ButtonWithIcon
									href='/my-space'
									text={user.name.charAt(0).toUpperCase()}
									icon={
										<Image
											src={user.avatarUrl || '/avatar.png'}
											alt={`${user.name} avatar`}
											width={32}
											height={32}
											onError={handleImageError}
											className='flex-row-reverse rounded-[13px] object-cover'
										/>
									}
									className='px-8 py-7 min-w-[148px] w-fit text-[#3486fe]'
								/>
							</div>
						</>
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
							className='p-4 min-w-[125px] w-fit md:p-8 md:min-w-[157px] md:w-fit'
						/>
					)}
				</div>
			</div>
			{isLoginModalOpen && <LoginModal />}
		</>
	)
}
