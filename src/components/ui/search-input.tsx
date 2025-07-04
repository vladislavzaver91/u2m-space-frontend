'use client'

import Image from 'next/image'
import { IconCustom } from './icon-custom'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { Classified } from '@/types'
import { apiService } from '@/services/api.service'
import { useSearch } from '@/helpers/contexts/search-context'
import { ButtonCustom } from './button-custom'

interface SearchInputProps {
	placeholder?: string
	disabled?: boolean
	className?: string
	inputClass?: string
	smallWidth?: boolean
	logoActive?: boolean
	activeCategory?: string
}

export const SearchInput = ({
	placeholder,
	disabled,
	className = '',
	inputClass = '',
	smallWidth,
	logoActive = false,
	activeCategory = 'Selling',
}: SearchInputProps) => {
	const tComponents = useTranslations('Components')
	const initPlaceholder = tComponents('placeholders.imLookingFor')

	const {
		searchQuery,
		setSearchQuery,
		classifieds,
		setClassifieds,
		resetFilters,
		isFocused,
		setIsFocused,
	} = useSearch()

	const [query, setQuery] = useState(searchQuery)
	const [searchHistory, setSearchHistory] = useState<string[]>([])
	const [suggestions, setSuggestions] = useState<Classified[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()

	useEffect(() => {
		const history = localStorage.getItem('searchHistory')
		if (history) {
			setSearchHistory(JSON.parse(history))
		}
	}, [])

	const saveHistory = (newHistory: string[]) => {
		setSearchHistory(newHistory)
		localStorage.setItem('searchHistory', JSON.stringify(newHistory))
	}

	// Фильтрация и сортировка объявлений
	const filterClassifieds = useCallback(
		(query: string, classifieds: Classified[]): Classified[] => {
			if (query.trim().length < 2) return []
			const lowerQuery = query.toLowerCase()
			return classifieds
				.filter(item => {
					const titleMatch = item.title?.toLowerCase().includes(lowerQuery)
					const descriptionMatch = item.description
						?.toLowerCase()
						.includes(lowerQuery)
					const priceMatch = item.convertedPrice
						?.toString()
						.includes(lowerQuery)
					const tagsMatch = item.tags?.some(tag =>
						tag.toLowerCase().includes(lowerQuery)
					)
					return titleMatch || descriptionMatch || priceMatch || tagsMatch
				})
				.sort((a, b) => {
					// Приоритет по плану: extremum > smart > light
					const planPriority = {
						extremum: 3,
						smart: 2,
						light: 1,
					}

					const priorityA = planPriority[a.plan] || 1
					const priorityB = planPriority[b.plan] || 1

					if (priorityA !== priorityB) {
						return priorityB - priorityA // Высший приоритет выше
					}

					// Если планы одинаковые, сортируем по lastPromoted (от новых к старым)
					const dateA = a.lastPromoted ? new Date(a.lastPromoted).getTime() : 0
					const dateB = b.lastPromoted ? new Date(b.lastPromoted).getTime() : 0
					return dateB - dateA
				})
				.slice(0, 4) // Лимит 4 объявления
		},
		[]
	)

	// Обновление результатов поиска
	const updateSearchResults = useCallback(
		async (search: string) => {
			if (search.trim().length < 2) return
			setIsLoading(true)
			try {
				const data = await apiService.filterClassifieds({
					search,
					currency: 'USD', // Используем валюту по умолчанию, можно добавить выбор валюты
					limit: 20, // Стандартный лимит для списка объявлений
					offset: 0,
				})
				const newClassifieds = [
					...data.classifieds.largeFirst,
					...data.classifieds.largeSecond,
					...data.classifieds.small,
				]
				setClassifieds(newClassifieds)
			} catch (error) {
				console.error('Error updating search results:', error)
			} finally {
				setIsLoading(false)
			}
		},
		[setClassifieds]
	)

	// Обработка изменения ввода
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			setQuery(value)
			if (classifieds) {
				const filtered = filterClassifieds(value, classifieds)
				setSuggestions(filtered)
			}
		},
		[classifieds, filterClassifieds]
	)

	// Обработка клика по предложению или истории
	const handleSuggestionClick = useCallback(
		async (value: string, id?: string) => {
			setQuery(value)
			setSuggestions([])
			if (!searchHistory.includes(value)) {
				const newHistory = [value, ...searchHistory.slice(0, 4)]
				saveHistory(newHistory)
			}
			setSearchQuery(value)
			await updateSearchResults(value)
			// if (id) {
			// 	router.push(`/selling-classifieds/${id}`)
			// } else {
			// 	router.push(`/selling-classifieds?query=${encodeURIComponent(value)}`)
			// }
			inputRef.current?.focus()
		},
		[router, saveHistory, searchHistory, setSearchQuery, updateSearchResults]
	)

	// Очистка поля поиска
	const handleClear = useCallback(async () => {
		setQuery('')
		setSuggestions([])
		setSearchQuery('')
		resetFilters()

		try {
			const data = await apiService.getClassifieds({
				page: 1,
				limit: 20,
				currency: 'USD', // Используем валюту по умолчанию
			})
			const newClassifieds = [
				...data.classifieds.largeFirst,
				...data.classifieds.largeSecond,
				...data.classifieds.small,
			]
			setClassifieds(newClassifieds)
		} catch (error) {
			console.error('Error resetting classifieds:', error)
		}

		inputRef.current?.focus()
	}, [setSearchQuery, setClassifieds, resetFilters])

	// Удаление запроса из истории
	const handleDeleteHistory = useCallback(
		(item: string) => {
			const newHistory = searchHistory.filter(h => h !== item)
			saveHistory(newHistory)
		},
		[saveHistory, searchHistory]
	)

	// Обработка отправки поиска
	const handleSearch = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && query.trim().length >= 2) {
				const firstSuggestion = suggestions[0]
				if (firstSuggestion) {
					handleSuggestionClick(firstSuggestion.title, firstSuggestion.id)
				} else {
					handleSuggestionClick(query)
				}
			}
		},
		[handleSuggestionClick, query, suggestions]
	)

	const highlightMatch = (text: string, query: string) => {
		if (!query) return text
		const regex = new RegExp(`(${query})`, 'gi')
		return text.replace(regex, '<span class="bg-yellow-200">$1</span>')
	}

	// Условия для отображения автокомплита
	const showHistory =
		isFocused &&
		query.trim().length >= 1 &&
		query.trim().length < 2 &&
		searchHistory.length > 0
	const showSuggestions =
		isFocused && query.trim().length >= 2 && suggestions.length > 0
	const isAutocompleteOpen = showHistory || showSuggestions

	const target =
		typeof window !== 'undefined' && localStorage.getItem('hasVisited')
			? '/selling-classifieds'
			: '/'

	// Определяем источник логотипа
	const logoSrc = isFocused
		? query.trim().length >= 1
			? '/icons/logo_input_active.svg'
			: '/icons/logo_blue.svg'
		: '/icons/logo_input.svg'

	return (
		<div className={`relative w-full select-none ${className}`}>
			{/* Логотип */}
			<div className='absolute inset-y-0 left-4 flex items-center'>
				{logoActive && !isFocused ? (
					<Link href={target}>
						<Image src={logoSrc} alt='logo icon' width={48} height={32} />
					</Link>
				) : smallWidth && isFocused ? (
					<ButtonCustom
						onClick={handleClear}
						iconWrapperClass='w-6 h-6'
						icon={
							<IconCustom
								name='arrow-prev'
								hover={true}
								hoverColor='#f9329c'
								className='w-6 h-6 text-[#3486FE] fill-none group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
							/>
						}
						isHover
						className='p-4 min-w-14 md:p-8 md:min-w-[88px] w-fit'
					/>
				) : (
					<Image src={logoSrc} alt='logo icon' width={48} height={32} />
				)}
			</div>

			{/* Поле ввода */}
			<input
				ref={inputRef}
				type='text'
				value={query}
				onChange={handleInputChange}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setTimeout(() => setIsFocused(false), 200)}
				onKeyDown={handleSearch}
				placeholder={placeholder || initPlaceholder}
				disabled={disabled}
				className={`${inputClass} w-full h-16 pl-20 pr-20 py-4 text-[18px] placeholder:text-[#4f4f4f] focus:outline-none transition-opacity duration-200 ${
					smallWidth
						? 'border-none bg-transparent'
						: isAutocompleteOpen
						? 'border border-transparent rounded-t-4xl bg-white shadow-custom-xl'
						: 'border border-[#bdbdbd] rounded-4xl focus:border-transparent focus:ring-1 focus:ring-[#F9329C]'
				}`}
			/>

			{/* Кнопка очистки + иконки микрофона и камеры */}
			<div className='max-md:hidden absolute inset-y-0 right-4 flex items-center gap-4'>
				{query && (
					<ButtonCustom
						onClick={handleClear}
						className='max-w-[76px] w-full h-8 px-4 bg-white border border-[#4F4F4F] rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe]'
						text='Clear'
					/>
				)}
				<div className='w-10 h-10 flex items-center justify-center'>
					<IconCustom
						name='microphone'
						className='w-6 h-6 fill-none text-[#f9329c]'
					/>
				</div>
				<div className='w-10 h-10 flex items-center justify-center'>
					<IconCustom
						name='camera'
						className='w-6 h-6 fill-none text-[#3486fe]'
					/>
				</div>
			</div>

			{/* Автокомплит */}
			{isAutocompleteOpen && (
				<div
					className={`absolute top-full left-0 right-0 bg-white shadow-custom-xl z-40 max-h-[298px] overflow-y-auto rounded-b-[13px] ${
						smallWidth ? 'border-none' : 'border border-transparent'
					}`}
				>
					{/* История поиска */}
					{showHistory && (
						<>
							{searchHistory.slice(0, 4).map(item => (
								<div
									key={item}
									className='flex items-center justify-between px-4 py-2 hover:bg-[#F7F7F7] cursor-pointer group'
									onClick={() => handleSuggestionClick(item)}
								>
									<div className='flex items-center gap-4'>
										<div className='w-[50px] h-10 flex items-center justify-center'>
											<IconCustom
												name='history'
												hover={true}
												hoverColor='#4F4F4F'
												className='w-6 h-6 text-[#BDBDBD] group-hover:text-[#4F4F4F] fill-none'
											/>
										</div>
										<span
											className='text-[16px] font-bold text-[#4F4F4F]'
											dangerouslySetInnerHTML={{
												__html: highlightMatch(item, query),
											}}
										/>
									</div>
									<button
										onClick={e => {
											e.stopPropagation()
											handleDeleteHistory(item)
										}}
										className='w-10 h-10 cursor-pointer flex items-center justify-center'
									>
										<IconCustom
											name='close'
											className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c]'
											hover={true}
											hoverColor='#f9329c'
										/>
									</button>
								</div>
							))}
						</>
					)}

					{/* Предложения */}
					{showSuggestions && (
						<>
							{suggestions.map(item => (
								<div
									key={item.id}
									className='lex items-center justify-between px-4 py-2 hover:bg-[#F7F7F7] cursor-pointer group'
									onClick={() => handleSuggestionClick(item.title, item.id)}
								>
									<div className='flex items-center gap-4'>
										<div className='w-[50px] h-10 flex items-center justify-center'>
											<IconCustom
												name='search-glass'
												hover={true}
												hoverColor='#4F4F4F'
												className='w-6 h-6 text-[#BDBDBD] group-hover:text-[#4F4F4F] fill-none'
											/>
										</div>
										<div
											className='text-[16px] font-bold text-[#4F4F4F]'
											dangerouslySetInnerHTML={{
												__html: highlightMatch(item.title, query),
											}}
										/>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			)}
		</div>
	)
}
