'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'

export function useImageManagement() {
	const [imagePreviews, setImagePreviews] = useState<string[]>([])
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [existingImages, setExistingImages] = useState<string[]>([])
	const [loadingIndices, setLoadingIndices] = useState<number[]>([])
	const [error, setError] = useState<string>('')

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

	const moveImageAtCreate = (dragIndex: number, hoverIndex: number) => {
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

	const makeMainImageAtCreate = (index: number) => {
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
	}

	const deleteImageAtCreate = (index: number) => {
		setImagePreviews(prev => prev.filter((_, i) => i !== index))
		setImageFiles(prev => prev.filter((_, i) => i !== index))
		setLoadingIndices(prev =>
			prev.filter(i => i !== index).map(i => (i > index ? i - 1 : i))
		)
	}

	const moveImageAtEdit = (dragIndex: number, hoverIndex: number) => {
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

	const makeMainImageAtEdit = (index: number) => {
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

	const deleteImageAtEdit = (index: number) => {
		setImagePreviews(prev => prev.filter((_, i) => i !== index))
		setImageFiles(prev => prev.filter((_, i) => i !== index))
		setExistingImages(prev => prev.filter((_, i) => i !== index))
		setLoadingIndices(prev =>
			prev.filter(i => i !== index).map(i => (i > index ? i - 1 : i))
		)
	}

	return {
		imagePreviews,
		setImagePreviews,
		imageFiles,
		setImageFiles,
		existingImages,
		setExistingImages,
		loadingIndices,
		setLoadingIndices,
		handleImageChange,
		moveImageAtCreate,
		moveImageAtEdit,
		deleteImageAtCreate,
		deleteImageAtEdit,
		makeMainImageAtCreate,
		makeMainImageAtEdit,
		error,
		setError,
	}
}

export function useModalManagement() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	)

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

	return {
		isModalOpen,
		setIsModalOpen,
		isContextMenuOpen,
		selectedImageIndex,
		handleOpenModal,
		handleCloseModal,
		handleOpenContextMenu,
		handleCloseContextMenu,
	}
}
