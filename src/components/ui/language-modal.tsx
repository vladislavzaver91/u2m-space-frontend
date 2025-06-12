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
import { useUser } from '@/helpers/contexts/user-context'
import { apiService } from '@/services/api.service'
import { CityOption } from '@/types'
import { handleApiError } from '@/helpers/functions/handle-api-error'

export const LanguageModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [formData, setFormData] = useState<{
		city: string
		cityId: number
		countryCode: 'US' | 'UA' | 'PL'
		languageCode: 'en' | 'uk' | 'pl'
	}>({
		city: '',
		cityId: 0,
		countryCode: 'US',
		languageCode: 'en',
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
	const { user, updateUser } = useUser()
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
		const loadCitiesAndSyncCity = async () => {
			try {
				setIsLoading(true)
				const fetchedCities = await cityService.fetchAllCities(localActive)
				setCities(fetchedCities)
				setError(null)

				// Переводим город пользователя, если он есть
				let translatedCity = ''
				if (user?.city) {
					const translated = cityService.getTranslatedCityName(
						user.city,
						localActive
					)
					translatedCity = translated || user.city // Если перевод не найден, оставляем исходное имя
				}

				setFormData(prev => ({
					...prev,
					languageCode: user?.language || localActive,
					countryCode:
						user?.language === 'en'
							? 'US'
							: user?.language === 'uk'
							? 'UA'
							: 'PL',
					city: translatedCity,
					cityId: 0, // cityId можно обновить, если нужно
				}))
			} catch (error) {
				setError(tLanguageModal('errors.failedToLoadCities'))
			} finally {
				setIsLoading(false)
			}
		}
		loadCitiesAndSyncCity()
	}, [localActive, tLanguageModal, user])

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

	const handleCityChange = async (cityName: string) => {
		const selectedCity = cities.find(city => city.name === cityName)
		setFormData({
			...formData,
			city: cityName,
			cityId: selectedCity ? selectedCity.id : 0,
		})

		if (user && cityName) {
			try {
				setIsLoading(true)
				const englishCityName =
					cityService.getTranslatedCityName(cityName, 'en') || cityName
				const updateData = { city: englishCityName || null }
				const updatedUser = await apiService.updateUserProfile(
					user.id,
					updateData
				)
				updateUser(updatedUser)
			} catch (error: any) {
				setError(
					error.response?.data?.error || tLanguageModal('errors.serverError')
				)
			} finally {
				setIsLoading(false)
			}
		}
	}

	const handleLanguageChange = async (
		languageCode: 'en' | 'uk' | 'pl',
		countryCode: 'US' | 'UA' | 'PL'
	) => {
		setIsLoading(true)
		try {
			let translatedCity = formData.city
			if (formData.city) {
				const translated = cityService.getTranslatedCityName(
					formData.city,
					languageCode
				)
				translatedCity = translated || formData.city // Если перевод не найден, оставляем текущее имя
			}

			await setLanguage(languageCode, countryCode)
			setFormData(prev => ({
				...prev,
				languageCode,
				countryCode,
				city: translatedCity,
			}))
		} catch (error) {
			setError(handleApiError(error, tLanguageModal('errors.serverError')))
		} finally {
			setIsLoading(false)
		}
	}

	const handleCurrencyChange = async (currencyCode: 'USD' | 'UAH' | 'EUR') => {
		if (!user) return
		setIsLoading(true)
		try {
			await setCurrency(currencyCode)
		} catch (error) {
			setError(handleApiError(error, tLanguageModal('errors.serverError')))
		} finally {
			setIsLoading(false)
		}
	}

	const handleClose = () => {
		closeModal()
	}

	if (error) {
		console.log(error)
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

					<div className='relative w-full min-h-[74px] flex items-center justify-center'>
						{isLoading ? (
							<Loader />
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full'>
								{languageOptions.map((item, index) => (
									<div
										key={index}
										onClick={() =>
											handleLanguageChange(item.languageCode, item.countryCode)
										}
										className={`min-w-[216px] w-fit h-[74px] text-[16px] p-4 font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] active:border-[#f9329c] hover:bg-[#F7F7F7] transition-colors cursor-pointer ${
											selectedLanguage.languageCode === item.languageCode &&
											selectedLanguage.countryCode === item.countryCode
												? 'border-[#f9329c]'
												: ''
										}`}
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

					<div className='relative w-full min-h-[74px] flex items-center justify-center'>
						{isLoading ? (
							<Loader />
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full'>
								{currencyOptions.map((item, index) => (
									<div
										key={index}
										onClick={() => handleCurrencyChange(item.code)}
										className={`min-w-[216px] w-fit ${
											item.code === 'USD' ? 'h-[94px]' : 'h-[74px]'
										} p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] active:border-[#f9329c] hover:bg-[#F7F7F7] transition-colors cursor-pointer ${
											selectedCurrency.code === item.code
												? 'border-[#f9329c]'
												: ''
										} `}
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
