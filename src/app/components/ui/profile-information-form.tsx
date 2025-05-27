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
					register={{
						name: 'nickname',
						onChange: e =>
							setFormData({ ...formData, nickname: e.target.value }),
					}}
					maxLength={16}
					value={formData.nickname}
				/>
				<CustomInput
					label='Legal name'
					register={{
						name: 'name',
						onChange: e => setFormData({ ...formData, name: e.target.value }),
					}}
					maxLength={50}
					value={formData.name}
				/>
				<CustomInput
					label='Legal surname'
					register={{
						name: 'surname',
						onChange: e =>
							setFormData({ ...formData, surname: e.target.value }),
					}}
					maxLength={50}
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
				<CustomInput
					label='Email Address'
					register={{
						name: 'email',
						onChange: e => setFormData({ ...formData, email: e.target.value }),
					}}
					maxLength={100}
					value={formData.email}
					type='email'
				/>
				<CustomInput
					label='Phone number'
					register={{
						name: 'phoneNumber',
						onChange: e =>
							setFormData({ ...formData, phoneNumber: e.target.value }),
					}}
					maxLength={20}
					value={formData.phoneNumber}
					type='tel'
					prefix='+'
				/>
				<CustomInput
					label='Extra phone number'
					register={{
						name: 'extraPhoneNumber',
						onChange: e =>
							setFormData({ ...formData, extraPhoneNumber: e.target.value }),
					}}
					maxLength={20}
					value={formData.extraPhoneNumber}
					type='tel'
					prefix='+'
				/>
			</form>
		</div>
	)
}
