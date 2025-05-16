'use client'

import Link from 'next/link'
import { IconCustom } from './icon-custom'

interface AddPhotoButtonProps {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// interface AddPhotoButtonProps {
// }

export const AddPhotoButton = ({ onChange }: AddPhotoButtonProps) => {
	return (
		<div className='relative border-2 border-dashed border-[#bdbdbd] rounded-[13px] flex flex-col items-center justify-center transition-all hover:shadow-custom-xl hover:border-[#f9329c] w-full max-md:h-[84px] md:h-[294px] space-y-2 cursor-pointer group select-none'>
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
				className='w-6 h-6 text-[#4f4f4f] fill-none group'
			/>
			<span className='text-[#4f4f4f] text-[16px] font-bold leading-5 select-none'>
				Add photos
			</span>
		</div>
	)
}
