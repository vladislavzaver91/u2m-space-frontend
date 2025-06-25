'use client'

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	useRef,
	useLayoutEffect,
} from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from './auth-context'
import { useUser } from './user-context'
import { apiService } from '@/services/api.service'
import { cityService } from '@/services/cities.service'
import { handleApiError } from '@/helpers/functions/handle-api-error'
import { usePathname, useRouter } from 'next/navigation'

export interface LanguageOption {
	language: string
	country: string
	languageCode: 'en' | 'uk' | 'pl'
	countryCode: 'US' | 'UA' | 'PL'
	defaultCurrency: 'USD' | 'UAH' | 'EUR'
}

export interface CurrencyOption {
	name: string
	symbol: string
	code: 'USD' | 'UAH' | 'EUR'
}

interface Settings {
	languageCode: 'en' | 'uk' | 'pl'
	countryCode: 'US' | 'UA' | 'PL'
	currencyCode: 'USD' | 'UAH' | 'EUR'
	city: string | null
}

interface LanguageContextType {
	languageOptions: LanguageOption[]
	currencyOptions: CurrencyOption[]
	settings: Settings
	updateSettings: (newSettings: Partial<Settings>) => Promise<void>
	translateCity: (city: string, languageCode: 'en' | 'uk' | 'pl') => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const tLanguageModal = useTranslations('LanguageModal')
	const { authUser } = useAuth()
	const { updateUser } = useUser()
	const userId = authUser?.id
	const router = useRouter()
	const pathname = usePathname()
	const locale = useLocale() as 'en' | 'uk' | 'pl'

	/// useRef для отслеживания синхронизации
	const isSyncingRef = useRef(false)
	const lastSyncedUserIdRef = useRef<string | undefined>(undefined)

	// Мемоизация languageOptions и currencyOptions
	const languageOptions = useMemo<LanguageOption[]>(
		() => [
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
		],
		[tLanguageModal]
	)

	const currencyOptions = useMemo<CurrencyOption[]>(
		() => [
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
		],
		[tLanguageModal]
	)

	// Инициализация настроек
	const [settings, setSettings] = useState<Settings>(() => {
		const defaultLanguage =
			languageOptions.find(opt => opt.languageCode === locale) ||
			languageOptions[0]
		const defaultSettings: Settings = {
			languageCode: defaultLanguage.languageCode,
			countryCode: defaultLanguage.countryCode,
			currencyCode: defaultLanguage.defaultCurrency,
			city: null,
		}

		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('guestSettings')
			if (saved) {
				const parsed = JSON.parse(saved)
				const savedLanguage = languageOptions.find(
					opt => opt.languageCode === parsed.language
				)
				const savedCurrency = currencyOptions.find(
					opt => opt.code === parsed.currency
				)
				return {
					languageCode: savedLanguage
						? savedLanguage.languageCode
						: defaultLanguage.languageCode,
					countryCode: savedLanguage
						? savedLanguage.countryCode
						: defaultLanguage.countryCode,
					currencyCode: savedCurrency
						? savedCurrency.code
						: defaultLanguage.defaultCurrency,
					city: parsed.city || null,
				}
			}
		}
		return defaultSettings
	})

	// Синхронизация при авторизации
	useLayoutEffect(() => {
		if (
			!userId ||
			isSyncingRef.current ||
			lastSyncedUserIdRef.current === userId
		) {
			console.log('Sync skipped:', {
				userId,
				isSyncing: isSyncingRef.current,
				lastSyncedUserId: lastSyncedUserIdRef.current,
			})
			return
		}

		console.log('Starting sync for userId:', userId)
		isSyncingRef.current = true

		const syncUserSettings = async () => {
			try {
				// Получаем текущие настройки из localStorage
				const saved = localStorage.getItem('guestSettings')
				let guestSettings: Partial<Settings> = {}
				if (saved) {
					guestSettings = JSON.parse(saved)
					console.log('Guest settings from localStorage:', guestSettings)
				}

				// Получаем данные профиля с сервера
				const userData = await apiService.getUserProfile(userId)
				console.log('Fetched user data:', userData)

				// Формируем новые настройки, отдавая приоритет localStorage
				const userLanguage =
					languageOptions.find(
						opt =>
							opt.languageCode ===
							(guestSettings.languageCode || userData.language || locale)
					) || languageOptions[0]
				const newSettings: Settings = {
					languageCode:
						guestSettings.languageCode || userData.language || locale,
					countryCode: userLanguage.countryCode,
					currencyCode:
						guestSettings.currencyCode ||
						userData.currency ||
						userLanguage.defaultCurrency,
					city: guestSettings.city || userData.city || null,
				}

				// Проверяем, изменились ли настройки
				if (
					newSettings.languageCode !== settings.languageCode ||
					newSettings.countryCode !== settings.countryCode ||
					newSettings.currencyCode !== settings.currencyCode ||
					newSettings.city !== settings.city
				) {
					console.log('Settings changed, updating:', newSettings)
					setSettings(newSettings)
					localStorage.setItem(
						'guestSettings',
						JSON.stringify({
							language: newSettings.languageCode,
							currency: newSettings.currencyCode,
							city: newSettings.city,
						})
					)

					// Обновляем серверные данные настройками из localStorage
					const updateData = {
						language: newSettings.languageCode,
						currency: newSettings.currencyCode,
						city: newSettings.city || null,
					}
					console.log('Updating user profile with:', updateData)
					const updatedUser = await apiService.updateUserProfile(
						userId,
						updateData
					)
					updateUser(updatedUser)
				} else {
					console.log('No settings changes, skipping update')
				}

				lastSyncedUserIdRef.current = userId
			} catch (error) {
				console.error('Error syncing user settings:', error)
			} finally {
				isSyncingRef.current = false
				console.log('Sync completed for userId:', userId)
			}
		}

		syncUserSettings()
	}, [userId, locale, languageOptions, settings, updateUser])

	// Синхронизация с локалью сайта
	useLayoutEffect(() => {
		const currentLanguage = languageOptions.find(
			opt => opt.languageCode === locale
		)
		if (
			currentLanguage &&
			currentLanguage.languageCode !== settings.languageCode
		) {
			console.log('Locale changed, updating settings:', {
				locale,
				currentLanguage,
			})
			const newSettings: Settings = {
				...settings,
				languageCode: currentLanguage.languageCode,
				countryCode: currentLanguage.countryCode,
				currencyCode: settings.currencyCode,
			}
			setSettings(newSettings)
			localStorage.setItem(
				'guestSettings',
				JSON.stringify({
					language: newSettings.languageCode,
					currency: newSettings.currencyCode,
					city: newSettings.city,
				})
			)
		}
	}, [locale, languageOptions, settings])

	// Единая функция для обновления настроек
	const updateSettings = async (newSettings: Partial<Settings>) => {
		try {
			console.log('updateSettings called with:', newSettings)
			const languageOption =
				languageOptions.find(
					opt =>
						opt.languageCode ===
						(newSettings.languageCode || settings.languageCode)
				) || languageOptions[0]

			const updatedSettings: Settings = {
				...settings,
				...newSettings,
				countryCode: newSettings.languageCode
					? languageOption.countryCode
					: settings.countryCode,
				currencyCode: newSettings.currencyCode
					? newSettings.currencyCode
					: newSettings.languageCode
					? languageOption.defaultCurrency
					: settings.currencyCode,
			}

			// Перевод города, если он есть и меняется язык
			if (updatedSettings.city && newSettings.languageCode) {
				updatedSettings.city =
					cityService.getTranslatedCityName(
						updatedSettings.city,
						newSettings.languageCode
					) || updatedSettings.city
			}

			// Обновляем состояние
			setSettings(updatedSettings)

			// Сохраняем в localStorage
			localStorage.setItem(
				'guestSettings',
				JSON.stringify({
					language: updatedSettings.languageCode,
					currency: updatedSettings.currencyCode,
					city: updatedSettings.city,
				})
			)

			// Обновляем сервер
			if (userId) {
				const updateData = {
					language: updatedSettings.languageCode,
					currency: updatedSettings.currencyCode,
					city: updatedSettings.city || null,
				}
				console.log('Updating user profile with:', updateData)
				const updatedUser = await apiService.updateUserProfile(
					userId,
					updateData
				)
				updateUser(updatedUser)
			} else {
				console.log('Updating guest settings with:', {
					language: updatedSettings.languageCode,
					currency: updatedSettings.currencyCode,
					city: updatedSettings.city || null,
				})
				await apiService.updateGuestSettings({
					language: updatedSettings.languageCode,
					currency: updatedSettings.currencyCode,
					city: updatedSettings.city || null,
				})
			}

			// Обновляем маршрут, если изменился язык
			if (newSettings.languageCode && newSettings.languageCode !== locale) {
				const pathWithoutLocale = pathname.replace(`/${locale}`, '')
				const newPath = `/${newSettings.languageCode}${pathWithoutLocale}`
				console.log('Navigating to new path:', newPath)
				router.push(newPath)
			}
		} catch (error) {
			console.error('Error updating settings:', error)
			throw new Error(
				handleApiError(error, tLanguageModal('errors.serverError'))
			)
		}
	}

	// Функция для перевода города
	const translateCity = (city: string, languageCode: 'en' | 'uk' | 'pl') => {
		return cityService.getTranslatedCityName(city, languageCode) || city
	}

	return (
		<LanguageContext.Provider
			value={{
				languageOptions,
				currencyOptions,
				settings,
				updateSettings,
				translateCity,
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
