import { CurrencyConversionResponse } from '@/types'
import $api from '../../lib/http'

export class CurrencyService {
	async updateUserCurrency(
		userId: string,
		currency: 'USD' | 'UAH' | 'EUR'
	): Promise<void> {
		await $api.put(`/api/users/${userId}/currency`, { currency })
	}

	async convertCurrency(
		amount: number,
		fromCurrency: 'USD' | 'UAH' | 'EUR'
	): Promise<CurrencyConversionResponse> {
		const res = await $api.post('/api/currency/convert', {
			amount,
			fromCurrency,
		})
		return res.data
	}
}

export const currencyService = new CurrencyService()
