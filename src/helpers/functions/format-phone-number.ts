export const formatPhoneNumber = (value: string): string => {
	// Удаляем все нецифровые символы, кроме +
	const digits = value.replace(/[^\d+]/g, '')
	if (!digits.startsWith('+')) return digits

	// Извлекаем код страны
	const countryCodeMatch = digits.match(/^\+(\d{1,3})/)
	if (!countryCodeMatch) return digits

	const countryCode = countryCodeMatch[0]
	const number = digits.slice(countryCode.length)

	// Формат для украинского номера (+380)
	if (countryCode === '+380' && number.length <= 9) {
		const parts: string[] = []
		if (number.length >= 1) parts.push(number.slice(0, 2)) // Первые 2 цифры (оператор)
		if (number.length >= 3) parts.push(number.slice(2, 4)) // Следующие 2 цифры
		if (number.length >= 5) parts.push(number.slice(4, 7)) // Следующие 3 цифры
		if (number.length >= 8) parts.push(number.slice(7, 9)) // Последние 2 цифры
		return `${countryCode} ${parts.join(' ')}`.trim()
	}

	// Универсальный формат для других номеров
	if (number.length <= 10) {
		const parts: string[] = []
		if (number.length >= 1) parts.push(number.slice(0, 3)) // Первые 3 цифры
		if (number.length >= 4) parts.push(number.slice(3, 6)) // Следующие 3 цифры
		if (number.length >= 7) parts.push(number.slice(6, 10)) // Последние 4 цифры
		return `${countryCode} ${parts.join(' ')}`.trim()
	}

	// Если номер длиннее, возвращаем без форматирования
	return digits
}
