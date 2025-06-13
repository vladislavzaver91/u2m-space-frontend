'use client'

import { createContext, useContext, useState } from 'react'

interface ProfileFormContextType {
	submitForm: () => void
	setSubmitForm: (submit: () => void) => void
	isSubmitDisabled: boolean
	setIsSubmitDisabled: (disabled: boolean) => void
}

const ProfileFormContext = createContext<ProfileFormContextType | undefined>(
	undefined
)

export function ProfileFormProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [submitForm, setSubmitForm] = useState<() => void>(() => {})
	const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true)

	return (
		<ProfileFormContext.Provider
			value={{
				submitForm,
				setSubmitForm,
				isSubmitDisabled,
				setIsSubmitDisabled,
			}}
		>
			{children}
		</ProfileFormContext.Provider>
	)
}

export const useProfileForm = () => {
	const context = useContext(ProfileFormContext)
	if (!context) {
		throw new Error('useProfileForm must be used within a ProfileFormProvider')
	}
	return context
}
