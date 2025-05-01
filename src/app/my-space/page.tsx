'use client'

import { ButtonWithIcon } from '../components/ui/button-with-icon'
import { useAuth } from '../helpers/contexts/auth-context'

export default function MySpace() {
	const { user, logout } = useAuth()

	return (
		<div className='min-h-screen flex flex-col pt-40 px-8'>
			<div className='flex items-center justify-between'>
				<ButtonWithIcon
					text='Logout'
					onClick={logout}
					className='py-2.5 px-4 w-fit min-w-[92px] border border-[#4f4f4f] rounded-[8px] hover:bg-[#f7f7f7] hover:border-[#3486fe]'
				/>

				{/* Заглушка для контента */}
				<div className='flex-1 text-center'>
					<h1 className='text-[32px] font-bold text-[#4f4f4f]'>My Space</h1>
					<p className='text-[18px] text-[#4f4f4f] mt-4'>
						Welcome, {user?.name || 'User'}! This is your personal space.
					</p>
					<p className='text-[16px] text-[#bdbdbd] mt-2'>
						(This page is under development)
					</p>
				</div>
			</div>
		</div>
	)
}
