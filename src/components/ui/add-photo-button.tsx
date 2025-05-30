'use client'

import { useTranslations } from 'next-intl'
import { IconCustom } from './icon-custom'

interface AddPhotoButtonProps {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const AddPhotoButton = ({ onChange }: AddPhotoButtonProps) => {
	const tCreateEditClassified = useTranslations('CreateEditClassified')

	return (
		<div className='relative border-2 border-dashed border-[#bdbdbd] rounded-[13px] flex flex-col items-center justify-center transition-all hover:border-[#f9329c] hover:bg-[#F7F7F7]  w-full max-md:h-[84px] md:h-[294px] space-y-2 cursor-pointer group select-none'>
			<input
				id='photo-input'
				type='file'
				accept='image/*'
				multiple
				onChange={onChange}
				className='absolute inset-0 opacity-0 cursor-pointer'
			/>
			<IconCustom
				name='camera'
				hover
				hoverColor='#f9329c'
				className='w-6 h-6 text-[#4f4f4f] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
			/>
			<p className='text-[#4f4f4f] text-[16px] font-bold leading-5 select-none'>
				{tCreateEditClassified('addPhotos')}
			</p>
		</div>
	)
}
