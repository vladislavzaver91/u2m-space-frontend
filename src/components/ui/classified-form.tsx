'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Tooltip } from './tooltip'
import { useEffect } from 'react'
import { ClassifiedFormInput } from './classified-form-input'
import { useTranslations } from 'next-intl'

interface ClassifiedFormData {
	title: string
	description: string
	price: string
}

interface ClassifiedFormProps {
	initialData?: ClassifiedFormData
	onSubmit: SubmitHandler<ClassifiedFormData>
	onMouseEnter: (field: 'title' | 'description' | 'price') => void
	onMouseLeave: (field: 'title' | 'description' | 'price') => void
	tooltipVisible: Record<'title' | 'description' | 'price', boolean>
	onFormStateChange?: (state: {
		isValid: boolean
		values: ClassifiedFormData
	}) => void
}

export const ClassifiedForm = ({
	initialData,
	onSubmit,
	onMouseEnter,
	onMouseLeave,
	tooltipVisible,
	onFormStateChange,
}: ClassifiedFormProps) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<ClassifiedFormData>({
		defaultValues: initialData || {
			title: '',
			description: '',
			price: '',
		},
		mode: 'onChange',
	})

	const titleValue = watch('title')
	const descriptionValue = watch('description')
	const priceValue = watch('price')

	const tCreateEditClassified = useTranslations('CreateEditClassified')

	const formValues = {
		title: titleValue,
		description: descriptionValue,
		price: priceValue,
	}
	useEffect(() => {
		if (onFormStateChange) {
			onFormStateChange({ isValid, values: formValues })
		}
	}, [isValid, titleValue, descriptionValue, priceValue, onFormStateChange])

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='w-full lg:max-w-[300px] flex flex-col gap-2'
		>
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('title')}
				onMouseLeave={() => onMouseLeave('title')}
			>
				<ClassifiedFormInput
					label={tCreateEditClassified('formInputs.title')}
					register={register('title', {
						required: tCreateEditClassified('errorInputs.title.required'),
						maxLength: {
							value: 60,
							message: tCreateEditClassified('errorInputs.title.message'),
						},
					})}
					value={titleValue}
					error={errors.title?.message}
					maxLength={60}
				/>

				<Tooltip
					title={tCreateEditClassified('tooltips.title.name')}
					text={tCreateEditClassified('tooltips.title.description')}
					visible={tooltipVisible.title}
				/>
			</div>
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('description')}
				onMouseLeave={() => onMouseLeave('description')}
			>
				<ClassifiedFormInput
					label={tCreateEditClassified('formInputs.description')}
					register={register('description', {
						required: tCreateEditClassified('errorInputs.description.required'),
						maxLength: {
							value: 300,
							message: tCreateEditClassified('errorInputs.title.message'),
						},
					})}
					value={descriptionValue}
					error={errors.description?.message}
					maxLength={300}
				/>
				<Tooltip
					title={tCreateEditClassified('tooltips.description.name')}
					text={tCreateEditClassified('tooltips.description.description')}
					visible={tooltipVisible.description}
				/>
			</div>
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('price')}
				onMouseLeave={() => onMouseLeave('price')}
			>
				<ClassifiedFormInput
					label={tCreateEditClassified('formInputs.price')}
					type='number'
					register={register('price', {
						required: tCreateEditClassified('errorInputs.price.required'),
						min: {
							value: 0,
							message: tCreateEditClassified('errorInputs.price.message1'),
						},
						validate: value =>
							!isNaN(parseFloat(value)) ||
							tCreateEditClassified('errorInputs.price.message1'),
					})}
					value={priceValue}
					error={errors.price?.message}
					maxLength={10}
					prefix='$'
				/>

				<Tooltip
					title={tCreateEditClassified('tooltips.price.name')}
					text={tCreateEditClassified('tooltips.price.description')}
					visible={tooltipVisible.price}
				/>
			</div>
		</form>
	)
}
