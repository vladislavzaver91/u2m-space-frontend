'use client'

import { useState } from 'react'
import { CustomSelect } from './custom-select'
import { CustomToggle } from './custom-toggle'

export const ProfileSettingsForm = () => {
	const [formData, setFormData] = useState({
		language: '',
		currency: '',
		city: '',
		notifications: false,
		showPhone: false,
		advancedUser: false,
		deleteReason: '',
	})

	const deleteReasons = [
		'I no longer use the service',
		'Too expensive',
		'Found a better alternative',
		'Not satisfied with the quality',
		'I have security or privacy concerns',
		'Too much spam or unnecessary messages',
		'Temporarily deleting, planning to come back later',
		'Created a new account',
		"Can't find the functionality I need",
		'Technical issues, frequent crashes',
		"I'm not happy with the company's policies",
		'Account was hacked',
		'Other personal reasons',
	]

	return (
		<form className='space-y-2 w-full mx-auto sm:w-[300px]'>
			<CustomSelect
				label='Language and region'
				options={['English (UK)', 'Ukraine', 'Polish']}
				value={formData.language}
				onChange={value => setFormData({ ...formData, language: value })}
			/>
			<CustomSelect
				label='Currency'
				options={['USD', 'UAH', 'EUR']}
				value={formData.currency}
				onChange={value => setFormData({ ...formData, currency: value })}
			/>
			<CustomSelect
				label='Place'
				options={['New York', 'London', 'Moscow', 'Madrid']}
				value={formData.city}
				onChange={value => setFormData({ ...formData, city: value })}
			/>
			<CustomToggle
				label='Notifications'
				checked={formData.notifications}
				onChange={checked =>
					setFormData({ ...formData, notifications: checked })
				}
			/>
			<CustomToggle
				label='Show Phone'
				checked={formData.showPhone}
				onChange={checked => setFormData({ ...formData, showPhone: checked })}
			/>
			<CustomToggle
				label='Advanced user'
				checked={formData.advancedUser}
				onChange={checked =>
					setFormData({ ...formData, advancedUser: checked })
				}
			/>
			<CustomSelect
				label='Delete Account'
				options={deleteReasons}
				value={formData.deleteReason}
				onChange={value => setFormData({ ...formData, deleteReason: value })}
			/>
		</form>
	)
}
