'use client'

interface CategoryTabsProps {
	categories: string[]
	activeCategory: string
	onCategoryChange: (category: string) => void
	disabled?: boolean
}

export const CategoryTabs = ({
	categories,
	activeCategory,
	onCategoryChange,
	disabled,
}: CategoryTabsProps) => {
	return (
		<div className='flex flex-wrap gap-8 md:gap-20 py-8'>
			{categories.map((category, index) => (
				<button
					key={index}
					onClick={() => !disabled && onCategoryChange(category)}
					disabled={disabled}
					className={`pb-4 text-[24px] font-bold uppercase cursor-pointer transition-colors hover:text-[#4f4f4f] ${
						activeCategory === category
							? 'text-[#3486fe] border-b-2 border-[#f9329c]'
							: 'text-[#bdbdbd]'
					}`}
				>
					{category}
				</button>
			))}
		</div>
	)
}
