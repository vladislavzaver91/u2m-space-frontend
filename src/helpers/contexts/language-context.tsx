'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from './auth-context'
import { apiService } from '@/services/api.service'
import { useUser } from './user-context'

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

	const { user } = useAuth()
	const { updateUser } = useUser()
	const userId = user?.id
	const router = useRouter()
	const pathname = usePathname()
	const locale = useLocale() as 'en' | 'uk' | 'pl'
	const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
		languageOptions.find(opt => opt.languageCode === locale) ||
			languageOptions[0]
	)
	const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(
		currencyOptions.find(opt => opt.code === user?.currency) ||
			currencyOptions[0]
	)

	// Загрузка валюты пользователя с бэкенда
	useEffect(() => {
		const fetchUserData = async () => {
			if (!userId) return
			try {
				const userData = await apiService.getUserProfile(userId)
				setSelectedLanguage(
					languageOptions.find(opt => opt.languageCode === userData.language) ||
						languageOptions.find(opt => opt.languageCode === locale) ||
						languageOptions[0]
				)
				setSelectedCurrency(
					currencyOptions.find(opt => opt.code === userData.currency) ||
						currencyOptions.find(
							opt =>
								opt.code ===
								(languageOptions.find(opt => opt.languageCode === locale)
									?.defaultCurrency || 'USD')
						) ||
						currencyOptions[0]
				)
			} catch (error) {
				console.error('Ошибка при загрузке данных пользователя:', error)
				setSelectedCurrency(
					currencyOptions.find(
						opt =>
							opt.code ===
							(languageOptions.find(opt => opt.languageCode === locale)
								?.defaultCurrency || 'USD')
					) || currencyOptions[0]
				)
			}
		}
		fetchUserData()
	}, [userId, locale, user?.currency])

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
		}
	}, [locale])

	// Обновление валюты на бэкенде
	const setCurrency = async (currencyCode: 'USD' | 'UAH' | 'EUR') => {
		if (!userId) return
		try {
			const updateData = { currency: currencyCode }
			const updatedUser = await apiService.updateUserProfile(userId, updateData)
			setSelectedCurrency(
				currencyOptions.find(opt => opt.code === currencyCode)!
			)
			updateUser(updatedUser)
			const pathWithoutLocale = pathname.replace(`/${locale}`, '')
			router.push(`/${locale}${pathWithoutLocale}`)
		} catch (error) {
			console.error('Ошибка при обновлении валюты:', error)
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
		if (newLanguage && userId) {
			try {
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
				const pathWithoutLocale = pathname.replace(`/${locale}`, '')
				const newPath = `/${languageCode}${pathWithoutLocale}`
				router.push(newPath)
			} catch (error) {
				console.error('Ошибка при обновлении языка:', error)
			}
		}
	}

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
