import Image from 'next/image'

interface ItemCardProps {
	index: number
	label: string
	img: string
	isSlider?: boolean
}

export const BenefitsItemCard = ({
	index,
	label,
	img,
	isSlider = false,
}: ItemCardProps) => {
	const cardWidthClass = index === 2 ? 'max-w-[404px]' : 'max-w-[442px]'
	const imgWidthClass = index === 2 ? '2xl:w-[168px]' : '2xl:w-[206px]'
	const imgMaxWidthClass =
		index === 2 ? 'max-2xl:max-w-[168px]' : 'max-2xl:max-w-[206px]'

	return (
		<div
			className={`flex items-center gap-4 h-[200px] ${cardWidthClass} ${
				isSlider
					? 'max-sm:flex-wrap max-sm:justify-center max-sm:h-auto max-sm:min-h-[200px] max-sm:w-full max-sm:max-w-[300px]'
					: ''
			}`}
		>
			<div
				className={`${imgWidthClass} ${imgMaxWidthClass} relative w-full h-[200px]`}
			>
				<Image
					src={img}
					alt={`${label} icon`}
					fill
					className='h-full w-full object-contain'
				/>
			</div>
			<p
				className={`w-[220px] h-full flex items-center p-2.5 text-[24px] font-bold text-[#4f4f4f] flex-shrink-0`}
			>
				{label}
			</p>
		</div>
	)
}
