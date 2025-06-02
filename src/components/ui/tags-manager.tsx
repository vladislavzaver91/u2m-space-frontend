'use client'

import { useEffect, useState } from 'react'
import { TagsSection } from './tags-section'
import { TagsRecommendedSection } from './tags-recommended-section'
import { apiService } from '@/services/api.service'

interface TagsManagerProps {
	initialTags?: string[]
	onTagsChange?: (tags: string[]) => void
}

export const TagsManager = ({
	initialTags = [],
	onTagsChange,
}: TagsManagerProps) => {
	const [tags, setTags] = useState<string[]>(initialTags)
	const [error, setError] = useState<string>('')
	const [recommendedTags, setRecommendedTags] = useState<string[]>([])

	useEffect(() => {
		const fetchRecommendedTags = async () => {
			try {
				const serverTags = await apiService.getTags()
				const recommended = serverTags
					.map(tag => tag.name)
					.filter(tag => !tags.includes(tag))
				setRecommendedTags(recommended)
			} catch (err) {
				setError('Failed to load recommended tags')
			}
		}
		fetchRecommendedTags()
	}, [tags])

	const handleAddTag = (tag: string) => {
		if (!tag || tags.includes(tag)) {
			return
		}

		// Calculate total length of existing tags
		const totalLength = tags.reduce((sum, t) => sum + t.length, 0)

		// Check if adding the new tag exceeds 500 characters
		if (totalLength + tag.length > 500) {
			setError('Total tag length cannot exceed 500 characters')
			return
		}

		const newTags = [...tags, tag]
		setTags(newTags)
		setRecommendedTags(prev => prev.filter(t => t !== tag))
		onTagsChange?.(newTags)
		setError('')
	}

	const handleRemoveTag = (tag: string) => {
		const newTags = tags.filter(t => t !== tag)
		setTags(newTags)
		setRecommendedTags(prev => [...prev, tag])
		onTagsChange?.(newTags)
		setError('')
	}

	return (
		<div className='flex flex-col gap-4'>
			{error && <div className='text-red-500 text-[14px] mb-2'>{error}</div>}
			<TagsSection
				tags={tags}
				onAddTag={handleAddTag}
				onRemoveTag={handleRemoveTag}
			/>
			<TagsRecommendedSection
				recommendedTags={recommendedTags}
				onAddTag={handleAddTag}
			/>
		</div>
	)
}
