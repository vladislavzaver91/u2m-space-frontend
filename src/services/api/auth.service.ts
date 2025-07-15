import { AuthResponse, LoginData } from '@/types'
import $api from '../../lib/http'

export class AuthService {
	async exchangeAuthState(state: string): Promise<AuthResponse> {
		const res = await $api.get('/api/auth/exchange', {
			params: { state },
		})
		return res.data
	}

	async login(data: LoginData): Promise<AuthResponse> {
		const res = await $api.post('/api/auth/login', data)
		return res.data
	}
}

export const authService = new AuthService()
