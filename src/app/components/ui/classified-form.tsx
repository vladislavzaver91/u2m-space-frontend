'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { CustomInput } from './custom-input'
import { Tooltip } from './tooltip'
import { useEffect } from 'react'

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
				<CustomInput
					label='Title'
					register={register('title', {
						required: 'Title is required',
						maxLength: {
							value: 60,
							message: 'Title must be up to 60 characters',
						},
					})}
					value={titleValue}
					error={errors.title?.message}
					maxLength={60}
				/>

				<Tooltip
					title='Title'
					text='Enter a catchy title to attract potential buyers (max 60 characters).'
					visible={tooltipVisible.title}
				/>
			</div>
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('description')}
				onMouseLeave={() => onMouseLeave('description')}
			>
				<CustomInput
					label='Description'
					register={register('description', {
						required: 'Description is required',
						maxLength: {
							value: 300,
							message: 'Description must be up to 300 characters',
						},
					})}
					value={descriptionValue}
					error={errors.description?.message}
					maxLength={300}
				/>
				<Tooltip
					title='Description'
					text='Is a meta tag that briefly describes the content of a given web page. Keywords are keywords or phrases that are used on a given web page and are the main ones for it (i.e., they reveal the topic and content).'
					visible={tooltipVisible.description}
				/>
			</div>
			<div
				className='relative'
				onMouseEnter={() => onMouseEnter('price')}
				onMouseLeave={() => onMouseLeave('price')}
			>
				<CustomInput
					label='Price'
					type='number'
					register={register('price', {
						required: 'Price is required',
						min: { value: 0, message: 'Price must be a positive number' },
						validate: value =>
							!isNaN(parseFloat(value)) || 'Price must be a valid number',
					})}
					value={priceValue}
					error={errors.price?.message}
					maxLength={10}
					prefix='$'
				/>

				<Tooltip
					title='Price'
					text='Set a competitive price for your item (must be a positive number).'
					visible={tooltipVisible.price}
				/>
			</div>
		</form>
	)
}
