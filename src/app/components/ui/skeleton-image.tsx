'use client'

interface SkeletonImageProps {
	className?: string
	width?: string | number
	height?: string | number
	borderRadius?: string | number
}

export const SkeletonImage = ({
	className,
	width,
	height,
	borderRadius = '13px',
}: SkeletonImageProps) => {
	return (
		<div
			className={['bg-[#bdbdbd] animate-shimmer', className]
				.filter(Boolean)
				.join(' ')}
			style={{
				width: width || '100%',
				height: height || '100%',
				borderRadius:
					typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
				backgroundImage:
					'linear-gradient(90deg, #bdbdbd 0%, #d3d3d3 40%, #bdbdbd 80%)',
				backgroundSize: '200% 100%',
			}}
		/>
	)
}
