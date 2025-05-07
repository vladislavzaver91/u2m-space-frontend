interface IconCustomProps {
	name: string
	className?: string
	size?: number
	hover?: boolean
}

export const IconCustom = ({
	name,
	className = '',
	size = 24,
	hover,
}: IconCustomProps) => {
	return (
		<svg
			className={`${className} ${
				hover ? 'group-hover:text-[#F9329C] group-focus:text-[#f9329c]' : ''
			} transition-colors`}
			width={size}
			height={size}
			fill='currentColor'
			stroke='currentColor'
		>
			<use xlinkHref={`/icons/icons-sprite.svg#${name}`} />
		</svg>
	)
}
