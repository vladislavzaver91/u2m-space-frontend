'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ButtonCustom } from './button-custom'
import { IconCustom } from './icon-custom'
import { useWindowSize } from '@/helpers/hooks/use-window-size'

interface ImageContextMenuModalProps {
	isOpen: boolean
	onClose: () => void
	onMakeMain: () => void
	onDelete: () => void
}

export const ImageContextMenuModal = ({
	isOpen,
	onClose,
	onMakeMain,
	onDelete,
}: ImageContextMenuModalProps) => {
	const { width } = useWindowSize()

	const tCreateEditClassified = useTranslations('CreateEditClassified')

	return (
		<AnimatePresence>
			{isOpen && width < 1024 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='fixed inset-0 bg-[#3486fe]/60 flex items-end justify-center z-50 px-4 pb-4'
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className='bg-white rounded-[13px] shadow-lg w-full max-w-[328px] p-2 flex flex-col items-center space-y-8'
						onClick={e => e.stopPropagation()}
					>
						<div className='w-full'>
							<ButtonCustom
								onClick={() => {
									onMakeMain()
									onClose()
								}}
								text={tCreateEditClassified('setTheMain')}
								className='w-full p-4 bg-white text-[#4F4F4F] text-[16px] font-bold hover:bg-[#F7F7F7] focus:bg-[#F7F7F7]'
							/>
							<ButtonCustom
								onClick={() => {
									onDelete()
									onClose()
								}}
								text={tCreateEditClassified('delete')}
								className='w-full p-4 bg-white text-[#4F4F4F] text-[16px] font-bold hover:bg-[#F7F7F7] focus:bg-[#F7F7F7]'
							/>
						</div>

						<ButtonCustom
							onClick={onClose}
							iconWrapperClass='w-6 h-6 flex items-center justify-center'
							icon={
								<IconCustom
									name='close'
									className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
									hover={true}
									hoverColor='#f9329c'
								/>
							}
							isHover
							className='w-10 h-10 flex items-center justify-center rounded-lg'
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
