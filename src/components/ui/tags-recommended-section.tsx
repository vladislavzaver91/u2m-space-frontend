'use client'

import { useTranslations } from 'next-intl'
import { TagItem } from './tag-item'

interface TagsRecommendedSectionProps {
	recommendedTags: string[]
	onAddTag: (tag: string) => void
}

export const TagsRecommendedSection = ({
	recommendedTags,
	onAddTag,
}: TagsRecommendedSectionProps) => {
	const tCreateEditClassified = useTranslations('CreateEditClassified')

	return (
		<div className='w-full p-0 sm:p-4 space-y-4'>
			<p className='text-[16px] font-bold text-[#4f4f4f]'>
				{tCreateEditClassified('recommendedTags')}
			</p>
			<div className='flex flex-wrap gap-4'>
				{recommendedTags.length > 0 ? (
					recommendedTags.map(tag => (
						<TagItem
							key={tag}
							text={tag}
							onClick={() => onAddTag(tag)}
							type='plus'
						/>
					))
				) : (
					<p className='text-[13px] text-[#4f4f4f]'>
						No recommended tags available.
					</p>
				)}
			</div>
		</div>
	)
}
