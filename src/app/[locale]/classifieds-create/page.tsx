'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAuth } from '@/helpers/contexts/auth-context'
import { Classified } from '@/types'
import { Loader } from '@/components/ui/loader'
import { ImageSlider } from '@/components/ui/image-slider'
import { AddPhotoButton } from '@/components/ui/add-photo-button'
import { ClassifiedForm } from '@/components/ui/classified-form'
import { TagsManager } from '@/components/ui/tags-manager'
import { SliderImagesModal } from '@/components/ui/slider-images-modal'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { NavigationButtons } from '@/components/ui/navigation-buttons'
import { useClassifiedForm } from '@/helpers/contexts/classified-form-context'
import { ImageContextMenuModal } from '@/components/ui/image-context-menu-modal'
import { classifiedsService } from '@/services/api/classifieds.service'
import { ImageGrid } from '@/components/ui/image-grid'
import {
	useImageManagement,
	useModalManagement,
} from '@/helpers/hooks/use-create-classified-hooks'

export default function ClassifiedsCreate() {
	const { authUser } = useAuth()
	const { setFormState, isFormValid, setIsFormValid } = useClassifiedForm()
	const {
		imagePreviews,
		imageFiles,
		loadingIndices,
		handleImageChange,
		moveImageAtCreate,
		deleteImageAtCreate,
		makeMainImageAtCreate,
		error,
		setError,
	} = useImageManagement()
	const {
		isModalOpen,
		isContextMenuOpen,
		selectedImageIndex,
		handleOpenModal,
		handleCloseModal,
		handleOpenContextMenu,
		handleCloseContextMenu,
	} = useModalManagement()

	const [classified, setClassified] = useState<Classified | null>(null)
	const [tags, setTags] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [tooltipVisible, setTooltipVisible] = useState({
		title: false,
		description: false,
		price: false,
	})
	const [formData, setFormData] = useState<{
		title: string
		description: string
		price: string
	}>({
		title: '',
		description: '',
		price: '',
	})
	const tMyClassifieds = useTranslations('MyClassifieds')
	const router = useRouter()

	const handleSubmit = useCallback(
		async (formData: { title: string; description: string; price: string }) => {
			console.log(
				'handleSubmit called with:',
				formData,
				new Date().toISOString()
			)
			console.log('Raw price value:', formData.price)
			console.log('Parsed price value:', parseFloat(formData.price))

			setIsLoading(true)
			setError('')

			try {
				const formDataToSend = new FormData()
				formDataToSend.append('title', formData.title)
				formDataToSend.append('description', formData.description)
				formDataToSend.append('price', formData.price)
				console.log(
					`formDataToSend.append('price', formData.price)`,
					formData.price
				)

				if (tags.length > 0) {
					tags.forEach(tag => formDataToSend.append('tags[]', tag))
				}
				imageFiles.forEach(file => {
					formDataToSend.append('images', file)
				})

				for (const [key, value] of formDataToSend.entries()) {
					console.log(`FormData: ${key} =`, value)
				}

				const res = await classifiedsService.createClassified(formDataToSend)
				console.log('Response from createClassified:', res)
				setClassified(res)
				router.push(`/my-classifieds`)
			} catch (error: any) {
				console.error('Create classified error:', error)
				console.error('Error response data:', error.response?.data)
				console.error('Error status:', error.response?.status)
				setError(
					error.response?.data?.error ||
						error.message ||
						'Failed to create classified'
				)
				setIsLoading(false)
			}
		},
		[tags, imageFiles, router]
	)

	const handleMouseEnter = (field: keyof typeof tooltipVisible) => {
		setTooltipVisible(prev => ({ ...prev, [field]: true }))
	}

	const handleMouseLeave = (field: keyof typeof tooltipVisible) => {
		setTooltipVisible(prev => ({ ...prev, [field]: false }))
	}

	const initialFormData = useMemo(
		() => ({
			title: '',
			description: '',
			price: '',
		}),
		[]
	)

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
			imageFiles,
			formData,
			submit: handleSubmit,
		})
		console.log('formData', formData)
		console.log('initialFormData', initialFormData)
	}, [isFormValid, imageFiles, setFormState, handleSubmit, initialFormData])

	if (!authUser) {
		return <div className='text-center mt-20'>Authorization required</div>
	}

	if (isLoading) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<DndProvider backend={HTML5Backend}>
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
															title=''
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

												<ImageGrid
													imagePreviews={imagePreviews}
													loadingIndices={loadingIndices}
													handleImageChange={handleImageChange}
													moveImage={moveImageAtCreate}
													deleteImage={deleteImageAtCreate}
													handleOpenContextMenu={handleOpenContextMenu}
												/>
											</div>

											<div className='grid col-start-1 col-end-13 sm:col-start-4 sm:col-end-10 max-md:w-full max-[769px]:min-w-[300px] max-[769px]:w-fit max-md:ml-0! max-[769px]:ml-5 max-sm:px-4 lg:col-start-5 lg:col-end-8 lg:w-[300px] lg:min-w-fit'>
												<ClassifiedForm
													initialData={initialFormData}
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
												<TagsManager onTagsChange={setTags} />
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
					title={classified?.title}
					onSlideChange={index => setCurrentSlide(index)}
				/>
				<ImageContextMenuModal
					isOpen={isContextMenuOpen}
					onClose={handleCloseContextMenu}
					onMakeMain={() =>
						selectedImageIndex !== null &&
						makeMainImageAtCreate(selectedImageIndex)
					}
					onDelete={() =>
						selectedImageIndex !== null &&
						deleteImageAtCreate(selectedImageIndex)
					}
				/>
			</div>
		</DndProvider>
	)
}
