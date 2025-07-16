'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Notification } from '@/types'
import { useScreenResize } from '@/helpers/hooks/use-screen-resize'
import { useNotifications } from '@/helpers/contexts/notification-context'
import { notificationService } from '@/services/api/notification.service'
import { Loader } from './loader'
import { IconCustom } from './icon-custom'

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
	const { notifications, setNotifications } = useNotifications()
	const { isMobile } = useScreenResize()
	const [loading, setLoading] = useState(false)
	const modalRef = useRef<HTMLDivElement>(null)

	// Форматирование сообщения с выделением плейсхолдеров
	const formatMessage = (
		message: string,
		messageData: { [key: string]: string }
	) => {
		const parts = message.split(/(\{[^}]+\})/g)
		return parts.map((part, index) => {
			if (part.match(/^\{[^}]+\}$/)) {
				const key = part.slice(1, -1) // Удаляем { и }
				const value = messageData[key] || ''
				return (
					<span
						key={index}
						className='font-bold text-[13px] uppercase text-[#3486FE]'
					>
						{key === 'value' && message.includes('+{value}')
							? `+${value}`
							: value}
					</span>
				)
			}
			return <span key={index}>{part}</span>
		})
	}

	// Получение перевода уведомления
	const translateNotification = (notification: Notification) => {
		const { title } = t.raw(`types.${notification.type}`) as {
			title: string
			message: string
		}

		// Для BONUSES_CHANGED используем t.rich для выделения {units}
		if (notification.type === 'BONUSES_CHANGED') {
			const message = t.rich(`types.${notification.type}.message`, {
				value: () => (
					<span className='font-bold text-[13px] uppercase text-[#3486FE]'>
						{notification.messageData.value || ''}
					</span>
				),
				units: () => (
					<span className='font-bold text-[13px] uppercase text-[#F9329C]'>
						{t('types.BONUSES_CHANGED.units')}
					</span>
				),
			})
			return { title, message }
		}

		// Для остальных типов используем formatMessage
		const { message: rawMessage } = t.raw(`types.${notification.type}`) as {
			title: string
			message: string
		}
		return {
			title,
			message: formatMessage(rawMessage, notification.messageData),
		}
	}

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

	// Вычисление позиции модального окна
	const getModalPosition = () => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			return {
				top: rect.bottom + window.scrollY,
				left: rect.left,
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
					<ul>
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
											{message}
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
