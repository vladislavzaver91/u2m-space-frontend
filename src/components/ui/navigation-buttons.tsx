'use client'

import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'
import { useAuth } from '@/helpers/contexts/auth-context'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

interface NavigationButtonsProps {
	activePage: string
}

export const NavigationButtons = ({ activePage }: NavigationButtonsProps) => {
	const { user, logout } = useAuth()
	const router = useRouter()
	const swiperRef = useRef<SwiperRef | null>(null)
	const tMyClassifieds = useTranslations('MyClassifieds')

	const BUTTONS = [
		{
			text: tMyClassifieds('buttons.myClassifieds'),
			path: `/my-classifieds`,
			iconName: 'note',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			type: 'myClassifieds',
		},
		{
			text: tMyClassifieds('buttons.favorites'),
			path: `/favorites`,
			iconName: 'heart',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			type: 'favorites',
		},
		{
			text: tMyClassifieds('buttons.profile'),
			path: null,
			iconName: 'user-card',
			className: 'max-w-fit px-4 h-10',
			activeBtnClass: 'max-w-fit px-4 h-10',
			iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
			type: 'profile',
		},
		{
			text: tMyClassifieds('buttons.logout'),
			path: null,
			iconName: null,
			className: 'max-w-fit px-4 h-10',
			iconWrapperClass: null,
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
		} else if (type === 'profile') {
			if (user && user.id) {
				router.push(`/profile/${user.id}`)
			} else {
				console.warn('User or user.id is missing')
				router.push(`/selling-classifieds`)
			}
		} else if (path) {
			router.push(path)
		}
	}

	useEffect(() => {
		if (swiperRef.current?.swiper) {
			const activeIndex = BUTTONS.findIndex(
				btn => btn.text.toLowerCase() === activePage.toLowerCase()
			)
		}
	}, [activePage])

	return (
		<div className='flex max-2-5xl:flex-wrap max-2-5xl:items-center max-2-5xl:justify-start max-sm:mb-4 max-sm:pl-0 max-sm:py-[11px] sm:pl-8 max-2-5xl:py-6 2-5xl:absolute 2-5xl:pl-32 2-5xl:flex-col gap-4'>
			<div className='navigation-btn block w-full sm:hidden'>
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
							<ButtonCustom
								text={btn.text}
								onClick={() =>
									handleBtnClick(btn.path, btn.type === 'logout', btn.type)
								}
								className={
									activePage.toLowerCase() === btn.text.toLowerCase() &&
									btn.type !== 'logout'
										? `min-w-full! rounded-lg text-white bg-[#3486fe]! ${btn.className}`
										: `min-w-full! border border-[#4f4f4f] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] ${btn.className}`
								}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			<div className='hidden sm:flex max-2-5xl:flex-wrap max-2-5xl:items-center max-2-5xl:justify-start 2-5xl:flex-col gap-4'>
				{BUTTONS.map((btn, index) => (
					<ButtonCustom
						key={index}
						text={btn.text}
						onClick={() =>
							handleBtnClick(btn.path, btn.type === 'logout', btn.type)
						}
						className={
							activePage.toLowerCase() === btn.text.toLowerCase() &&
							btn.type !== 'logout'
								? `flex flex-row-reverse items-center rounded-lg text-white bg-[#3486fe]! ${btn.activeBtnClass}`
								: `border border-[#4f4f4f] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] ${btn.className}`
						}
						iconWrapperClass={
							activePage.toLowerCase() === btn.text.toLowerCase() &&
							btn.iconName &&
							btn.type !== 'logout'
								? btn.iconWrapperClass
								: undefined
						}
						icon={
							activePage.toLowerCase() === btn.text.toLowerCase() &&
							btn.iconName &&
							btn.type !== 'logout' ? (
								<IconCustom
									name={btn.iconName}
									className='w-[18px] h-[18px] fill-none text-white'
								/>
							) : undefined
						}
					/>
				))}
			</div>
		</div>
	)
}
