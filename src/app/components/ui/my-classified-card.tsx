'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ButtonWithIcon } from './button-with-icon'
import { useState } from 'react'
import { IconCustom } from './icon-custom'
import { useRouter } from 'next/navigation'

interface MyClassifiedCardProps {
	id: string
	title: string
	price: string
	image?: string
	href: string
	isActive: boolean
	views?: number
	messages?: number
	favorites?: number
	onToggleActive: () => Promise<void>
}

export const MyClassifiedCard = ({
	id,
	title,
	price,
	image,
	href,
	isActive,
	views,
	messages,
	favorites,
	onToggleActive,
}: MyClassifiedCardProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isToggling, setIsToggling] = useState(false)
	const router = useRouter()

	const handleMouseEnter = () => setIsHovered(true)
	const handleMouseLeave = () => setIsHovered(false)

	const handleToggle = async (e: React.MouseEvent) => {
		e.preventDefault()
		setIsToggling(true)
		try {
			await onToggleActive()
		} finally {
			setIsToggling(false)
		}
	}

	const handleEdit = (e: React.MouseEvent) => {
		e.preventDefault()
		router.push(`/classifieds-edit/${id}`)
	}

	const INFO_AND_ANALYTICAL_DATA = [
		{
			icon: (
				<IconCustom name='show' className='w-4 h-4 fill-none text-[#3486FE]' />
			),
			data: views || 0,
		},
		{
			icon: (
				<IconCustom name='chat' className='w-4 h-4 fill-none text-[#4F4F4F]' />
			),
			data: messages || 0,
		},
		{
			icon: (
				<IconCustom
					name='heart'
					className={`w-4 h-4 ${
						favorites === 0
							? 'text-[#3486fe] fill-none'
							: 'text-[#F9329C] stroke-[#F9329C]'
					}`}
				/>
			),
			data: favorites || 0,
		},
	]

	const containerProps = {
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		className:
			'block border border-[#bdbdbd] rounded-[13px] transition-all active:shadow-custom-2xl hover:shadow-custom-xl hover:border-transparent w-full max-sm:min-h-[396px] sm:h-[294px] 3xl:h-[375px]! min-w-[217px] cursor-pointer',
	}

	return (
		<>
			{isActive ? (
				<Link href={href} {...containerProps}>
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
						{!isActive && (
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
						<div className='relative flex flex-col justify-between p-4 min-h-[242px] overflow-hidden gap-4 sm:hidden'>
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
								<h2 className='text-[18px] uppercase font-bold text-[#4f4f4f] py-[9px]'>
									${price}
								</h2>
								<p className='text-[#4f4f4f] text-[16px] font-bold line-clamp-2'>
									{title}
								</p>
							</div>
							{/* кнопки */}
							<div className='w-full flex max-2xs:flex-wrap items-center gap-4'>
								<ButtonWithIcon
									text='hide'
									icon={
										<IconCustom
											name='hide'
											hover
											className='w-4 h-4 fill-none text-[#4f4f4f] group-focus:text-[#3486fe]!'
										/>
									}
									onClick={handleToggle}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-full group'
								/>
								<ButtonWithIcon
									text='edit'
									onClick={handleEdit}
									icon={
										<IconCustom
											name='edit-pencil'
											hoverColor='#3486fe'
											disabled={!isActive}
											className='w-4 h-4 fill-none text-[#4f4f4f]'
										/>
									}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-full group'
									disabled={!isActive}
									disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
								/>
								<ButtonWithIcon
									text='up'
									icon={
										<IconCustom
											name='arrow-circle-up'
											hover
											hoverColor='#3486fe'
											disabled={!isActive}
											className='w-4 h-4 fill-none text-[#4f4f4f]'
										/>
									}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-full group'
									disabled={!isActive}
									disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
								/>
							</div>
						</div>
						{/* таблет + декстоп */}
						<div className='max-sm:hidden relative p-4 3xl:p-3.5! h-[140px] 3xl:h-[122px]! overflow-hidden'>
							<div
								className={`absolute inset-0 p-4 3xl:p-3.5! flex flex-col gap-2 transition-transform duration-300 ease-in-out ${
									isHovered ? '-translate-y-full' : 'translate-y-0'
								}`}
							>
								<h2 className='text-[18px] md:text-[24px] text-[#4f4f4f] uppercase font-bold transition-all'>
									${price}
								</h2>
								<p className='text-[#4f4f4f] text-[16px] font-bold leading-5 line-clamp-2'>
									{title}
								</p>
							</div>
							<div
								className={`absolute inset-0 p-4 3xl:p-3.5! flex flex-col justify-between transition-transform duration-300 ease-in-out ${
									isHovered ? 'translate-y-0' : 'translate-y-full'
								}`}
							>
								{/* инфо-аналитические данные */}
								<div className='w-full flex justify-between gap-4'>
									{INFO_AND_ANALYTICAL_DATA.map((item, index) => (
										<div
											key={index}
											className='min-w-[51px] w-full flex flex-col justify-center items-center gap-[3px] px-3'
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
										onClick={handleToggle}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-full group'
									/>
									<ButtonWithIcon
										text='edit'
										onClick={handleEdit}
										icon={
											<IconCustom
												name='edit-pencil'
												hover
												hoverColor='#3486fe'
												disabled={!isActive}
												className='w-4 h-4 fill-none text-[#4f4f4f]'
											/>
										}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-full group'
										disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
										disabled={!isActive}
									/>
									<ButtonWithIcon
										text='up'
										icon={
											<IconCustom
												name='arrow-circle-up'
												hover
												disabled={!isActive}
												hoverColor='#3486fe'
												className='w-4 h-4 fill-none text-[#4f4f4f]'
											/>
										}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-full group'
										disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
										disabled={!isActive}
									/>
								</div>
							</div>
						</div>
					</>
				</Link>
			) : (
				<div {...containerProps}>
					<div className='relative w-full h-[154px] 3xl:h-[253px] cursor-not-allowed'>
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
						{!isActive && (
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
								<h2 className='text-[18px] uppercase font-bold text-[#4f4f4f] py-[9px]'>
									${price}
								</h2>
								<p className='text-[#4f4f4f] text-[16px] font-bold line-clamp-2'>
									{title}
								</p>
							</div>
							{/* кнопки */}
							<div className='w-full flex max-2xs:flex-wrap items-center gap-4'>
								<ButtonWithIcon
									text='hide'
									icon={
										<IconCustom
											name='hide'
											hover
											className='w-4 h-4 fill-none text-[#4f4f4f] group-focus:text-[#3486fe]!'
										/>
									}
									onClick={handleToggle}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-full group'
								/>
								<ButtonWithIcon
									text='edit'
									onClick={handleEdit}
									icon={
										<IconCustom
											name='edit-pencil'
											hoverColor='#3486fe'
											disabled={!isActive}
											className='w-4 h-4 fill-none text-[#4f4f4f]'
										/>
									}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-full group'
									disabled={!isActive}
									disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
								/>
								<ButtonWithIcon
									text='up'
									icon={
										<IconCustom
											name='arrow-circle-up'
											hover
											hoverColor='#3486fe'
											disabled={!isActive}
											className='w-4 h-4 fill-none text-[#4f4f4f]'
										/>
									}
									isHover
									className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[88px] w-full group'
									disabled={!isActive}
									disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
								/>
							</div>
						</div>
						{/* таблет + декстоп */}
						<div className='max-sm:hidden relative p-4 3xl:p-3.5! h-[140px] 3xl:h-[122px]! overflow-hidden'>
							<div
								className={`absolute inset-0 p-4 3xl:p-3.5! flex flex-col gap-2 transition-transform duration-300 ease-in-out ${
									isHovered ? '-translate-y-full' : 'translate-y-0'
								}`}
							>
								<h2 className='text-[18px] md:text-[24px] text-[#4f4f4f] uppercase font-bold transition-all'>
									${price}
								</h2>
								<p className='text-[#4f4f4f] text-[16px] font-bold leading-5 line-clamp-2'>
									{title}
								</p>
							</div>
							<div
								className={`absolute inset-0 p-4 3xl:p-3.5! flex flex-col justify-between transition-transform duration-300 ease-in-out ${
									isHovered ? 'translate-y-0' : 'translate-y-full'
								}`}
							>
								{/* инфо-аналитические данные */}
								<div className='w-full flex justify-between gap-4'>
									{INFO_AND_ANALYTICAL_DATA.map((item, index) => (
										<div
											key={index}
											className='min-w-[51px] w-full flex flex-col justify-center items-center gap-[3px] px-3'
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
										onClick={handleToggle}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-full group'
									/>
									<ButtonWithIcon
										text='edit'
										onClick={handleEdit}
										icon={
											<IconCustom
												name='edit-pencil'
												hover
												hoverColor='#3486fe'
												disabled={!isActive}
												className='w-4 h-4 fill-none text-[#4f4f4f]'
											/>
										}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-full group'
										disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
										disabled={!isActive}
									/>
									<ButtonWithIcon
										text='up'
										icon={
											<IconCustom
												name='arrow-circle-up'
												hover
												disabled={!isActive}
												hoverColor='#3486fe'
												className='w-4 h-4 fill-none text-[#4f4f4f]'
											/>
										}
										isHover
										className='border border-[#bdbdbd] rounded-lg py-1 flex flex-col items-center justify-center gap-[3px] text-[13px] font-normal min-w-[51px] w-full group'
										disableClass='border-[#f7f7f7]! bg-white! text-[#BDBDBD]!'
										disabled={!isActive}
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
