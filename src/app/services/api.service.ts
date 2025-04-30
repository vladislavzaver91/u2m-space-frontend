import $api from '../lib/http'
import { Classified, User } from '../types'

interface AuthResponse {
	user: User
	accessToken: string
	refreshToken: string
}

export class ApiService {
	async getClassifieds(): Promise<Classified[]> {
		const response = await $api.get('/api/classifieds')
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
