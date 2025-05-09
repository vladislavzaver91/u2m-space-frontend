'use client'

import Link from 'next/link'
import { IconCustom } from './icon-custom'

// interface AddPhotoButtonProps {
// }

export const AddPhotoButton = () => {
	return (
		<div className='border-2 border-dashed border-[#bdbdbd] rounded-[13px] flex flex-col items-center justify-center transition-all hover:shadow-custom-xl hover:border-[#f9329c] w-full max-md:h-[84px] md:h-[294px] space-y-2 cursor-pointer group'>
			<IconCustom
				name='camera'
				hover
				className='w-6 h-6 text-[#4f4f4f] fill-none group'
			/>
			<span className='text-[#4f4f4f] text-[16px] font-bold leading-5'>
				Add photos
			</span>
		</div>
	)
}
