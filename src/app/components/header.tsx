'use client'

import { usePathname } from 'next/navigation'
import { ButtonWithIcon } from './ui/button-with-icon'
import { Logo } from './ui/logo'
import { useAuth } from '../helpers/contexts/auth-context'
import { useModal } from '../helpers/contexts/modal-context'
import { LoginModal } from './login-modal'
import Image from 'next/image'

export const Header = () => {
	const { user } = useAuth()
	const { isLoginModalOpen, openLoginModal } = useModal()
	const pathname = usePathname()

	return (
		<>
			<div className='fixed top-0 left-0 w-full px-8 py-7 flex items-center justify-between bg-white/10 backdrop-blur-md z-10'>
				<Logo width={100} height={32} />
				<div className='flex items-center absolute top-0 right-0'>
					{pathname !== '/' && (
						<ButtonWithIcon
							text='Add'
							icon={
								<Image
									src='/icons/add_plus.svg'
									alt='icon plus'
									width={24}
									height={24}
									className='fill-[#3486fe]'
								/>
							}
							className='p-8 min-w-[139px] w-fit'
						/>
					)}
					{user ? (
						<p className='font-bold text-[16px] text-[#3486fe]'>{user.name}</p>
					) : (
						<ButtonWithIcon
							text='Log in'
							onClick={openLoginModal}
							icon={
								<Image
									src='/icons/user_square.svg'
									alt='user icon'
									width={24}
									height={24}
									className='fill-[#3486fe]'
								/>
							}
							className='p-8 min-w-[157px] w-fit'
						/>
					)}
				</div>
			</div>
			{isLoginModalOpen && <LoginModal />}
		</>
	)
}
