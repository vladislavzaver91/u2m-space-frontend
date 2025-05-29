'use client'

import { useState } from 'react'
import { CustomSelect } from './custom-select'
import { CustomToggle } from './custom-toggle'
import { useTranslations } from 'next-intl'
import { Tooltip } from './tooltip'

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
}

export const ProfileSettingsForm = ({
	onMouseEnter,
	onMouseLeave,
	tooltipVisible,
}: ProfileSettingsFormProps) => {
	const [formData, setFormData] = useState({
		language: '',
		currency: '',
		city: '',
		notifications: false,
		showPhone: false,
		advancedUser: false,
		deleteReason: '',
	})
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

	return (
		<form className='space-y-2 w-full mx-auto sm:w-[300px]'>
			{/* Language and region */}
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('language')}
				onMouseLeave={() => onMouseLeave('language')}
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
				/>
				<Tooltip
					title={tProfile('settingTooltips.languageRegion.name')}
					text={tProfile('settingTooltips.languageRegion.description')}
					visible={tooltipVisible.language}
				/>
			</div>

			{/* currency */}
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('currency')}
				onMouseLeave={() => onMouseLeave('currency')}
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
				/>
				<Tooltip
					title={tProfile('settingTooltips.currency.name')}
					text={tProfile('settingTooltips.currency.description')}
					visible={tooltipVisible.currency}
				/>
			</div>

			{/* Place */}
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('city')}
				onMouseLeave={() => onMouseLeave('city')}
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
				/>
				<Tooltip
					title={tProfile('settingTooltips.place.name')}
					text={tProfile('settingTooltips.place.description')}
					visible={tooltipVisible.city}
				/>
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
				/>
				<Tooltip
					title={tProfile('settingTooltips.notifications.name')}
					text={tProfile('settingTooltips.notifications.description')}
					visible={tooltipVisible.notifications}
				/>
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
				/>
				<Tooltip
					title={tProfile('settingTooltips.showPhone.name')}
					text={tProfile('settingTooltips.showPhone.description')}
					visible={tooltipVisible.showPhone}
				/>
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
				/>
				<Tooltip
					title={tProfile('settingTooltips.advancedUser.name')}
					text={tProfile('settingTooltips.advancedUser.description')}
					visible={tooltipVisible.advancedUser}
				/>
			</div>

			{/* Delete Account */}
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('deleteReason')}
				onMouseLeave={() => onMouseLeave('deleteReason')}
			>
				<CustomSelect
					label={tProfile('settingFormInputs.deleteAccount')}
					options={deleteReasons}
					value={formData.deleteReason}
					onChange={value => setFormData({ ...formData, deleteReason: value })}
				/>
				<Tooltip
					title={tProfile('settingTooltips.deleteAccount.name')}
					text={tProfile('settingTooltips.deleteAccount.description')}
					visible={tooltipVisible.deleteReason}
				/>
			</div>
		</form>
	)
}
