'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { notificationService } from '@/services/notification.service'
import { Notification } from '@/types'

interface NotificationContextType {
	notifications: Notification[]
	setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
	fetchNotifications: (userId: string) => Promise<void>
	markNotificationAsRead: (
		userId: string,
		notificationId: string
	) => Promise<void>
	deleteNotification: (userId: string, notificationId: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([])

	const { authUser } = useAuth()

	const fetchNotifications = async (userId: string) => {
		try {
			const data = await notificationService.fetchNotifications(userId)
			const sortedNotifications = data.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)
			setNotifications(sortedNotifications)
		} catch (error) {
			console.error('Failed to load notifications:', error)
		}
	}

	const markNotificationAsRead = async (
		userId: string,
		notificationId: string
	) => {
		try {
			await notificationService.markNotificationAsRead(userId, notificationId)
			setNotifications(prev =>
				prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
			)
		} catch (error) {
			console.error('Failed to mark notification as read:', error)
		}
	}

	const deleteNotification = async (userId: string, notificationId: string) => {
		try {
			await notificationService.deleteNotification(userId, notificationId)
			setNotifications(prev => prev.filter(n => n.id !== notificationId))
		} catch (error) {
			console.error('Failed to delete notification:', error)
		}
	}

	// Уведомления при загрузке страницы, если юзер авторизован
	useEffect(() => {
		if (authUser?.id) {
			fetchNotifications(authUser.id)
		}
	}, [authUser?.id])

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				setNotifications,
				fetchNotifications,
				markNotificationAsRead,
				deleteNotification,
			}}
		>
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotifications = () => {
	const context = useContext(NotificationContext)
	if (!context) {
		throw new Error(
			'useNotifications must be used within a NotificationProvider'
		)
	}
	return context
}
