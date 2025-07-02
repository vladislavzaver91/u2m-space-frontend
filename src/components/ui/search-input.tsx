'use client'

import Image from 'next/image'
import { IconCustom } from './icon-custom'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
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

	const { searchQuery, setSearchQuery, classifieds } = useSearch()

	const [query, setQuery] = useState(searchQuery)
	const [isFocused, setIsFocused] = useState(false)
	const [searchHistory, setSearchHistory] = useState<string[]>([])
	const [suggestions, setSuggestions] = useState<Classified[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()

	useLayoutEffect(() => {
		const history = localStorage.getItem('searchHistory')
		if (history) {
			setSearchHistory(JSON.parse(history))
		}
	}, [])

	const saveHistory = (newHistory: string[]) => {
		setSearchHistory(newHistory)
		localStorage.setItem('searchHistory', JSON.stringify(newHistory))
	}

	// Фильтрация объявлений
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
				.slice(0, 5) // Ограничиваем до 5 предложений
		},
		[]
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
		(value: string, id?: string) => {
			setQuery(value)
			setSuggestions([])
			if (!searchHistory.includes(value)) {
				const newHistory = [value, ...searchHistory.slice(0, 4)] // Храним до 5 запросов
				saveHistory(newHistory)
			}
			setSearchQuery(value)
			// if (id) {
			// 	router.push(`/selling-classifieds/${id}`)
			// } else {
			// 	router.push(`/selling-classifieds?query=${encodeURIComponent(value)}`)
			// }
			inputRef.current?.focus()
		},
		[router, saveHistory, searchHistory, setSearchQuery]
	)

	// Очистка поля поиска
	const handleClear = useCallback(() => {
		setQuery('')
		setSuggestions([])
		setSearchQuery('')
		router.push('/selling-classifieds')
		inputRef.current?.focus()
	}, [router, setSearchQuery])

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

	// Определяем элементы автокомплита
	const showHistory =
		isFocused && query.trim().length < 2 && searchHistory.length > 0
	const showSuggestions = isFocused && suggestions.length > 0

	const target =
		typeof window !== 'undefined' && localStorage.getItem('hasVisited')
			? '/selling-classifieds'
			: '/'

	return (
		<div className={`relative w-full select-none ${className}`}>
			<div className='absolute inset-y-0 left-4 flex items-center'>
				{isFocused ? (
					<Image
						src='/icons/logo_input_active.svg'
						alt='logo icon'
						width={48}
						height={32}
					/>
				) : logoActive ? (
					<Link href={target}>
						<Image
							src='/icons/logo_input.svg'
							alt='logo icon'
							width={48}
							height={32}
						/>
					</Link>
				) : (
					<Image
						src='/icons/logo_input.svg'
						alt='logo icon'
						width={48}
						height={32}
					/>
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
				className={`${inputClass} w-full h-16 pl-20 pr-20 py-4 ${
					smallWidth
						? 'border-none bg-transparent'
						: 'border border-[#bdbdbd] rounded-4xl focus:ring-2 focus:ring-blue-500'
				} focus:outline-none placeholder:text-[#4f4f4f] text-[18px]`}
			/>

			{/*Кнопка очистки + иконки микрофона и камеры */}
			<div className='max-md:hidden absolute inset-y-0 right-4 flex items-center gap-4'>
				{query && (
					<ButtonCustom
						onClick={handleClear}
						className='max-w-[76px] w-full h-8 px-4 bg-white border border-[#4F4F4F rounded-lg hover:border-[#f9329c] active:text-white active:bg-[#3486fe] active:border-[#3486fe]'
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
			{isFocused && (showHistory || showSuggestions) && (
				<div className='absolute top-full left-0 right-0 mt-2 bg-white border border-[#bdbdbd] rounded-xl shadow-lg z-10 max-h-[400px] overflow-y-auto'>
					{/* История поиска */}
					{showHistory && (
						<>
							<div className='px-3 pt-2 text-sm text-gray-500 font-medium'>
								История поиска
							</div>
							{searchHistory.slice(0, 5).map(item => (
								<div
									key={item}
									className='flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer'
									onClick={() => handleSuggestionClick(item)}
								>
									<div className='flex items-center gap-2'>
										<IconCustom
											name='Interface/History'
											className='w-5 h-5 text-[#3486fe]'
										/>
										<span
											className='text-[16px] text-[#4f4f4f]'
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
										className='p-1'
									>
										<IconCustom
											name='Menu/Close_MD'
											className='w-5 h-5 text-[#4f4f4f] hover:text-[#f9329c]'
										/>
									</button>
								</div>
							))}
						</>
					)}

					{/* Предложения */}
					{showSuggestions && (
						<>
							<div className='px-3 pt-2 text-sm text-gray-500 font-medium'>
								Найденные объявления
							</div>
							{suggestions.map(item => (
								<div
									key={item.id}
									className='flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer'
									onClick={() => handleSuggestionClick(item.title, item.id)}
								>
									<div className='flex items-center gap-2'>
										<IconCustom
											name='Interface/Search_Magnifying_Glass'
											className='w-5 h-5 text-[#3486fe]'
										/>
										<div
											className='text-[16px] text-[#4f4f4f] font-medium'
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
