'use client'

interface IconBasicComponentProps {
	name: string
	iconThumbStyle?: string
	size?: number
	iconThumb?: boolean
}

export const IconBasicComponent = ({
	name,
	iconThumbStyle,
	size,
	iconThumb,
}: IconBasicComponentProps) =>
	iconThumb ? (
		<div
			className={`${iconThumbStyle} w-6 h-6 flex items-center justify-center`}
		>
			<svg width={size} height={size}>
				<use xlinkHref={`/icons/icons-sprite.svg#${name}`} />
			</svg>
		</div>
	) : (
		<svg width={size} height={size}>
			<use xlinkHref={`/icons/icons-sprite.svg#${name}`} />
		</svg>
	)
