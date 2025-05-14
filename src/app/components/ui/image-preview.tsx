'use client'

import { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { IconCustom } from './icon-custom'
import { ButtonWithIcon } from './button-with-icon'

const ItemTypes = {
	IMAGE: 'image',
}

interface ImagePreviewProps {
	src: string
	index: number
	moveImage: (dragIndex: number, hoverIndex: number) => void
	onRemove: (index: number) => void
}

export const ImagePreview = ({
	src,
	index,
	moveImage,
	onRemove,
}: ImagePreviewProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.IMAGE,
		item: { index },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const [, drop] = useDrop({
		accept: ItemTypes.IMAGE,
		hover(item: { index: number }) {
			if (item.index !== index) {
				moveImage(item.index, index)
				item.index = index
			}
		},
	})

	drag(drop(ref))

	return (
		<div
			ref={ref}
			className='relative max-sm:w-full max-sm:min-w-16 max-sm:h-16 sm:max-w-20 h-20 cursor-pointer max-lg:grid max-sm:col-span-1 max-lg:col-span-3'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<img
				src={src}
				alt={`Image ${index}`}
				className='w-full max-sm:h-16 h-20 object-cover rounded-[13px]'
			/>
			{index === 0 && (
				<div className='absolute top-0 right-0 w-6 h-6 bg-white rounded-bl-[13px] flex items-center justify-center'>
					<IconCustom
						name='star'
						className='w-3 h-3 text-[#f9329c] fill-none'
					/>
				</div>
			)}
			{isHovered && (
				<div className='absolute inset-0 bg-black/50 rounded-[13px] flex items-center justify-center'>
					<ButtonWithIcon
						onClick={() => onRemove(index)}
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='trash'
								className='w-6 h-6 text-white fill-none'
							/>
						}
						className='w-6 h-6 flex items-center justify-center'
					/>
				</div>
			)}
		</div>
	)
}
