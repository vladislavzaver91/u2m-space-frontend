'use client'

import { useState } from 'react'
import { AddPhotoButton } from '../components/ui/add-photo-button'
import { ButtonWithIcon } from '../components/ui/button-with-icon'
import { ClassifiedForm } from '../components/ui/classified-form'
import { IconCustom } from '../components/ui/icon-custom'
import { TagsManager } from '../components/ui/tags-manager'
import { useAuth } from '../helpers/contexts/auth-context'
import $api from '../lib/http'
import { useRouter } from 'next/navigation'
import { apiService } from '../services/api.service'
import imageCompression from 'browser-image-compression'

const AddPhotoSmallBtn = ({ onClick }: { onClick: () => void }) => {
	return (
		<div
			onClick={onClick}
			className='border-dashed border border-[#4f4f4f] rounded-[13px] bg-transparent hover:bg-[#f7f7f7] hover:border-[#f9329c] group transition-colors flex items-center justify-center max-sm:w-full max-sm:min-w-16 max-sm:h-16 sm:max-w-20 h-20 cursor-pointer max-lg:grid max-sm:col-span-1 max-lg:col-span-3'
		>
			<IconCustom
				name='plus'
				hover
				className='w-6 h-6 fill-none text-[#4f4f4f] group'
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

			await apiService.createClassified(formDataToSend)
			router.push('/selling-classifieds')
		} catch (error: any) {
			setError(error.response?.data?.error || 'Failed to create classified')
		}
	}

	return (
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
								onClick={() => document.querySelector('form')?.requestSubmit()}
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
											<AddPhotoButton onChange={handleImageChange} />

											<div className='grid grid-cols-4 sm:grid-cols-12 lg:grid-cols-4 max-sm:px-3.5 max-sm:py-4 sm:p-8 gap-8'>
												{/* моб */}
												<div className='col-start-1 col-end-5 sm:col-start-3 sm:col-end-11 gap-8 lg:hidden'>
													<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 md:gap-8'>
														{Array.from({ length: 8 }).map((_, idx) =>
															idx < imagePreviews.length ? (
																<div key={idx} className='relative'>
																	<img
																		src={imagePreviews[idx]}
																		alt={`Image ${idx}`}
																		className='w-full h-16 object-cover rounded-[13px]'
																	/>
																	<button
																		onClick={() => {
																			setImagePreviews(prev =>
																				prev.filter((_, i) => i !== idx)
																			)
																			setImageFiles(prev =>
																				prev.filter((_, i) => i !== idx)
																			)
																		}}
																		className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center'
																	>
																		×
																	</button>
																</div>
															) : (
																<AddPhotoSmallBtn
																	key={`btn-${idx}`}
																	onClick={() =>
																		document
																			.getElementById('photo-input')
																			?.click()
																	}
																/>
															)
														)}
													</div>
												</div>

												{/* десктоп */}
												<div className='max-lg:hidden contents'>
													{Array.from({ length: 8 }).map((_, idx) =>
														idx < imagePreviews.length ? (
															<div key={idx} className='relative'>
																<img
																	src={imagePreviews[idx]}
																	alt={`Image ${idx}`}
																	className='w-20 h-20 object-cover rounded-[13px]'
																/>
																<button
																	onClick={() => {
																		setImagePreviews(prev =>
																			prev.filter((_, i) => i !== idx)
																		)
																		setImageFiles(prev =>
																			prev.filter((_, i) => i !== idx)
																		)
																	}}
																	className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center'
																>
																	×
																</button>
															</div>
														) : (
															<AddPhotoSmallBtn
																key={`btn-${idx}`}
																onClick={() =>
																	document
																		.getElementById('photo-input')
																		?.click()
																}
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
	)
}
