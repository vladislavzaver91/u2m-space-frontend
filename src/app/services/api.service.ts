import $api from '../lib/http'
import { Classified, User } from '../types'

interface AuthResponse {
	user: User
	accessToken: string
	refreshToken: string
}

interface ClassifiedsResponse {
	classifieds: Classified[]
	total: number
	hasMore: boolean
}

interface ClassifiedData {
	title: string
	description: string
	price: string
	images?: File[] | string[]
	tags: string[]
}

interface UpdateClassifiedData extends ClassifiedData {
	isActive?: boolean
}

interface PartialUpdateClassifiedData {
	isActive?: boolean
	title?: string
	description?: string
	price?: string
	tags?: string[]
	images?: File[] | string[]
}

interface Tag {
	id: string
	name: string
	createdAt: string
	updatedAt: string
}

export class ApiService {
	async getClassifieds(params: {
		page: number
		limit: number
		tags?: string[]
	}): Promise<ClassifiedsResponse> {
		const offset = (params.page - 1) * params.limit
		const res = await $api.get('/api/classifieds', {
			params: { limit: params.limit, offset, tags: params.tags },
		})
		return res.data
	}

	async getClassifiedById(id: string): Promise<Classified> {
		const res = await $api.get(`/api/classifieds/${id}`)
		return res.data
	}

	async getUserClassifieds(params: {
		page: number
		limit: number
	}): Promise<ClassifiedsResponse> {
		const offset = (params.page - 1) * params.limit
		const res = await $api.get('/api/classifieds/user', {
			params: { limit: params.limit, offset },
		})
		return res.data
	}

	async createClassified(data: ClassifiedData | FormData): Promise<Classified> {
		const res = await $api.post('/api/classifieds', data, {
			headers:
				data instanceof FormData
					? { 'Content-Type': 'multipart/form-data' }
					: undefined,
		})
		return res.data
	}

	async updateClassified(
		id: string,
		data: PartialUpdateClassifiedData
	): Promise<Classified> {
		const res = await $api.put(`/api/classifieds/${id}`, data)
		return res.data
	}

	async deleteClassified(id: string): Promise<void> {
		await $api.delete(`/api/classifieds/${id}`)
	}

	async createTag(name: string): Promise<Tag> {
		const res = await $api.post('/api/tags', { name })
		return res.data
	}

	async deleteTag(id: string): Promise<void> {
		await $api.delete(`/api/tags/${id}`)
	}

	async exchangeAuthState(state: string): Promise<AuthResponse> {
		const response = await $api.get('/api/auth/exchange', {
			params: { state },
		})
		return response.data
	}
}

export const apiService = new ApiService()
