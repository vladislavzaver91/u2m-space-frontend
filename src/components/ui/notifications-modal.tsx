'use client'

import { notificationService } from '@/services/notification.service'
import { useTranslations } from 'next-intl'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconCustom } from './icon-custom'
import { useNotifications } from '@/helpers/contexts/notification-context'
import { Loader } from './loader'
import { Notification } from '@/types'
import { useScreenResize } from '@/helpers/hooks/use-screen-resize'

interface NotificationsModalProps {
	isOpen: boolean
	onClose: () => void
	userId: string
	buttonRef: React.RefObject<HTMLButtonElement | null>
}

export const NotificationsModal = ({
	isOpen,
	onClose,
	userId,
	buttonRef,
}: NotificationsModalProps) => {
	const t = useTranslations('Notifications')

	const { notifications, setNotifications, markNotificationAsRead } =
		useNotifications()
	const { isMobile } = useScreenResize()

	const [loading, setLoading] = useState(false)

	const modalRef = useRef<HTMLDivElement>(null)

	// Форматирование сообщения с выделением {value} или +{value}
	const formatMessage = (
		message: string,
		messageData: { [key: string]: string }
	) => {
		const valueRegex = /\+?\{value\}/g
		const parts = message.split(valueRegex)
		const value = messageData.value || ''
		const isValuePresent = message.includes('{value}')

		return (
			<>
				{parts.map((part, index) => (
					<React.Fragment key={index}>
						{part}
						{index < parts.length - 1 && (
							<p className='font-bold text-blue-600'>
								{message.startsWith('+{value}') && index === 0
									? `+${value}`
									: value}
							</p>
						)}
					</React.Fragment>
				))}
			</>
		)
	}

	// Перевод уведомления
	const translateNotification = (notification: Notification) => {
		const { title, message } = t.raw(`types.${notification.type}`)
		let formattedTitle = title
		let formattedMessage = message

		Object.keys(notification.messageData).forEach(key => {
			const regex = new RegExp(`\\{${key}\\}`, 'g')
			formattedTitle = formattedTitle.replace(
				regex,
				notification.messageData[key]
			)
			formattedMessage = formattedMessage.replace(
				regex,
				notification.messageData[key]
			)
		})

		return { title: formattedTitle, message: formattedMessage }
	}

	// // Отмечаем непрочитанные уведомления как прочитанные при открытии модалки
	// useEffect(() => {
	// 	if (isOpen && userId) {
	// 		setLoading(true)
	// 		try {
	// 			notifications.forEach(async notification => {
	// 				if (!notification.isRead) {
	// 					await markNotificationAsRead(userId, notification.id)
	// 				}
	// 			})
	// 		} catch (error) {
	// 			console.error('Failed to mark notifications as read:', error)
	// 		} finally {
	// 			setLoading(false)
	// 		}
	// 	}
	// }, [isOpen, userId, notifications, markNotificationAsRead])

	// Закрытие модального окна по клику за его пределами
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isOpen &&
				modalRef.current &&
				!modalRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose])

	// Обработчик удаления уведомления
	const handleDelete = async (notificationId: string) => {
		try {
			await notificationService.deleteNotification(userId, notificationId)
			setNotifications(notifications.filter(n => n.id !== notificationId))
		} catch (error) {
			console.error('Failed to delete notification:', error)
		}
	}

	// Вычисление позиции модального окна относительно кнопки
	const getModalPosition = () => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			return {
				top: rect.bottom + window.scrollY,
				left: rect.left, // Позиционируем по левой стороне кнопки
			}
		}
		return { top: 0, left: 0 }
	}

	const { top, left } = getModalPosition()

	if (!isOpen) return null

	return (
		<div
			ref={modalRef}
			className='fixed z-50 bg-white shadow-custom-xl rounded-b-[13px] md:max-w-[393px] w-full h-[200px]'
			style={
				!isMobile
					? { top: `${top}px`, left: `${left}px` }
					: { top: `${top}px`, left: 0, right: 0 }
			}
		>
			<div className='h-full pr-2 custom-scrollbar overflow-y-scroll rounded-b-[13px]'>
				{loading ? (
					<Loader />
				) : notifications.length === 0 ? (
					<p className='p-4 text-[16px] font-bold text-[#4F4F4F] flex flex-col items-center justify-center h-full'>
						{t('empty')}
					</p>
				) : (
					<ul className=''>
						{notifications.map(notification => {
							const { title, message } = translateNotification(notification)
							return (
								<li
									key={notification.id}
									className='flex justify-between items-center px-4 py-2 bg-white hover:bg-[#F7F7F7] hover:py-3 group transition-all duration-200'
								>
									<div className='flex flex-col'>
										<p
											className={`text-[13px] font-bold ${
												notification.isRead
													? 'text-[#BABABA]'
													: 'text-[#4F4F4F]'
											}`}
										>
											{title}
										</p>
										<p
											className={`text-[13px] font-normal truncate max-w-[289px] ${
												notification.isRead
													? 'text-[#BABABA]'
													: 'text-[#4F4F4F]'
											}`}
										>
											{[
												'BONUSES_CHANGED',
												'TRUST_RATING_CHANGED',
												'PLAN_CHANGED',
											].includes(notification.type)
												? formatMessage(message, notification.messageData)
												: message}
										</p>
									</div>

									<button
										onClick={() => handleDelete(notification.id)}
										className='hidden w-10 h-10 cursor-pointer group-hover:flex items-center justify-center rounded-lg'
										aria-label={t('delete')}
									>
										<IconCustom
											name='close'
											className='w-6 h-6 fill-none text-[#4f4f4f] hover:text-[#f9329c]'
											hover={true}
											hoverColor='#f9329c'
										/>
									</button>
								</li>
							)
						})}
					</ul>
				)}
			</div>
		</div>
	)
}
