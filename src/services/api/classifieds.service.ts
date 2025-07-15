import {
	Classified,
	ClassifiedData,
	ClassifiedsResponse,
	FilterClassifiedsResponse,
	PartialUpdateClassifiedData,
	UserClassifiedsResponse,
} from '@/types'
import $api from '../../lib/http'

export class ClassifiedsService {
	async getClassifieds(params: {
		limit?: number
		smallLimit?: number
		smallOffset?: number
		tags?: string[]
		currency?: 'USD' | 'UAH' | 'EUR'
		category?: string
		city?: string
	}): Promise<ClassifiedsResponse> {
		const res = await $api.get('/api/classifieds', {
			params: {
				limit: params.limit || 20,
				smallLimit: params.smallLimit || 12,
				smallOffset: params.smallOffset || 0,
				tags: params.tags,
				currency: params.currency,
				category: params.category || '',
				city: params.city,
			},
		})
		return res.data
	}

	async filterClassifieds(params: {
		search?: string
		tags?: string[]
		minPrice?: string
		maxPrice?: string
		currency?: 'USD' | 'UAH' | 'EUR'
		sortBy?: 'price' | 'createdAt'
		sortOrder?: 'asc' | 'desc'
		city?: string
		limit?: number
		offset?: number
	}): Promise<FilterClassifiedsResponse> {
		const res = await $api.get('/api/classifieds/filter', {
			params: {
				search: params.search,
				tags: params.tags,
				minPrice: params.minPrice,
				maxPrice: params.maxPrice,
				currency: params.currency || 'USD',
				sortBy: params.sortBy || 'createdAt',
				sortOrder: params.sortOrder || 'desc',
				city: params.city,
				limit: params.limit || 20,
				offset: params.offset || 0,
			},
		})
		return res.data
	}

	async getClassifiedById(
		id: string,
		params?: { currency?: 'USD' | 'UAH' | 'EUR' }
	): Promise<Classified> {
		const res = await $api.get(`/api/classifieds/${id}`, { params })
		return res.data
	}

	async getUserClassifieds(params: {
		page: number
		limit: number
	}): Promise<UserClassifiedsResponse> {
		const offset = (params.page - 1) * params.limit
		const res = await $api.get('/api/classifieds/user', {
			params: { limit: params.limit, offset },
		})
		return res.data
	}

	async createClassified(data: ClassifiedData | FormData): Promise<Classified> {
		console.log('Sending FormData to server:', data)
		const isFormData = data instanceof FormData
		const res = await $api.post('/api/classifieds', data, {
			headers: isFormData
				? { 'Content-Type': 'multipart/form-data' }
				: undefined,
		})
		console.log('Server response:', res.data)
		return res.data
	}

	async updateClassified(
		id: string,
		data: PartialUpdateClassifiedData | FormData
	): Promise<Classified> {
		const isFormData = data instanceof FormData
		const res = await $api.put(`/api/classifieds/${id}`, data, {
			headers: isFormData
				? { 'Content-Type': 'multipart/form-data' }
				: undefined,
		})
		return res.data
	}

	async toggleClassifiedActive(
		id: string,
		isActive: boolean
	): Promise<Classified> {
		const res = await $api.patch(`/api/classifieds/${id}/toggle-active`, {
			isActive,
		})
		return res.data
	}

	async deleteClassified(id: string): Promise<void> {
		await $api.delete(`/api/classifieds/${id}`)
	}
}

export const classifiedsService = new ClassifiedsService()
