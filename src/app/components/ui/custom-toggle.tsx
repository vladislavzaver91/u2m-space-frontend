'use client'

interface CustomToggleProps {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
}

export const CustomToggle = ({
	label,
	checked,
	onChange,
}: CustomToggleProps) => {
	return (
		<div className='flex items-center justify-between w-full h-[86px]'>
			<label className='text-[16px] font-bold text-[#4f4f4f]'>{label}</label>
			<div className='relative w-12 h-6'>
				<input
					type='checkbox'
					checked={checked}
					onChange={e => onChange(e.target.checked)}
					className='opacity-0 w-full h-full peer'
				/>
				<span
					className={`absolute top-0 left-0 w-12 h-6 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-[#3486fe] peer-focus:ring-2 peer-focus:ring-[#3486fe]`}
				/>
				<span
					className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
						checked ? 'translate-x-6' : ''
					}`}
				/>
			</div>
		</div>
	)
}
