'use client'

import { useState } from 'react'
import { CustomInput } from './custom-input'
import { CustomSelect } from './custom-select'
import { User } from '@/app/types'

export const ProfileInformationForm = ({ user }: { user: User }) => {
	const [formData, setFormData] = useState({
		nickname: '',
		name: '',
		surname: '',
		gender: '',
		birthDate: '',
		email: '',
		phoneNumber: '',
		extraPhoneNumber: '',
	})

	const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) =>
		(1950 + i).toString()
	)

	return (
		<div className='flex justify-center gap-[74px]'>
			{/* left info */}
			<div className='flex flex-col items-center gap-8'>
				{/* avatar */}
				{user.avatarUrl && (
					<img
						src={user.avatarUrl}
						alt={user.name}
						className='w-[120px] h-[120px] rounded-[13px] object-cover'
					/>
				)}
				{/* trust rating */}
				<div className='flex flex-col items-center'>
					<p className='font-bold text-[16px] text-[#3486FE]'>50</p>
					<p className='font-bold text-[16px] text-[#4F4F4F]'>Trust rating</p>
				</div>
				{/* bonuses */}
				<div className='flex flex-col items-center'>
					<p className='font-bold text-[16px] text-[#3486FE]'>
						<span className='text-[#F9329C]'>U</span>33
					</p>
					<p className='font-bold text-[16px] text-[#4F4F4F]'>Bonuses</p>
				</div>
			</div>
			{/* right info */}
			<form className='space-y-4 w-full sm:w-[300px]'>
				<CustomInput
					label='Your nickname'
					onChange={value => setFormData({ ...formData, nickname: value })}
					maxLength={16}
					value={formData.nickname}
				/>
				<CustomInput
					label='Legal name'
					onChange={value => setFormData({ ...formData, name: value })}
					value={formData.name}
					maxLength={20}
				/>
				<CustomInput
					label='Legal surname'
					onChange={value => setFormData({ ...formData, surname: value })}
					value={formData.surname}
					maxLength={20}
				/>
				<CustomSelect
					label='Gender'
					options={['Male', 'Female']}
					value={formData.gender}
					onChange={value => setFormData({ ...formData, gender: value })}
				/>
				<CustomSelect
					label='Date of Birth'
					options={years}
					value={formData.birthDate}
					onChange={value => setFormData({ ...formData, birthDate: value })}
				/>
				<CustomInput
					label='Email Address'
					onChange={value => setFormData({ ...formData, email: value })}
					maxLength={100}
					value={formData.email}
					type='email'
				/>
				<CustomInput
					label='Phone number'
					onChange={value =>
						setFormData({ ...formData, extraPhoneNumber: value })
					}
					maxLength={20}
					value={formData.phoneNumber}
					type='tel'
					prefix='+'
				/>
				<CustomInput
					label='Extra phone number'
					onChange={value =>
						setFormData({ ...formData, extraPhoneNumber: value })
					}
					maxLength={20}
					value={formData.extraPhoneNumber}
					type='tel'
					prefix='+'
				/>
			</form>
		</div>
	)
}
