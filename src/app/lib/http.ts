import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios'

interface AuthTokens {
	accessToken: string
	refreshToken: string
}

interface ApiError {
	response?: {
		status?: number
		data?: {
			error?: string
		}
	}
	message?: string
}

const API_URL =
	process.env.NEXT_PUBLIC_ENVIRONMENT_URL === 'develop'
		? 'http://localhost:3000'
		: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const $api: AxiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Интерцептор запросов для добавления accessToken
$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const accessToken = localStorage.getItem('accessToken')
	if (accessToken && config.headers) {
		config.headers.set('Authorization', `Bearer ${accessToken}`)
	}
	return config
})

// Интерцептор ответов для обработки истекших токенов
$api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async error => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			try {
				const refreshToken = localStorage.getItem('refreshToken')
				if (!refreshToken) {
					throw new Error('No refresh token')
				}
				console.log('Attempting token refresh with:', refreshToken)

				const response = await axios.post<AuthTokens>(
					`${API_URL}/api/auth/refresh`,
					{ refreshToken },
					{
						headers: {
							'Refresh-Token': refreshToken,
						},
						withCredentials: false,
					}
				)
				const { accessToken, refreshToken: newRefreshToken } = response.data

				localStorage.setItem('accessToken', accessToken)
				localStorage.setItem('refreshToken', newRefreshToken)

				originalRequest.headers.Authorization = `Bearer ${accessToken}`
				return $api(originalRequest)
			} catch (refreshError: unknown) {
				console.error('Refresh token failed:', refreshError)
				const apiError = refreshError as ApiError
				if (apiError.response) {
					console.error('Server response:', apiError.response.data)
				}
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
				localStorage.removeItem('user')
				window.location.href = '/'
				return Promise.reject(refreshError)
			}
		}
		return Promise.reject(error)
	}
)

export default $api
