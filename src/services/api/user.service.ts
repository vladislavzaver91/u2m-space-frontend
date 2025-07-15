import { GuestSettings, UpdateUserProfileData, User } from '@/types'
import $api from '../../lib/http'

export class UserService {
	async updateGuestSettings(settings: GuestSettings): Promise<GuestSettings> {
		const res = await $api.post('/api/users/guest/settings', settings)
		return res.data
	}

	async getUserProfile(id: string): Promise<User> {
		const res = await $api.get(`/api/users/${id}`)
		return res.data.user
	}

	async updateUserProfile(
		id: string,
		data: UpdateUserProfileData
	): Promise<User> {
		const formData = new FormData()
		Object.entries(data).forEach(([key, value]) => {
			if (value !== undefined) {
				if (key === 'avatar' && value instanceof File) {
					formData.append(key, value)
				} else if (value === null) {
					formData.append(key, '')
				} else {
					formData.append(key, String(value))
				}
			}
		})

		const res = await $api.post(`/api/users/${id}/update`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		return res.data.user
	}

	async deleteUserProfile(
		id: string,
		data?: { deleteReason?: string | null }
	): Promise<void> {
		await $api.delete(`/api/user/${id}`, { data })
	}
}

export const userService = new UserService()
