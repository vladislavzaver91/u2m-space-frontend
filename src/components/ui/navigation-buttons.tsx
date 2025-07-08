'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'
import { useAuth } from '@/helpers/contexts/auth-context'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { useUser } from '@/helpers/contexts/user-context'

interface NavigationButtonsProps {
	activePage: string
	setNicknameError?: (error: string) => void
}

export const NavigationButtons = ({
	activePage,
	setNicknameError,
}: NavigationButtonsProps) => {
	const { authUser, logout } = useAuth()
	const { user } = useUser()
	const router = useRouter()

	const [isMobile, setIsMobile] = useState(false)

	const swiperRef = useRef<SwiperRef | null>(null)

	const tMyClassifieds = useTranslations('MyClassifieds')
	const tProfile = useTranslations('Profile')

	useEffect(() => {
		console.log('authUser nickname', authUser)
	}, [])

	const BUTTONS = [
		{
			text: tMyClassifieds('buttons.myClassifieds'),
			path: `/my-classifieds`,
			iconName: 'note',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			iconSize: 'w-[18px] h-[18px]',
			type: 'myClassifieds',
		},
		{
			text: tMyClassifieds('buttons.review'),
			path: `/my-classifieds`,
			iconName: 'dummy-circle-small',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			iconSize: 'w-6 h-6',
			type: 'review',
		},
		{
			text: tMyClassifieds('buttons.favorites'),
			path: `/favorites`,
			iconName: 'heart',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			iconSize: 'w-[18px] h-[18px]',
			type: 'favorites',
		},
		{
			text: tMyClassifieds('buttons.payment'),
			path: `/payment`,
			iconName: 'credit-card',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			iconSize: 'w-[18px] h-[18px]',
			type: 'payment',
		},
		{
			text: tMyClassifieds('buttons.profile'),
			path: null,
			iconName: 'user-card',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			iconSize: 'w-[18px] h-[18px]',
			type: 'profile',
		},
		{
			text: tMyClassifieds('buttons.logout'),
			path: null,
			iconName: null,
			className: 'max-w-fit px-4 h-10',
			iconWrapperClass: undefined,
			type: 'logout',
		},
	]

	const handleBtnClick = (
		path: string | null,
		isLogout: boolean,
		type: string
	) => {
		if (isLogout) {
			logout()
		} else if (!user?.nickname && type !== 'logout') {
			setNicknameError?.(
				tProfile('informationFormInputs.errorNicknameRequired')
			)
			return
		} else if (type === 'profile') {
			if (authUser && authUser.id) {
				router.push(`/profile/${authUser.id}`)
			} else {
				console.warn('User or user.id is missing')
				router.push(`/selling-classifieds`)
			}
		} else if (path) {
			router.push(path)
		}
	}

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		if (swiperRef.current?.swiper) {
			const activeIndex = BUTTONS.findIndex(
				btn => btn.text.toLowerCase() === activePage.toLowerCase()
			)
		}
	}, [activePage])

	return (
		<div className='flex max-2-5xl:flex-wrap max-2-5xl:items-center max-2-5xl:justify-start max-sm:mb-4 max-[880px]:pl-0 max-sm:py-[11px] min-[880px]:pl-8 max-2-5xl:py-6 2-5xl:fixed 2-5xl:pl-40! 2-5xl:flex-col gap-4'>
			<div className='navigation-btn-slider block w-full lg:hidden'>
				<Swiper
					slidesPerView='auto'
					spaceBetween={16}
					grabCursor={true}
					speed={500}
					freeMode={true}
					touchRatio={1.5}
					touchReleaseOnEdges
					slidesOffsetBefore={16}
					slidesOffsetAfter={16}
					className='select-none w-full h-auto'
					ref={swiperRef}
					breakpoints={{
						320: {
							slidesPerView: 'auto',
							spaceBetween: 16,
							slidesOffsetBefore: 16,
							slidesOffsetAfter: 16,
						},
					}}
				>
					{BUTTONS.map((btn, index) => (
						<SwiperSlide
							key={index}
							className={`transition-transform duration-300 select-none`}
						>
							{isMobile ? (
								<ButtonCustom
									text={btn.text}
									onClick={() =>
										handleBtnClick(btn.path, btn.type === 'logout', btn.type)
									}
									className={
										activePage.toLowerCase() === btn.text.toLowerCase() &&
										btn.type !== 'logout' &&
										btn.type !== 'review'
											? `min-w-full! rounded-lg text-white bg-[#3486fe]! ${btn.className}`
											: `min-w-full! border border-[#4f4f4f] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] ${btn.className}`
									}
								/>
							) : (
								<ButtonCustom
									key={index}
									text={btn.text}
									onClick={() =>
										handleBtnClick(btn.path, btn.type === 'logout', btn.type)
									}
									className={
										activePage.toLowerCase() === btn.text.toLowerCase() &&
										btn.type !== 'logout' &&
										btn.type !== 'review'
											? `flex flex-row-reverse items-center rounded-lg text-white bg-[#3486fe]! ${btn.activeBtnClass}`
											: `${
													btn.type === 'review' &&
													'flex flex-row-reverse items-center'
											  } border border-[#4f4f4f] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] ${
													btn.className
											  }`
									}
									iconWrapperClass={
										(activePage.toLowerCase() === btn.text.toLowerCase() &&
											btn.iconName !== null &&
											btn.type !== 'logout') ||
										btn.type === 'review'
											? btn.iconWrapperClass
											: undefined
									}
									icon={
										(activePage.toLowerCase() === btn.text.toLowerCase() &&
											btn.iconName !== null &&
											btn.type !== 'logout') ||
										btn.type === 'review' ? (
											<IconCustom
												name={btn.iconName as string}
												className={`${btn.iconSize} fill-none text-white`}
											/>
										) : undefined
									}
								/>
							)}
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			<div className='hidden lg:flex max-2-5xl:flex-wrap max-2-5xl:items-center max-2-5xl:justify-start 2-5xl:flex-col gap-4'>
				{BUTTONS.map((btn, index) => (
					<ButtonCustom
						key={index}
						text={btn.text}
						onClick={() =>
							handleBtnClick(btn.path, btn.type === 'logout', btn.type)
						}
						className={
							activePage.toLowerCase() === btn.text.toLowerCase() &&
							btn.type !== 'logout' &&
							btn.type !== 'review'
								? `flex flex-row-reverse items-center rounded-lg text-white bg-[#3486fe]! ${btn.activeBtnClass}`
								: `${
										btn.type === 'review' &&
										'flex flex-row-reverse items-center'
								  } border border-[#4f4f4f] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] ${
										btn.className
								  }`
						}
						iconWrapperClass={
							(activePage.toLowerCase() === btn.text.toLowerCase() &&
								btn.iconName !== null &&
								btn.type !== 'logout') ||
							btn.type === 'review'
								? btn.iconWrapperClass
								: undefined
						}
						icon={
							(activePage.toLowerCase() === btn.text.toLowerCase() &&
								btn.iconName !== null &&
								btn.type !== 'logout') ||
							btn.type === 'review' ? (
								<IconCustom
									name={btn.iconName as string}
									className={`${btn.iconSize} fill-none text-white`}
								/>
							) : undefined
						}
					/>
				))}
			</div>
		</div>
	)
}
