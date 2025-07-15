import { ToggleFavoriteResponse, UserClassifiedsResponse } from '@/types'
import $api from '../../lib/http'

export class FavoritesService {
	async getUserFavorites(params: {
		page: number
		limit: number
	}): Promise<UserClassifiedsResponse> {
		const offset = (params.page - 1) * params.limit
		const res = await $api.get('/api/favorites/user', {
			params: { limit: params.limit, offset },
		})
		return res.data
	}

	async toggleFavorite(id: string): Promise<ToggleFavoriteResponse> {
		const res = await $api.patch(`/api/classifieds/${id}/toggle-favorite`)
		return res.data
	}
}

export const favoritesService = new FavoritesService()
