'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ButtonWithIcon } from './button-with-icon'
import { useState } from 'react'
import { IconCustom } from './icon-custom'

interface MyClassifiedCardProps {
	title: string
	price: string
	image?: string
	href?: string
}

const INFO_AND_ANALYTICAL_DATA = [
	{
		icon: (
			<IconCustom name='show' className='w-4 h-4 fill-none text-[#3486FE]' />
		),
		data: 1471,
	},
	{
		icon: (
			<IconCustom
				name='suitcase'
				className='w-4 h-4 fill-none text-[#3486FE]'
			/>
		),
		data: 356,
	},
	{
		icon: (
			<IconCustom
				name='heart'
				className='w-4 h-4 text-[#F9329C] stroke-[#F9329C]'
			/>
		),
		data: 257,
	},
]

export const MyClassifiedCard = ({
	title,
	price,
	image,
	href,
}: MyClassifiedCardProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isHidden, setIsHidden] = useState(false)

	const handleMouseEnter = () => setIsHovered(true)
	const handleMouseLeave = () => setIsHovered(false)
	const handleHideClick = () => setIsHidden(!isHidden)

	return (
		<>
			{href ? (
				<Link
					href={href}
					className='block border border-[#bdbdbd] rounded-[13px] transition-all active:shadow-custom-2xl hover:shadow-custom-xl hover:border-none w-full h-[375px]'
				>
					<div className='relative w-full h-[253px]'>
						{image ? (
							<Image
								src={image}
								alt={title}
								fill
								className='h-full w-full object-cover object-center rounded-t-[13px]'
							/>
						) : (
							<div className='h-full bg-gray-200 rounded-t-[13px]' />
						)}
					</div>
					<div className='p-4 flex flex-col gap-2 min-h-[122px]'>
						<h3 className='text-[18px] md:text-[24px] uppercase font-bold transition-all'>
							${price}
						</h3>
						<p className='text-[#4f4f4f] text-[16px] font-bold leading-5 line-clamp-2'>
							{title}
						</p>
					</div>
				</Link>
			) : (
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					className='block border border-[#bdbdbd] rounded-[13px] transition-all active:shadow-custom-2xl hover:shadow-custom-xl hover:border-none w-full max-sm:min-h-[396px] sm:h-[294px] 3xl:h-[375px]! min-w-[217px] cursor-pointer'
				>
					<div className='relative w-full h-[154px] 3xl:h-[253px]'>
						{image ? (
							<Image
								src={image}
								alt={title}
								fill
								className='h-full w-full object-cover object-center rounded-t-[13px]'
							/>
						) : (
							<div className='h-full bg-gray-200 rounded-t-[13px]' />
						)}
						{/* оверлей с иконкой hide */}
						{isHidden && (
							<div className='absolute inset-0 flex items-center justify-center bg-[#3486fe]/60 rounded-t-[13px]'>
								<IconCustom
									name='hide'
									className='w-16 h-16 fill-none text-white'
								/>
							</div>
						)}
					</div>

					{/* Нижний блок с анимацией */}
					<>
						{/* моб */}
						<div className='relative p-4 min-h-[242px] overflow-hidden space-y-4 sm:hidden'>
							{/* инфо-аналитические данные */}
							<div className='w-full flex flex-wrap justify-between gap-4'>
								{INFO_AND_ANALYTICAL_DATA.map((item, index) => (
									<div
										key={index}
										className='flex flex-col justify-center items-center gap-[3px] px-8'
									>
										<span className='w-4 h-4'>{item.icon}</span>
										<p className='font-bold text-[13px] text-[#4f4f4f]'>
											{item.data}
										</p>
									</div>
								))}
							</div>
							{/* цена + заголовок */}
							<div>
								<h3 className='text-[18px] uppercase font-bold text-[#4f4f4f] py-[9px]'>
									${price}
								</h3>
								<p className='text-[#4f4f4f] text-[16px] font-bold line-clamp-2'>
									{title}
								</p>
							</div>
							{/* кнопки */}
							<div className='w-full flex flex-wrap justify-between gap-4'>
								<ButtonWithIcon
									text='hide'
									icon={
										<IconCustom
											name='hide'
											hover
											className='w-4 h-4 fill-none text-[#4f4f4f] group-focus:text-[#3486fe]!'
										/>
									}
									onClick={e => {
										e.preventDefault()
										handleHideClick()
									}}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-fit group'
								/>
								<ButtonWithIcon
									text='edit'
									icon={
										<IconCustom
											name='edit-pencil'
											hover
											className='w-4 h-4 fill-none text-[#4f4f4f] group-focus:text-[#3486fe]!'
										/>
									}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-fit group'
								/>
								<ButtonWithIcon
									text='up'
									icon={
										<IconCustom
											name='arrow-circle-up'
											hover
											className='w-4 h-4 fill-none text-[#4f4f4f] group-focus:text-[#3486fe]!'
										/>
									}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-fit group'
								/>
							</div>
						</div>
						{/* таблет + декстоп */}
						<div className='max-sm:hidden relative p-4 h-[140px] 3xl:h-[122px]! overflow-hidden'>
							<div
								className={`absolute inset-0 p-4 flex flex-col gap-2 transition-transform duration-300 ease-in-out ${
									isHovered ? '-translate-y-full' : 'translate-y-0'
								}`}
							>
								<h3 className='text-[18px] md:text-[24px] text-[#4f4f4f] uppercase font-bold transition-all'>
									${price}
								</h3>
								<p className='text-[#4f4f4f] text-[16px] font-bold leading-5 line-clamp-2'>
									{title}
								</p>
							</div>
							<div
								className={`absolute inset-0 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
									isHovered ? 'translate-y-0' : 'translate-y-full'
								}`}
							>
								{/* инфо-аналитические данные */}
								<div className='w-full flex justify-between gap-4'>
									{INFO_AND_ANALYTICAL_DATA.map((item, index) => (
										<div
											key={index}
											className='flex flex-col justify-center items-center gap-[3px] px-3'
										>
											<span className='w-4 h-4'>{item.icon}</span>
											<p className='font-bold text-[13px] text-[#4f4f4f]'>
												{item.data}
											</p>
										</div>
									))}
								</div>
								{/* кнопки */}
								<div className='w-full flex justify-between gap-4'>
									<ButtonWithIcon
										text='hide'
										icon={
											<IconCustom
												name='hide'
												hover
												className='w-4 h-4 fill-none text-[#4f4f4f] group-hover:text-[#3486fe]! group-focus:text-[#3486fe]!'
											/>
										}
										onClick={e => {
											e.preventDefault()
											handleHideClick()
										}}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-fit group'
									/>
									<ButtonWithIcon
										text='edit'
										icon={
											<IconCustom
												name='edit-pencil'
												hover
												className='w-4 h-4 fill-none text-[#4f4f4f] group-hover:text-[#3486fe]! group-focus:text-[#3486fe]!'
											/>
										}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-fit group'
									/>
									<ButtonWithIcon
										text='up'
										icon={
											<IconCustom
												name='arrow-circle-up'
												hover
												className='w-4 h-4 fill-none text-[#4f4f4f] group-hover:text-[#3486fe]! group-focus:text-[#3486fe]!'
											/>
										}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-fit group'
									/>
								</div>
							</div>
						</div>
					</>
				</div>
			)}
		</>
	)
}
