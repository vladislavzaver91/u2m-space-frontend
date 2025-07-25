'use client'

interface LoaderProps {
	size?: string
}
export const Loader = ({ size }: LoaderProps) => {
	return (
		<div className={`flex items-center justify-center w-${size} h-${size}`}>
			<svg className='animate-spin' viewBox='25 25 50 50'>
				<circle r='20' cy='50' cx='50' className='animate-dash4' />
			</svg>
		</div>
	)
}
