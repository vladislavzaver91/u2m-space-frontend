'use client'

import { IconCustom } from './icon-custom'

interface RichTextWithIconProps {
	text: string
	className?: string
}

export const RichTextWithIcon = ({
	text,
	className = '',
}: RichTextWithIconProps) => {
	if (!text.includes('[ICON:')) {
		return <span className={className}>{text}</span>
	}

	const iconPattern = /\[ICON:([^:]+):([^\]]*)\]/g
	const parts = []
	let lastIndex = 0
	let match

	while ((match = iconPattern.exec(text)) !== null) {
		// Добавляем текст до иконки
		if (match.index > lastIndex) {
			parts.push(text.slice(lastIndex, match.index))
		}

		// Добавляем иконку
		const [, iconName, iconClasses] = match
		parts.push(
			<IconCustom
				key={`icon-${match.index}`}
				name={iconName}
				className={
					iconClasses ||
					'w-5 h-5 text-[#3486FE] fill-none inline-block align-middle mx-1'
				}
			/>
		)

		lastIndex = match.index + match[0].length
	}

	// Добавляем оставшийся текст
	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex))
	}

	return <span className={`inline align-sub ${className}`}>{parts}</span>
}
