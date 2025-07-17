'use client'

import { useSearch } from '@/helpers/contexts/search-context'
import { useTranslations } from 'next-intl'
import { Range } from 'react-range'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'
import { useScreenResize } from '@/helpers/hooks/use-screen-resize'
import { classifiedsService } from '@/services/api/classifieds.service'
import { debounce } from 'lodash'

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
		minPrice,
		setMinPrice,
		maxPrice,
		setMaxPrice,
		tags,
		setTags,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder,
		priceRange,
		setPriceRange,
		setIsFiltered,
	} = useSearch()
	const { isMobile, isTablet } = useScreenResize()

	const [availableTags, setAvailableTags] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])

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
				isOpen &&
				modalRef.current &&
				!modalRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		const handleScroll = () => {
			if (isOpen) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			window.addEventListener('scroll', handleScroll)
			window.addEventListener('touchmove', handleScroll) // Для сенсорных устройств
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('touchmove', handleScroll)
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
					const data = await classifiedsService.filterClassifieds({
						search: searchQuery,
						currency: 'USD',
					})
					const minPriceValue = data.priceRange.convertedMin
					const maxPriceValue =
						data.priceRange.convertedMin === data.priceRange.convertedMax
							? data.priceRange.convertedMin + 1
							: data.priceRange.convertedMax
					setPriceRange({
						convertedMin: minPriceValue,
						convertedMax: maxPriceValue,
						convertedCurrency: data.priceRange.convertedCurrency,
					})
					setAvailableCities(data.availableCities || [])
					setAvailableTags(data.availableTags || []) // Добавляем загрузку тегов
					setClassifieds(data.classifieds)
				} catch (error) {
					console.error('Error fetching filter data:', error)
				}
			}
			fetchFilterData()
		}
	}, [isOpen, searchQuery, setClassifieds, setAvailableCities, setPriceRange])

	const debouncedApplyFilters = useCallback(
		debounce(async () => {
			try {
				const data = await classifiedsService.filterClassifieds({
					search: searchQuery,
					tags: tags.length > 0 ? tags : undefined, // Отправляем tags только если они выбраны
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
				setClassifieds(data.classifieds)
				setIsFiltered(true)
			} catch (error) {
				console.error('Error applying filters:', error)
			}
		}, 300),
		[
			searchQuery,
			tags,
			minPrice,
			maxPrice,
			priceRange,
			sortBy,
			sortOrder,
			city,
			setClassifieds,
			setIsFiltered,
		]
	)

	// Обработка изменения тегов
	const toggleTag = useCallback(
		(tag: string) => {
			const newTags = tags.includes(tag)
				? tags.filter(t => t !== tag)
				: [...tags, tag]
			const newSelectedTags = selectedTags.includes(tag)
				? selectedTags.filter(t => t !== tag)
				: [...selectedTags, tag]

			setTags(newTags)
			setSelectedTags(newSelectedTags)
		},
		[tags, selectedTags, setTags, setSelectedTags]
	)

	useEffect(() => {
		setSelectedTags(tags)
	}, [tags])

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
			debouncedApplyFilters()
		}
	}, [
		minPrice,
		maxPrice,
		sortBy,
		sortOrder,
		city,
		tags,
		isOpen,
		debouncedApplyFilters,
	])

	// кнопка сброса фильтров
	const resetModalFilters = useCallback(() => {
		setMinPrice(priceRange?.convertedMin ?? null)
		setMaxPrice(priceRange?.convertedMax ?? null)
		setTags([])
		setSelectedTags([])
		setCity(null)
		setSortBy('createdAt')
		setSortOrder('desc')
		setIsFiltered(false) // Сбрасываем флаг фильтрации
		// Вызываем начальную загрузку без фильтров
		const fetchInitialData = async () => {
			try {
				const data = await classifiedsService.getClassifieds({
					limit: 20,
					smallLimit: 12,
					smallOffset: 0,
					currency: 'USD',
				})
				setClassifieds(data.classifieds)
			} catch (error) {
				console.error('Error fetching initial classifieds:', error)
			}
		}
		fetchInitialData()
	}, [
		priceRange,
		setTags,
		setSelectedTags,
		setCity,
		setSortBy,
		setSortOrder,
		setIsFiltered,
		setClassifieds,
	])

	if (!isOpen || !priceRange) return null

	return (
		<div
			ref={modalRef}
			className='fixed top-[80px] right-40 bg-white rounded-b-[13px] shadow-custom-xl z-50 w-full md:max-w-[768px] lg:w-[550px] h-auto overflow-hidden transition-all duration-300 ease-in-out transform opacity-0 scale-95 data-[open=true]:opacity-100 data-[open=true]:scale-100'
			style={
				!isMobile && !isTablet
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
