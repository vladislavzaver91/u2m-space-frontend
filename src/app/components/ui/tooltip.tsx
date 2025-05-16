'use client'

import { IconCustom } from './icon-custom'

interface TooltipProps {
	title: string
	text: string
	visible: boolean
	positionClass?: string
}

export const Tooltip = ({
	title,
	text,
	visible,
	positionClass,
}: TooltipProps) => (
	<div
		className={`max-xl:hidden absolute ${positionClass} left-40 2xl:left-80 top-10 w-[294px] min-h-fit bg-[#f7f7f7] rounded-[13px] p-5 text-[16px] text-[#4f4f4f] transition-all duration-300 ease-in-out z-10 ${
			visible
				? 'opacity-100 translate-y-0'
				: 'opacity-0 translate-y-2 pointer-events-none'
		}`}
	>
		<div className='flex items-center gap-2.5 mb-3'>
			<IconCustom
				name='arrow-up-left'
				className='w-[13px] h-3 text-[#F9329C] fill-none flex items-center justify-center'
			/>
			<h4 className='text-[#4f4f4f] text-[16px] font-bold'>{title}</h4>
		</div>
		{text}
	</div>
)
