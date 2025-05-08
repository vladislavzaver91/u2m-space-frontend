'use client'

import { ButtonWithIcon } from './button-with-icon'
import { IconCustom } from './icon-custom'

interface TagItemProps {
	text: string
	onClick: () => void
	type: 'close' | 'plus'
}

export const TagItem = ({ text, onClick, type }: TagItemProps) => {
	return (
		<div
			className={`flex items-center h-10 gap-2 border border-[#3486fe] rounded-lg py-2 text-[#3486fe]  hover:bg-[#f7f7f7] transition-all ${
				type === 'close' ? 'pl-4 pr-2' : 'pl-2 pr-4 flex-row-reverse'
			} `}
		>
			<span className='text-[14px] font-medium text-[#4f4f4f]'>{text}</span>
			<ButtonWithIcon
				onClick={onClick}
				iconWrapperClass='h-6 w-6 flex items-center justify-center'
				icon={
					<IconCustom
						name={type === 'close' ? 'close' : 'plus'}
						className={`${
							type === 'close' ? 'w-3.5 h-3.5 ' : 'w-6 h-6 '
						} text-[#F9329C] fill-none`}
					/>
				}
				isHover
				className='w-6 h-6 flex items-center justify-center rounded-lg'
			/>
		</div>
	)
}
