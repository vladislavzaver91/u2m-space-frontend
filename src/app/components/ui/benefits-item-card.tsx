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
	const cardWidthClass = index === 2 ? 'md:max-w-[404px]' : 'md:max-w-[442px]'
	const imgWidthClass = index === 2 ? '2xl:w-[168px]' : '2xl:w-[206px]'
	const imgMaxWidthClass =
		index === 2 ? 'max-2xl:max-w-[168px]' : 'max-2xl:max-w-[206px]'

	return (
		<div
			className={`flex items-center max-md:gap-[50px] gap-4 h-[200px] ${cardWidthClass} ${
				isSlider
					? 'max-md:flex-col max-md:items-center max-md:justify-center max-md:h-auto max-md:min-h-[480px] max-md:min-w-full max-md:max-w-[310px]'
					: ''
			}`}
		>
			<div
				className={`relative w-full h-[200px] ${
					isSlider
						? 'max-md:min-w-[300px] max-md:h-[310px]'
						: `${imgWidthClass} ${imgMaxWidthClass} max-md:min-w-[310px] max-md:h-[300px]`
				}`}
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
