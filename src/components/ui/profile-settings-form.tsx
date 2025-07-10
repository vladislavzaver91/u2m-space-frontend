'use client'

import {
	Dispatch,
	SetStateAction,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react'
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
import { useRouter } from 'next/navigation'
import { CustomSearchSelect } from './custom-search-select'

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
	const { user, updateUser } = useUser()
	const { setSubmitForm, setIsSubmitDisabled } = useProfileForm()
	const { languageOptions, currencyOptions, updateSettings, translateCity } =
		useLanguage()

	const [isLoading, setIsLoading] = useState(false)
	const [cities, setCities] = useState<CityOption[]>([])
	const [] = useState(false)
	const [errors, setErrors] = useState<{ server: string }>({ server: '' })
	const [isComponentOpen, setIsComponentOpen] = useState({
		language: false,
		currency: false,
		city: false,
		deleteReason: false,
	})
	const [formData, setFormData] = useState<{
		language: 'en' | 'uk' | 'pl'
		currency: 'USD' | 'UAH' | 'EUR'
		city: string | null
		notifications: boolean
		showPhone: boolean
		advancedUser: boolean
		deleteReason: string | null
	}>({
		language: user?.language || 'en',
		currency: user?.currency || 'USD',
		city: user?.city || null,
		notifications: user?.notifications ?? true,
		showPhone: user?.showPhone ?? false,
		advancedUser: user?.advancedUser ?? false,
		deleteReason: user?.deleteReason || null,
	})

	const router = useRouter()
	const localeActive = useLocale() as 'en' | 'uk' | 'pl'

	const tProfile = useTranslations('Profile')

	const currencyOptionsMapped = currencyOptions.map(opt => ({
		code: opt.code,
		label: opt.name,
	}))

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

	useEffect(() => {
		if (user) {
			const loadCitiesAndSync = async () => {
				try {
					setIsLoading(true)
					const fetchedCities = await cityService.fetchAllCities(
						user.language || 'en'
					)
					setCities(fetchedCities)

					let translatedCity: string | null = null
					if (user.city) {
						translatedCity = translateCity(user.city, user.language || 'en')
					}

					setFormData({
						language: user.language || 'en',
						currency: user.currency || 'USD',
						city: translatedCity,
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
			loadCitiesAndSync()
		}
	}, [user, tProfile, translateCity])

	useEffect(() => {
		const updateCitiesOnLanguageChange = async () => {
			try {
				setIsLoading(true)
				const fetchedCities = await cityService.fetchAllCities(
					formData.language
				)
				setCities(fetchedCities)

				let translatedCity: string | null = formData.city
				if (formData.city) {
					translatedCity = translateCity(formData.city, formData.language)
				}

				setFormData(prev => ({
					...prev,
					city: formData.city,
				}))
			} catch (error) {
				console.error('Error updating cities on language change:', error)
				setErrors({ server: tProfile('errors.failedToLoadCities') })
			} finally {
				setIsLoading(false)
			}
		}
		updateCitiesOnLanguageChange()
	}, [formData.language, tProfile, translateCity])

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
		setFormData(prev => ({
			...prev,
			language: languageCode,
		}))
		setErrors({ server: '' })
	}

	const handleCurrencyChange = (currencyCode: 'USD' | 'UAH' | 'EUR') => {
		setFormData(prev => ({
			...prev,
			currency: currencyCode,
		}))
		setErrors({ server: '' })
	}

	const handleCityChange = (cityName: string) => {
		setFormData(prev => ({
			...prev,
			city: cityName || null,
		}))
		setErrors({ server: '' })
	}

	const handleNotificationsChange = async (checked: boolean) => {
		if (!user) return
		setFormData(prev => ({ ...prev, notifications: checked }))
		try {
			const updatedUser = await apiService.updateUserProfile(user.id, {
				notifications: checked,
			})
			updateUser(updatedUser)
		} catch (error: any) {
			console.error('Failed to update notifications:', error)
			setFormData(prev => ({
				...prev,
				notifications: user.notifications ?? true,
			}))
			setErrors({
				server: error.response?.data?.error || tProfile('errors.serverError'),
			})
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!user) return

		setIsLoading(true)
		setErrors({ server: '' })

		try {
			let translatedCity: string | null = formData.city
			if (formData.city) {
				translatedCity = translateCity(formData.city, formData.language)
			}

			const updateData = {
				language: formData.language,
				currency: formData.currency,
				city: translatedCity,
				notifications: formData.notifications,
				showPhone: formData.showPhone,
				advancedUser: formData.advancedUser,
			}

			console.log('Submitting:', updateData)
			const updatedUser = await apiService.updateUserProfile(
				user.id,
				updateData
			)
			updateUser(updatedUser)

			await updateSettings({
				languageCode: formData.language,
				currencyCode: formData.currency,
				city: translatedCity,
			})
			window.location.href = `/${formData.language}/selling-classifieds`
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
				router.push(`/${localeActive}/selling-classifieds`)
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

	useLayoutEffect(() => {
		setSubmitForm(() => handleSubmit)
	}, [formData, user, setSubmitForm])

	if (!user || isLoading) {
		return (
			<div className='flex flex-col items-center justify-center'>
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
					showLabel
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
				<CustomSearchSelect
					label={tProfile('settingFormInputs.place')}
					options={cities.map(city => city.name)}
					value={formData.city ?? ''}
					onChange={handleCityChange}
					languageCode={formData.language}
					onClick={() => !formData.advancedUser && onTooltipClick('city')}
					onOpenChange={isOpen =>
						setIsComponentOpen(prev => ({ ...prev, city: isOpen }))
					}
					showLabel
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
					onChange={handleNotificationsChange}
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
