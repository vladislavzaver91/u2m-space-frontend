'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import imageCompression from 'browser-image-compression'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAuth } from '@/helpers/contexts/auth-context'
import { apiService } from '@/services/api.service'
import { Loader } from '@/components/ui/loader'
import { ImageSlider } from '@/components/ui/image-slider'
import { AddPhotoButton } from '@/components/ui/add-photo-button'
import { ImagePreview } from '@/components/ui/image-preview'
import { AddPhotoSmallButton } from '@/components/ui/add-photo-small-button'
import { ClassifiedForm } from '@/components/ui/classified-form'
import { TagsManager } from '@/components/ui/tags-manager'
import { SliderImagesModal } from '@/components/ui/slider-images-modal'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { NavigationButtons } from '@/components/ui/navigation-buttons'
import { useClassifiedForm } from '@/helpers/contexts/classified-form-context'
import { ImageContextMenuModal } from '@/components/ui/image-context-menu-modal'
import { useLanguage } from '@/helpers/contexts/language-context'
import { CurrencyConversionResponse } from '@/types'

export default function ClassifiedsEdit() {
	const { authUser } = useAuth()
	const { settings } = useLanguage()
	const { setFormState, isFormValid, setIsFormValid } = useClassifiedForm()
	const [imagePreviews, setImagePreviews] = useState<string[]>([])
	const [loadingIndices, setLoadingIndices] = useState<number[]>([])
	const [existingImages, setExistingImages] = useState<string[]>([])
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [tags, setTags] = useState<string[]>([])
	const [error, setError] = useState<string>('')
	const [initialData, setInitialData] = useState<{
		title: string
		description: string
		price: string
	} | null>(null)
	const [formData, setFormData] = useState<{
		title: string
		description: string
		price: string
	}>({
		title: '',
		description: '',
		price: '',
	})
	const [originalPrice, setOriginalPrice] = useState<number | null>(null)
	const [originalCurrency, setOriginalCurrency] = useState<
		'USD' | 'UAH' | 'EUR' | null
	>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	)
	const [isLoading, setIsLoading] = useState(true)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [tooltipVisible, setTooltipVisible] = useState({
		title: false,
		description: false,
		price: false,
	})
	const [convertedPrices, setConvertedPrices] =
		useState<CurrencyConversionResponse | null>(null)
	const [conversionError, setConversionError] = useState<string>('')

	const tMyClassifieds = useTranslations('MyClassifieds')
	const router = useRouter()
	const params = useParams()
	const id = params.id as string

	useEffect(() => {
		const fetchClassified = async () => {
			try {
				setIsLoading(true)
				const classified = await apiService.getClassifiedById(id)
				console.log('classified on edit page:', classified)

				const initial = {
					title: classified.title,
					description: classified.description,
					price: classified.price.toFixed(0),
				}

				setOriginalPrice(classified.price)
				setOriginalCurrency(classified.currency)

				// Если валюта пользователя отличается от валюты объявления, конвертируем цену
				if (settings.currencyCode !== classified.currency) {
					try {
						const res = await apiService.convertCurrency(
							classified.price,
							classified.currency
						)
						const convertedPrice = res[settings.currencyCode].toFixed(0)
						initial.price = convertedPrice
					} catch (error) {
						setConversionError('Failed to convert price')
						console.error('Conversion error:', error)
					}
				}

				setInitialData(initial)

				setFormData(initial)
				setImagePreviews(classified.images)
				setExistingImages(classified.images)
				setTags(classified.tags || [])
			} catch (error) {
				setError('Failed to load classified')
			} finally {
				setIsLoading(false)
			}
		}
		fetchClassified()
	}, [id, settings.currencyCode])

	console.log('Initial data tags: ', tags)

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files) return

		const maxFileSize = 5 * 1024 * 1024 // 5 МБ
		const options = {
			maxSizeMB: 5,
			maxWidthOrHeight: 1024,
			useWebWorker: true,
		}

		const newFiles: File[] = []
		const newPreviews: string[] = []

		for (const file of Array.from(files)) {
			try {
				setLoadingIndices(prev => [
					...prev,
					imagePreviews.length + newPreviews.length,
				])

				const compressedFile = await imageCompression(file, options)
				if (compressedFile.size > maxFileSize) {
					setError(`The file ${file.name} is larger than 5MB after compression`)
					setLoadingIndices(prev => prev.slice(0, -1))
					return
				}

				newFiles.push(compressedFile)
				const preview = await imageCompression.getDataUrlFromFile(
					compressedFile
				)
				newPreviews.push(preview)
			} catch (err) {
				setError(`Failed to compress ${file.name}`)
				setLoadingIndices(prev => prev.slice(0, -1))
				return
			}
		}

		const totalImages = imagePreviews.length + newFiles.length
		if (totalImages > 8) {
			setError('Maximum 8 images')
			setLoadingIndices(prev => prev.slice(0, imagePreviews.length))
			return
		}

		setImagePreviews(prev => [...prev, ...newPreviews])
		setImageFiles(prev => [...prev, ...newFiles])
		// Удаляем лоадеры
		setLoadingIndices(prev => prev.slice(0, prev.length - newPreviews.length))
		setError('')
	}

	const moveImage = (dragIndex: number, hoverIndex: number) => {
		setImagePreviews(prev => {
			const updated = [...prev]
			const [dragged] = updated.splice(dragIndex, 1)
			updated.splice(hoverIndex, 0, dragged)
			return updated
		})

		setExistingImages(prev => {
			const updated = [...prev]
			const [dragged] = updated.splice(dragIndex, 1)
			updated.splice(hoverIndex, 0, dragged)
			return updated
		})

		setImageFiles(prev => {
			const updated = [...prev]
			const adjustedDragIndex = dragIndex - existingImages.length
			const adjustedHoverIndex = hoverIndex - existingImages.length
			if (adjustedDragIndex >= 0 && adjustedHoverIndex >= 0) {
				const [dragged] = updated.splice(adjustedDragIndex, 1)
				updated.splice(adjustedHoverIndex, 0, dragged)
			}
			return updated
		})
	}

	const makeMainImage = (index: number) => {
		if (index === 0) return // Уже главное фото
		setImagePreviews(prev => {
			const updated = [...prev]
			const [selected] = updated.splice(index, 1)
			updated.unshift(selected)
			return updated
		})
		setImageFiles(prev => {
			const updated = [...prev]
			const [selected] = updated.splice(index, 1)
			updated.unshift(selected)
			return updated
		})
		setExistingImages(prev => {
			const updated = [...prev]
			const [selected] = updated.splice(index, 1)
			updated.unshift(selected)
			return updated
		})
	}

	const deleteImage = (index: number) => {
		setImagePreviews(prev => prev.filter((_, i) => i !== index))
		setImageFiles(prev => prev.filter((_, i) => i !== index))
		setExistingImages(prev => prev.filter((_, i) => i !== index))
		setLoadingIndices(prev =>
			prev.filter(i => i !== index).map(i => (i > index ? i - 1 : i))
		)
	}

	// const moveImage = (dragIndex: number, hoverIndex: number) => {
	// 	setImagePreviews(prev => {
	// 		const updated = [...prev]
	// 		const [dragged] = updated.splice(dragIndex, 1)
	// 		updated.splice(hoverIndex, 0, dragged)
	// 		return updated
	// 	})

	// 	// Синхронизация
	// 	setExistingImages(prev => {
	// 		const updated = [...prev]
	// 		const [dragged] = updated.splice(dragIndex, 1)
	// 		updated.splice(hoverIndex, 0, dragged)
	// 		return updated
	// 	})

	// 	setImageFiles(prev => {
	// 		const updated = [...prev]
	// 		const adjustedDragIndex = dragIndex - existingImages.length
	// 		const adjustedHoverIndex = hoverIndex - existingImages.length
	// 		if (adjustedDragIndex >= 0 && adjustedHoverIndex >= 0) {
	// 			const [dragged] = updated.splice(adjustedDragIndex, 1)
	// 			updated.splice(adjustedHoverIndex, 0, dragged)
	// 		}
	// 		return updated
	// 	})
	// }

	// const handleRemoveImage = (index: number) => {
	// 	setImagePreviews(prev => prev.filter((_, i) => i !== index))

	// 	setExistingImages(prev => {
	// 		if (index < prev.length) {
	// 			return prev.filter((_, i) => i !== index)
	// 		}
	// 		return prev
	// 	})

	// 	setImageFiles(prev => {
	// 		const adjustedIndex = index - existingImages.length
	// 		if (adjustedIndex >= 0) {
	// 			return prev.filter((_, i) => i !== adjustedIndex)
	// 		}
	// 		return prev
	// 	})
	// }

	const handleSubmit = useCallback(
		async (formData: { title: string; description: string; price: string }) => {
			console.log(
				'handleSubmit called with:',
				formData,
				new Date().toISOString()
			)

			if (imagePreviews.length < 1) {
				setError('At least 1 image is required')
				return
			}

			setIsLoading(true)
			setError('')

			try {
				const formDataToSend = new FormData()
				formDataToSend.append('title', formData.title)
				formDataToSend.append('description', formData.description)

				// Если цена изменилась, отправляем новую цену и валюту
				if (formData.price !== initialData?.price) {
					formDataToSend.append('price', formData.price)
					formDataToSend.append('currency', settings.currencyCode)
				} else {
					// Если цена не изменилась, используем оригинальные значения
					if (originalPrice !== null && originalCurrency !== null) {
						formDataToSend.append('price', originalPrice.toFixed(0))
						formDataToSend.append('currency', originalCurrency)
					}
				}

				formDataToSend.append('price', formData.price)
				tags.forEach(tag => formDataToSend.append('tags[]', tag))
				existingImages.forEach(url => {
					formDataToSend.append('existingImages[]', url)
				})
				imageFiles.forEach(file => {
					formDataToSend.append('images', file)
				})

				for (const [key, value] of formDataToSend.entries()) {
					console.log(`FormData: ${key} =`, value)
				}

				const res = await apiService.updateClassified(id, formDataToSend)
				console.log('Update response:', res)
				setTags(res.tags || [])
				router.push(`/my-classifieds`)
			} catch (error: any) {
				console.error(
					'Classified update error:',
					error.response?.data || error.message
				)
				setError(error.response?.data?.error || 'Failed to update classified')
				setIsLoading(false)
			}
		},
		[
			id,
			tags,
			existingImages,
			imageFiles,
			router,
			settings.currencyCode,
			initialData,
			originalPrice,
			originalCurrency,
		]
	)

	const handleDelete = useCallback(async () => {
		try {
			await apiService.deleteClassified(id)
			router.push('/my-classifieds')
		} catch (error: any) {
			console.error(
				'Error deleting classified:',
				error.response?.data || error.message
			)
			setError(error.response?.data?.error || 'Failed to delete classified')
		}
	}, [id, router])

	const handleOpenModal = () => {
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const handleOpenContextMenu = (index: number) => {
		setSelectedImageIndex(index)
		setIsContextMenuOpen(true)
	}

	const handleCloseContextMenu = () => {
		setIsContextMenuOpen(false)
		setSelectedImageIndex(null)
	}

	const handleMouseEnter = (field: keyof typeof tooltipVisible) => {
		setTooltipVisible(prev => ({ ...prev, [field]: true }))
	}

	const handleMouseLeave = (field: keyof typeof tooltipVisible) => {
		setTooltipVisible(prev => ({ ...prev, [field]: false }))
	}

	const handleFormStateChange = useCallback(
		(state: {
			isValid: boolean
			values: { title: string; description: string; price: string }
		}) => {
			setIsFormValid(state.isValid)
			setFormData(prev => {
				if (
					prev.title !== state.values.title ||
					prev.description !== state.values.description ||
					prev.price !== state.values.price
				) {
					return state.values
				}
				return prev
			})
		},
		[]
	)

	useEffect(() => {
		setFormState({
			isValid: isFormValid,
			imageFiles: [
				...existingImages.map(url => new File([], url)),
				...imageFiles,
			],
			formData,
			submit: handleSubmit,
		})
	}, [
		isFormValid,
		existingImages,
		imageFiles,
		formData,
		handleSubmit,
		setFormState,
	])

	if (!authUser) {
		return <div className='text-center mt-20'>Authorization required</div>
	}

	if (isLoading || !initialData) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<DndProvider backend={HTML5Backend} options={{ enableMouseEvents: true }}>
			<div className='min-h-screen flex flex-col'>
				<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
					<div className='max-2-5xl:mb-8'>
						<NavigationButtons
							activePage={tMyClassifieds('buttons.myClassifieds')}
						/>
					</div>

					{/* контент создания продукта */}

					<div className='flex-1 w-full'>
						<div className='md:px-8 xl:max-w-[1664px] mx-auto'>
							<div className='grid grid-cols-4 sm:grid-cols-12 gap-8 min-[769px]:gap-8 xl:gap-[60px]'>
								<div className='col-start-1 col-end-5 sm:col-start-1 sm:col-end-13'>
									<div className='w-full lg:max-w-[855px] lg:mx-auto space-y-4'>
										{error && (
											<div className='text-red-500 text-[14px]'>{error}</div>
										)}

										<div className='grid grid-cols-12 gap-4 lg:grid-cols-6 lg:gap-[60px]'>
											<div className='col-start-1 col-end-13 w-full lg:col-start-1 lg:col-end-5 lg:max-w-[487px]'>
												<div className='relative'>
													{imagePreviews.length > 0 ? (
														<ImageSlider
															images={imagePreviews}
															title={initialData?.title || ''}
															onOpenModal={handleOpenModal}
															className='slider-classified-info'
														/>
													) : (
														<div className='relative max-md:p-4'>
															<AddPhotoButton onChange={handleImageChange} />
														</div>
													)}
													{loadingIndices.length > 0 &&
														imagePreviews.length === 0 && (
															<div className='absolute inset-0 flex items-center justify-center border-2 border-dashed border-[#bdbdbd] rounded-[13px] bg-white'>
																<Loader />
															</div>
														)}
												</div>

												<div className='max-md:px-4'>
													<div className='grid grid-cols-4 sm:grid-cols-12 lg:grid-cols-4 max-sm:px-3.5 max-sm:py-4 sm:p-8 gap-8'>
														{/* моб */}
														<div className='col-start-1 col-end-5 sm:col-start-3 sm:col-end-11 gap-8 lg:hidden'>
															<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 md:gap-8'>
																{Array.from({ length: 8 }).map((_, idx) => {
																	if (loadingIndices.includes(idx)) {
																		return (
																			<div
																				key={`loading-${idx}`}
																				className='relative max-sm:w-full max-sm:min-w-16 max-sm:h-16 sm:max-w-20 h-20 cursor-pointer rounded-[13px] transition-all duration-300 max-lg:grid max-sm:col-span-1 max-lg:col-span-3 border border-[#BDBDBD]'
																			>
																				<div className='absolute inset-0 flex items-center justify-center rounded-[13px]'>
																					<Loader />
																				</div>
																			</div>
																		)
																	}
																	return idx < imagePreviews.length ? (
																		<ImagePreview
																			key={idx}
																			src={imagePreviews[idx]}
																			index={idx}
																			moveImage={moveImage}
																			onRemove={() => deleteImage(idx)}
																			onClick={() => handleOpenContextMenu(idx)}
																		/>
																	) : (
																		<AddPhotoSmallButton
																			key={`btn-${idx}`}
																			onChange={handleImageChange}
																		/>
																	)
																})}
															</div>
														</div>

														{/* десктоп */}
														<div className='max-lg:hidden contents'>
															{Array.from({ length: 8 }).map((_, idx) => {
																if (loadingIndices.includes(idx)) {
																	return (
																		<div
																			key={`loading-${idx}`}
																			className='relative max-sm:w-full max-sm:min-w-16 max-sm:h-16 sm:max-w-20 h-20 cursor-pointer rounded-[13px] transition-all duration-300 max-lg:grid max-sm:col-span-1 max-lg:col-span-3 border border-[#BDBDBD]'
																		>
																			<div className='absolute inset-0 flex items-center justify-center rounded-[13px]'>
																				<Loader />
																			</div>
																		</div>
																	)
																}
																return idx < imagePreviews.length ? (
																	<ImagePreview
																		key={idx}
																		src={imagePreviews[idx]}
																		index={idx}
																		moveImage={moveImage}
																		onRemove={() => deleteImage(idx)}
																	/>
																) : (
																	<AddPhotoSmallButton
																		key={`btn-${idx}`}
																		onChange={handleImageChange}
																	/>
																)
															})}
														</div>
													</div>
												</div>
											</div>

											<div className='grid col-start-1 col-end-13 sm:col-start-4 sm:col-end-10 max-md:w-full max-[769px]:min-w-[300px] max-[769px]:w-fit max-md:ml-0! max-[769px]:ml-5 max-sm:px-4 lg:col-start-5 lg:col-end-8 lg:w-[300px] lg:min-w-fit'>
												<ClassifiedForm
													initialData={initialData}
													onSubmit={handleSubmit}
													onMouseEnter={(field: keyof typeof tooltipVisible) =>
														handleMouseEnter(field)
													}
													onMouseLeave={(field: keyof typeof tooltipVisible) =>
														handleMouseLeave(field)
													}
													tooltipVisible={tooltipVisible}
													onFormStateChange={handleFormStateChange}
												/>
											</div>
										</div>
										<div className='grid grid-cols-4 sm:grid-cols-12 lg:grid-cols-6 gap-4 md:gap-[60px] max-md:px-4 max-md:pb-4 max-xl:pb-8'>
											<div className='col-start-1 col-end-13 lg:col-start-1 lg:col-end-7 w-full relative'>
												<TagsManager
													onTagsChange={setTags}
													initialTags={tags}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<SliderImagesModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					images={imagePreviews}
					title={initialData?.title}
					onSlideChange={index => setCurrentSlide(index)}
				/>
				<ImageContextMenuModal
					isOpen={isContextMenuOpen}
					onClose={handleCloseContextMenu}
					onMakeMain={() =>
						selectedImageIndex !== null && makeMainImage(selectedImageIndex)
					}
					onDelete={() =>
						selectedImageIndex !== null && deleteImage(selectedImageIndex)
					}
				/>
			</div>
		</DndProvider>
	)
}
