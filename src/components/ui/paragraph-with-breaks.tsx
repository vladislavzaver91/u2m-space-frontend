'use client'

type ParagraphWithBreaksProps = {
	text: string
	className?: string
}

export const ParagraphWithBreaks = ({
	text,
	className = '',
}: ParagraphWithBreaksProps) => {
	return (
		<>
			{text.split('\n\n').map((paragraph, index) => (
				<p key={index} className={className}>
					{paragraph}
				</p>
			))}
		</>
	)
}
