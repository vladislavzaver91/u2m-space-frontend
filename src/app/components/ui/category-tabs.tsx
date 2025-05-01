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
					className={`relative pb-4 text-[24px] font-bold uppercase cursor-pointer transition-colors border-b-2 border-transparent ${
						activeCategory === category
							? 'text-[#3486fe] border-[#f9329c]'
							: category === 'Category 2'
							? 'text-[#bdbdbd]'
							: 'text-[#4f4f4f] hover:text-[#3486fe] hover:border-[#f9329c]'
					} ${
						activeCategory !== category &&
						category !== 'Category 2' &&
						!disabled
							? 'text-[#bdbdbd]'
							: ''
					}`}
				>
					{category}
					<span
						className={`absolute bottom-0 left-0 h-[2px] bg-[#f9329c] transition-all duration-300 ${
							activeCategory === category
								? 'w-full'
								: category === 'Category 2'
								? 'w-0'
								: 'w-0 group-hover:w-full'
						}`}
					/>
				</button>
			))}
		</div>
	)
}
