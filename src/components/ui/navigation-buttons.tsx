'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'
import { useAuth } from '@/helpers/contexts/auth-context'

interface NavigationButtonsProps {
	activePage: string
}

const BUTTONS = [
	{
		text: 'My Classifieds',
		path: '/my-classifieds',
		iconName: 'note',
		className: 'w-fit min-w-[151px] h-10',
		activeBtnClass: 'w-fit min-w-[183px] h-10',
		iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
	},
	{
		text: 'Favorites',
		path: '/favorites',
		iconName: 'heart',
		className: 'w-fit min-w-[109px] h-10',
		activeBtnClass: 'w-fit min-w-[141px] h-10',
		iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
	},
	{
		text: 'Profile',
		path: null,
		iconName: 'user-card',
		className: 'w-fit min-w-[87px] h-10',
		activeBtnClass: 'w-fit min-w-[119px] h-10',
		iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
	},
	{
		text: 'Logout',
		path: null,
		iconName: null,
		className: 'w-fit min-w-[92px] h-10',
		iconWrapperClass: null,
	},
]

export const NavigationButtons = ({ activePage }: NavigationButtonsProps) => {
	const { user, logout } = useAuth()
	const router = useRouter()
	const swiperRef = useRef<SwiperRef | null>(null)

	const handleBtnClick = (
		path: string | null,
		isLogout: boolean,
		text: string
	) => {
		if (isLogout) {
			logout()
		} else if (text === 'Profile') {
			if (user && user.id) {
				router.push(`/profile/${user.id}`)
			} else {
				console.warn('User or user.id is missing')
				router.push('/selling-classifieds')
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
							className={`${btn.className} transition-transform duration-300 select-none`}
						>
							<ButtonCustom
								text={btn.text}
								onClick={() =>
									handleBtnClick(btn.path, btn.text === 'Logout', btn.text)
								}
								className={
									activePage.toLowerCase() === btn.text.toLowerCase() &&
									btn.text !== 'Logout'
										? `flex items-center justify-center rounded-lg text-white bg-[#3486fe]! ${btn.className}`
										: `flex items-center justify-center border border-[#4f4f4f] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] ${btn.className}`
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
							handleBtnClick(btn.path, btn.text === 'Logout', btn.text)
						}
						className={
							activePage.toLowerCase() === btn.text.toLowerCase() &&
							btn.text !== 'Logout'
								? `flex flex-row-reverse items-center justify-center rounded-lg text-white bg-[#3486fe]! ${btn.activeBtnClass}`
								: `flex items-center justify-center border border-[#4f4f4f] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe] ${btn.className}`
						}
						iconWrapperClass={
							activePage.toLowerCase() === btn.text.toLowerCase() &&
							btn.iconName &&
							btn.text !== 'Logout'
								? btn.iconWrapperClass
								: undefined
						}
						icon={
							activePage.toLowerCase() === btn.text.toLowerCase() &&
							btn.iconName &&
							btn.text !== 'Logout' ? (
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
