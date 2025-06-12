'use client'

import { startTransition, useEffect, useLayoutEffect, useState } from 'react'
import { CustomSelect } from './custom-select'
import { CustomToggle } from './custom-toggle'
import { useLocale, useTranslations } from 'next-intl'
import { Tooltip } from './tooltip'
import { CityOption, UpdateUserProfileData, User } from '@/types'
import { apiService } from '@/services/api.service'
import { useUser } from '@/helpers/contexts/user-context'
import { useProfileForm } from '@/helpers/contexts/profile-form-context'
import { Loader } from './loader'
import { cityService } from '@/services/cities.service'
import { useLanguage } from '@/helpers/contexts/language-context'
import { CustomLanguageSelect } from './custom-language-select'
import { useRouter } from '@/i18n/routing'

interface ProfileSettingsFormProps {
	onMouseEnter: (
		field:
			| 'language'
			| 'currency'
			| 'city'
			| 'notifications'
			| 'showPhone'
			| 'advancedUser'
			| 'deleteReason'
	) => void
	onMouseLeave: (
		field:
			| 'language'
			| 'currency'
			| 'city'
			| 'notifications'
			| 'showPhone'
			| 'advancedUser'
			| 'deleteReason'
	) => void
	onTooltipClick: (
		field:
			| 'language'
			| 'currency'
			| 'city'
			| 'notifications'
			| 'showPhone'
			| 'advancedUser'
			| 'deleteReason'
	) => void
	tooltipVisible: Record<
		| 'language'
		| 'currency'
		| 'city'
		| 'notifications'
		| 'showPhone'
		| 'advancedUser'
		| 'deleteReason',
		boolean
	>
	isTooltipClicked: Record<
		| 'nickname'
		| 'name'
		| 'surname'
		| 'gender'
		| 'birthday'
		| 'email'
		| 'phoneNumber'
		| 'extraPhoneNumber'
		| 'language'
		| 'currency'
		| 'city'
		| 'notifications'
		| 'showPhone'
		| 'advancedUser'
		| 'deleteReason',
		boolean
	>
}

export const ProfileSettingsForm = ({
	onMouseEnter,
	onMouseLeave,
	onTooltipClick,
	tooltipVisible,
	isTooltipClicked,
}: ProfileSettingsFormProps) => {
	const { user, updateUser, loading } = useUser()
	const { setSubmitForm, setIsSubmitDisabled } = useProfileForm()
	const { languageOptions, currencyOptions, setLanguage, setCurrency } =
		useLanguage()

	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState<{
		language: 'en' | 'uk' | 'pl'
		currency: 'USD' | 'UAH' | 'EUR'
		city: string | null
		cityId: number
		notifications: boolean
		showPhone: boolean
		advancedUser: boolean
		deleteReason: string | null
	}>({
		language: 'en',
		currency: 'USD',
		city: null,
		cityId: 0,
		notifications: true,
		showPhone: false,
		advancedUser: false,
		deleteReason: null,
	})

	const [cities, setCities] = useState<CityOption[]>([])

	const [errors, setErrors] = useState<{ server: string }>({
		server: '',
	})
	const [isComponentOpen, setIsComponentOpen] = useState({
		language: false,
		currency: false,
		city: false,
		deleteReason: false,
	})

	const router = useRouter()
	const localeActive = useLocale() as 'en' | 'uk' | 'pl'

	const tProfile = useTranslations('Profile')
	const tLanguageModal = useTranslations('LanguageModal')

	// Маппинг для валют
	const currencyOptionsMapped = currencyOptions.map(opt => ({
		code: opt.code,
		label: opt.name,
	}))

	// Маппинг languageOptions с переводами
	const translatedLanguageOptions = languageOptions.map(opt => ({
		...opt,
		language: opt.language,
		country: opt.country,
	}))

	const deleteReasons = [
		tProfile('settingFormInputs.deleteAccountOption1'),
		tProfile('settingFormInputs.deleteAccountOption2'),
		tProfile('settingFormInputs.deleteAccountOption3'),
		tProfile('settingFormInputs.deleteAccountOption4'),
		tProfile('settingFormInputs.deleteAccountOption5'),
		tProfile('settingFormInputs.deleteAccountOption6'),
		tProfile('settingFormInputs.deleteAccountOption7'),
		tProfile('settingFormInputs.deleteAccountOption8'),
		tProfile('settingFormInputs.deleteAccountOption9'),
		tProfile('settingFormInputs.deleteAccountOption10'),
		tProfile('settingFormInputs.deleteAccountOption11'),
		tProfile('settingFormInputs.deleteAccountOption12'),
		tProfile('settingFormInputs.deleteAccountOption13'),
	]

	// Загрузка данных пользователя и городов
	useEffect(() => {
		if (user) {
			const loadCitiesAndSyncCity = async () => {
				try {
					setIsLoading(true)
					const language = user.language || 'en' // Используем user.language
					const fetchedCities = await cityService.fetchAllCities(language)
					setCities(fetchedCities)

					let translatedCity: string | null = null
					let cityId = 0
					if (user.city) {
						const translated = cityService.getTranslatedCityName(
							user.city,
							language
						)
						translatedCity = translated || user.city
						const selectedCity = fetchedCities.find(
							city => city.name === translatedCity
						)
						cityId = selectedCity ? selectedCity.id : 0
						console.log('Initial city:', {
							userCity: user.city,
							language,
							translatedCity,
							cityId,
							fetchedCities: fetchedCities.map(c => c.name),
						})
					}

					setFormData({
						language: user.language || 'en',
						currency: user.currency || 'USD',
						city: translatedCity,
						cityId,
						notifications: user.notifications ?? true,
						showPhone: user.showPhone ?? false,
						advancedUser: user.advancedUser ?? false,
						deleteReason: user.deleteReason || null,
					})

					setErrors({ server: '' })
				} catch (error) {
					console.error('Error loading cities:', error)
					setErrors({ server: tProfile('errors.failedToLoadCities') })
				} finally {
					setIsLoading(false)
				}
			}
			loadCitiesAndSyncCity()
		}
	}, [user, tProfile])

	// Обновление городов и перевода при смене языка
	useEffect(() => {
		const updateCitiesOnLanguageChange = async () => {
			try {
				setIsLoading(true)
				const fetchedCities = await cityService.fetchAllCities(
					formData.language
				)
				setCities(fetchedCities)

				let translatedCity: string | null = formData.city
				let cityId = formData.cityId
				if (formData.city) {
					const translated = cityService.getTranslatedCityName(
						formData.city,
						formData.language
					)
					translatedCity = translated || formData.city
					const selectedCity = fetchedCities.find(
						city => city.name === translatedCity
					)
					cityId = selectedCity ? selectedCity.id : 0
					console.log('Language change:', {
						oldCity: formData.city,
						translatedCity,
						cityId,
						language: formData.language,
						fetchedCities: fetchedCities.map(c => c.name),
					})
				}

				setFormData(prev => ({
					...prev,
					city: translatedCity,
					cityId,
				}))
			} catch (error) {
				console.error('Error updating cities on language change:', error)
				setErrors({ server: tProfile('errors.failedToLoadCities') })
			} finally {
				setIsLoading(false)
			}
		}
		updateCitiesOnLanguageChange()
	}, [formData.language, tProfile])

	// Обновление состояния кнопки submit
	useLayoutEffect(() => {
		const isFormValid = !isLoading && !errors.server
		setIsSubmitDisabled(!isFormValid)
	}, [formData, errors, isLoading, setIsSubmitDisabled])

	const handleMouseEnter = (
		field: keyof typeof tooltipVisible,
		isOpen: boolean
	) => {
		if (!isOpen) {
			onMouseEnter(field)
		}
	}

	const handleMouseLeave = (
		field: keyof typeof tooltipVisible,
		isOpen: boolean
	) => {
		if (!isOpen) {
			onMouseLeave(field)
		}
	}

	const handleLanguageChange = (languageCode: 'en' | 'uk' | 'pl') => {
		setFormData({ ...formData, language: languageCode })
		setErrors({ server: '' })
	}

	const handleCurrencyChange = (currencyCode: 'USD' | 'UAH' | 'EUR') => {
		setFormData({ ...formData, currency: currencyCode })
		setErrors({ server: '' })
	}

	const handleCityChange = (cityName: string) => {
		const selectedCity = cities.find(city => city.name === cityName)
		setFormData({
			...formData,
			city: cityName || null,
			cityId: selectedCity ? selectedCity.id : 0,
		})
		console.log('City selected:', { cityName, cityId: selectedCity?.id })
		setErrors({ server: '' })
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!user) return

		setIsLoading(true)
		setErrors({ server: '' })

		try {
			let englishCity: string | null = formData.city
			if (formData.city) {
				englishCity =
					cityService.getTranslatedCityName(formData.city, 'en') ||
					formData.city
			}
			console.log('Submitting:', { formDataCity: formData.city, englishCity })

			const updateData: UpdateUserProfileData = {
				language: formData.language,
				currency: formData.currency,
				city: englishCity,
				notifications: formData.notifications,
				showPhone: formData.showPhone,
				advancedUser: formData.advancedUser,
			}

			const updatedUser = await apiService.updateUserProfile(
				user.id,
				updateData
			)
			updateUser(updatedUser)

			const selectedLanguageOption = languageOptions.find(
				opt => opt.languageCode === updatedUser.language
			)
			if (selectedLanguageOption) {
				await setLanguage(
					selectedLanguageOption.languageCode,
					selectedLanguageOption.countryCode
				)
				console.log('await setLanguage')
				await setCurrency(updatedUser.currency)
				console.log('await setCurrency')
			}

			let translatedCity: string | null = null
			let cityId = 0
			if (updatedUser.city) {
				const translated = cityService.getTranslatedCityName(
					updatedUser.city,
					updatedUser.language || 'en'
				)
				translatedCity = translated || updatedUser.city
				const selectedCity = cities.find(city => city.name === translatedCity)
				cityId = selectedCity ? selectedCity.id : 0
				console.log('After submit:', {
					updatedUserCity: updatedUser.city,
					translatedCity,
					cityId,
				})
			}

			setFormData({
				language: updatedUser.language || 'en',
				currency: updatedUser.currency || 'USD',
				city: translatedCity,
				cityId,
				notifications: updatedUser.notifications ?? true,
				showPhone: updatedUser.showPhone ?? false,
				advancedUser: updatedUser.advancedUser ?? false,
				deleteReason: updatedUser.deleteReason || null,
			})

			window.location.href = `/${localeActive}/selling-classifieds`
		} catch (error: any) {
			console.error('Submit error:', error)
			const errorMessage =
				error.response?.data?.error || tProfile('errors.serverError')
			setErrors({
				server: Array.isArray(errorMessage)
					? errorMessage.join(', ')
					: errorMessage,
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleDeleteAccount = async (reason: string) => {
		if (!user) return

		if (confirm(tProfile('confirm.deleteAccount'))) {
			setIsLoading(true)
			setErrors({ server: '' })
			try {
				await apiService.deleteUserProfile(user.id, { deleteReason: reason })
				router.push('/selling-classifieds')
			} catch (error: any) {
				console.error('Delete account error:', error)
				const errorMessage =
					error.response?.data?.error || tProfile('errors.deleteAccount')
				setErrors({
					server: Array.isArray(errorMessage)
						? errorMessage.join(', ')
						: errorMessage,
				})
			} finally {
				setIsLoading(false)
			}
		}
	}

	// Установка функции сабмита в контекст
	useLayoutEffect(() => {
		setSubmitForm(() => handleSubmit)
	}, [formData, user, setSubmitForm])

	// Установка функции сабмита в контекст
	useLayoutEffect(() => {
		setSubmitForm(() => handleSubmit)
	}, [formData, user, setSubmitForm])

	if (isLoading || loading || !user) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<form className='space-y-2 w-full mx-auto sm:w-[300px]'>
			{/* Language and region */}
			<div
				className='relative'
				onMouseEnter={() =>
					handleMouseEnter('language', isComponentOpen.language)
				}
				onMouseLeave={() =>
					handleMouseLeave('language', isComponentOpen.language)
				}
			>
				<CustomLanguageSelect
					label={tProfile('settingFormInputs.languageRegion')}
					options={translatedLanguageOptions}
					value={formData.language}
					onChange={handleLanguageChange}
					onClick={() => !formData.advancedUser && onTooltipClick('language')}
					onOpenChange={isOpen =>
						setIsComponentOpen(prev => ({ ...prev, language: isOpen }))
					}
				/>
				{!formData.advancedUser && (
					<Tooltip
						title={tProfile('settingTooltips.languageRegion.name')}
						text={tProfile('settingTooltips.languageRegion.description')}
						visible={tooltipVisible.language}
						isClicked={isTooltipClicked.language}
					/>
				)}
			</div>

			{/* currency */}
			<div
				className='relative'
				onMouseEnter={() =>
					handleMouseEnter('currency', isComponentOpen.currency)
				}
				onMouseLeave={() =>
					handleMouseLeave('currency', isComponentOpen.currency)
				}
			>
				<CustomSelect
					label={tProfile('settingFormInputs.currency')}
					options={currencyOptionsMapped.map(opt => opt.label)}
					value={
						currencyOptionsMapped.find(opt => opt.code === formData.currency)
							?.label || ''
					}
					onChange={value => {
						const selected = currencyOptionsMapped.find(
							opt => opt.label === value
						)
						if (selected) {
							handleCurrencyChange(selected.code)
						}
					}}
					onClick={() => !formData.advancedUser && onTooltipClick('currency')}
					onOpenChange={isOpen =>
						setIsComponentOpen(prev => ({ ...prev, currency: isOpen }))
					}
				/>
				{!formData.advancedUser && (
					<Tooltip
						title={tProfile('settingTooltips.currency.name')}
						text={tProfile('settingTooltips.currency.description')}
						visible={tooltipVisible.currency}
						isClicked={isTooltipClicked.currency}
					/>
				)}
			</div>

			{/* Place */}
			<div
				className='relative'
				onMouseEnter={() => handleMouseEnter('city', isComponentOpen.city)}
				onMouseLeave={() => handleMouseLeave('city', isComponentOpen.city)}
			>
				<CustomSelect
					label={tProfile('settingFormInputs.place')}
					options={cities.map(city => city.name)}
					value={formData.city ?? ''}
					onChange={handleCityChange}
					onClick={() => !formData.advancedUser && onTooltipClick('city')}
					onOpenChange={isOpen =>
						setIsComponentOpen(prev => ({ ...prev, city: isOpen }))
					}
				/>
				{!formData.advancedUser && (
					<Tooltip
						title={tProfile('settingTooltips.place.name')}
						text={tProfile('settingTooltips.place.description')}
						visible={tooltipVisible.city}
						isClicked={isTooltipClicked.city}
					/>
				)}
			</div>

			{/* notifications */}
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('notifications')}
				onMouseLeave={() => onMouseLeave('notifications')}
			>
				<CustomToggle
					label={tProfile('settingFormInputs.notifications')}
					checked={formData.notifications}
					onChange={checked =>
						setFormData({ ...formData, notifications: checked })
					}
					onClick={() =>
						!formData.advancedUser && onTooltipClick('notifications')
					}
				/>
				{!formData.advancedUser && (
					<Tooltip
						title={tProfile('settingTooltips.notifications.name')}
						text={tProfile('settingTooltips.notifications.description')}
						visible={tooltipVisible.notifications}
						isClicked={isTooltipClicked.notifications}
					/>
				)}
			</div>

			{/* showPhone */}
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('showPhone')}
				onMouseLeave={() => onMouseLeave('showPhone')}
			>
				<CustomToggle
					label={tProfile('settingFormInputs.showPhone')}
					checked={formData.showPhone}
					onChange={checked => setFormData({ ...formData, showPhone: checked })}
					onClick={() => !formData.advancedUser && onTooltipClick('showPhone')}
				/>
				{!formData.advancedUser && (
					<Tooltip
						title={tProfile('settingTooltips.showPhone.name')}
						text={tProfile('settingTooltips.showPhone.description')}
						visible={tooltipVisible.showPhone}
						isClicked={isTooltipClicked.showPhone}
					/>
				)}
			</div>

			{/* Advanced user */}
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('advancedUser')}
				onMouseLeave={() => onMouseLeave('advancedUser')}
			>
				<CustomToggle
					label={tProfile('settingFormInputs.advancedUser')}
					checked={formData.advancedUser}
					onChange={checked =>
						setFormData({ ...formData, advancedUser: checked })
					}
					onClick={() =>
						!formData.advancedUser && onTooltipClick('advancedUser')
					}
				/>
				{!formData.advancedUser && (
					<Tooltip
						title={tProfile('settingTooltips.advancedUser.name')}
						text={tProfile('settingTooltips.advancedUser.description')}
						visible={tooltipVisible.advancedUser}
						isClicked={isTooltipClicked.advancedUser}
					/>
				)}
			</div>

			{/* Delete Account */}
			<div
				className='relative'
				onMouseEnter={() =>
					handleMouseEnter('deleteReason', isComponentOpen.deleteReason)
				}
				onMouseLeave={() =>
					handleMouseLeave('deleteReason', isComponentOpen.deleteReason)
				}
			>
				<CustomSelect
					label={tProfile('settingFormInputs.deleteAccount')}
					options={deleteReasons}
					value={formData.deleteReason || ''}
					onChange={value => {
						setFormData({ ...formData, deleteReason: value || null })
						if (value) {
							handleDeleteAccount(value)
						}
					}}
					onClick={() =>
						!formData.advancedUser && onTooltipClick('deleteReason')
					}
					onOpenChange={isOpen =>
						setIsComponentOpen(prev => ({ ...prev, deleteReason: isOpen }))
					}
				/>
				{!formData.advancedUser && (
					<Tooltip
						title={tProfile('settingTooltips.deleteAccount.name')}
						text={tProfile('settingTooltips.deleteAccount.description')}
						visible={tooltipVisible.deleteReason}
						isClicked={isTooltipClicked.deleteReason}
					/>
				)}
			</div>
		</form>
	)
}
