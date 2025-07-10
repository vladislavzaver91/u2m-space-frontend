import { Notification } from '@/types'
import $api from '../lib/http'

export class NotificationService {
	async fetchNotifications(userId: string): Promise<Notification[]> {
		const res = await $api.get(`/api/users/${userId}/notifications`)
		return res.data
	}

	async markNotificationAsRead(
		userId: string,
		notificationId: string
	): Promise<Notification[]> {
		const res = await $api.patch(
			`/api/users/${userId}/notifications/${notificationId}/read`
		)
		return res.data
	}

	async deleteNotification(
		userId: string,
		notificationId: string
	): Promise<void> {
		const res = await $api.delete(
			`/api/users/${userId}/notifications/${notificationId}`
		)
		return res.data
	}
}

export const notificationService = new NotificationService()
