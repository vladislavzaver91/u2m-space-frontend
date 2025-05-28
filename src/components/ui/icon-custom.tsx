interface IconCustomProps {
	name: string
	className?: string
	size?: number
	hover?: boolean
	hoverColor?: string
	disabled?: boolean
}

export const IconCustom = ({
	name,
	className = '',
	size = 24,
	hover = false,
	hoverColor = '#3486fe',
	disabled = false,
}: IconCustomProps) => {
	return (
		<svg
			className={[
				className,
				hover && !disabled
					? `group-hover:text-[${hoverColor}]! group-focus:text-[${hoverColor}]!`
					: '',
				disabled ? 'text-[#bdbdbd]! pointer-events-none!' : '',
				'transition-colors',
			]
				.filter(Boolean)
				.join(' ')}
			width={size}
			height={size}
			fill='currentColor'
			stroke='currentColor'
		>
			<use xlinkHref={`/icons/icons-sprite.svg#${name}`} />
		</svg>
	)
}
