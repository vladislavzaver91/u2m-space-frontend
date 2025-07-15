'use client'

import React from 'react'
import { Loader } from './loader'
import { ImagePreview } from './image-preview'
import { AddPhotoSmallButton } from './add-photo-small-button'

interface ImageGridProps {
	imagePreviews: string[]
	loadingIndices: number[]
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	moveImage: (dragIndex: number, hoverIndex: number) => void
	deleteImage: (index: number) => void
	handleOpenContextMenu?: (index: number) => void // Опционально для мобильной версии
}

export const ImageGrid: React.FC<ImageGridProps> = ({
	imagePreviews,
	loadingIndices,
	handleImageChange,
	moveImage,
	deleteImage,
	handleOpenContextMenu,
}) => {
	return (
		<div className='max-md:px-4'>
			<div className='grid grid-cols-4 sm:grid-cols-12 lg:grid-cols-4 max-sm:px-3.5 max-sm:py-4 sm:p-8 gap-8'>
				{/* Мобильная версия */}
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
									onClick={
										handleOpenContextMenu
											? () => handleOpenContextMenu(idx)
											: undefined
									}
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

				{/* Десктопная версия */}
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
	)
}
