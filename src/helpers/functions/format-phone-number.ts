export const formatPhoneNumber = (value: string): string => {
	// Удаляем все нецифровые символы, кроме +
	const cleanValue = value.replace(/[^0-9+]/g, '').replace(/^\+{2,}/, '+')
	if (!cleanValue) return ''

	// Если нет +, добавляем его
	const formatted = cleanValue.startsWith('+') ? cleanValue : `+${cleanValue}`

	// Извлекаем код страны
	const digits = formatted.replace(/^\+/, '')
	if (digits.length <= 3) return `+${digits}`
	if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`
	return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
