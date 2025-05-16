'use client'

import { useRef } from 'react'
import { IconCustom } from './icon-custom'

export const AddPhotoSmallButton = ({
	onChange,
}: {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	return (
		<div
			onClick={() => fileInputRef.current?.click()}
			className='border-dashed border border-[#4f4f4f] rounded-[13px] bg-transparent hover:bg-[#f7f7f7] hover:border-[#f9329c] group transition-colors flex items-center justify-center max-sm:w-full max-sm:min-w-16 max-sm:h-16 sm:max-w-20 h-20 cursor-pointer max-lg:grid max-sm:col-span-1 max-lg:col-span-3 select-none'
		>
			<IconCustom
				name='plus'
				hover
				className='w-6 h-6 fill-none text-[#4f4f4f] group'
			/>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				multiple
				onChange={onChange}
				className='hidden'
			/>
		</div>
	)
}
