'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ButtonWithIcon } from './ui/button-with-icon'
import { Logo } from './ui/logo'
import { useAuth } from '../helpers/contexts/auth-context'
import { useModal } from '../helpers/contexts/modal-context'
import { LoginModal } from './login-modal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SearchInput } from './ui/search-input'
import { IconCustom } from './ui/icon-custom'

export const Header = () => {
	const { user } = useAuth()
	const { isLoginModalOpen, openLoginModal } = useModal()
	const pathname = usePathname()
	const router = useRouter()
	const [isSearchVisible, setIsSearchVisible] = useState(false)
	const [isMobile, setIsMobile] = useState<boolean>(false)

	const isMyClassifieds = pathname === '/my-classifieds'

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		handleResize() // Проверка при монтировании
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

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
			<div className='fixed px-4 md:px-8 min-h-14 md:min-h-[88px] py-3 md:py-7 top-0 left-0 w-full flex items-center bg-white/10 backdrop-blur-md z-10'>
				{/* Контент слева */}
				<div className={`${isSearchVisible && 'max-lg:hidden'}`}>
					<Logo width={100} height={32} inHeader={true} />
				</div>
				{isMyClassifieds && isMobile && (
					<span className='md:hidden text-[#4f4f4f] text-[18px] font-bold uppercase'>
						My space
					</span>
				)}

				{/* SearchInput в центре (не отображается на /my-classifieds при <768px) */}
				<div
					className={`absolute left-0 md:left-4 lg:left-1/2 lg:transform lg:-translate-x-1/2 w-full max-w-[500px] min-[1024px]:max-w-[430px] min-[1120px]:max-w-[500px] min-[1370px]:max-w-[770px] transition-all duration-300 ease-in-out ${
						isSearchVisible
							? 'opacity-100 translate-y-0'
							: 'md:opacity-0 md:-translate-y-4 md:pointer-events-none'
					} ${isMyClassifieds && isMobile ? 'hidden' : ''}`}
				>
					{isSearchVisible ? (
						<>
							<div className='md:hidden'>
								<SearchInput
									className='max-w-[600px]'
									smallWidth
									placeholder='Search'
								/>
							</div>
							<div className='max-md:hidden'>
								<SearchInput
									className='lg:max-w-[770px]'
									inputClass='bg-white'
									disabled
								/>
							</div>
						</>
					) : (
						<div className='md:hidden'>
							<SearchInput
								className='max-w-[200px] sm:max-w-[460px]'
								inputClass='pr-4!'
								smallWidth
								logoActive={true}
								placeholder='Search'
							/>
						</div>
					)}
				</div>

				{/* Контент справа */}
				<div className='flex items-center absolute top-0 right-0'>
					{isMyClassifieds && isMobile && (
						<ButtonWithIcon
							onClick={() => router.back()}
							iconWrapperClass='w-6 h-6 flex items-center justify-center'
							icon={
								<IconCustom
									name='close'
									className='w-4 h-4 text-[#4f4f4f] fill-none'
								/>
							}
							isHover
							className='md:hidden p-4 min-w-[56px] w-fit'
						/>
					)}
					{(!isMyClassifieds || !isMobile) && (
						<>
							{pathname !== '/' && (
								<>
									<div className='max-md:hidden flex lg:hidden'>
										<ButtonWithIcon
											iconWrapperClass='w-6 h-6'
											icon={
												<IconCustom
													name='add_plus'
													hover={true}
													className='w-6 h-6 text-[#3486fe] fill-none'
												/>
											}
											isHover
											className='p-4 md:p-8 min-w-[56px] w-fit'
										/>
									</div>
									<div className='hidden lg:flex'>
										<ButtonWithIcon
											text='Add'
											iconWrapperClass='w-6 h-6'
											icon={
												<IconCustom
													name='add_plus'
													hover={true}
													className='w-6 h-6 text-[#3486fe] fill-none'
												/>
											}
											isHover
											className='p-8 min-w-[139px] w-fit'
										/>
									</div>
								</>
							)}
							{user ? (
								<>
									<ButtonWithIcon
										iconWrapperClass='w-6 h-6'
										icon={
											<IconCustom
												name='add_plus'
												hover={true}
												className='w-6 h-6 text-[#3486fe] fill-none'
											/>
										}
										isHover
										className='md:hidden p-4 md:p-8 min-w-[56px] w-fit'
									/>
									<div className='flex md:hidden'>
										<ButtonWithIcon
											href='/my-classifieds'
											iconWrapperClass='w-8 h-8'
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
											isHover
											className='px-3 py-4 min-w-[64px] w-fit'
										/>
									</div>
									<div className='hidden md:flex'>
										<ButtonWithIcon
											href='/my-classifieds'
											text={user.name.charAt(0).toUpperCase()}
											iconWrapperClass='w-8 h-8'
											icon={
												<Image
													src={user.avatarUrl || '/avatar.png'}
													alt={`${user.name} avatar`}
													width={32}
													height={32}
													onError={handleImageError}
													className='rounded-[13px] object-cover'
												/>
											}
											isHover
											className='flex-row-reverse px-8 py-7 min-w-[148px] w-fit text-[#3486fe]'
										/>
									</div>
								</>
							) : (
								<ButtonWithIcon
									text='Log in'
									onClick={openLoginModal}
									iconWrapperClass='w-6 h-6'
									icon={
										<IconCustom
											name='user_square'
											hover={true}
											className='w-6 h-6 text-[#3486fe] fill-none'
										/>
									}
									isHover
									className='p-4 min-w-[125px] w-fit md:p-8 md:min-w-[157px] md:w-fit'
								/>
							)}
						</>
					)}
				</div>
			</div>
			{isLoginModalOpen && <LoginModal />}
		</>
	)
}
