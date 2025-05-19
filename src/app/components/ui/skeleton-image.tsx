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
			className={['bg-[#F7F7F7] animate-pulse', className]
				.filter(Boolean)
				.join(' ')}
			style={{
				width: width || '100%',
				height: height || '100%',
				borderRadius:
					typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
			}}
		/>
	)
}
