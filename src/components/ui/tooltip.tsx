'use client'

import { IconCustom } from './icon-custom'

interface TooltipProps {
	title: string
	text: string
	visible: boolean
	positionClass?: string
	isClicked?: boolean
}

export const Tooltip = ({
	title,
	text,
	visible,
	positionClass,
	isClicked,
}: TooltipProps) => (
	<div
		className={`max-xl:hidden absolute ${positionClass} left-40 2xl:left-80 top-10 w-[294px] min-h-fit bg-[#f7f7f7] rounded-[13px] p-5 transition-all ease-in-out ${
			visible
				? 'opacity-100 translate-y-0 duration-300'
				: `opacity-0 translate-y-2 pointer-events-none z-10 ${
						isClicked ? 'duration-50' : 'duration-300'
				  }`
		}`}
	>
		<div className='flex items-center gap-2.5 mb-3'>
			<IconCustom
				name='arrow-up-left'
				className='w-[13px] h-3 text-[#F9329C] fill-none flex items-center justify-center'
			/>
			<p className='text-[#4f4f4f] text-[16px] font-bold'>{title}</p>
		</div>
		<p className='text-[16px] text-[#4f4f4f]'>{text}</p>
	</div>
)
