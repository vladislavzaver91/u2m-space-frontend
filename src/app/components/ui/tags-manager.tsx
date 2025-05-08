'use-client'

import { useState } from 'react'
import { TagsSection } from './tags-section'
import { TagsRecommendedSection } from './tags-recommended-section'

export const TagsManager = () => {
	const [tags, setTags] = useState<string[]>([
		'Fashion',
		'Vintage',
		'Streetwear',
		'Casual',
	])
	const [recommendedTags, setRecommendedTags] = useState<string[]>([
		'Minimal',
		'Bohemian',
		'Sporty',
		'Elegant',
	])

	const handleAddTag = (tag: string) => {
		if (!tags.includes(tag)) {
			setTags(prev => [...prev, tag])
		}
		setRecommendedTags(prev => prev.filter(t => t !== tag))
	}

	const handleRemoveTag = (tag: string) => {
		setTags(prev => prev.filter(t => t !== tag))
		if (!recommendedTags.includes(tag)) {
			setRecommendedTags(prev => [...prev, tag])
		}
	}

	return (
		<div className='flex flex-col'>
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
