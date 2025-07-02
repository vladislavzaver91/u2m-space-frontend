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

	const { searchQuery, setClassifieds } = useSearch()

	const [priceRange, setPriceRange] = useState<PriceRange | null>(null)
	const [minPrice, setMinPrice] = useState<number | null>(null)
	const [maxPrice, setMaxPrice] = useState<number | null>(null)
	const [availableTags, setAvailableTags] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [sortBy, setSortBy] = useState<'price' | 'createdAt'>('createdAt')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

	const modalRef = useRef<HTMLDivElement>(null)

	// Загрузка начальных данных (диапазон цен и теги)
	useLayoutEffect(() => {
		if (isOpen) {
			const fetchFilterData = async () => {
				try {
					const data = await apiService.filterClassifieds({
						search: searchQuery,
						currency: 'USD', // Можно заменить на валюту из useLanguage
					})
					setPriceRange({
						convertedMin: data.priceRange.convertedMin,
						convertedMax: data.priceRange.convertedMax,
						convertedCurrency: data.priceRange.convertedCurrency,
					})
					setMinPrice(data.priceRange.convertedMin)
					setMaxPrice(data.priceRange.convertedMax)
					setAvailableTags(data.availableTags || [])
					setClassifieds(data.classifieds)
				} catch (error) {
					console.error('Error fetching filter data:', error)
				}
			}
			fetchFilterData()
		}
	}, [isOpen, searchQuery, setClassifieds])

	// При применении фильтров
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
			setClassifieds(data.classifieds)
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

	// Позиционирование модального окна
	useEffect(() => {
		if (isOpen && buttonRef.current && modalRef.current) {
			const buttonRect = buttonRef.current.getBoundingClientRect()
			modalRef.current.style.top = `${buttonRect.bottom + window.scrollY}px`
			modalRef.current.style.right = `${window.innerWidth - buttonRect.right}px`
		}
	}, [isOpen, buttonRef])

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

	if (!isOpen || !priceRange || !buttonRef) return null

	return (
		<div
			ref={modalRef}
			className='absolute bg-white border border-[#bdbdbd] rounded-xl shadow-lg z-30 p-4 w-[300px] max-h-[400px] overflow-y-auto'
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
							}`}
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
					className='w-full p-2 border border-[#bdbdbd] rounded-lg text-sm'
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
				className='mt-4 w-full bg-[#6FCF97] text-white py-2 rounded-lg text-sm font-medium'
			>
				{tComponents('apply')}
			</button>
		</div>
	)
}
