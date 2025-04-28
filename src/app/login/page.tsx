'use client'

import { useRouter } from 'next/navigation'
import { ButtonWithIcon } from '../components/ui/button-with-icon'
import { MdClose } from 'react-icons/md'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

const AUTH_LINK_ITEMS = [
	{
		icon: '/icons/facebook.svg',
		name: 'Facebook',
	},
	{
		icon: '/icons/apple.svg',
		name: 'Apple',
	},
	{
		icon: '/icons/google.svg',
		name: 'Google',
	},
]

export default function Login() {
	const router = useRouter()

	const handleClose = () => {
		router.back()
	}

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleClose()
			}
		}
		window.addEventListener('keydown', handleEsc)
		return () => {
			window.removeEventListener('keydown', handleEsc)
		}
	}, [])

	return (
		<div className='fixed inset-0 bg-[#3486fe]/60 flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl shadow-lg w-[582px] max-w-[90%] p-8 flex flex-col items-center space-y-8'>
				{/* Кнопка закрытия */}

				{/* Заголовок */}
				<h2 className='text-[24px] font-bold text-[#4f4f4f] text-center'>
					Welcome
				</h2>

				<div>
					<h3 className='text-[18px] text-[#4f4f4f] text-center mb-4'>
						Log in with
					</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
						{AUTH_LINK_ITEMS.map((item, index) => (
							<ButtonWithIcon
								key={index}
								text={item.name}
								icon={
									<Image
										src={item.icon}
										alt={`${item.name} logo`}
										width={32}
										height={32}
									/>
								}
								href='/'
								className='flex items-center gap-4 p-4 text-[16px] font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-xl hover:bg-[#f7f7f7] hover:border-[#f9329c] transition-colors w-full justify-center'
							/>
						))}
					</div>
				</div>

				<ButtonWithIcon
					onClick={handleClose}
					className='text-[#4f4f4f] hover:text-gray-700'
					icon={<MdClose className='w-6 h-6' />}
				/>
			</div>
		</div>
	)
}
