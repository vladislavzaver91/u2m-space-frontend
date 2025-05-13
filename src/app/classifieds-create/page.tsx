'use client'

import { useRef, useState } from 'react'
import { AddPhotoButton } from '../components/ui/add-photo-button'
import { ButtonWithIcon } from '../components/ui/button-with-icon'
import { ClassifiedForm } from '../components/ui/classified-form'
import { IconCustom } from '../components/ui/icon-custom'
import { TagsManager } from '../components/ui/tags-manager'
import { useAuth } from '../helpers/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { apiService } from '../services/api.service'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import imageCompression from 'browser-image-compression'
import { ImageSlider } from '../components/ui/image-slider'
import { SliderImagesModal } from '../components/ui/slider-images-modal'

const ItemTypes = {
	IMAGE: 'image',
}

interface ImagePreviewProps {
	src: string
	index: number
	moveImage: (dragIndex: number, hoverIndex: number) => void
	onRemove: (index: number) => void
}

const ImagePreview = ({
	src,
	index,
	moveImage,
	onRemove,
}: ImagePreviewProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.IMAGE,
		item: { index },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const [, drop] = useDrop({
		accept: ItemTypes.IMAGE,
		hover(item: { index: number }) {
			if (item.index !== index) {
				moveImage(item.index, index)
				item.index = index
			}
		},
	})

	drag(drop(ref))

	return (
		<div
			ref={ref}
			className='relative'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<img
				src={src}
				alt={`Image ${index}`}
				className='w-full max-sm:h-16 h-20 object-cover rounded-[13px]'
			/>
			{index === 0 && (
				<div className='absolute top-0 right-0 w-6 h-6 bg-white rounded-bl-[13px] flex items-center justify-center'>
					<IconCustom
						name='star'
						className='w-3 h-3 text-[#f9329c] fill-none'
					/>
				</div>
			)}
			{isHovered && (
				<div className='absolute inset-0 bg-black/50 rounded-[13px] flex items-center justify-center'>
					<ButtonWithIcon
						onClick={() => onRemove(index)}
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='trash'
								className='w-6 h-6 text-white fill-none'
							/>
						}
						className='w-6 h-6 flex items-center justify-center'
					/>
				</div>
			)}
		</div>
	)
}

const AddPhotoSmallBtn = ({
	onChange,
}: {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	return (
		<div
			onClick={() => fileInputRef.current?.click()}
			className='border-dashed border border-[#4f4f4f] rounded-[13px] bg-transparent hover:bg-[#f7f7f7] hover:border-[#f9329c] group transition-colors flex items-center justify-center max-sm:w-full max-sm:min-w-16 max-sm:h-16 sm:max-w-20 h-20 cursor-pointer max-lg:grid max-sm:col-span-1 max-lg:col-span-3'
		>
			<IconCustom
				name='plus'
				hover
				className='w-6 h-6 fill-none text-[#4f4f4f] group'
			/>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				multiple
				onChange={onChange}
				className='hidden'
			/>
		</div>
	)
}

export default function ClassifiedsCreate() {
	const { user, logout } = useAuth()
	const [imagePreviews, setImagePreviews] = useState<string[]>([])
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [tags, setTags] = useState<string[]>([])
	const [error, setError] = useState<string>('')
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleBack = () => {
		window.history.back()
	}

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
				const compressedFile = await imageCompression(file, options)
				if (compressedFile.size > maxFileSize) {
					setError(`File ${file.name} exceeds 5MB after compression`)
					return
				}

				newFiles.push(compressedFile)
				const preview = await imageCompression.getDataUrlFromFile(
					compressedFile
				)
				newPreviews.push(preview)
			} catch (err) {
				setError(`Failed to compress ${file.name}`)
				return
			}
		}

		if (imageFiles.length + newFiles.length > 8) {
			setError('Maximum 8 images allowed')
			return
		}

		setImageFiles(prev => [...prev, ...newFiles])
		setImagePreviews(prev => [...prev, ...newPreviews])
		setError('')
	}

	const moveImage = (dragIndex: number, hoverIndex: number) => {
		setImagePreviews(prev => {
			const updated = [...prev]
			const [dragged] = updated.splice(dragIndex, 1)
			updated.splice(hoverIndex, 0, dragged)
			return updated
		})
		setImageFiles(prev => {
			const updated = [...prev]
			const [dragged] = updated.splice(dragIndex, 1)
			updated.splice(hoverIndex, 0, dragged)
			return updated
		})
	}

	const handleSubmit = async (formData: {
		title: string
		description: string
		price: string
	}) => {
		if (imageFiles.length < 1) {
			setError('At least 1 image is required')
			return
		}

		try {
			const formDataToSend = new FormData()
			formDataToSend.append('title', formData.title)
			formDataToSend.append('description', formData.description)
			formDataToSend.append('price', formData.price)
			tags.forEach(tag => formDataToSend.append('tags[]', tag))
			imageFiles.forEach((file, index) => {
				formDataToSend.append('images', file, `image-${index}.jpg`)
			})

			// Логирование FormData для отладки
			for (const [key, value] of formDataToSend.entries()) {
				console.log(`FormData: ${key} =`, value)
			}

			const res = await apiService.createClassified(formDataToSend)
			console.log(res)
			router.push(`/selling-classifieds/${res.id}`)
		} catch (error: any) {
			console.error('Create classified error:', error.response?.data)
			setError(error.response?.data?.error || 'Failed to create classified')
		}
	}

	if (!user) {
		return <div className='text-center mt-20'>Authorization required</div>
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div className='min-h-screen flex flex-col'>
				<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
					<div className='flex max-md:flex-wrap-reverse max-md:mb-4 max-2-5xl:justify-start'>
						{/* кнопки слева */}
						<div className='flex max-md:items-center justify-between max-md:w-full 2-5xl:absolute 2-5xl:left-0 z-10'>
							<ButtonWithIcon
								onClick={handleBack}
								text='Back'
								iconWrapperClass='w-6 h-6'
								icon={
									<IconCustom
										name='arrow-prev'
										hover={true}
										className='w-6 h-6 text-[#3486FE] fill-none'
									/>
								}
								isHover
								className='flex justify-center h-[88px] items-center min-w-[147px] w-fit'
							/>
							<div className='pr-4 md:hidden'>
								<ButtonWithIcon
									onClick={() =>
										document.querySelector('form')?.requestSubmit()
									}
									text='Publish'
									className='min-w-[95px] w-fit h-10 px-4 bg-[#3486fe]! text-white rounded-lg'
								/>
							</div>
						</div>
						<div className='flex max-md:w-full max-2-5xl:flex-wrap max-2-5xl:items-center max-md:mb-4 max-2-5xl:mb-8 max-md:pl-4 max-2-5xl:pl-8 max-2-5xl:py-6 max-sm:py-[11px] 2-5xl:absolute 2-5xl:pl-40 2-5xl:flex-col gap-4'>
							<ButtonWithIcon
								text='My Classifieds'
								iconWrapperClass='w-6 h-6 flex items-center justify-center'
								icon={
									<IconCustom
										name='plus'
										className='w-6 h-6 fill-none text-white'
									/>
								}
								className='w-fit min-w-[183px] h-10 flex flex-row-reverse items-center justify-center rounded-lg text-white bg-[#3486fe]!'
							/>
							<ButtonWithIcon
								text='Logout'
								onClick={logout}
								className='w-fit min-w-[92px] h-10 flex items-center justify-center border border-[#4f4f4f] rounded-[8px] hover:bg-[#f7f7f7] hover:border-[#3486fe]'
							/>
						</div>
					</div>

					{/* контент создания продукта */}
					<div className='flex-1 w-full'>
						<div className='custom-container mx-auto'>
							<div className='grid grid-cols-4 sm:grid-cols-12 gap-8 min-[769px]:gap-8 xl:gap-[60px]'>
								<div className='col-start-1 col-end-5 sm:col-start-1 sm:col-end-13'>
									<div className='w-full lg:max-w-[855px] lg:mx-auto space-y-4'>
										{error && (
											<div className='text-red-500 text-[14px]'>{error}</div>
										)}

										<div className='grid grid-cols-12 gap-4 lg:grid-cols-6 lg:gap-[60px]'>
											<div className='col-start-1 col-end-13 w-full lg:col-start-1 lg:col-end-5 lg:max-w-[487px]'>
												{imagePreviews.length > 0 ? (
													<ImageSlider images={imagePreviews} title='' />
												) : (
													<AddPhotoButton onChange={handleImageChange} />
												)}

												<div className='grid grid-cols-4 sm:grid-cols-12 lg:grid-cols-4 max-sm:px-3.5 max-sm:py-4 sm:p-8 gap-8'>
													{/* моб */}
													<div className='col-start-1 col-end-5 sm:col-start-3 sm:col-end-11 gap-8 lg:hidden'>
														<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 md:gap-8'>
															{Array.from({ length: 8 }).map((_, idx) =>
																idx < imagePreviews.length ? (
																	<ImagePreview
																		key={idx}
																		src={imagePreviews[idx]}
																		index={idx}
																		moveImage={moveImage}
																		onRemove={() => {
																			setImagePreviews(prev =>
																				prev.filter((_, i) => i !== idx)
																			)
																			setImageFiles(prev =>
																				prev.filter((_, i) => i !== idx)
																			)
																		}}
																	/>
																) : (
																	<AddPhotoSmallBtn
																		key={`btn-${idx}`}
																		onChange={handleImageChange}
																	/>
																)
															)}
														</div>
													</div>

													{/* десктоп */}
													<div className='max-lg:hidden contents'>
														{Array.from({ length: 8 }).map((_, idx) =>
															idx < imagePreviews.length ? (
																<ImagePreview
																	key={idx}
																	src={imagePreviews[idx]}
																	index={idx}
																	moveImage={moveImage}
																	onRemove={() => {
																		setImagePreviews(prev =>
																			prev.filter((_, i) => i !== idx)
																		)
																		setImageFiles(prev =>
																			prev.filter((_, i) => i !== idx)
																		)
																	}}
																/>
															) : (
																<AddPhotoSmallBtn
																	key={`btn-${idx}`}
																	onChange={handleImageChange}
																/>
															)
														)}
													</div>
												</div>
											</div>
											<div className='col-start-1 col-end-13 sm:col-start-4 sm:col-end-10 min-w-full lg:col-start-5 lg:col-end-8 lg:w-[300px] lg:min-w-fit'>
												<ClassifiedForm onSubmit={handleSubmit} />
											</div>
										</div>
										<div className='grid grid-cols-4 sm:grid-cols-12 lg:grid-cols-6 gap-4 md:gap-[60px]'>
											<div className='col-start-1 col-end-13 lg:col-start-1 lg:col-end-7 w-full'>
												<TagsManager onTagsChange={setTags} />
											</div>
										</div>
										<div className='hidden md:flex justify-end'>
											<ButtonWithIcon
												onClick={() =>
													document.querySelector('form')?.requestSubmit()
												}
												text='Publish'
												className='min-w-[95px] w-fit h-10 px-4 bg-[#3486fe]! text-white rounded-lg'
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DndProvider>
	)
}
