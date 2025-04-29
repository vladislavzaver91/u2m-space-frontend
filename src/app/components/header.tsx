'use client'

import { usePathname } from 'next/navigation'
import { ButtonWithIcon } from './ui/button-with-icon'
import { Logo } from './ui/logo'
import { MdOutlineArrowBack } from 'react-icons/md'
import { useAuth } from '../helpers/contexts/auth-context'

export const Header = () => {
	const { user } = useAuth()
	const pathname = usePathname()

	return (
		<div className='fixed top-0 left-0 w-full px-8 py-7 flex items-center justify-between bg-white z-10'>
			<Logo width={100} height={32} />
			<div>
				{pathname !== '/' && (
					<ButtonWithIcon
						text='Add'
						icon={<MdOutlineArrowBack className='fill-[#3486fe] w-6 h-6' />}
						className='mr-8'
					/>
				)}
				{user ? (
					<p className='font-bold text-[16px] text-[#3486fe]'>{user.name}</p>
				) : (
					<ButtonWithIcon
						text='Log in'
						href='/login'
						icon={<MdOutlineArrowBack className='fill-[#3486fe] w-6 h-6' />}
					/>
				)}
			</div>
		</div>
	)
}
