'use client'

import { useSearch } from '@/helpers/contexts/search-context'
import { apiService } from '@/services/api.service'
import { useTranslations } from 'next-intl'
import { Range } from 'react-range'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'
import { useScreenResize } from '@/helpers/hooks/use-screen-resize'

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
	const tFilters = useTranslations('Filters')
	const {
		searchQuery,
		setClassifieds,
		resetFilters,
		city,
		setCity,
		availableCities,
		setAvailableCities,
	} = useSearch()
	const { isMobile } = useScreenResize()

	const [priceRange, setPriceRange] = useState<PriceRange | null>(null)
	const [minPrice, setMinPrice] = useState<number | null>(null)
	const [maxPrice, setMaxPrice] = useState<number | null>(null)
	const [availableTags, setAvailableTags] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [sortBy, setSortBy] = useState<'price' | 'createdAt'>('createdAt')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

	const modalRef = useRef<HTMLDivElement>(null)

	const sortOptions = [
		{ value: 'createdAt-desc', label: tFilters('buttons.firstNew') },
		{ value: 'createdAt-asc', label: tFilters('buttons.firstOld') },
		{ value: 'price-desc', label: tFilters('buttons.highPrice') },
		{ value: 'price-asc', label: tFilters('buttons.lowPrice') },
	]

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
	const getModalPosition = () => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			return {
				top: rect.bottom + window.scrollY,
				left: rect.left, // Позиционируем по левой стороне кнопки
			}
		}
		return { top: 0, left: 0 }
	}

	const { top, left } = getModalPosition()

	// Загрузка начальных данных
	useEffect(() => {
		if (isOpen) {
			const fetchFilterData = async () => {
				try {
					const data = await apiService.filterClassifieds({
						search: searchQuery,
						currency: 'USD',
					})
					const minPriceValue = data.priceRange.convertedMin
					const maxPriceValue =
						data.priceRange.convertedMax === data.priceRange.convertedMin
							? data.priceRange.convertedMin + 1 // Добавляем 1, если min === max
							: data.priceRange.convertedMax
					setPriceRange({
						convertedMin: minPriceValue,
						convertedMax: maxPriceValue,
						convertedCurrency: data.priceRange.convertedCurrency,
					})
					setMinPrice(minPriceValue)
					setMaxPrice(maxPriceValue)
					setAvailableTags(data.availableTags || [])
					setAvailableCities(data.availableCities || [])
					setSelectedTags([])
					setCity(null)
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
	}, [isOpen, searchQuery, setClassifieds, setAvailableCities])

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
				city: city ?? undefined,
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
		city,
		setClassifieds,
	])

	// Обработка изменения тегов
	const toggleTag = useCallback((tag: string) => {
		setSelectedTags(prev =>
			prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
		)
	}, [])

	// Обработка выбора города
	const toggleCity = useCallback(
		(selectedCity: string) => {
			setCity(city === selectedCity ? null : selectedCity)
		},
		[city, setCity]
	)

	// Обработка выбора сортировки
	const toggleSort = useCallback((value: string) => {
		const [sortField, order] = value.split('-') as [
			'price' | 'createdAt',
			'asc' | 'desc'
		]
		setSortBy(sortField)
		setSortOrder(order)
	}, [])

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
		city,
		applyFilters,
		isOpen,
	])

	// кнопка сброса фильтров
	const resetModalFilters = useCallback(() => {
		setMinPrice(priceRange?.convertedMin ?? null)
		setMaxPrice(priceRange?.convertedMax ?? null)
		setSelectedTags([])
		setCity(null)
		setSortBy('createdAt')
		setSortOrder('desc')
		resetFilters() // Сбрасываем фильтры в контексте
		applyFilters()
	}, [priceRange, applyFilters, resetFilters])

	if (!isOpen || !priceRange) return null

	return (
		<div
			ref={modalRef}
			className='fixed top-[80px] right-40 bg-white rounded-b-[13px] shadow-custom-xl z-50 w-full md:max-w-[768px] lg:w-[550px] h-auto overflow-hidden transition-all duration-300 ease-in-out transform opacity-0 scale-95 data-[open=true]:opacity-100 data-[open=true]:scale-100'
			style={
				!isMobile
					? { top: `${top}px`, left: `${left}px` }
					: { top: `${top}px`, left: 0, right: 0 }
			}
			data-open={isOpen}
		>
			{/* Диапазон цен */}
			<div className='p-8'>
				<p className='text-[16px] font-bold text-[#4F4F4F] mb-4'>
					{tFilters('price')}
				</p>
				<div className='relative' style={{ height: '46px' }}>
					{priceRange && priceRange.convertedMin < priceRange.convertedMax ? (
						<Range
							step={1}
							min={priceRange.convertedMin}
							max={priceRange.convertedMax}
							values={[
								minPrice ?? priceRange.convertedMin,
								maxPrice ?? priceRange.convertedMax,
							]}
							onChange={values => {
								setMinPrice(values[0])
								setMaxPrice(values[1])
							}}
							renderTrack={({ props, children }) => (
								<div
									{...props}
									className='h-2 w-full bg-[#F7F7F7] rounded-lg'
									style={{
										position: 'relative',
										top: '50%',
										transform: 'translateY(-50%)',
									}}
								>
									<div
										className='absolute h-2 bg-[#F7F7F7] rounded-lg'
										style={{
											left: `${
												(((minPrice ?? priceRange.convertedMin) -
													priceRange.convertedMin) /
													(priceRange.convertedMax - priceRange.convertedMin)) *
												100
											}%`,
											width: `${
												(((maxPrice ?? priceRange.convertedMax) -
													(minPrice ?? priceRange.convertedMin)) /
													(priceRange.convertedMax - priceRange.convertedMin)) *
												100
											}%`,
										}}
									/>
									{children}
								</div>
							)}
							renderThumb={({ props, index }) => (
								<div
									{...props}
									className={`h-[46px] w-[50px] flex items-center justify-center text-white text-[16px] font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-[#3486FE] ${
										index === 0 ? 'bg-[#3486FE]' : 'bg-[#F9329C]'
									}`}
									style={{
										...props.style,
										boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
										cursor: 'pointer',
										// Корректировка позиции, чтобы учесть padding: 32px
										left: `calc(${props.style.left} - ${
											index === 0 ? '32px' : '0px'
										})`,
										right: `calc(${props.style.right} - ${
											index === 1 ? '32px' : '0px'
										})`,
									}}
								>
									{index === 0
										? `$${minPrice ?? priceRange.convertedMin}`
										: `$${maxPrice ?? priceRange.convertedMax}`}
								</div>
							)}
						/>
					) : (
						<p className='text-[16px] text-[#4F4F4F] font-bold'>
							{tFilters('errorPrice')}
						</p>
					)}
				</div>
			</div>

			{/* Теги */}
			<div className='p-8'>
				<p className='text-[16px] font-bold text-[#4F4F4F] mb-4'>
					{tFilters('tags')}
				</p>
				<div className='flex flex-wrap gap-4'>
					{availableTags.map(tag => (
						<ButtonCustom
							key={tag}
							onClick={() => toggleTag(tag)}
							text={tag}
							iconWrapperClass='w-6 h-6'
							icon={
								<IconCustom
									name={
										selectedTags.includes(tag) ? 'switch-right' : 'switch-left'
									}
									className={`w-6 h-6 fill-none ${
										selectedTags.includes(tag)
											? 'text-[#6FCF97]'
											: 'text-[#BDBDBD]'
									}`}
								/>
							}
							className={`py-2 pl-2 pr-4 rounded-lg bg-[#F7F7F7] border text-[16px] font-bold ${
								selectedTags.includes(tag)
									? 'text-[#3486FE] border-[#3486fe]'
									: 'text-[#BDBDBD] border-[#bdbdbd]'
							} transition-colors duration-300`}
						/>
					))}
				</div>
			</div>

			{/* Сортировка по региону */}
			<div className='p-8'>
				<p className='text-[16px] font-bold text-[#4F4F4F] mb-4'>
					{tFilters('sortByRegionAndCity')}
				</p>
				<div className='flex flex-wrap gap-4'>
					{availableCities.map(cityItem => (
						<ButtonCustom
							key={cityItem}
							onClick={() => toggleCity(cityItem)}
							text={cityItem}
							iconWrapperClass='w-6 h-6'
							icon={
								<IconCustom
									name={city === cityItem ? 'switch-right' : 'switch-left'}
									className={`w-6 h-6 fill-none ${
										city === cityItem ? 'text-[#6FCF97]' : 'text-[#BDBDBD]'
									}`}
								/>
							}
							className={`py-2 pl-2 pr-4 rounded-lg bg-[#F7F7F7] border text-[16px] font-bold ${
								city === cityItem
									? 'text-[#3486FE] border-[#3486fe]'
									: 'text-[#BDBDBD] border-[#bdbdbd]'
							} transition-colors duration-300`}
						/>
					))}
				</div>
			</div>

			{/* Сортировка */}
			<div className='p-8'>
				<p className='text-[16px] font-bold text-[#4F4F4F] mb-4'>
					{tFilters('sort')}
				</p>
				<div className='grid grid-cols-2 gap-4 w-fit'>
					{sortOptions.map(option => (
						<ButtonCustom
							key={option.value}
							onClick={() => toggleSort(option.value)}
							text={option.label}
							iconWrapperClass='w-6 h-6'
							icon={
								<IconCustom
									name='check'
									className={`w-6 h-6 fill-none ${
										sortBy + '-' + sortOrder === option.value
											? 'text-[#6FCF97]'
											: 'text-[#BDBDBD]'
									}`}
								/>
							}
							className={`max-w-full py-2 pl-2 pr-4 rounded-lg bg-[#F7F7F7] border text-[16px] font-bold ${
								sortBy + '-' + sortOrder === option.value
									? 'text-[#3486FE] border-[#3486fe]'
									: 'text-[#BDBDBD] border-[#bdbdbd]'
							} transition-colors duration-300`}
						/>
					))}
				</div>
			</div>
			{/* Кнопка закрытия */}
			<div className='flex justify-end p-8'>
				<ButtonCustom
					onClick={onClose}
					text={tFilters('buttons.apply')}
					className='min-w-[81px] h-10 px-4 md:px-4 py-2 md:py-2.5 text-white bg-[#6FCF97]! rounded-lg'
				/>
			</div>
		</div>
	)
}
