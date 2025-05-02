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

export class ApiService {
	async getClassifieds(params: {
		page: number
		limit: number
	}): Promise<ClassifiedsResponse> {
		const offset = (params.page - 1) * params.limit
		const response = await $api.get('/api/classifieds', {
			params: { limit: params.limit, offset },
		})
		return response.data
	}

	async getClassifiedById(id: string): Promise<Classified> {
		const response = await $api.get(`/api/classifieds/${id}`)
		return response.data
	}

	async exchangeAuthState(state: string): Promise<AuthResponse> {
		const response = await $api.get('/api/auth/exchange', {
			params: { state },
		})
		return response.data
	}
}

export const apiService = new ApiService()
