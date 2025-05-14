'use client'

import { useState } from 'react'
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
	const [recommendedTags, setRecommendedTags] = useState<string[]>([
		'Minimal',
		'Bohemian',
		'Sporty',
		'Elegant',
	])

	const handleAddTag = async (tag: string) => {
		if (!tag || tags.includes(tag)) {
			return
		}

		try {
			await apiService.createTag(tag)
			const newTags = [...tags, tag]
			setTags(newTags)
			setRecommendedTags(prev => prev.filter(t => t !== tag))
			onTagsChange?.(newTags)
			setError('')
		} catch (err) {
			setError('Failed to add tag')
		}
	}

	const handleRemoveTag = async (tag: string) => {
		try {
			const tagData = await apiService.getTagByName(tag)
			await apiService.deleteTag(tagData.id)
			const newTags = tags.filter(t => t !== tag)
			setTags(newTags)
			setRecommendedTags(prev => [...prev, tag])
			onTagsChange?.(newTags)
			setError('')
		} catch (err) {
			setError('Failed to remove tag')
		}
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
