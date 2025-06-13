'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from './auth-context'
import { apiService } from '@/services/api.service'
import { useUser } from './user-context'
import { handleApiError } from '../functions/handle-api-error'

export interface LanguageOption {
	language: string
	country: string
	languageCode: 'en' | 'uk' | 'pl'
	countryCode: 'US' | 'UA' | 'PL'
	defaultCurrency: 'USD' | 'UAH' | 'EUR'
}

interface CurrencyOption {
	name: string
	symbol: string
	code: 'USD' | 'UAH' | 'EUR'
}

interface LanguageContextType {
	languageOptions: LanguageOption[]
	currencyOptions: CurrencyOption[]
	selectedLanguage: LanguageOption
	selectedCurrency: CurrencyOption
	setLanguage: (
		languageCode: 'en' | 'uk' | 'pl',
		countryCode: 'US' | 'UA' | 'PL'
	) => void
	setCurrency: (currencyCode: 'USD' | 'UAH' | 'EUR') => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const tLanguageModal = useTranslations('LanguageModal')
	const languageOptions: LanguageOption[] = [
		{
			language: tLanguageModal('chooseLanguageRegion.english'),
			country: tLanguageModal('chooseLanguageRegion.unitedStates'),
			languageCode: 'en',
			countryCode: 'US',
			defaultCurrency: 'USD',
		},
		{
			language: tLanguageModal('chooseLanguageRegion.ukrainian'),
			country: tLanguageModal('chooseLanguageRegion.ukraine'),
			languageCode: 'uk',
			countryCode: 'UA',
			defaultCurrency: 'UAH',
		},
		{
			language: tLanguageModal('chooseLanguageRegion.polish'),
			country: tLanguageModal('chooseLanguageRegion.poland'),
			languageCode: 'pl',
			countryCode: 'PL',
			defaultCurrency: 'EUR',
		},
	]

	const currencyOptions: CurrencyOption[] = [
		{
			name: tLanguageModal('chooseCurrency.americanDollar'),
			symbol: 'USD – $',
			code: 'USD',
		},
		{
			name: tLanguageModal('chooseCurrency.ukrainianHryvnia'),
			symbol: 'UAH – ₴',
			code: 'UAH',
		},
		{
			name: tLanguageModal('chooseCurrency.euro'),
			symbol: 'EUR – €',
			code: 'EUR',
		},
	]

	const { authUser } = useAuth()
	const { updateUser } = useUser()
	const userId = authUser?.id
	const router = useRouter()
	const pathname = usePathname()
	const locale = useLocale() as 'en' | 'uk' | 'pl'

	const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
		() => {
			// Приоритет: текущая локаль сайта
			const defaultLanguage =
				languageOptions.find(opt => opt.languageCode === locale) ||
				languageOptions[0]

			if (typeof window !== 'undefined') {
				const saved = localStorage.getItem('guestSettings')
				if (saved) {
					const { language } = JSON.parse(saved)
					const savedLanguage = languageOptions.find(
						opt => opt.languageCode === language
					)
					// Используем сохраненный язык только если он валидный, иначе локаль
					return savedLanguage || defaultLanguage
				}
			}
			return defaultLanguage
		}
	)
	const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(
		() => {
			const defaultCurrency =
				currencyOptions.find(
					opt => opt.code === selectedLanguage.defaultCurrency
				) || currencyOptions[0]

			if (typeof window !== 'undefined') {
				const saved = localStorage.getItem('guestSettings')
				if (saved) {
					const { currency } = JSON.parse(saved)
					const savedCurrency = currencyOptions.find(
						opt => opt.code === currency
					)
					// Используем сохраненную валюту только если она валидная
					return savedCurrency || defaultCurrency
				}
			}
			return defaultCurrency
		}
	)

	// Загрузка валюты пользователя с бэкенда
	useEffect(() => {
		const fetchUserData = async () => {
			if (!userId) return
			try {
				const userData = await apiService.getUserProfile(userId)

				const userLanguage = userData.language || locale // Если null, используем текущую локаль
				const userCurrency =
					userData.currency ||
					languageOptions.find(opt => opt.languageCode === userLanguage)
						?.defaultCurrency ||
					'USD'

				const newLanguage =
					languageOptions.find(opt => opt.languageCode === userLanguage) ||
					languageOptions.find(opt => opt.languageCode === locale) ||
					languageOptions[0]
				const newCurrency =
					currencyOptions.find(opt => opt.code === userCurrency) ||
					currencyOptions.find(
						opt => opt.code === newLanguage.defaultCurrency
					) ||
					currencyOptions[0]

				setSelectedLanguage(newLanguage)
				setSelectedCurrency(newCurrency)

				// Обновляем localStorage для консистентности
				localStorage.setItem(
					'guestSettings',
					JSON.stringify({
						language: newLanguage.languageCode,
						currency: newCurrency.code,
						city: userData.city || null,
					})
				)
			} catch (error) {
				console.error('Error loading user data:', error)
				const defaultLanguage =
					languageOptions.find(opt => opt.languageCode === locale) ||
					languageOptions[0]
				setSelectedLanguage(defaultLanguage)
				setSelectedCurrency(
					currencyOptions.find(
						opt => opt.code === defaultLanguage.defaultCurrency
					) || currencyOptions[0]
				)
			}
		}
		fetchUserData()
	}, [userId, locale])

	// Синхронизация языка с локалью
	useEffect(() => {
		const currentLanguage = languageOptions.find(
			opt => opt.languageCode === locale
		)
		if (
			currentLanguage &&
			currentLanguage.languageCode !== selectedLanguage.languageCode
		) {
			setSelectedLanguage(currentLanguage)
			setSelectedCurrency(
				currencyOptions.find(
					opt => opt.code === currentLanguage.defaultCurrency
				) || currencyOptions[0]
			)
			// Обновляем localStorage
			localStorage.setItem(
				'guestSettings',
				JSON.stringify({
					language: currentLanguage.languageCode,
					currency: currentLanguage.defaultCurrency,
					city: localStorage.getItem('guestCity') || null,
				})
			)
		}
	}, [locale])

	// Обновление валюты на бэкенде
	const setCurrency = async (currencyCode: 'USD' | 'UAH' | 'EUR') => {
		try {
			if (userId) {
				await apiService.updateUserCurrency(userId, currencyCode)
				const updatedUser = await apiService.getUserProfile(userId)
				setSelectedCurrency(
					currencyOptions.find(opt => opt.code === currencyCode)!
				)
				updateUser(updatedUser)
			} else {
				const res = await apiService.updateGuestSettings({
					currency: currencyCode,
					language: selectedLanguage.languageCode,
					city: localStorage.getItem('guestCity') || null,
				})
				setSelectedCurrency(
					currencyOptions.find(opt => opt.code === currencyCode)!
				)
				localStorage.setItem(
					'guestSettings',
					JSON.stringify({
						language: res.language,
						currency: res.currency,
						city: res.city,
					})
				)
			}

			// window.location.reload()
		} catch (error) {
			throw new Error(
				handleApiError(error, tLanguageModal('errors.serverError'))
			)
		}
	}

	// Смена языка и страны
	const setLanguage = async (
		languageCode: 'en' | 'uk' | 'pl',
		countryCode: 'US' | 'UA' | 'PL'
	) => {
		const newLanguage = languageOptions.find(
			opt =>
				opt.languageCode === languageCode && opt.countryCode === countryCode
		)
		if (!newLanguage) throw new Error('Invalid language')
		try {
			if (userId) {
				const updateData = {
					language: languageCode,
					currency: newLanguage.defaultCurrency,
				}
				const updatedUser = await apiService.updateUserProfile(
					userId,
					updateData
				)
				setSelectedLanguage(newLanguage)
				setSelectedCurrency(
					currencyOptions.find(opt => opt.code === newLanguage.defaultCurrency)!
				)
				updateUser(updatedUser)
			} else {
				const res = await apiService.updateGuestSettings({
					language: languageCode,
					currency: newLanguage.defaultCurrency,
					city: localStorage.getItem('guestCity') || null,
				})
				setSelectedLanguage(newLanguage)
				setSelectedCurrency(
					currencyOptions.find(opt => opt.code === newLanguage.defaultCurrency)!
				)
				localStorage.setItem(
					'guestSettings',
					JSON.stringify({
						language: res.language,
						currency: res.currency,
						city: res.city,
					})
				)
			}

			// const pathWithoutLocale = pathname.replace(`/${locale}`, '')
			// const newPath = `/${languageCode}${pathWithoutLocale}`
			// router.push(newPath)
		} catch (error) {
			throw new Error(
				handleApiError(error, tLanguageModal('errors.serverError'))
			)
		}
	}

	useEffect(() => {
		console.log('LanguageProvider: selectedLanguage', selectedLanguage)
		console.log('LanguageProvider: selectedCurrency', selectedCurrency)
		console.log(
			'LanguageProvider: localStorage',
			localStorage.getItem('guestSettings')
		)
	}, [selectedLanguage, selectedCurrency])

	return (
		<LanguageContext.Provider
			value={{
				languageOptions,
				currencyOptions,
				selectedLanguage,
				selectedCurrency,
				setLanguage,
				setCurrency,
			}}
		>
			{children}
		</LanguageContext.Provider>
	)
}

export function useLanguage() {
	const context = useContext(LanguageContext)
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context
}
