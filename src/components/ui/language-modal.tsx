'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Loader } from './loader'
import { ButtonCustom } from './button-custom'
import { IconCustom } from './icon-custom'
import { useModal } from '@/helpers/contexts/modal-context'
import { usePathname, useRouter } from 'next/navigation'
import { CustomSearchSelect } from './custom-search-select'
import { cityService } from '@/services/cities.service'
import { useLanguage } from '@/helpers/contexts/language-context'
import { useUser } from '@/helpers/contexts/user-context'
import { CityOption } from '@/types'
import { handleApiError } from '@/helpers/functions/handle-api-error'

import enTranslations from '@/messages/en.json'
import ukTranslations from '@/messages/uk.json'
import plTranslations from '@/messages/pl.json'

export const LanguageModal = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [error, setError] = useState<string | null>(null)
	const [cities, setCities] = useState<CityOption[]>([])
	const { handleOverlayClick, closeModal } = useModal()
	const {
		languageOptions,
		currencyOptions,
		settings,
		updateSettings,
		translateCity,
	} = useLanguage()
	const [tempSettings, setTempSettings] = useState(settings)

	const tLanguageModal = useTranslations('LanguageModal')

	const translationsMap = useMemo(
		() => ({
			en: enTranslations.LanguageModal,
			uk: ukTranslations.LanguageModal,
			pl: plTranslations.LanguageModal,
		}),
		[]
	)

	const dynamicTranslations = useMemo(
		() => ({
			chooseLanguageRegionTitle:
				translationsMap[tempSettings.languageCode].chooseLanguageRegion.title,
			chooseCurrencyTitle:
				translationsMap[tempSettings.languageCode].chooseCurrency.title,
			chooseCityTitle:
				translationsMap[tempSettings.languageCode].chooseCity.title,
			failedToLoadCities:
				translationsMap[tempSettings.languageCode].errors.failedToLoadCities,
		}),
		[tempSettings.languageCode, translationsMap]
	)

	// Загрузка городов и блокировка скролла
	useEffect(() => {
		const loadCities = async () => {
			try {
				setIsLoading(true)
				const fetchedCities = await cityService.fetchAllCities(
					tempSettings.languageCode
				)
				setCities(fetchedCities)
				setError(null)
			} catch (error: any) {
				setError(handleApiError(error, dynamicTranslations.failedToLoadCities))
			} finally {
				setIsLoading(false)
			}
		}
		loadCities()

		// Блокируем скролл при открытии модального окна
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = ''
		}
	}, [tempSettings.languageCode, tLanguageModal])

	// Обработка выбора языка
	// const handleLanguageChange = async (languageCode: 'en' | 'uk' | 'pl') => {
	// 	setIsLoading(true)
	// 	try {
	// 		closeModal()
	// 		await updateSettings({
	// 			languageCode,
	// 			city: settings.city
	// 				? translateCity(settings.city, languageCode)
	// 				: settings.city,
	// 		})
	// 	} catch (error: any) {
	// 		setError(handleApiError(error, tLanguageModal('errors.serverError')))
	// 	} finally {
	// 		setIsLoading(false)
	// 	}
	// }

	// // Обработка выбора валюты
	// const handleCurrencyChange = async (currencyCode: 'USD' | 'UAH' | 'EUR') => {
	// 	setIsLoading(true)
	// 	try {
	// 		closeModal()
	// 		await updateSettings({ currencyCode })
	// 		window.location.reload()
	// 	} catch (error: any) {
	// 		setError(handleApiError(error, tLanguageModal('errors.serverError')))
	// 	} finally {
	// 		setIsLoading(false)
	// 	}
	// }

	// // Обработка выбора города
	// const handleCityChange = async (cityName: string) => {
	// 	setIsLoading(true)
	// 	try {
	// 		closeModal()
	// 		await updateSettings({
	// 			city: cityName,
	// 		})
	// 		console.log('updatedCity', cityName)
	// 	} catch (error: any) {
	// 		setError(handleApiError(error, tLanguageModal('errors.serverError')))
	// 	} finally {
	// 		setIsLoading(false)
	// 	}
	// }

	const handleLanguageChange = (languageCode: 'en' | 'uk' | 'pl') => {
		setTempSettings(prev => ({
			...prev,
			languageCode,
			city: prev.city ? translateCity(prev.city, languageCode) : prev.city,
		}))
	}

	const handleCurrencyChange = (currencyCode: 'USD' | 'UAH' | 'EUR') => {
		setTempSettings(prev => ({ ...prev, currencyCode }))
	}

	const handleCityChange = (cityName: string) => {
		setTempSettings(prev => ({ ...prev, city: cityName }))
	}

	const handleClose = async () => {
		setIsLoading(true)
		try {
			await updateSettings(tempSettings)
			if (tempSettings.currencyCode !== settings.currencyCode) {
				window.location.reload()
			}
		} catch (error: any) {
			setError(handleApiError(error, tLanguageModal('errors.serverError')))
		} finally {
			setIsLoading(false)
			closeModal()
		}
	}

	console.log(cities)

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
					className='bg-white rounded-[13px] shadow-lg max-w-[744px] w-full p-8 flex flex-col items-center space-y-8 select-none'
				>
					{/* language and region */}
					<h2 className='text-[18px] font-bold uppercase text-[#4f4f4f] text-center'>
						{dynamicTranslations.chooseLanguageRegionTitle}
					</h2>

					<div className='relative w-full min-h-[74px] flex items-center justify-center'>
						{isLoading ? (
							<Loader />
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full'>
								{languageOptions.map((item, index) => (
									<div
										key={index}
										onClick={() => handleLanguageChange(item.languageCode)}
										className={`min-w-[216px] w-fit h-[74px] text-[16px] p-4 font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] active:border-[#f9329c] hover:bg-[#F7F7F7] transition-colors cursor-pointer ${
											tempSettings.languageCode === item.languageCode
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
						{dynamicTranslations.chooseCurrencyTitle}
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
										className={`min-w-[216px] w-fit min-h-[74px] max-h-[94px] p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] active:border-[#f9329c] hover:bg-[#F7F7F7] transition-colors cursor-pointer ${
											tempSettings.currencyCode === item.code
												? 'border-[#f9329c]'
												: ''
										} `}
									>
										<p className='font-bold text-[16px] text-[#4F4F4F] leading-5'>
											{item.name}
										</p>
										<p className='font-normal text-[16px] text-[#4F4F4F] leading-5'>
											{item.symbol}
										</p>
									</div>
								))}
							</div>
						)}
					</div>

					{/* city */}
					<h2 className='text-[18px] font-bold uppercase text-[#4f4f4f] text-center'>
						{dynamicTranslations.chooseCityTitle}
					</h2>

					<div className='w-full mx-auto sm:w-[300px]'>
						<CustomSearchSelect
							label={tLanguageModal('chooseCity.city')}
							options={cities.map(city => city.name)}
							value={tempSettings.city || ''}
							onChange={handleCityChange}
							languageCode={tempSettings.languageCode}
							failedToLoadCitiesError={dynamicTranslations.failedToLoadCities}
						/>
					</div>

					<ButtonCustom
						onClick={handleClose}
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='close'
								className='w-6 h-6 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
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
