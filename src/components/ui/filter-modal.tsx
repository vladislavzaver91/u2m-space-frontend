'use client'

import { useSearch } from '@/helpers/contexts/search-context'
import { apiService } from '@/services/api.service'
import { useTranslations } from 'next-intl'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
	buttonRef: React.RefObject<HTMLButtonElement | null>
}

interface PriceRange {
	convertedMin: number
	convertedMax: number
	convertedCurrency: string
}

export const FilterModal = ({
	isOpen,
	onClose,
	buttonRef,
}: FilterModalProps) => {
	const tComponents = useTranslations('Components')
	const { searchQuery, setClassifieds, resetFilters } = useSearch()

	const [priceRange, setPriceRange] = useState<PriceRange | null>(null)
	const [minPrice, setMinPrice] = useState<number | null>(null)
	const [maxPrice, setMaxPrice] = useState<number | null>(null)
	const [availableTags, setAvailableTags] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [sortBy, setSortBy] = useState<'price' | 'createdAt'>('createdAt')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

	const modalRef = useRef<HTMLDivElement>(null)

	// Закрытие модального окна при клике вне
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose])

	// Позиционирование модального окна
	useEffect(() => {
		const updatePosition = () => {
			if (isOpen && buttonRef.current && modalRef.current) {
				const buttonRect = buttonRef.current.getBoundingClientRect()
				const modalRect = modalRef.current.getBoundingClientRect()
				const viewportWidth = window.innerWidth
				const viewportHeight = window.innerHeight

				// Позиционируем под кнопкой
				let top = buttonRect.bottom + window.scrollY + 8 // Отступ 8px от кнопки
				let right = viewportWidth - buttonRect.right

				// Проверяем, не выходит ли модалка за нижнюю границу экрана
				if (top + modalRect.height > viewportHeight + window.scrollY) {
					top = buttonRect.top + window.scrollY - modalRect.height - 8 // Позиционируем над кнопкой
				}

				// Проверяем, не выходит ли модалка за правую границу
				if (right < 0) {
					right = 8 // Минимальный отступ от края
				}

				modalRef.current.style.top = `${top}px`
				modalRef.current.style.right = `${right}px`
			}
		}

		if (isOpen) {
			updatePosition()
			window.addEventListener('resize', updatePosition)
		}

		return () => {
			window.removeEventListener('resize', updatePosition)
		}
	}, [isOpen, buttonRef])

	// Загрузка начальных данных
	useEffect(() => {
		if (isOpen) {
			const fetchFilterData = async () => {
				try {
					const data = await apiService.filterClassifieds({
						search: searchQuery,
						currency: 'USD',
					})
					setPriceRange({
						convertedMin: data.priceRange.convertedMin,
						convertedMax: data.priceRange.convertedMax,
						convertedCurrency: data.priceRange.convertedCurrency,
					})
					setMinPrice(data.priceRange.convertedMin)
					setMaxPrice(data.priceRange.convertedMax)
					setAvailableTags(data.availableTags || [])
					setSelectedTags([])
					setSortBy('createdAt')
					setSortOrder('desc')
					const newClassifieds = [
						...data.classifieds.largeFirst,
						...data.classifieds.largeSecond,
						...data.classifieds.small,
					]
					setClassifieds(newClassifieds)
				} catch (error) {
					console.error('Error fetching filter data:', error)
				}
			}
			fetchFilterData()
		}
	}, [isOpen, searchQuery, setClassifieds])

	// Применение фильтров
	const applyFilters = useCallback(async () => {
		try {
			const data = await apiService.filterClassifieds({
				search: searchQuery,
				tags: selectedTags,
				minPrice: minPrice !== null ? minPrice.toString() : undefined,
				maxPrice: maxPrice !== null ? maxPrice.toString() : undefined,
				currency: (['USD', 'UAH', 'EUR'].includes(
					priceRange?.convertedCurrency ?? ''
				)
					? priceRange?.convertedCurrency
					: 'USD') as 'USD' | 'UAH' | 'EUR',
				sortBy,
				sortOrder,
			})
			const newClassifieds = [
				...data.classifieds.largeFirst,
				...data.classifieds.largeSecond,
				...data.classifieds.small,
			]
			setClassifieds(newClassifieds)
		} catch (error) {
			console.error('Error applying filters:', error)
		}
	}, [
		searchQuery,
		selectedTags,
		minPrice,
		maxPrice,
		priceRange,
		sortBy,
		sortOrder,
		setClassifieds,
	])

	// Обработка изменения тегов
	const toggleTag = useCallback((tag: string) => {
		setSelectedTags(prev =>
			prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
		)
	}, [])

	// Обработка изменения сортировки
	const handleSortChange = (value: string) => {
		if (value === 'price-desc') {
			setSortBy('price')
			setSortOrder('desc')
		} else if (value === 'price-asc') {
			setSortBy('price')
			setSortOrder('asc')
		} else if (value === 'createdAt-desc') {
			setSortBy('createdAt')
			setSortOrder('desc')
		} else if (value === 'createdAt-asc') {
			setSortBy('createdAt')
			setSortOrder('asc')
		}
	}

	// Применение фильтров при изменении параметров
	useEffect(() => {
		if (isOpen) {
			applyFilters()
		}
	}, [
		selectedTags,
		minPrice,
		maxPrice,
		sortBy,
		sortOrder,
		applyFilters,
		isOpen,
	])

	// кнопка сброса фильтров
	const resetModalFilters = useCallback(() => {
		setMinPrice(priceRange?.convertedMin ?? null)
		setMaxPrice(priceRange?.convertedMax ?? null)
		setSelectedTags([])
		setSortBy('createdAt')
		setSortOrder('desc')
		resetFilters() // Сбрасываем фильтры в контексте
		applyFilters()
	}, [priceRange, applyFilters, resetFilters])

	if (!isOpen || !priceRange) return null

	return (
		<div
			ref={modalRef}
			className='absolute bg-white border border-[#bdbdbd] rounded-xl shadow-lg z-30 p-4 w-[300px] max-h-[400px] overflow-y-auto transition-all duration-300 ease-in-out transform opacity-0 scale-95 data-[open=true]:opacity-100 data-[open=true]:scale-100'
			data-open={isOpen}
		>
			{/* Диапазон цен */}
			<div className='mb-4'>
				<h3 className='text-sm font-medium text-gray-500 mb-2'>
					{tComponents('priceRange')}
				</h3>
				<div className='relative'>
					<input
						type='range'
						min={priceRange.convertedMin}
						max={priceRange.convertedMax}
						value={minPrice ?? priceRange.convertedMin}
						onChange={e => {
							const value = Number(e.target.value)
							if (maxPrice === null || value <= maxPrice) {
								setMinPrice(value)
							}
						}}
						className='w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer'
						style={{ accentColor: '#3486fe' }}
					/>
					<input
						type='range'
						min={priceRange.convertedMin}
						max={priceRange.convertedMax}
						value={maxPrice ?? priceRange.convertedMax}
						onChange={e => {
							const value = Number(e.target.value)
							if (minPrice === null || value >= minPrice) {
								setMaxPrice(value)
							}
						}}
						className='w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer absolute top-0'
						style={{ accentColor: '#f9329c' }}
					/>
				</div>
				<div className='flex justify-between mt-2'>
					<span className='text-sm text-gray-500'>
						{minPrice ?? priceRange.convertedMin} {priceRange.convertedCurrency}
					</span>
					<span className='text-sm text-gray-500'>
						{maxPrice ?? priceRange.convertedMax} {priceRange.convertedCurrency}
					</span>
				</div>
			</div>

			{/* Теги */}
			<div className='mb-4'>
				<h3 className='text-sm font-medium text-gray-500 mb-2'>
					{tComponents('tags')}
				</h3>
				<div className='flex flex-wrap gap-2'>
					{availableTags.map(tag => (
						<button
							key={tag}
							onClick={() => toggleTag(tag)}
							className={`px-3 py-1 rounded-full text-sm border ${
								selectedTags.includes(tag)
									? 'bg-[#3486fe] text-white border-[#3486fe]'
									: 'bg-white text-[#4f4f4f] border-[#bdbdbd]'
							} transition-colors duration-200`}
						>
							{tag}
						</button>
					))}
				</div>
			</div>

			{/* Сортировка */}
			<div>
				<h3 className='text-sm font-medium text-gray-500 mb-2'>
					{tComponents('sortBy')}
				</h3>
				<select
					onChange={e => handleSortChange(e.target.value)}
					className='w-full p-2 border border-[#bdbdbd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3486fe]'
				>
					<option value='createdAt-desc'>{tComponents('firstNew')}</option>
					<option value='createdAt-asc'>{tComponents('firstOld')}</option>
					<option value='price-desc'>{tComponents('highPrice')}</option>
					<option value='price-asc'>{tComponents('lowPrice')}</option>
				</select>
			</div>

			{/* Кнопка закрытия */}
			<button
				onClick={onClose}
				className='mt-4 w-full bg-[#6FCF97] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#5BBF87] transition-colors duration-200'
			>
				{tComponents('apply')}
			</button>
		</div>
	)
}
