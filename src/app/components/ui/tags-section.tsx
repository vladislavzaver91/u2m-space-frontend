'use client'

import { useState } from 'react'
import { TagItem } from './tag-item'
import { IconCustom } from './icon-custom'
import { ButtonWithIcon } from './button-with-icon'
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
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [newTag, setNewTag] = useState('')

	const handleAddTag = () => {
		if (newTag.trim()) {
			onAddTag(newTag.trim())
			setNewTag('')
			setIsModalOpen(false)
		}
	}

	return (
		<div className='w-full p-4 space-y-4'>
			<h3 className='text-[16px] font-bold text-[#4f4f4f]'>Tags</h3>
			<div className='flex flex-wrap items-center gap-4 w-full'>
				<AnimatePresence>
					{tags.length > 0 ? (
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
						))
					) : (
						<p className='text-[13px] text-[#4f4f4f]'>No tags added yet.</p>
					)}
				</AnimatePresence>
				<ButtonWithIcon
					text='Add tag'
					onClick={() => setIsModalOpen(true)}
					iconWrapperClass='w-6 h-6'
					icon={
						<IconCustom
							name='plus'
							className='w-6 h-6 fill-none text-[#f9329c]'
						/>
					}
					isHover
					className='min-w-[123px] w-fit h-10 py-2 flex items-center justify-center gap-2 rounded-lg text-[#3486fe]'
				/>
			</div>

			{/* Модальное окно для добавления тега */}
			{isModalOpen && (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className='fixed inset-0 flex items-center justify-center bg-[#3486fe]/60 z-50 animate-fade-in'
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className='bg-white rounded-[13px] p-6 w-full max-w-[400px] mx-4 shadow-custom-xl animate-scale-in'
						>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-[18px] font-bold text-[#4f4f4f]'>
									Add New Tag
								</h3>
								<button
									onClick={() => setIsModalOpen(false)}
									className='focus:outline-none'
								>
									<IconCustom
										name='close'
										className='w-5 h-5 text-[#4f4f4f] fill-none hover:text-[#3486fe]'
									/>
								</button>
							</div>
							<input
								type='text'
								value={newTag}
								onChange={e => setNewTag(e.target.value)}
								placeholder='Enter tag name'
								className='w-full p-3 border border-[#bdbdbd] rounded-[8px] text-[16px] font-medium text-[#4f4f4f] focus:outline-none focus:border-[#3486fe]'
							/>
							<div className='flex justify-end gap-3 mt-4'>
								<button
									onClick={() => setIsModalOpen(false)}
									className='px-4 py-2 text-[#4f4f4f] hover:text-[#3486fe] transition-colors'
								>
									Cancel
								</button>
								<button
									onClick={handleAddTag}
									className='px-4 py-2 bg-[#3486fe] text-white rounded-[8px] hover:bg-[#1a5bff] transition-colors'
								>
									Add
								</button>
							</div>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			)}
		</div>
	)
}
