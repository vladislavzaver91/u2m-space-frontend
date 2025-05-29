'use client'

import { useTranslations } from 'next-intl'
import { TagItem } from './tag-item'
import { AnimatePresence, motion } from 'framer-motion'

interface TagsSectionProps {
	tags: string[]
	onAddTag: (tag: string) => void
	onRemoveTag: (tag: string) => void
}

export const TagsSection = ({
	tags,
	onAddTag,
	onRemoveTag,
}: TagsSectionProps) => {
	const tCreateEditClassified = useTranslations('CreateEditClassified')

	return (
		<div className='w-full p-0 sm:p-4 space-y-4'>
			<p className='text-[16px] font-bold text-[#4f4f4f]'>
				{tCreateEditClassified('tags')}
			</p>
			<div className='flex flex-wrap items-center gap-4 w-full'>
				<AnimatePresence>
					{tags.length > 0 &&
						tags.map(tag => (
							<motion.div
								key={tag}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.2 }}
							>
								<TagItem
									text={tag}
									onClick={() => onRemoveTag(tag)}
									type='close'
								/>
							</motion.div>
						))}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
					>
						<TagItem
							text={tCreateEditClassified('addTag')}
							onAddTag={onAddTag}
							type='input'
						/>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	)
}
