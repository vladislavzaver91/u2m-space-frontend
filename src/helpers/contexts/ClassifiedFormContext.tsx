'use client'

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from 'react'

interface ClassifiedFormData {
	title: string
	description: string
	price: string
}

interface ClassifiedFormState {
	isFormValid: boolean
	hasImages: boolean
	isPublishDisabled: boolean
	submitForm: () => void
	setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>
	setFormState: (state: {
		isValid: boolean
		imageFiles: File[]
		formData: ClassifiedFormData
		submit: (data: ClassifiedFormData) => void
	}) => void
}

interface FormStateParams {
	isValid: boolean
	imageFiles: File[]
	formData: ClassifiedFormData
	submit: (data: ClassifiedFormData) => void
}

const ClassifiedFormContext = createContext<ClassifiedFormState | undefined>(
	undefined
)

export const ClassifiedFormProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const [isFormValid, setIsFormValid] = useState(false)
	const [hasImages, setHasImages] = useState(false)
	const [isPublishDisabled, setIsPublishDisabled] = useState(true)
	const [submitForm, setSubmitForm] = useState<() => void>(() => () => {})
	const [formData, setFormData] = useState<ClassifiedFormData>({
		title: '',
		description: '',
		price: '',
	})

	const setFormState = useCallback(
		({ isValid, imageFiles, formData, submit }: FormStateParams) => {
			setIsFormValid(isValid)
			setHasImages(imageFiles.length > 0)
			setIsPublishDisabled(!isValid || imageFiles.length === 0)
			setFormData(formData)
			setSubmitForm(() => () => submit(formData))
		},
		[]
	)

	return (
		<ClassifiedFormContext.Provider
			value={{
				isFormValid,
				setIsFormValid,
				hasImages,
				isPublishDisabled,
				submitForm,
				setFormState,
			}}
		>
			{children}
		</ClassifiedFormContext.Provider>
	)
}

export const useClassifiedForm = () => {
	const context = useContext(ClassifiedFormContext)
	if (!context) {
		throw new Error(
			'useClassifiedForm must be used within a ClassifiedFormProvider'
		)
	}
	return context
}
