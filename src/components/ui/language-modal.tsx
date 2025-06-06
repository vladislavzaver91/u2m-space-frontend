'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { startTransition, useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Loader } from './loader'
import { ButtonCustom } from './button-custom'
import { IconCustom } from './icon-custom'
import { useModal } from '@/helpers/contexts/modal-context'
import { usePathname, useRouter } from 'next/navigation'
import { CustomSearchSelect } from './custom-search-select'
import { cityService } from '@/services/cities.service'
import { useLanguage } from '@/helpers/contexts/language-context'
import { useAuth } from '@/helpers/contexts/auth-context'

interface CityOption {
	id: number
	name: string
}

// interface LanguageButtonItem {
// 	language: string
// 	country: string
// 	languageCode: 'en' | 'uk' | 'pl'
// 	countryCode: 'US' | 'UA' | 'PL'
// }

// const LANGUAGE_BTN_ITEMS: LanguageButtonItem[] = [
// 	{
// 		language: 'English',
// 		country: 'United States',
// 		languageCode: 'en',
// 		countryCode: 'US',
// 	},
// 	{
// 		language: 'Українська',
// 		country: 'Україна',
// 		languageCode: 'uk',
// 		countryCode: 'UA',
// 	},
// 	{
// 		language: 'Polski',
// 		country: 'Polska',
// 		languageCode: 'pl',
// 		countryCode: 'PL',
// 	},
// ]

// const CURRENCY_BTN_ITEMS = [
// 	{
// 		name: 'Американський долар',
// 		symbol: 'USD – $',
// 	},
// 	{
// 		name: 'Українська гривня',
// 		symbol: 'UAH – ₴',
// 	},
// 	{
// 		name: 'Євро',
// 		symbol: 'EUR – €',
// 	},
// ]

export const LanguageModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [formData, setFormData] = useState({
		city: '',
		cityId: 0,
		countryCode: 'US',
		languageCode: 'en' as 'en' | 'uk' | 'pl',
	})
	const [cities, setCities] = useState<CityOption[]>([])
	const { handleOverlayClick, closeModal } = useModal()
	const {
		languageOptions,
		currencyOptions,
		selectedLanguage,
		selectedCurrency,
		setLanguage,
		setCurrency,
	} = useLanguage()
	const { user } = useAuth()
	const router = useRouter()
	const pathname = usePathname()
	const localActive = useLocale() as 'en' | 'uk' | 'pl'
	const tLanguageModal = useTranslations('LanguageModal')
	const limit = 10

	useEffect(() => {
		// Блокируем скролл страницы при открытии модального окна
		document.body.style.overflow = 'hidden'
		return () => {
			// Восстанавливаем скролл при закрытии
			document.body.style.overflow = ''
		}
	}, [])

	// Синхронизация formData.languageCode с локалью сайта
	useEffect(() => {
		setFormData(prev => ({
			...prev,
			languageCode: localActive,
		}))

		const loadCities = async () => {
			try {
				setIsLoading(true)
				const fetchedCities = cityService.fetchAllCities(localActive)
				setCities(fetchedCities)
				setError(null)
			} catch (error) {
				setError(tLanguageModal('errors.failedToLoadCities'))
			} finally {
				setIsLoading(false)
			}
		}
		loadCities()
	}, [localActive, tLanguageModal])

	// const changeLanguage = (
	// 	nextLocale: string,
	// 	countryCode: string,
	// 	languageCode: 'en' | 'uk' | 'pl'
	// ) => {
	// 	startTransition(() => {
	// 		setIsLoading(true)
	// 		const pathWithoutLocale = pathname.replace(`/${localActive}`, '')
	// 		const newPath = `/${nextLocale}${pathWithoutLocale}`
	// 		router.push(newPath)
	// 		setFormData({ city: '', cityId: 0, countryCode, languageCode })
	// 		setCities([])
	// 		closeModal()
	// 		setIsLoading(false)
	// 	})
	// }

	// Обработка выбора города

	const handleCityChange = (cityName: string) => {
		const selectedCity = cities.find(city => city.name === cityName)
		setFormData({
			...formData,
			city: cityName,
			cityId: selectedCity ? selectedCity.id : 0,
		})
	}

	const handleClose = () => {
		closeModal()
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
					<h2 className='text-[18px] font-bold uppercase text-[#4f4f4f] text-center'>
						{tLanguageModal('chooseLanguageRegion.title')}
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
								{languageOptions.map((item, index) => (
									<div
										key={index}
										onClick={() =>
											setLanguage(item.languageCode, item.countryCode)
										}
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
					<h2 className='text-[18px] font-bold uppercase text-[#4f4f4f] text-center'>
						{tLanguageModal('chooseCurrency.title')}
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
								{currencyOptions.map((item, index) => (
									<div
										key={index}
										onClick={() => user && setCurrency(item.code)}
										className={`min-w-[216px] w-fit ${
											item.code === 'USD' ? 'h-[94px]' : 'h-[74px]'
										} p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] hover:border-[#f9329c] active:bg-[#F7F7F7] transition-colors cursor-pointer ${
											selectedCurrency.code === item.code
												? ''
												: 'border-[#bdbdbd] hover:border-[#f9329c] active:bg-[#F7F7F7]'
										} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
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
					<h2 className='text-[18px] font-bold uppercase text-[#4f4f4f] text-center'>
						{tLanguageModal('chooseCity.title')}
					</h2>

					<div className='w-full mx-auto sm:w-[300px]'>
						<CustomSearchSelect
							label={tLanguageModal('chooseCity.city')}
							options={cities.map(city => city.name)}
							value={formData.city}
							onChange={handleCityChange}
							languageCode={formData.languageCode}
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
