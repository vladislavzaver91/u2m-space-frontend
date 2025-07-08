'use client'

interface RichTextRerenderProps {
	html: string
	className?: string
}

export const RichTextRerender = ({
	html,
	className = '',
}: RichTextRerenderProps) => {
	return (
		<div
			className={`rich-text ${className}`}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}
