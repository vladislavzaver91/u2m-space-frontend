'use client'

import { ButtonCustom } from './ui/button-custom'
import { Logo } from './ui/logo'
import { useAuth } from '../helpers/contexts/auth-context'
import { useModal } from '../helpers/contexts/modal-context'
import { LoginModal } from './login-modal'
import Image from 'next/image'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { SearchInput } from './ui/search-input'
import { IconCustom } from './ui/icon-custom'
import { LanguageModal } from './ui/language-modal'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import { useClassifiedForm } from '@/helpers/contexts/classified-form-context'
import { useRouter } from '@/i18n/routing'
import { useProfileForm } from '@/helpers/contexts/profile-form-context'
import { useUser } from '@/helpers/contexts/user-context'
import { useSearch } from '@/helpers/contexts/search-context'
import { FilterModal } from './ui/filter-modal'
import { IconBasicComponent } from './ui/icon-basic-component'
import { NotificationsModal } from './ui/notifications-modal'
import { useNotifications } from '@/helpers/contexts/notification-context'
import { useScreenResize } from '@/helpers/hooks/use-screen-resize'
import { is } from 'date-fns/locale'

export const Header = () => {
	const { authUser } = useAuth()
	const { user } = useUser()
	const { isLoginModalOpen, openLoginModal, openModal, isModalOpen } =
		useModal()
	const { isPublishDisabled, submitForm } = useClassifiedForm()
	const { isSubmitDisabled, submitForm: submitProfileForm } = useProfileForm()
	const {
		searchQuery,
		setSearchQuery,
		isFocused,
		setIsFocused,
		minPrice,
		maxPrice,
		tags,
		city,
		sortBy,
		sortOrder,
		priceRange,
		resetFilters,
	} = useSearch()
	const { notifications } = useNotifications()
	const { isMobile, isTablet } = useScreenResize()

	const pathname = usePathname()
	const locale = useLocale()
	const router = useRouter()

	const [isSearchVisible, setIsSearchVisible] = useState(false)
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
	const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)

	const filterDesktopButtonRef = useRef<HTMLButtonElement>(null)
	const filterTabletButtonRef = useRef<HTMLButtonElement>(null)
	const filterMobileButtonRef = useRef<HTMLButtonElement>(null)
	const notificationDesktopButtonRef = useRef<HTMLButtonElement>(null)
	const notificationTabletButtonRef = useRef<HTMLButtonElement>(null)
	const notificationMobileButtonRef = useRef<HTMLButtonElement>(null)

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
		`/${locale}/payment`,
		`/${locale}/rules`,
	]
	const isMySpaceLabel = mySpaceRoutes.some(route => pathname.startsWith(route))

	const isMyClassifiedsRoute = `/${locale}/my-classifieds`.startsWith(pathname)

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
		if (isProfileLabel && !user?.nickname) {
			return
		}
		if (isMyClassifiedsRoute) {
			router.push('/selling-classifieds')
		} else {
			router.back()
		}
	}

	// Устанавливаем hasNotifications на основе длины notifications из контекста
	const hasNotifications = notifications.length > 0

	// Обработчик клика на кнопку фильтров
	const handleFiltersClick = () => {
		setIsFilterModalOpen(prev => !prev)
	}

	// Обработчик клика на кнопку уведомлений
	const handleNotificationClick = () => {
		setIsNotificationModalOpen(prev => !prev)
	}

	// Обработчик закрытия фильтров и поиска
	const handleCloseAll = () => {
		setIsFilterModalOpen(false)
		setSearchQuery('')
		setIsFocused(false)
		resetFilters()
	}

	// Проверяем, выбраны ли какие-либо настройки фильтра
	const areFiltersApplied = useMemo(() => {
		return (
			(minPrice !== null &&
				priceRange !== null &&
				minPrice !== priceRange.convertedMin) ||
			(maxPrice !== null &&
				priceRange !== null &&
				maxPrice !== priceRange.convertedMax) ||
			(tags && tags.length > 0) ||
			city !== null ||
			sortBy !== 'createdAt' ||
			sortOrder !== 'desc'
		)
	}, [minPrice, maxPrice, tags, city, sortBy, sortOrder, priceRange])

	console.log('authUser', authUser)

	// Отслеживание прокрутки
	useLayoutEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY
			setIsSearchVisible(scrollPosition > 120) // Показывать SearchInput после 100px прокрутки
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	console.log('User avatar URL:', authUser?.avatarUrl)

	isFilterModalOpen && console.log('Filter modal is open')

	return (
		<>
			<div className='fixed mr-2 px-4 md:px-8 min-h-14 md:min-h-[88px] py-3 md:py-7 top-0 left-0 w-full flex items-center bg-white/75 backdrop-blur-2xl z-20'>
				{/* Контент слева */}
				{isMobile && isFilterModalOpen ? (
					<ButtonCustom
						onClick={handleCloseAll}
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
						className='absolute p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit'
					/>
				) : isMySpaceLabel ? (
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
					className={`absolute left-0 md:left-4 2xl:left-1/2 2xl:transform 2xl:-translate-x-1/2 w-full ${
						isFocused
							? 'max-[1023px]:min-w-full'
							: 'max-[1023px]:max-w-[500px] '
					} 
						min-[1024px]:max-w-[430px] min-[1120px]:max-w-[500px] min-[1370px]:max-w-[500px] min-[1669px]:max-w-[770px] transition-all duration-300 ease-in-out ${
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
								/>
							</div>
						</>
					) : (
						!isFilterModalOpen && (
							<div className='md:hidden'>
								<SearchInput
									className={`${
										isFocused ? 'min-w-full' : 'max-w-[200px] sm:max-w-[460px]'
									}`}
									inputClass='pr-4!'
									smallWidth
									logoActive={true}
									placeholder={tComponents('placeholders.search')}
								/>
							</div>
						)
					)}
				</div>

				{/* Контент справа */}
				{!shouldShowPublishBtn && !isProfileLabel && (
					<div className='flex items-center absolute top-0 right-0'>
						{isMobile && isFilterModalOpen ? (
							<ButtonCustom
								onClick={handleCloseAll}
								iconWrapperClass='w-6 h-6'
								icon={
									<IconCustom
										name='close'
										hover={true}
										hoverColor='#f9329c'
										className='w-6 h-6 text-[#3486FE] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
									/>
								}
								isHover
								className='p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit'
							/>
						) : (
							<>
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

								{/* filters */}
								{searchQuery && (
									<div className='hidden lg:flex'>
										<ButtonCustom
											ref={filterDesktopButtonRef}
											onClick={handleFiltersClick}
											text={tButtons('filters')}
											iconWrapperClass='relative flex items-center justify-center w-6 h-6'
											icon={
												areFiltersApplied ? (
													<IconBasicComponent name='filters-notify' iconThumb />
												) : (
													<IconCustom
														name='filters'
														hover={true}
														hoverColor='#f9329c'
														className={`w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c] ${
															isFilterModalOpen ? 'text-[#3486fe]!' : ''
														}`}
														aria-hidden='true'
													/>
												)
											}
											isHover
											className={`p-8 min-w-[157px] w-fit ${
												isFilterModalOpen ? 'bg-[#F7F7F7]!' : ''
											}`}
											aria-label={
												isFilterModalOpen
													? 'Close filter modal'
													: 'Open filter modal'
											}
											aria-expanded={isFilterModalOpen}
										/>
									</div>
								)}

								{/* notifications */}
								<div className='hidden lg:flex'>
									<ButtonCustom
										ref={notificationDesktopButtonRef}
										onClick={handleNotificationClick}
										text={tButtons('notifications')}
										iconWrapperClass='relative flex items-center justify-center w-6 h-6'
										icon={
											hasNotifications ? (
												<IconBasicComponent name='chat-notify' iconThumb />
											) : (
												<IconCustom
													name='chat'
													hover={true}
													hoverColor='#f9329c'
													className={`w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c] ${
														isNotificationModalOpen ? 'text-[#3486fe]!' : ''
													}`}
													aria-hidden='true'
												/>
											)
										}
										isHover
										className={`p-8 min-w-[157px] w-fit ${
											isNotificationModalOpen ? 'bg-[#F7F7F7]!' : ''
										}`}
										aria-label={
											isNotificationModalOpen
												? 'Close notifications modal'
												: 'Open notifications modal'
										}
										aria-expanded={isNotificationModalOpen}
									/>
								</div>

								{/* favorites & add */}
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

								{!isFocused && (
									<>
										{isMobile && (
											<>
												{/* filters */}
												{searchQuery && (
													<ButtonCustom
														ref={filterMobileButtonRef}
														onClick={handleFiltersClick}
														iconWrapperClass='relative flex items-center justify-center w-6 h-6'
														icon={
															areFiltersApplied ? (
																<IconBasicComponent
																	name='filters-notify'
																	iconThumb
																/>
															) : (
																<IconCustom
																	name='filters'
																	hover={true}
																	hoverColor='#f9329c'
																	className={`w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c] ${
																		isFilterModalOpen ? 'text-[#3486fe]!' : ''
																	}`}
																	aria-hidden='true'
																/>
															)
														}
														isHover
														className={`p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit ${
															isFilterModalOpen ? 'bg-[#F7F7F7]!' : ''
														}`}
														aria-label={
															isFilterModalOpen
																? 'Close filters modal'
																: 'Open filters modal'
														}
														aria-expanded={isFilterModalOpen}
													/>
												)}
												{/* notifications */}
												<ButtonCustom
													ref={notificationMobileButtonRef}
													onClick={handleNotificationClick}
													iconWrapperClass='relative flex items-center justify-center w-6 h-6'
													icon={
														hasNotifications ? (
															<IconBasicComponent
																name='chat-notify'
																iconThumb
															/>
														) : (
															<IconCustom
																name='chat'
																hover={true}
																hoverColor='#f9329c'
																className={`w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c] ${
																	isNotificationModalOpen
																		? 'text-[#3486fe]!'
																		: ''
																}`}
																aria-hidden='true'
															/>
														)
													}
													isHover
													className={`p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit ${
														isNotificationModalOpen ? 'bg-[#F7F7F7]!' : ''
													}`}
													aria-label={
														isNotificationModalOpen
															? 'Close notifications modal'
															: 'Open notifications modal'
													}
													aria-expanded={isNotificationModalOpen}
												/>
											</>
										)}

										{isTablet && (
											<>
												{/* filters */}
												{searchQuery && (
													<ButtonCustom
														ref={filterTabletButtonRef}
														onClick={handleFiltersClick}
														iconWrapperClass='relative flex items-center justify-center w-6 h-6'
														icon={
															areFiltersApplied ? (
																<IconBasicComponent
																	name='filters-notify'
																	iconThumb
																/>
															) : (
																<IconCustom
																	name='filters'
																	hover={true}
																	hoverColor='#f9329c'
																	className={`w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c] ${
																		isFilterModalOpen ? 'text-[#3486fe]!' : ''
																	}`}
																	aria-hidden='true'
																/>
															)
														}
														isHover
														className={`p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit ${
															isFilterModalOpen ? 'bg-[#F7F7F7]!' : ''
														}`}
														aria-label={
															isFilterModalOpen
																? 'Close filters modal'
																: 'Open filters modal'
														}
														aria-expanded={isFilterModalOpen}
													/>
												)}
												{/* notifications */}
												<ButtonCustom
													ref={notificationTabletButtonRef}
													onClick={handleNotificationClick}
													iconWrapperClass='relative flex items-center justify-center w-6 h-6'
													icon={
														hasNotifications ? (
															<IconBasicComponent
																name='chat-notify'
																iconThumb
															/>
														) : (
															<IconCustom
																name='chat'
																hover={true}
																hoverColor='#f9329c'
																className={`w-6 h-6 text-[#3486fe] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c] ${
																	isNotificationModalOpen
																		? 'text-[#3486fe]!'
																		: ''
																}`}
																aria-hidden='true'
															/>
														)
													}
													isHover
													className={`p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit ${
														isNotificationModalOpen ? 'bg-[#F7F7F7]!' : ''
													}`}
													aria-label={
														isNotificationModalOpen
															? 'Close notifications modal'
															: 'Open notifications modal'
													}
													aria-expanded={isNotificationModalOpen}
												/>
											</>
										)}

										<div className='flex lg:hidden'>
											{/* favorites */}
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
											{/* add */}
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
												className='p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit'
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
									</>
								)}
								{/* аватарка пользователя */}
								<div className='hidden md:flex'>
									<ButtonCustom
										href={`/my-classifieds`}
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
			{isFilterModalOpen && (
				<FilterModal
					isOpen={isFilterModalOpen}
					onClose={() => setIsFilterModalOpen(false)}
					buttonRef={
						isMobile
							? filterMobileButtonRef
							: isTablet
							? filterTabletButtonRef
							: filterDesktopButtonRef
					}
				/>
			)}
			{authUser && authUser.id && (
				<NotificationsModal
					isOpen={isNotificationModalOpen}
					onClose={() => setIsNotificationModalOpen(false)}
					userId={authUser.id}
					buttonRef={
						isMobile
							? notificationMobileButtonRef
							: isTablet
							? notificationTabletButtonRef
							: notificationDesktopButtonRef
					}
				/>
			)}
		</>
	)
}
