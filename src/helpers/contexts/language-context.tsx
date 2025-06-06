'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useAuth } from './auth-context'
import { apiService } from '@/services/api.service'

interface LanguageOption {
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

const languageOptions: LanguageOption[] = [
	{
		language: 'English',
		country: 'United States',
		languageCode: 'en',
		countryCode: 'US',
		defaultCurrency: 'USD',
	},
	{
		language: 'Українська',
		country: 'Україна',
		languageCode: 'uk',
		countryCode: 'UA',
		defaultCurrency: 'UAH',
	},
	{
		language: 'Polski',
		country: 'Polska',
		languageCode: 'pl',
		countryCode: 'PL',
		defaultCurrency: 'EUR',
	},
]

const currencyOptions: CurrencyOption[] = [
	{
		name: 'Американський долар',
		symbol: 'USD – $',
		code: 'USD',
	},
	{
		name: 'Українська гривня',
		symbol: 'UAH – ₴',
		code: 'UAH',
	},
	{
		name: 'Євро',
		symbol: 'EUR – €',
		code: 'EUR',
	},
]

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const { user } = useAuth()
	const userId = user?.id
	const router = useRouter()
	const pathname = usePathname()
	const locale = useLocale() as 'en' | 'uk' | 'pl'
	const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
		languageOptions.find(opt => opt.languageCode === locale) ||
			languageOptions[0]
	)
	const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(
		currencyOptions.find(
			opt => opt.code === selectedLanguage.defaultCurrency
		) || currencyOptions[0]
	)

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
		}
	}, [locale])

	// Обновление валюты на бэкенде
	const setCurrency = async (currencyCode: 'USD' | 'UAH' | 'EUR') => {
		if (!userId) return
		try {
			await apiService.updateUserCurrency(userId, currencyCode)
			setSelectedCurrency(
				currencyOptions.find(opt => opt.code === currencyCode)!
			)
		} catch (error) {
			console.error('Ошибка при обновлении валюты:', error)
		}
	}

	// Смена языка и страны
	const setLanguage = (
		languageCode: 'en' | 'uk' | 'pl',
		countryCode: 'US' | 'UA' | 'PL'
	) => {
		const newLanguage = languageOptions.find(
			opt =>
				opt.languageCode === languageCode && opt.countryCode === countryCode
		)
		if (newLanguage) {
			const pathWithoutLocale = pathname.replace(`/${locale}`, '')
			const newPath = `/${languageCode}${pathWithoutLocale}`
			router.push(newPath)
			setSelectedLanguage(newLanguage)
			setCurrency(newLanguage.defaultCurrency) // Автоматически устанавливаем валюту страны
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
