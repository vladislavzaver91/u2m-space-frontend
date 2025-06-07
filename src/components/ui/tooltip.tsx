'use client'

import { convertedCurrencyItems, CurrencyConversionResponse } from '@/types'
import { IconCustom } from './icon-custom'

interface TooltipProps {
	title: string
	text: string
	visible: boolean
	positionClass?: string
	isClicked?: boolean
	isPriceField?: boolean
	convertedPrices?: CurrencyConversionResponse | null
	conversionError?: string
	convertedCurrencyItems?: convertedCurrencyItems[]
}

export const Tooltip = ({
	title,
	text,
	visible,
	positionClass,
	isClicked,
	isPriceField,
	convertedPrices,
	conversionError,
	convertedCurrencyItems,
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

		{isPriceField ? (
			<div className='text-[16px] text-[#4f4f4f]'>
				{conversionError ? (
					<p className='text-[#F9329C]'>{conversionError}</p>
				) : (
					convertedCurrencyItems && (
						<ul className='pl-[34px]'>
							{convertedCurrencyItems.map((item, index) => (
								<li key={index} className='flex items-center gap-2.5'>
									<p className='font-normal'>{item.currency}</p>
									<span>-</span>
									<p className='font-bold'>
										{item.symbol}
										{item.price}
									</p>
								</li>
							))}
						</ul>
					)
				)}
			</div>
		) : (
			<p className='text-[16px] text-[#4f4f4f]'>{text}</p>
		)}
	</div>
)
