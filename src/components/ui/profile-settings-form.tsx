'use client'

import { useEffect, useState } from 'react'
import { CustomSelect } from './custom-select'
import { CustomToggle } from './custom-toggle'
import { useTranslations } from 'next-intl'
import { Tooltip } from './tooltip'
import { User } from '@/types'
import { apiService } from '@/services/api.service'
import { useUser } from '@/helpers/contexts/user-context'
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
	const { user } = useUser()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		language: 'en',
		currency: 'USD',
		city: '',
		notifications: true,
		showPhone: false,
		advancedUser: false,
		deleteReason: '',
	})
	const [isComponentOpen, setIsComponentOpen] = useState({
		language: false,
		currency: false,
		city: false,
		deleteReason: false,
	})

	const router = useRouter()

	const tProfile = useTranslations('Profile')
	const tLanguageModal = useTranslations('LanguageModal')

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

	const userId = user!.id

	// Загрузка данных пользователя
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const updatedUser: User = await apiService.getUserProfile(userId)
				setFormData({
					language: updatedUser.language || 'en',
					currency: updatedUser.currency || 'USD',
					city: updatedUser.city || '',
					notifications: updatedUser.notifications ?? true,
					showPhone: updatedUser.showPhone ?? false,
					advancedUser: updatedUser.advancedUser ?? false,
					deleteReason: updatedUser.deleteReason || '',
				})
			} catch (error: any) {
				const errorMessage =
					error.response?.data?.error || tProfile('errors.serverError')
				console.error(errorMessage)
			}
		}
		fetchUser()
	}, [userId, tProfile])

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const updatedData = {
				language: formData.language,
				currency: formData.currency,
				city: formData.city || null,
				notifications: formData.notifications,
				showPhone: formData.showPhone,
				advancedUser: formData.advancedUser,
			}
			await apiService.updateUserProfile(userId, updatedData)
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error || tProfile('errors.serverError')
			console.error(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDeleteAccount = async () => {
		if (!formData.deleteReason) {
			console.log(tProfile('errors.selectDeleteReason'))
			return
		}
		if (confirm(tProfile('confirm.deleteAccount'))) {
			setIsLoading(true)
			try {
				await apiService.deleteUserProfile(userId)
				router.push(`/selling-classifieds`)
			} catch (error: any) {
				const errorMessage =
					error.response?.data?.error || tProfile('errors.serverError')
				console.error(errorMessage)
			} finally {
				setIsLoading(false)
			}
		}
	}

	return (
		<form
			className='space-y-2 w-full mx-auto sm:w-[300px]'
			onSubmit={handleSubmit}
		>
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
				<CustomSelect
					label={tProfile('settingFormInputs.languageRegion')}
					options={[
						tLanguageModal('chooseLanguageRegion.english'),

						tLanguageModal('chooseLanguageRegion.ukrainian'),
						tLanguageModal('chooseLanguageRegion.polish'),
					]}
					value={formData.language}
					onChange={value => setFormData({ ...formData, language: value })}
					onClick={() => onTooltipClick('language')}
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
					options={[
						tLanguageModal('chooseCurrency.americanDollar'),
						tLanguageModal('chooseCurrency.ukrainianHryvnia'),
						tLanguageModal('chooseCurrency.euro'),
					]}
					value={formData.currency}
					onChange={value => setFormData({ ...formData, currency: value })}
					onClick={() => onTooltipClick('currency')}
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
					options={[
						tLanguageModal('chooseCity.cities.newYork'),
						tLanguageModal('chooseCity.cities.london'),
						tLanguageModal('chooseCity.cities.kyiv'),
						tLanguageModal('chooseCity.cities.poltava'),
						tLanguageModal('chooseCity.cities.odessa'),
						tLanguageModal('chooseCity.cities.kharkiv'),
						tLanguageModal('chooseCity.cities.warsaw'),
					]}
					value={formData.city}
					onChange={value => setFormData({ ...formData, city: value })}
					onClick={() => onTooltipClick('city')}
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
					onClick={() => onTooltipClick('notifications')}
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
					onClick={() => onTooltipClick('showPhone')}
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
					onClick={() => onTooltipClick('advancedUser')}
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
					value={formData.deleteReason}
					onChange={value => setFormData({ ...formData, deleteReason: value })}
					onClick={() => onTooltipClick('deleteReason')}
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

			{/* Кнопки действий */}
			<div className='flex justify-between mt-4'>
				<button
					type='submit'
					disabled={isLoading}
					className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
				>
					{isLoading ? tProfile('loading') : tProfile('save')}
				</button>
				<button
					type='button'
					onClick={handleDeleteAccount}
					disabled={isLoading || !formData.deleteReason}
					className='px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50'
				>
					{tProfile('deleteAccount')}
				</button>
			</div>
		</form>
	)
}
