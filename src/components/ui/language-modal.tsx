'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Loader } from './loader'
import { ButtonCustom } from './button-custom'
import { CustomSelect } from './custom-select'
import { IconCustom } from './icon-custom'
import { useRouter } from 'next/navigation'
import { useModal } from '@/helpers/contexts/modal-context'

const LANGUAGE_BTN_ITEMS = [
	{
		language: 'English',
		country: 'United Kingdom',
	},
	{
		language: 'Українська',
		country: 'Україна',
	},
	{
		language: 'Polski',
		country: 'Polska',
	},
]

const CURRENCY_BTN_ITEMS = [
	{
		name: 'Американський долар',
		symbol: 'USD – $',
	},
	{
		name: 'Українська гривня',
		symbol: 'UAH – ₴',
	},
	{
		name: 'Євро',
		symbol: 'EUR – €',
	},
]

export const LanguageModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [formData, setFormData] = useState({
		city: '',
	})
	const { handleOverlayClick, closeModal } = useModal()
	const router = useRouter()

	const handleClose = () => {
		closeModal()
		setIsLoading(false)
		router.replace(window.location.pathname)
	}

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				className='fixed inset-0 bg-[#3486fe]/60 flex items-center justify-center z-50 px-3'
				onClick={handleOverlayClick}
			>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='bg-white rounded-[13px] shadow-lg max-w-[744px] w-full p-8 flex flex-col items-center space-y-8'
				>
					{/* language and region */}
					<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
						Choose language and region
					</h2>

					{error && (
						<div className='bg-red-100 text-red-700 p-4 rounded-lg w-full text-center animate-pulse'>
							{error}
						</div>
					)}

					<div className='relative w-full min-h-[74px] flex items-center justify-center'>
						{isLoading ? (
							<Loader />
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full'>
								{LANGUAGE_BTN_ITEMS.map((item, index) => (
									<div
										key={index}
										className='min-w-[216px] w-fit h-[74px] text-[16px] p-4 font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] hover:border-[#f9329c] active:bg-[#F7F7F7] transition-colors cursor-pointer'
									>
										<p className='font-bold text-[16px] text-[#4F4F4F] leading-[18px]'>
											{item.language}
										</p>
										<p className='font-normal text-[16px] text-[#4F4F4F] leading-[18px]'>
											{item.country}
										</p>
									</div>
								))}
							</div>
						)}
					</div>

					{/* currency */}
					<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
						Choose currency
					</h2>

					{error && (
						<div className='bg-red-100 text-red-700 p-4 rounded-lg w-full text-center animate-pulse'>
							{error}
						</div>
					)}

					<div className='relative w-full min-h-[74px] flex items-center justify-center'>
						{isLoading ? (
							<Loader />
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full'>
								{CURRENCY_BTN_ITEMS.map((item, index) => (
									<div
										key={index}
										className={`min-w-[216px] w-fit ${
											index === 0 ? 'h-[94px]' : 'h-[74px]'
										} p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] hover:border-[#f9329c] active:bg-[#F7F7F7] transition-colors cursor-pointer`}
									>
										<p className='font-bold text-[16px] text-[#4F4F4F] leading-[18px]'>
											{item.name}
										</p>
										<p className='font-normal text-[16px] text-[#4F4F4F] leading-[18px]'>
											{item.symbol}
										</p>
									</div>
								))}
							</div>
						)}
					</div>

					{/* city */}
					<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
						Choose a city
					</h2>

					<div className='w-full mx-auto sm:w-[300px]'>
						<CustomSelect
							label='City'
							options={[
								'New York',
								'London',
								'Kyiv',
								'Poltava',
								'Odessa',
								'Kharkiv',
								'Warsaw',
							]}
							value={formData.city}
							onChange={value => setFormData({ ...formData, city: value })}
						/>
					</div>

					<ButtonCustom
						onClick={handleClose}
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='close'
								className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
								hover={true}
								hoverColor='#f9329c'
							/>
						}
						isHover
						className='w-10 h-10 flex items-center justify-center rounded-lg'
					/>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}
