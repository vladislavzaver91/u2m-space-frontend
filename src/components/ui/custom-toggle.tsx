'use client'

import { IconCustom } from './icon-custom'

interface CustomToggleProps {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
	onClick?: () => void
}

export const CustomToggle = ({
	label,
	checked,
	onChange,
	onClick,
}: CustomToggleProps) => {
	const handleToggle = () => {
		onChange(!checked)
	}

	return (
		<div className='relative cursor-pointer' onClick={onClick}>
			<div className='w-full h-[102px] py-8' onClick={handleToggle}>
				<div className='relative border-b border-[#bdbdbd] flex items-center justify-between px-2 w-full h-[38px]'>
					<label className='text-[16px] font-bold text-[#4f4f4f]'>
						{label}
					</label>
					<div className='relative w-6 h-6'>
						<input
							type='checkbox'
							checked={checked}
							onChange={e => onChange(e.target.checked)}
							className='opacity-0 w-full h-full peer'
						/>
						<div className='absolute top-0'>
							{checked ? (
								<IconCustom
									name='switch-right'
									className='w-6 h-6 fill-none text-[#3486fe]'
								/>
							) : (
								<IconCustom
									name='switch-left'
									className='w-6 h-6 fill-none text-[#BDBDBD]'
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
