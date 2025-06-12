'use client'

import { ButtonCustom } from './ui/button-custom'
import { Logo } from './ui/logo'
import { useAuth } from '../helpers/contexts/auth-context'
import { useModal } from '../helpers/contexts/modal-context'
import { LoginModal } from './login-modal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SearchInput } from './ui/search-input'
import { IconCustom } from './ui/icon-custom'
import { LanguageModal } from './ui/language-modal'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import { useClassifiedForm } from '@/helpers/contexts/classified-form-context'
import { useRouter } from '@/i18n/routing'
import { useProfileForm } from '@/helpers/contexts/profile-form-context'
import { useUser } from '@/helpers/contexts/user-context'

export const Header = () => {
	const { authUser } = useAuth()
	const { user } = useUser()
	const { isLoginModalOpen, openLoginModal, openModal, isModalOpen } =
		useModal()
	const { isPublishDisabled, submitForm } = useClassifiedForm()
	const { isSubmitDisabled, submitForm: submitProfileForm } = useProfileForm()
	const pathname = usePathname()
	const locale = useLocale()
	const router = useRouter()
	const [isSearchVisible, setIsSearchVisible] = useState(false)
	const [isMobile, setIsMobile] = useState<boolean>(false)
	const tButtons = useTranslations('Buttons')
	const tComponents = useTranslations('Components')
	const { id } = useParams<{ id: string }>()

	const mySpaceRoutes = [
		`/${locale}/selling-classifieds/${id}`,
		`/${locale}/my-classifieds`,
		`/${locale}/classifieds-create`,
		`/${locale}/classifieds-edit`,
		`/${locale}/favorites`,
		`/${locale}/profile/${id}`,
	]
	const isMySpaceLabel = mySpaceRoutes.some(route => pathname.startsWith(route))

	const addClassifiedsRoutes = [
		`/${locale}/classifieds-create`,
		`/${locale}/classifieds-edit`,
	]
	const shouldShowPublishBtn = addClassifiedsRoutes.some(route =>
		pathname.startsWith(route)
	)

	const profileRoute = `/${locale}/profile/${id}`
	const isProfileLabel = pathname.startsWith(profileRoute)

	const handleBack = () => {
		router.push(`/selling-classifieds`)
	}

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		handleResize() // Проверка при монтировании
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	console.log('authUser', authUser)

	// Отслеживание прокрутки
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY
			setIsSearchVisible(scrollPosition > 120) // Показывать SearchInput после 100px прокрутки
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	console.log('User avatar URL:', authUser?.avatarUrl)

	return (
		<>
			<div className='fixed mr-2 px-4 md:px-8 min-h-14 md:min-h-[88px] py-3 md:py-7 top-0 left-0 w-full flex items-center bg-white/75 backdrop-blur-2xl z-20'>
				{/* Контент слева */}
				{isMySpaceLabel ? (
					<div className='absolute left-0 top-0'>
						<ButtonCustom
							onClick={handleBack}
							text={tButtons('back')}
							iconWrapperClass='w-6 h-6'
							icon={
								<IconCustom
									name='arrow-prev'
									hover={true}
									hoverColor='#f9329c'
									className='w-6 h-6 text-[#3486FE] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
								/>
							}
							isHover
							className='flex h-[56px] md:h-[88px] items-center w-full max-md:px-4 py-2 md:p-8'
						/>
					</div>
				) : (
					<div className={`${isSearchVisible && 'max-lg:hidden'}`}>
						<Logo width={100} height={32} inHeader={true} />
					</div>
				)}

				{/* SearchInput в центре (не отображается на /my-classifieds при <768px) */}
				<div
					className={`absolute left-0 md:left-4 2xl:left-1/2 2xl:transform 2xl:-translate-x-1/2 w-full max-w-[500px] min-[1024px]:max-w-[430px] min-[1120px]:max-w-[500px] min-[1370px]:max-w-[500px] min-[1669px]:max-w-[770px] transition-all duration-300 ease-in-out ${
						isSearchVisible
							? 'opacity-100 translate-y-0'
							: 'md:opacity-0 md:-translate-y-4 md:pointer-events-none'
					} ${isMySpaceLabel && isMobile ? 'hidden' : ''}`}
				>
					{isSearchVisible ? (
						<>
							<div className='md:hidden'>
								<SearchInput
									className='max-w-[600px]'
									smallWidth
									placeholder={tComponents('placeholders.search')}
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
								placeholder={tComponents('placeholders.search')}
							/>
						</div>
					)}
				</div>

				{/* Контент справа */}
				{!shouldShowPublishBtn && !isProfileLabel && (
					<div className='flex items-center absolute top-0 right-0'>
						{/* все страницы без авторизации */}
						{pathname !== `/` && !authUser && (
							<>
								<div className='hidden md:flex lg:hidden'>
									{!isSearchVisible && (
										<ButtonCustom
											onClick={openModal}
											iconWrapperClass='w-6 h-6'
											icon={
												<IconCustom
													name='globe'
													hover={true}
													hoverColor='#f9329c'
													className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
												/>
											}
											isHover
											className='p-4 md:p-8 min-w-[88px] w-fit'
										/>
									)}

									<ButtonCustom
										onClick={openLoginModal}
										iconWrapperClass='w-6 h-6'
										icon={
											<IconCustom
												name='add_plus'
												hover={true}
												hoverColor='#f9329c'
												className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
											/>
										}
										isHover
										className='p-4 md:p-8 min-w-[88px] w-fit'
									/>
								</div>
								<div className='hidden lg:flex'>
									{!isSearchVisible && (
										<ButtonCustom
											onClick={openModal}
											iconWrapperClass='w-6 h-6'
											icon={
												<IconCustom
													name='globe'
													hover={true}
													hoverColor='#f9329c'
													className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
												/>
											}
											isHover
											className='p-4 md:p-8 min-w-[88px] w-fit'
										/>
									)}

									<ButtonCustom
										onClick={openLoginModal}
										text={tButtons('add')}
										iconWrapperClass='w-6 h-6'
										icon={
											<IconCustom
												name='add_plus'
												hover={true}
												hoverColor='#f9329c'
												className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
											/>
										}
										isHover
										className='p-8 min-w-[139px] w-fit'
									/>
								</div>
							</>
						)}
						{/* с авторизацией */}
						{authUser ? (
							<>
								{/* language */}
								{!isSearchVisible && (
									<ButtonCustom
										onClick={openModal}
										iconWrapperClass='w-6 h-6'
										icon={
											<IconCustom
												name='globe'
												hover={true}
												hoverColor='#f9329c'
												className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
											/>
										}
										isHover
										className='max-md:hidden flex p-8 min-w-[88px] w-fit'
									/>
								)}

								{/* favorites */}
								<div className='hidden lg:flex'>
									<ButtonCustom
										href={`/favorites/`}
										text={tButtons('favorites')}
										iconWrapperClass='relative flex items-center justify-center w-6 h-6'
										icon={
											<>
												<IconCustom
													name='heart'
													hover={true}
													hoverColor='#f9329c'
													className='w-[21px] h-[18px] text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
												/>
												{user?.favorites && user?.favorites?.length > 0 && (
													<span className='absolute top-0 right-0 w-2 h-2 border-2 border-white rounded-full bg-[#F9329C]' />
												)}
											</>
										}
										isHover
										className='p-8 min-w-[181px] w-fit'
									/>
									<ButtonCustom
										href={`/classifieds-create/`}
										text={tButtons('add')}
										iconWrapperClass='w-6 h-6'
										icon={
											<IconCustom
												name='add_plus'
												hover={true}
												hoverColor='#f9329c'
												className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
											/>
										}
										isHover
										className='p-8 min-w-[139px] w-fit'
									/>
								</div>

								<div className='flex lg:hidden'>
									<ButtonCustom
										href={`/favorites/`}
										iconWrapperClass='relative flex items-center justify-center w-6 h-6'
										icon={
											<>
												<IconCustom
													name='heart'
													hover={true}
													hoverColor='#f9329c'
													className='w-[21px] h-[18px] text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
												/>
												{user?.favorites && user?.favorites?.length > 0 && (
													<span className='absolute top-0 right-0 w-2 h-2 border-2 border-white rounded-full bg-[#F9329C]' />
												)}
											</>
										}
										isHover
										className='p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit'
									/>
									<ButtonCustom
										href={`/classifieds-create/`}
										iconWrapperClass='w-6 h-6'
										icon={
											<IconCustom
												name='add_plus'
												hover={true}
												hoverColor='#f9329c'
												className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
											/>
										}
										isHover
										className='p-4 min-w-[56px] w-fit'
									/>
								</div>

								<div className='flex md:hidden'>
									<ButtonCustom
										href={`/my-classifieds/`}
										iconWrapperClass='w-8 h-8'
										icon={
											<Image
												src={authUser.avatarUrl || '/avatar-lg.png'}
												alt={`${authUser.name} avatar`}
												width={32}
												height={32}
												priority
												unoptimized
												onError={e => {
													const defaultAvatarUrl =
														process.env.NEXT_PUBLIC_ENVIRONMENT_URL ===
														'develop'
															? 'http://localhost:3000/public/avatar-lg.png'
															: 'https://u2m-space-frontend.vercel.app/public/avatar-lg.png'
													e.currentTarget.src = defaultAvatarUrl
													console.log(
														'Fallback to default avatar URL:',
														e.currentTarget.src
													)
												}}
												className='flex-row-reverse rounded-[13px] object-cover'
											/>
										}
										isHover
										className='p-3 min-w-[56px] w-fit'
									/>
								</div>
								<div className='hidden md:flex'>
									<ButtonCustom
										href={`/my-classifieds/`}
										textParts={[
											{ text: 'U ', color: '[#f9329c]' },
											{ text: '33', color: '[#3486fe]' },
										]}
										iconWrapperClass='w-8 h-8'
										icon={
											<Image
												src={authUser.avatarUrl || '/avatar-lg.png'}
												alt={`${authUser.name} avatar`}
												width={32}
												height={32}
												priority
												unoptimized
												onError={e => {
													const defaultAvatarUrl =
														process.env.NEXT_PUBLIC_ENVIRONMENT_URL ===
														'develop'
															? 'http://localhost:3000/public/avatar-lg.png'
															: 'https://u2m-space-frontend.vercel.app/public/avatar-lg.png'
													e.currentTarget.src = defaultAvatarUrl
													console.log(
														'Fallback to default avatar URL:',
														e.currentTarget.src
													)
												}}
												className='rounded-[13px] object-cover'
											/>
										}
										isHover
										className='flex-row-reverse px-8 py-7 min-w-[148px] w-fit text-[#3486fe]'
									/>
								</div>
							</>
						) : (
							// без авторизации правый край хедера
							<ButtonCustom
								text={tButtons('login')}
								onClick={openLoginModal}
								iconWrapperClass='w-6 h-6'
								icon={
									<IconCustom
										name='user_square'
										hover={true}
										hoverColor='#f9329c'
										className='w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
									/>
								}
								isHover
								className='p-4 min-w-[125px] w-fit md:p-8 md:min-w-[157px] md:w-fit'
							/>
						)}
					</div>
				)}

				{/* кнопка Publish на страницах /create & /edit classifieds */}
				{shouldShowPublishBtn && (
					<div className='flex items-center absolute top-0 right-0'>
						<ButtonCustom
							onClick={submitForm}
							disabled={isPublishDisabled}
							text={tButtons('publish')}
							isHover
							textClass={`${
								isPublishDisabled ? 'bg-[#bdbdbd]' : 'bg-[#6FCF97]'
							} h-10 px-4  text-white text-[16px] font-bold rounded-lg flex items-center justify-center`}
							className='w-full px-4 md:px-8 py-2 md:py-6 text-white'
						/>
					</div>
				)}

				{/* кнопка Save на странице /profile */}
				{isProfileLabel && (
					<div className='flex items-center absolute top-0 right-0'>
						<ButtonCustom
							onClick={submitProfileForm}
							disabled={isSubmitDisabled}
							text={tButtons('save')}
							isHover
							textClass={`${
								isSubmitDisabled ? 'bg-[#bdbdbd]' : 'bg-[#6FCF97]'
							} h-10 px-4  text-white text-[16px] font-bold rounded-lg flex items-center justify-center`}
							className='w-full px-4 md:px-8 py-2 md:py-6 text-white'
						/>
					</div>
				)}
			</div>
			{isLoginModalOpen && <LoginModal />}
			{isModalOpen && <LanguageModal />}
		</>
	)
}
