'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { IconCustom } from './icon-custom'
import { ButtonCustom } from './button-custom'

interface CustomDatePickerProps {
	label: string
	value: string
	onChange: (value: string) => void
	onClick?: () => void
	onOpenChange?: (isOpen: boolean) => void
}

type ViewMode = 'months' | 'years' | 'days'

export const CustomDatePicker = ({
	label,
	value,
	onChange,
	onClick,
	onOpenChange,
}: CustomDatePickerProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [viewMode, setViewMode] = useState<ViewMode>('days')
	const [isMobile, setIsMobile] = useState(false)
	const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
		'top'
	)
	const [dropdownHeight, setDropdownHeight] = useState(424)
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
	const [yearRange, setYearRange] = useState({ start: 2018, end: 2035 })

	const dropdownRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLDivElement>(null)

	const tDatePicker = useTranslations('DatePicker')

	const months = [
		tDatePicker('months.january'),
		tDatePicker('months.february'),
		tDatePicker('months.march'),
		tDatePicker('months.april'),
		tDatePicker('months.may'),
		tDatePicker('months.june'),
		tDatePicker('months.july'),
		tDatePicker('months.august'),
		tDatePicker('months.september'),
		tDatePicker('months.october'),
		tDatePicker('months.november'),
		tDatePicker('months.december'),
	]

	const shortMonths = [
		tDatePicker('monthsShort.january'),
		tDatePicker('monthsShort.february'),
		tDatePicker('monthsShort.march'),
		tDatePicker('monthsShort.april'),
		tDatePicker('monthsShort.may'),
		tDatePicker('monthsShort.june'),
		tDatePicker('monthsShort.july'),
		tDatePicker('monthsShort.august'),
		tDatePicker('monthsShort.september'),
		tDatePicker('monthsShort.october'),
		tDatePicker('monthsShort.november'),
		tDatePicker('monthsShort.december'),
	]

	// Сокращенные названия дней недели
	const weekDays = [
		tDatePicker('weekDays.monday'),
		tDatePicker('weekDays.tuesday'),
		tDatePicker('weekDays.wednesday'),
		tDatePicker('weekDays.thursday'),
		tDatePicker('weekDays.friday'),
		tDatePicker('weekDays.saturday'),
		tDatePicker('weekDays.sunday'),
	]

	// Закрытие при клике вне компонента
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
				setIsFocused(false)
				setViewMode('days')
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Обработчик изменения размера окна
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// Измерение высоты календаря
	useEffect(() => {
		if (isOpen && dropdownRef.current) {
			const height = dropdownRef.current.getBoundingClientRect().height
			setDropdownHeight(height || 424) // Используем измеренную высоту или fallback
		}
	}, [isOpen, viewMode])

	// Обновление позиции календаря при открытии и прокрутке
	useEffect(() => {
		const updateDropdownPosition = () => {
			if (isOpen && buttonRef.current && isMobile) {
				const rect = buttonRef.current.getBoundingClientRect()
				const windowHeight = window.innerHeight

				// Если элемент в нижней половине экрана
				if (rect.top >= windowHeight / 2) {
					setDropdownPosition('bottom')
				} else {
					setDropdownPosition('top')
				}
			}
		}

		updateDropdownPosition()
		window.addEventListener('scroll', updateDropdownPosition)
		return () => window.removeEventListener('scroll', updateDropdownPosition)
	}, [isOpen, isMobile, dropdownHeight])

	const getDropdownClasses = () => {
		let baseClasses =
			'bg-white shadow-custom-xl rounded-b-[13px] max-h-[424px] z-50'

		if (isMobile) {
			baseClasses += ' w-full max-w-[410px]'
		} else {
			// Для десктопов
			baseClasses += ' w-full max-w-[410px] absolute top-[60px] -left-8'
		}

		return baseClasses
	}

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			setIsOpen(false)
			setIsFocused(false)
			setViewMode('days')
		}
	}

	const getDaysInMonth = (year: number, month: number) => {
		const firstDay = new Date(year, month, 1)
		const lastDay = new Date(year, month + 1, 0)
		const daysInMonth = lastDay.getDate()
		const startingDayOfWeek = (firstDay.getDay() + 6) % 7

		const days = []
		for (let i = 0; i < startingDayOfWeek; i++) {
			const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1)
			days.push({
				day: prevMonthDay.getDate(),
				isCurrentMonth: false,
				date: prevMonthDay,
			})
		}

		for (let day = 1; day <= daysInMonth; day++) {
			days.push({
				day,
				isCurrentMonth: true,
				date: new Date(year, month, day),
			})
		}

		const remainingCells = 42 - days.length
		for (let day = 1; day <= remainingCells; day++) {
			const nextMonthDay = new Date(year, month + 1, day)
			days.push({
				day: nextMonthDay.getDate(),
				isCurrentMonth: false,
				date: nextMonthDay,
			})
		}

		return days
	}

	const handlePrevMonth = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (selectedMonth === 0) {
			setSelectedMonth(11)
			setSelectedYear(selectedYear - 1)
		} else {
			setSelectedMonth(selectedMonth - 1)
		}
	}

	const handleNextMonth = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (selectedMonth === 11) {
			setSelectedMonth(0)
			setSelectedYear(selectedYear + 1)
		} else {
			setSelectedMonth(selectedMonth + 1)
		}
	}

	const handlePrevYearRange = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setYearRange({
			start: yearRange.start - 18,
			end: yearRange.end - 18,
		})
	}

	const handleNextYearRange = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setYearRange({
			start: yearRange.start + 18,
			end: yearRange.end + 18,
		})
	}

	const handleMonthSelect = (monthIndex: number, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setSelectedMonth(monthIndex)
		setViewMode('years')
	}

	const handleYearSelect = (year: number, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setSelectedYear(year)
		setViewMode('days')
	}

	const handleDaySelect = (date: Date, e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
			date.getMonth() + 1
		)
			.toString()
			.padStart(2, '0')}.${date.getFullYear()}`
		onChange(formattedDate)
		setIsOpen(false)
		setIsFocused(true)
		setViewMode('days')
	}

	const handleBackToMonths = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setViewMode('months')
	}

	const handleBackToYears = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setViewMode('years')
	}

	const handleToggleOpen = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsOpen(prev => {
			const newIsOpen = !prev
			onOpenChange?.(newIsOpen)
			return newIsOpen
		})
		setIsFocused(!isOpen)
		if (!isOpen) {
			setViewMode('days')
		}
		onClick?.()
	}

	const renderMonthsView = () => (
		<div className='p-4'>
			<div className='text-center text-[16px] font-bold text-black mb-[70px]'>
				{tDatePicker('month')}
			</div>
			<div className='grid grid-cols-3 gap-1 pb-[48px]'>
				{months.map((month, index) => (
					<button
						key={month}
						type='button'
						onClick={e => handleMonthSelect(index, e)}
						className={`md:px-5 md:py-2.5 text-center rounded-md text-[16px] font-bold transition-colors border border-transparent h-11  ${
							index === selectedMonth
								? 'bg-[#3486FE] text-white hover:text-black hover:bg-[#F7F7F7] hover:border-[#3486FE]'
								: 'bg-[#F7F7F7] text-black hover:bg-[#F7F7F7] hover:border-[#3486FE]'
						}`}
					>
						<span className='max-md:hidden'>{month}</span>
						<span className='md:hidden'>{shortMonths[index]}</span>
					</button>
				))}
			</div>
		</div>
	)

	const renderYearsView = () => {
		const years = []
		for (let year = yearRange.start; year <= yearRange.end; year++) {
			years.push(year)
		}

		return (
			<div className='p-4'>
				<div className='md:px-5 md:py-2 text-center text-[16px] font-bold text-black mb-[70px]'>
					{tDatePicker('year')}
				</div>

				<div className='grid grid-cols-4 gap-1'>
					<ButtonCustom
						onClick={handlePrevYearRange}
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='arrow-prev'
								className='w-3 h-3 fill-none text-[#BDBDBD] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
								hover={true}
								hoverColor='#f9329c'
							/>
						}
						isHover
						className='w-full flex items-center justify-center rounded-md! bg-[#F7F7F7]!'
					/>
					{years.map(year => (
						<button
							key={year}
							type='button'
							onClick={e => handleYearSelect(year, e)}
							className={`rounded-md text-[16px] font-bold text-center transition-colors border border-transparent h-11 ${
								year === selectedYear
									? 'bg-[#3486FE] text-white hover:text-black hover:bg-[#F7F7F7] hover:border-[#3486FE]'
									: 'bg-[#F7F7F7] text-black hover:bg-[#F7F7F7] hover:border-[#3486FE]'
							}`}
						>
							{year}
						</button>
					))}
					<ButtonCustom
						onClick={handleNextYearRange}
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='arrow-right'
								className='w-3 h-3 fill-none text-[#BDBDBD] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
								hover={true}
								hoverColor='#f9329c'
							/>
						}
						isHover
						className='w-full flex items-center justify-center rounded-md! bg-[#F7F7F7]!'
					/>
				</div>
			</div>
		)
	}

	const renderDaysView = () => {
		const today = new Date()
		const selectedDate = value
			? new Date(value.split('.').reverse().join('-'))
			: null
		const days = getDaysInMonth(selectedYear, selectedMonth)

		return (
			<div className='p-4 '>
				<div className='flex items-center justify-between mb-3'>
					<ButtonCustom
						onClick={handlePrevMonth}
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='arrow-prev'
								className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
								hover={true}
								hoverColor='#f9329c'
							/>
						}
						isHover
						className='w-10 h-10 flex items-center justify-center rounded-lg'
					/>

					<div className='flex items-center space-x-0.5'>
						<button
							type='button'
							onClick={handleBackToMonths}
							className='font-bold text-black text-[16px] flex items-center p-2 h-9 hover:bg-[#F7F7F7] cursor-pointer'
						>
							{months[selectedMonth]}
							<IconCustom
								name='arrow-drop-down'
								className='ml-2 w-2 h-2 stroke-none'
							/>
						</button>
						<button
							type='button'
							onClick={handleBackToYears}
							className='font-bold text-black text-[16px] flex items-center p-2 h-9 hover:bg-[#F7F7F7] cursor-pointer'
						>
							{selectedYear}
							<IconCustom
								name='arrow-drop-down'
								className='ml-2 w-2 h-2 stroke-none'
							/>
						</button>
					</div>

					<ButtonCustom
						onClick={handleNextMonth}
						iconWrapperClass='w-6 h-6 flex items-center justify-center'
						icon={
							<IconCustom
								name='arrow-right'
								className='w-3 h-3 fill-none text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c]'
								hover={true}
								hoverColor='#f9329c'
							/>
						}
						isHover
						className='w-10 h-10 flex items-center justify-center rounded-lg'
					/>
				</div>

				<div className='grid grid-cols-7 mb-3'>
					{weekDays.map(day => (
						<div
							key={day}
							className='text-center text-[16px] font-bold text-black px-3 py-2.5'
						>
							{day}
						</div>
					))}
				</div>

				<div className='grid grid-cols-7 gap-1'>
					{days.map((dayObj, index) => {
						const isToday =
							dayObj.isCurrentMonth &&
							dayObj.date.getDate() === today.getDate() &&
							dayObj.date.getMonth() === today.getMonth() &&
							dayObj.date.getFullYear() === today.getFullYear()
						const isSelected =
							selectedDate &&
							dayObj.isCurrentMonth &&
							dayObj.date.getDate() === selectedDate.getDate() &&
							dayObj.date.getMonth() === selectedDate.getMonth() &&
							dayObj.date.getFullYear() === selectedDate.getFullYear()

						return (
							<button
								key={index}
								type='button'
								onClick={e =>
									dayObj.isCurrentMonth && handleDaySelect(dayObj.date, e)
								}
								className={`text-[16px] cursor-pointer font-bold transition-colors text-center md:px-3 md:py-2.5 max-md:w-full md:w-[50px] h-11 rounded-md border border-transparent ${
									dayObj.isCurrentMonth
										? 'text-black hover:bg-[#F7F7F7] hover:border-[#3486FE]'
										: 'text-[#BDBDBD]'
								} ${
									(isToday || isSelected) && dayObj.isCurrentMonth
										? 'bg-[#3486FE] text-white hover:bg-[#F7F7F7] hover:text-black hover:border-[#3486FE]'
										: 'bg-[#F7F7F7]'
								}`}
								disabled={!dayObj.isCurrentMonth}
							>
								{dayObj.day}
							</button>
						)
					})}
				</div>
			</div>
		)
	}

	// элемент датапикер
	return (
		<motion.div
			className={`relative h-[102px] ${
				isOpen
					? 'absolute h-[102px] rounded-[13px] w-full max-w-[410px] md:w-[410px] z-40'
					: 'w-full pt-8'
			} cursor-pointer`}
			transition={{ duration: 0.2 }}
			ref={buttonRef}
			onClick={handleToggleOpen}
		>
			{!isOpen && (
				<div
					id={`${label.toLowerCase()}-datepicker`}
					className='relative text-[16px] font-bold text-[#4f4f4f] outline-none border-b bg-transparent cursor-pointer flex justify-between items-center h-[38px] pl-2 pr-2 group w-full border-[#bdbdbd]'
				>
					<label
						htmlFor={`${label.toLowerCase()}-datepicker`}
						className='w-fit transition-all duration-300 ease-in-out text-[16px] font-bold text-[#4f4f4f] cursor-pointer'
					>
						{value || label}
					</label>
					<div className='flex justify-center items-center w-6 h-6'>
						<IconCustom
							name='arrow-down-select'
							className='w-6 h-6 fill-none text-[#3486fe]'
						/>
					</div>
				</div>
			)}

			{isOpen && (
				<>
					{isMobile ? (
						<div
							onClick={handleOverlayClick}
							className={`fixed inset-0 z-50 flex px-4 max-sm:justify-start sm:justify-end ${
								dropdownPosition === 'bottom'
									? 'items-end pb-4'
									: 'items-center'
							}`}
						>
							<div ref={dropdownRef} className={getDropdownClasses()}>
								{viewMode === 'months' && renderMonthsView()}
								{viewMode === 'years' && renderYearsView()}
								{viewMode === 'days' && renderDaysView()}
							</div>
						</div>
					) : (
						<div ref={dropdownRef} className={getDropdownClasses()}>
							{viewMode === 'months' && renderMonthsView()}
							{viewMode === 'years' && renderYearsView()}
							{viewMode === 'days' && renderDaysView()}
						</div>
					)}
				</>
			)}
		</motion.div>
	)
}
