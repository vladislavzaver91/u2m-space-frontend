interface IconCustomProps {
	name: string
	className?: string
	size?: number
}

export const IconCustom = ({
	name,
	className = '',
	size = 24,
}: IconCustomProps) => {
	return (
		<svg
			className={`${className} group-hover:text-[#F9329C] transition-colors`}
			width={size}
			height={size}
			fill='currentColor'
			stroke='currentColor'
		>
			<use xlinkHref={`icons/icons-sprite.svg#${name}`} />
		</svg>
	)
}
