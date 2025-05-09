'use client'

import { useState } from 'react'
import { CustomInput } from './custom-input'

export const ClassifiedForm = () => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		price: '',
	})

	const handleChange = (field: keyof typeof formData) => (value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	return (
		<div className='w-full lg:max-w-[300px] flex flex-col gap-2'>
			<CustomInput
				label='Title'
				value={formData.title}
				onChange={handleChange('title')}
				maxLength={60}
			/>
			<CustomInput
				label='Description'
				value={formData.description}
				onChange={handleChange('description')}
				maxLength={300}
			/>
			<CustomInput
				label='Price'
				value={formData.price}
				onChange={handleChange('price')}
				maxLength={10}
				type='number'
			/>
		</div>
	)
}
