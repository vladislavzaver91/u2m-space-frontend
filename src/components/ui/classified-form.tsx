'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Tooltip } from './tooltip'
import { useEffect, useState } from 'react'
import { ClassifiedFormInput } from './classified-form-input'
import { useTranslations } from 'next-intl'
import { useLanguage } from '@/helpers/contexts/language-context'
import { convertedCurrencyItems, CurrencyConversionResponse } from '@/types'
import { IconCustom } from './icon-custom'
import { useUser } from '@/helpers/contexts/user-context'
import { Loader } from './loader'
import { CURRENCY_SYMBOLS } from '@/helpers/constants/currency'
import { currencyService } from '@/services/api/currency.service'

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
	console.log('watch price:', priceValue)

	const { settings } = useLanguage()
	const { user, loading } = useUser()

	const [convertedPrices, setConvertedPrices] =
		useState<CurrencyConversionResponse | null>(null)
	const [conversionError, setConversionError] = useState<string>('')

	const tCreateEditClassified = useTranslations('CreateEditClassified')

	const formValues = {
		title: titleValue,
		description: descriptionValue,
		price: priceValue,
	}

	const convertedCurrencyItems: convertedCurrencyItems[] = [
		{
			currency: 'USD',
			symbol: '$',
			price: convertedPrices?.USD.toFixed(0),
		},
		{
			currency: 'UAH',
			symbol: '₴',
			price: convertedPrices?.UAH.toFixed(0),
		},
		{
			currency: 'EUR',
			symbol: '€',
			price: convertedPrices?.EUR.toFixed(0),
		},
	]

	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		const fetchConvertedPrices = async () => {
			if (
				!tooltipVisible.price ||
				!priceValue ||
				isNaN(parseFloat(priceValue))
			) {
				setConvertedPrices(null)
				setConversionError('')
				return
			}

			console.log('priceValue', priceValue)

			try {
				setConversionError('')
				const amount = parseFloat(priceValue)
				console.log(`const amount = parseFloat(priceValue)`, amount)
				const response = await currencyService.convertCurrency(
					amount,
					settings.currencyCode
				)
				setConvertedPrices(response)
				console.log(`setConvertedPrices(response)`, response)
			} catch (error: any) {
				setConversionError(tCreateEditClassified('errorInputs.price.message3'))
				setConvertedPrices(null)
			}
		}

		if (tooltipVisible.price) {
			timeoutId = setTimeout(fetchConvertedPrices, 300)
		}

		return () => clearTimeout(timeoutId)
	}, [
		tooltipVisible.price,
		priceValue,
		settings.currencyCode,
		tCreateEditClassified,
	])

	useEffect(() => {
		if (onFormStateChange) {
			onFormStateChange({ isValid, values: formValues })
		}
	}, [isValid, titleValue, descriptionValue, priceValue, onFormStateChange])

	if (loading || !user) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

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
					fieldValue={titleValue} // Передаем значение через fieldValue
					error={errors.title?.message}
					maxLength={60}
				/>
				{!user.advancedUser && (
					<Tooltip
						title={tCreateEditClassified('tooltips.title.name')}
						text={tCreateEditClassified('tooltips.title.description')}
						visible={tooltipVisible.title}
					/>
				)}
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
					fieldValue={descriptionValue} // Передаем значение через fieldValue
					error={errors.description?.message}
					maxLength={300}
				/>
				{!user.advancedUser && (
					<Tooltip
						title={tCreateEditClassified('tooltips.description.name')}
						text={tCreateEditClassified('tooltips.description.description')}
						visible={tooltipVisible.description}
					/>
				)}
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
						max: {
							value: 9999999999,
							message: tCreateEditClassified('errorInputs.price.message2'),
						},
						validate: value =>
							!isNaN(parseFloat(value)) ||
							tCreateEditClassified('errorInputs.price.message1'),
					})}
					fieldValue={priceValue} // Передаем значение через fieldValue
					error={errors.price?.message}
					prefix={CURRENCY_SYMBOLS[settings.currencyCode]}
				/>
				<Tooltip
					title={tCreateEditClassified('tooltips.price.name')}
					text={tCreateEditClassified('tooltips.price.description')}
					visible={tooltipVisible.price}
					isPriceField
					convertedPrices={convertedPrices}
					conversionError={conversionError}
					convertedCurrencyItems={convertedCurrencyItems}
				/>
			</div>
			{convertedPrices && (
				<div
					className='xl:hidden bgπου

System: hidden bg-[#f7f7f7] rounded-[13px] p-5 w-full'
				>
					<div className='flex items-center gap-2.5 mb-3'>
						<IconCustom
							name='arrow-up-left'
							className='w-[13px] h-3 text-[#F9329C] fill-none flex items-center justify-center'
						/>
						<p className='text-[#4f4f4f] text-[16px] font-bold'>
							{tCreateEditClassified('tooltips.description.name')}
						</p>
					</div>
					<div className='text-[16px] text-[#4f4f4f]'>
						{conversionError ? (
							<p className='text-[#F9329C]'>{conversionError}</p>
						) : (
							<ul className='pl-[34px]'>
								{convertedCurrencyItems.map((item, index) => (
									<li key={index} className='flex items-center gap-2.5'>
										<p className='font-normal'>{item.currency}</p>
										<span>-</span>
										<p className='font-bold'>
											{item.symbol}
											{item.price}
										</p>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}
		</form>
	)
}
