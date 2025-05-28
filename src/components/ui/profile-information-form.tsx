'use client'

import { useState } from 'react'
import { CustomSelect } from './custom-select'
import { ProfileFormInput } from './profile-form-input'
import { User } from '@/types'

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
		<div className='flex justify-center gap-[74px] max-sm:flex-col max-sm:gap-[60px]'>
			{/* left info */}
			<div className='flex sm:flex-col items-center gap-8'>
				{/* avatar */}
				{user.avatarUrl && (
					<img
						src={user.avatarUrl}
						alt={user.name}
						className='w-[120px] h-[120px] rounded-[13px] object-cover'
					/>
				)}
				<div className='flex flex-col gap-8 max-sm:w-[176px]'>
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
			</div>
			{/* right info */}
			<form className='space-y-2 w-full sm:w-[300px]'>
				<ProfileFormInput
					label='Your nickname'
					onChange={value => setFormData({ ...formData, nickname: value })}
					maxLength={16}
					value={formData.nickname}
				/>
				{/* document name */}
				<div className='max-sm:pr-7 py-4'>
					<p className='font-bold text-[16px] text-[#3486FE] mb-[2px]'>
						Document Name
					</p>
					<p className='font-normal text-[16px] text-[#4F4F4F]'>
						Name indicated on the passport, driver’s license or other travel
						document.
					</p>
				</div>

				<ProfileFormInput
					label='Legal name'
					onChange={value => setFormData({ ...formData, name: value })}
					value={formData.name}
				/>
				<ProfileFormInput
					label='Legal surname'
					onChange={value => setFormData({ ...formData, surname: value })}
					value={formData.surname}
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
				<ProfileFormInput
					label='Email Address'
					onChange={value => setFormData({ ...formData, email: value })}
					value={formData.email}
					type='email'
				/>
				<ProfileFormInput
					label='Phone number'
					onChange={value =>
						setFormData({ ...formData, extraPhoneNumber: value })
					}
					value={formData.phoneNumber}
					type='tel'
					prefix='+'
				/>
				<ProfileFormInput
					label='Extra phone number'
					onChange={value =>
						setFormData({ ...formData, extraPhoneNumber: value })
					}
					value={formData.extraPhoneNumber}
					type='tel'
					prefix='+'
				/>
			</form>
		</div>
	)
}
