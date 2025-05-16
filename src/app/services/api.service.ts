import $api from '../lib/http'
import { Classified, User } from '../types'

interface AuthResponse {
	user: User
	accessToken: string
	refreshToken: string
}

interface LoginData {
	email: string
	password: string
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

	async toggleFavorite(id: string): Promise<Classified> {
		const res = await $api.patch(`/api/classifieds/${id}/toggle-favorite`)
		return res.data
	}

	async deleteClassified(id: string): Promise<void> {
		await $api.delete(`/api/classifieds/${id}`)
	}

	async getTags(): Promise<Tag[]> {
		const res = await $api.get('/api/tags')
		return res.data
	}

	async getTagByName(name: string): Promise<Tag> {
		const res = await $api.get('/api/tags', { params: { name } })
		return res.data
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

	async login(data: LoginData): Promise<AuthResponse> {
		const res = await $api.post('/api/auth/login', data)
		return res.data
	}
}

export const apiService = new ApiService()
