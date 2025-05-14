'use client'

import { useEffect, useState } from 'react'
import { TagsSection } from './tags-section'
import { TagsRecommendedSection } from './tags-recommended-section'
import { apiService } from '@/app/services/api.service'

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
		<div className='flex flex-col max-sm:gap-4'>
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
