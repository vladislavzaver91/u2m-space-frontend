'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { CustomInput } from './custom-input'

interface ClassifiedFormData {
	title: string
	description: string
	price: string
}

interface ClassifiedFormProps {
	initialData?: ClassifiedFormData
	onSubmit: SubmitHandler<ClassifiedFormData>
}
export const ClassifiedForm = ({
	initialData,
	onSubmit,
}: ClassifiedFormProps) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ClassifiedFormData>({
		defaultValues: initialData || {
			title: '',
			description: '',
			price: '',
		},
	})

	const titleValue = watch('title')
	const descriptionValue = watch('description')
	const priceValue = watch('price')

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='w-full lg:max-w-[300px] flex flex-col gap-2'
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
			/>
		</form>
	)
}
