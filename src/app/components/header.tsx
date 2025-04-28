'use client'

import { ButtonWithIcon } from './ui/button-with-icon'
import { Logo } from './ui/logo'
import { MdOutlineArrowBack } from 'react-icons/md'

export const Header = () => {
	return (
		<div className='fixed top-0 left-0 w-full px-8 py-7 flex items-center justify-between bg-white z-10'>
			<Logo width={100} height={32} />
			<div>
				<ButtonWithIcon
					text='Log in'
					href='/login'
					icon={<MdOutlineArrowBack className='fill-[#3486fe] w-6 h-6' />}
				/>
			</div>
		</div>
	)
}
