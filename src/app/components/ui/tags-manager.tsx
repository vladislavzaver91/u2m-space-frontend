'use client'

import { useState } from 'react'
import { TagsSection } from './tags-section'
import { TagsRecommendedSection } from './tags-recommended-section'

interface TagsManagerProps {
	initialTags?: string[]
	onTagsChange?: (tags: string[]) => void
}

export const TagsManager = ({
	initialTags = [],
	onTagsChange,
}: TagsManagerProps) => {
	const [tags, setTags] = useState<string[]>(initialTags)
	const [recommendedTags, setRecommendedTags] = useState<string[]>([
		'Minimal',
		'Bohemian',
		'Sporty',
		'Elegant',
	])

	const handleAddTag = (tag: string) => {
		if (!tags.includes(tag)) {
			const newTags = [...tags, tag]
			setTags(newTags)
			onTagsChange?.(newTags)
		}
		setRecommendedTags(prev => prev.filter(t => t !== tag))
	}

	const handleRemoveTag = (tag: string) => {
		const newTags = tags.filter(t => t !== tag)
		setTags(newTags)
		onTagsChange?.(newTags)
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
