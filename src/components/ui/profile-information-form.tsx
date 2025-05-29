'use client'

import { useState } from 'react'
import { CustomSelect } from './custom-select'
import { ProfileFormInput } from './profile-form-input'
import { User } from '@/types'
import { useTranslations } from 'next-intl'
import { Tooltip } from './tooltip'

interface ProfileInformationFormProps {
	user: User
	onMouseEnter: (
		field:
			| 'nickname'
			| 'name'
			| 'surname'
			| 'gender'
			| 'birthday'
			| 'email'
			| 'phoneNumber'
			| 'extraPhoneNumber'
	) => void
	onMouseLeave: (
		field:
			| 'nickname'
			| 'name'
			| 'surname'
			| 'gender'
			| 'birthday'
			| 'email'
			| 'phoneNumber'
			| 'extraPhoneNumber'
	) => void
	tooltipVisible: Record<
		| 'nickname'
		| 'name'
		| 'surname'
		| 'gender'
		| 'birthday'
		| 'email'
		| 'phoneNumber'
		| 'extraPhoneNumber',
		boolean
	>
}

export const ProfileInformationForm = ({
	user,
	onMouseEnter,
	onMouseLeave,
	tooltipVisible,
}: ProfileInformationFormProps) => {
	const [formData, setFormData] = useState({
		nickname: '',
		name: '',
		surname: '',
		gender: '',
		birthday: '',
		email: '',
		phoneNumber: '',
		extraPhoneNumber: '',
	})
	const tProfile = useTranslations('Profile')

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
						<p className='font-bold text-[16px] text-[#4F4F4F]'>
							{tProfile('trustRating')}
						</p>
					</div>
					{/* bonuses */}
					<div className='flex flex-col items-center'>
						<p className='font-bold text-[16px] text-[#3486FE]'>
							<span className='text-[#F9329C]'>U</span>33
						</p>
						<p className='font-bold text-[16px] text-[#4F4F4F]'>
							{tProfile('bonuses')}
						</p>
					</div>
				</div>
			</div>
			{/* right info */}
			<form className='space-y-2 w-full sm:w-[300px]'>
				{/* nickname */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('nickname')}
					onMouseLeave={() => onMouseLeave('nickname')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.yourNickname')}
						onChange={value => setFormData({ ...formData, nickname: value })}
						maxLength={16}
						value={formData.nickname}
					/>
					<Tooltip
						title={tProfile('informationTooltips.nickname.name')}
						text={tProfile('informationTooltips.nickname.description')}
						visible={tooltipVisible.nickname}
					/>
				</div>

				{/* document name */}
				<div className='max-sm:pr-7 py-4'>
					<p className='font-bold text-[16px] text-[#3486FE] mb-[2px]'>
						{tProfile('informationFormInputs.documentName')}
					</p>
					<p className='font-normal text-[16px] text-[#4F4F4F]'>
						{tProfile('informationFormInputs.documentNameDescr')}
					</p>
				</div>

				{/* name */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('name')}
					onMouseLeave={() => onMouseLeave('name')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.legalName')}
						onChange={value => setFormData({ ...formData, name: value })}
						value={formData.name}
					/>
					<Tooltip
						title={tProfile('informationTooltips.legalName.name')}
						text={tProfile('informationTooltips.legalName.description')}
						visible={tooltipVisible.name}
					/>
				</div>

				{/* surname */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('surname')}
					onMouseLeave={() => onMouseLeave('surname')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.legalSurname')}
						onChange={value => setFormData({ ...formData, surname: value })}
						value={formData.surname}
					/>
					<Tooltip
						title={tProfile('informationTooltips.legalSurname.name')}
						text={tProfile('informationTooltips.legalSurname.description')}
						visible={tooltipVisible.surname}
					/>
				</div>

				{/* gender */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('gender')}
					onMouseLeave={() => onMouseLeave('gender')}
				>
					<CustomSelect
						label={tProfile('informationFormInputs.gender')}
						options={[
							tProfile('informationFormInputs.male'),
							tProfile('informationFormInputs.female'),
						]}
						value={formData.gender}
						onChange={value => setFormData({ ...formData, gender: value })}
					/>
					<Tooltip
						title={tProfile('informationTooltips.gender.name')}
						text={tProfile('informationTooltips.gender.description')}
						visible={tooltipVisible.gender}
					/>
				</div>

				{/* birthday */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('birthday')}
					onMouseLeave={() => onMouseLeave('birthday')}
				>
					<CustomSelect
						label={tProfile('informationFormInputs.birthday')}
						options={years}
						value={formData.birthday}
						onChange={value => setFormData({ ...formData, birthday: value })}
					/>
					<Tooltip
						title={tProfile('informationTooltips.dateOfBirth.name')}
						text={tProfile('informationTooltips.dateOfBirth.description')}
						visible={tooltipVisible.birthday}
					/>
				</div>

				{/* email */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('email')}
					onMouseLeave={() => onMouseLeave('email')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.emailAddress')}
						onChange={value => setFormData({ ...formData, email: value })}
						value={formData.email}
						type='email'
					/>
					<Tooltip
						title={tProfile('informationTooltips.email.name')}
						text={tProfile('informationTooltips.email.description')}
						visible={tooltipVisible.email}
					/>
				</div>

				{/* phoneNumber */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('phoneNumber')}
					onMouseLeave={() => onMouseLeave('phoneNumber')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.phoneNumber')}
						onChange={value => setFormData({ ...formData, phoneNumber: value })}
						value={formData.phoneNumber}
						type='tel'
						prefix='+'
					/>
					<Tooltip
						title={tProfile('informationTooltips.phoneNumber.name')}
						text={tProfile('informationTooltips.phoneNumber.description')}
						visible={tooltipVisible.phoneNumber}
					/>
				</div>

				{/* extraPhoneNumber */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('extraPhoneNumber')}
					onMouseLeave={() => onMouseLeave('extraPhoneNumber')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.extraPhoneNumber')}
						onChange={value =>
							setFormData({ ...formData, extraPhoneNumber: value })
						}
						value={formData.extraPhoneNumber}
						type='tel'
						prefix='+'
					/>
					<Tooltip
						title={tProfile('informationTooltips.extraPhoneNumber.name')}
						text={tProfile('informationTooltips.extraPhoneNumber.description')}
						visible={tooltipVisible.extraPhoneNumber}
					/>
				</div>
			</form>
		</div>
	)
}
