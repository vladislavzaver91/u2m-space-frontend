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

export const MyClassifiedCard = ({
	title,
	price,
	image,
	href,
}: MyClassifiedCardProps) => {
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
				<div className='block border border-[#bdbdbd] rounded-[13px] transition-all active:shadow-custom-2xl hover:shadow-custom-xl hover:border-none w-full h-[375px]'>
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
				</div>
			)}
		</>
	)
}
