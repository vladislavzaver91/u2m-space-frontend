'use client'

import {
	Dispatch,
	SetStateAction,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { CustomSelect } from './custom-select'
import { ProfileFormInput } from './profile-form-input'
import { UpdateUserProfileData, User } from '@/types'
import { useTranslations } from 'next-intl'
import { Tooltip } from './tooltip'
import { CustomDatePicker } from './custom-date-picker'
import { apiService } from '@/services/api.service'
import { IconCustom } from './icon-custom'
import { useUser } from '@/helpers/contexts/user-context'
import { Loader } from './loader'
import { ButtonCustom } from './button-custom'
import { useProfileForm } from '@/helpers/contexts/profile-form-context'
import { formatPhoneNumber } from '@/helpers/functions/format-phone-number'
import { useRouter } from '@/i18n/routing'
import { useAuth } from '@/helpers/contexts/auth-context'

interface ProfileInformationFormProps {
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
	onTooltipClick: (
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
	isTooltipClicked: Record<
		| 'nickname'
		| 'name'
		| 'surname'
		| 'gender'
		| 'birthday'
		| 'email'
		| 'phoneNumber'
		| 'extraPhoneNumber'
		| 'language'
		| 'currency'
		| 'city'
		| 'notifications'
		| 'showPhone'
		| 'advancedUser'
		| 'deleteReason',
		boolean
	>
	externalNicknameError?: string
}

export const ProfileInformationForm = ({
	onMouseEnter,
	onMouseLeave,
	onTooltipClick,
	tooltipVisible,
	isTooltipClicked,
	externalNicknameError,
}: ProfileInformationFormProps) => {
	const { user, updateUser } = useUser()
	const { handleAuthSuccess } = useAuth()
	const { setSubmitForm, setIsSubmitDisabled } = useProfileForm()
	const tProfile = useTranslations('Profile')

	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)
	const [isAvatarHovered, setIsAvatarHovered] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [formData, setFormData] = useState({
		nickname: '',
		name: '',
		surname: '',
		gender: '' as 'Male' | 'Female' | '',
		birthday: '',
		email: '',
		phoneNumber: '',
		extraPhoneNumber: '',
		avatar: null as File | null,
		removeAvatar: false,
	})

	const [errors, setErrors] = useState<{
		nickname: string
		email: string
		phoneNumber: string
		avatarError: string
		server: string
	}>({
		nickname: externalNicknameError || '',
		email: '',
		phoneNumber: '',
		avatarError: '',
		server: '',
	})

	const [isComponentOpen, setIsComponentOpen] = useState({
		gender: false,
		birthday: false,
	})

	const genderOptions = [
		{ value: 'Male' as const, translationKey: 'informationFormInputs.male' },
		{
			value: 'Female' as const,
			translationKey: 'informationFormInputs.female',
		},
	]

	useEffect(() => {
		if (user) {
			setFormData({
				nickname: user.nickname || '',
				name: user.name || '',
				surname: user.legalSurname || '',
				gender: user.gender || '',
				birthday: user.birthday || '',
				email: user.email || '',
				phoneNumber: user.phoneNumber
					? formatPhoneNumber(user.phoneNumber)
					: '',
				extraPhoneNumber: user.extraPhoneNumber
					? formatPhoneNumber(user.extraPhoneNumber)
					: '',
				avatar: null,
				removeAvatar: false,
			})
		}
	}, [user])

	useLayoutEffect(() => {
		setErrors(prev => ({ ...prev, nickname: externalNicknameError || '' }))
	}, [externalNicknameError])

	// Обновление состояния кнопки submit
	useLayoutEffect(() => {
		const isFormValid =
			formData.nickname.trim() !== '' &&
			formData.email.trim() !== '' &&
			formData.phoneNumber.trim() !== '' &&
			!errors.nickname &&
			!errors.email &&
			!errors.phoneNumber &&
			!errors.avatarError &&
			!isLoading
		setIsSubmitDisabled(!isFormValid)
	}, [formData, errors, isLoading, setIsSubmitDisabled])

	//  Валидация полей
	const validateNickname = (value: string) => {
		if (!value.trim()) {
			return tProfile('informationFormInputs.errorNicknameRequired')
		}
		if (value.length > 0 && value.length <= 3) {
			return tProfile('informationFormInputs.errorNickname')
		}
		return ''
	}

	const validateEmail = (value: string) => {
		if (!value.trim()) {
			return tProfile('informationFormInputs.errorEmailRequired')
		}
		if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			return tProfile('informationFormInputs.errorEmail')
		}
		return ''
	}

	const validatePhoneNumber = (value: string) => {
		// Удаляем пробелы для проверки
		const cleanValue = value.replace(/\s/g, '')
		if (!cleanValue) {
			return tProfile('informationFormInputs.errorPhoneRequired')
		}

		// Проверяем, что номер начинается с +
		if (!cleanValue.startsWith('+')) {
			return tProfile('informationFormInputs.errorPhoneNumber')
		}

		// Извлекаем цифры после +
		const digits = cleanValue.replace(/^\+/, '')
		if (digits.length < 10 || digits.length > 15) {
			return tProfile('informationFormInputs.errorPhoneNumber')
		}

		// Специфическая проверка для украинского номера
		if (cleanValue.startsWith('+380') && digits.length !== 12) {
			// +380 + 9 цифр
			return tProfile('informationFormInputs.errorPhoneNumber')
		}

		return ''
	}

	const handleInputChange =
		(field: keyof typeof formData) => (value: string) => {
			let newValue = value
			if (field === 'phoneNumber' || field === 'extraPhoneNumber') {
				const cleanedValue = value
					.replace(/[^0-9+]/g, '')
					.replace(/^\+{2,}/, '+')
				newValue = formatPhoneNumber(cleanedValue)
			} else if (field === 'gender') {
				const selectedOption = genderOptions.find(
					opt => tProfile(opt.translationKey) === value
				)
				newValue = selectedOption ? selectedOption.value : ''
			}
			setFormData({ ...formData, [field]: newValue })
			setErrors({
				...errors,
				[field]:
					field === 'nickname'
						? validateNickname(newValue)
						: field === 'email'
						? validateEmail(newValue)
						: field === 'phoneNumber' || field === 'extraPhoneNumber'
						? validatePhoneNumber(newValue)
						: '',
				server: '',
			})
		}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				setErrors({ ...errors, avatarError: tProfile('errors.avatarSize') })
				return
			}
			if (!['image/jpeg', 'image/png'].includes(file.type)) {
				setErrors({ ...errors, avatarError: tProfile('errors.avatarFormat') })
				return
			}
			setFormData({ ...formData, avatar: file, removeAvatar: false })
			setErrors({ ...errors, avatarError: '', server: '' })
		}
	}

	const handleRemoveAvatar = (e: React.MouseEvent) => {
		e.stopPropagation()
		setFormData({ ...formData, avatar: null, removeAvatar: true })
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleAvatarClick = () => {
		fileInputRef.current?.click()
	}

	const handleMouseEnter = (
		field: keyof typeof tooltipVisible,
		isOpen: boolean
	) => {
		if (!isOpen) {
			onMouseEnter(field)
		}
	}

	const handleMouseLeave = (
		field: keyof typeof tooltipVisible,
		isOpen: boolean
	) => {
		if (!isOpen) {
			onMouseLeave(field)
		}
	}

	// Обработчик отправки формы
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setErrors({
			nickname: '',
			email: '',
			phoneNumber: '',
			avatarError: '',
			server: '',
		})

		// Валидация перед отправкой
		const nicknameError = validateNickname(formData.nickname)
		const emailError = validateEmail(formData.email)
		const phoneNumberError = validatePhoneNumber(formData.phoneNumber)

		if (nicknameError || emailError || phoneNumberError) {
			setErrors({
				nickname: nicknameError,
				email: emailError,
				phoneNumber: phoneNumberError,
				avatarError: '',
				server: '',
			})
			setIsLoading(false)
			return
		}

		if (!formData.email) {
			setErrors({
				...errors,
				email: tProfile('informationFormInputs.errorEmailRequired'),
			})
			setIsLoading(false)
			return
		}

		if (!formData.phoneNumber) {
			setErrors({
				...errors,
				phoneNumber: tProfile('informationFormInputs.errorPhoneRequired'),
			})
			setIsLoading(false)
			return
		}

		try {
			const updateData: UpdateUserProfileData = {
				email: formData.email || undefined,
				name: formData.name || null,
				legalSurname: formData.surname || null,
				nickname: formData.nickname || undefined,
				phoneNumber: formData.phoneNumber
					? formData.phoneNumber.replace(/\s/g, '')
					: undefined,
				extraPhoneNumber: formData.extraPhoneNumber
					? formData.extraPhoneNumber.replace(/\s/g, '')
					: null,
				gender:
					formData.gender === ''
						? null
						: (formData.gender as 'Male' | 'Female'),
				birthday: formData.birthday || null,
				avatar: formData.avatar || undefined,
				removeAvatar: formData.removeAvatar || undefined,
			}

			console.log('User:', user)

			const updatedUser = await apiService.updateUserProfile(
				user!.id,
				updateData
			)
			updateUser(updatedUser)

			handleAuthSuccess(
				{
					user: updatedUser,
					accessToken: localStorage.getItem('accessToken')!,
					refreshToken: localStorage.getItem('refreshToken')!,
				},
				false
			)

			setFormData({
				nickname: updatedUser.nickname,
				name: updatedUser.name || '',
				surname: updatedUser.legalSurname || '',
				gender: updatedUser.gender || '',
				birthday: updatedUser.birthday || '',
				email: updatedUser.email,
				phoneNumber: updatedUser.phoneNumber
					? formatPhoneNumber(updatedUser.phoneNumber)
					: '',
				extraPhoneNumber: updatedUser.extraPhoneNumber
					? formatPhoneNumber(updatedUser.extraPhoneNumber)
					: '',
				avatar: null,
				removeAvatar: false,
			})

			router.replace('/selling-classifieds')
		} catch (error: any) {
			let errorMessage = tProfile('errors.serverError')
			if (error.response?.data?.error) {
				if (error.response.data.error.includes('Failed to upload avatar')) {
					errorMessage = tProfile('errors.avatarUploadFailed')
				} else if (
					error.response.data.error.includes('Failed to remove avatar')
				) {
					errorMessage = tProfile('errors.avatarRemoveFailed')
				} else {
					errorMessage = error.response.data.error
				}
			}
			setErrors({ ...errors, server: errorMessage })
		} finally {
			setIsLoading(false)
		}
	}

	// Установка функции сабмита в контекст
	useLayoutEffect(() => {
		setSubmitForm(() => handleSubmit)
	}, [setSubmitForm, formData, user])

	if (!user || isLoading) {
		return (
			<div className='flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='flex justify-center gap-[74px] max-sm:flex-col max-sm:gap-[60px]'>
			{/* left info */}
			<div className='flex sm:flex-col items-center gap-8'>
				{/* avatar */}
				<div
					className='relative w-[120px] h-[120px] rounded-[13px] cursor-pointer'
					onMouseEnter={() => setIsAvatarHovered(true)}
					onMouseLeave={() => setIsAvatarHovered(false)}
					onClick={handleAvatarClick}
				>
					{formData.avatar ? (
						<img
							src={URL.createObjectURL(formData.avatar)}
							alt='Preview'
							className='w-full h-full object-cover rounded-[13px]'
						/>
					) : user.avatarUrl && !formData.removeAvatar ? (
						<img
							src={user.avatarUrl}
							alt={user.name || 'User'}
							className='w-full h-full object-cover rounded-[13px]'
						/>
					) : (
						<div className='w-full h-full bg-[#F7F7F7] flex items-center justify-center rounded-[13px]'>
							<IconCustom
								name='camera'
								className='w-8 h-8 text-[#BDBDBD] fill-none'
							/>
						</div>
					)}
					{(formData.avatar || (user.avatarUrl && !formData.removeAvatar)) && (
						<div
							className={`absolute inset-0 bg-black/50 flex items-center justify-center rounded-[13px] transition-opacity ${
								isAvatarHovered ? 'opacity-100' : 'opacity-0'
							}`}
						>
							<ButtonCustom
								onClick={handleRemoveAvatar}
								iconWrapperClass='w-8 h-8'
								icon={
									<IconCustom
										name='trash'
										className='w-8 h-8 text-white fill-none'
									/>
								}
								className='w-6 h-6 flex items-center justify-center'
							/>
						</div>
					)}
					<input
						type='file'
						accept='image/jpeg,image/png'
						ref={fileInputRef}
						onChange={handleAvatarChange}
						className='hidden'
					/>
				</div>

				<div className='flex flex-col gap-8 max-sm:w-[176px]'>
					{/* trust rating */}
					<div className='flex flex-col items-center'>
						<p className='font-bold text-[16px] text-[#3486FE]'>
							{user.trustRating}
						</p>
						<p className='font-bold text-[16px] text-[#4F4F4F]'>
							{tProfile('trustRating')}
						</p>
					</div>
					{/* bonuses */}
					<div className='flex flex-col items-center'>
						<p className='font-bold text-[16px] text-[#3486FE]'>
							<span className='text-[#F9329C]'>U</span>
							{user.bonuses}
						</p>
						<p className='font-bold text-[16px] text-[#4F4F4F]'>
							{tProfile('bonuses')}
						</p>
					</div>
				</div>
			</div>
			{/* right info */}
			<form className='space-y-2 w-full sm:w-[300px]' onSubmit={handleSubmit}>
				{/* nickname */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('nickname')}
					onMouseLeave={() => onMouseLeave('nickname')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.yourNickname')}
						onChange={handleInputChange('nickname')}
						onClick={() => !user.advancedUser && onTooltipClick('nickname')}
						maxLength={16}
						value={formData.nickname}
						error={errors.nickname}
						isValid={formData.nickname.length > 3 && !errors.nickname}
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.nickname.name')}
							text={tProfile('informationTooltips.nickname.description')}
							visible={tooltipVisible.nickname}
							isClicked={isTooltipClicked.nickname}
						/>
					)}
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
						onChange={handleInputChange('name')}
						onClick={() => !user.advancedUser && onTooltipClick('name')}
						value={formData.name}
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.legalName.name')}
							text={tProfile('informationTooltips.legalName.description')}
							visible={tooltipVisible.name}
							isClicked={isTooltipClicked.name}
						/>
					)}
				</div>

				{/* surname */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('surname')}
					onMouseLeave={() => onMouseLeave('surname')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.legalSurname')}
						onChange={handleInputChange('surname')}
						onClick={() => !user.advancedUser && onTooltipClick('surname')}
						value={formData.surname}
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.legalSurname.name')}
							text={tProfile('informationTooltips.legalSurname.description')}
							visible={tooltipVisible.surname}
							isClicked={isTooltipClicked.surname}
						/>
					)}
				</div>

				{/* gender */}
				<div
					className='relative'
					onMouseEnter={() =>
						handleMouseEnter('gender', isComponentOpen.gender)
					}
					onMouseLeave={() =>
						handleMouseLeave('gender', isComponentOpen.gender)
					}
				>
					<CustomSelect
						label={tProfile('informationFormInputs.gender')}
						options={genderOptions.map(opt => tProfile(opt.translationKey))}
						value={
							formData.gender
								? tProfile(
										genderOptions.find(opt => opt.value === formData.gender)!
											.translationKey
								  )
								: ''
						}
						onChange={handleInputChange('gender')}
						onClick={() => !user.advancedUser && onTooltipClick('gender')}
						onOpenChange={isOpen =>
							setIsComponentOpen(prev => ({ ...prev, gender: isOpen }))
						}
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.gender.name')}
							text={tProfile('informationTooltips.gender.description')}
							visible={tooltipVisible.gender}
							isClicked={isTooltipClicked.gender}
						/>
					)}
				</div>

				{/* birthday */}
				<div
					className='relative'
					onMouseEnter={() =>
						handleMouseEnter('birthday', isComponentOpen.birthday)
					}
					onMouseLeave={() =>
						handleMouseLeave('birthday', isComponentOpen.birthday)
					}
				>
					<CustomDatePicker
						label={tProfile('informationFormInputs.birthday')}
						value={formData.birthday}
						onChange={handleInputChange('birthday')}
						onClick={() => !user.advancedUser && onTooltipClick('birthday')}
						onOpenChange={isOpen =>
							setIsComponentOpen(prev => ({ ...prev, birthday: isOpen }))
						}
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.dateOfBirth.name')}
							text={tProfile('informationTooltips.dateOfBirth.description')}
							visible={tooltipVisible.birthday}
							isClicked={isTooltipClicked.birthday}
						/>
					)}
				</div>

				{/* email */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('email')}
					onMouseLeave={() => onMouseLeave('email')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.emailAddress')}
						onChange={handleInputChange('email')}
						onClick={() => !user.advancedUser && onTooltipClick('email')}
						value={formData.email}
						error={errors.email}
						type='email'
						isValid={formData.email.length > 0 && !errors.email}
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.email.name')}
							text={tProfile('informationTooltips.email.description')}
							visible={tooltipVisible.email}
							isClicked={isTooltipClicked.email}
						/>
					)}
				</div>

				{/* phoneNumber */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('phoneNumber')}
					onMouseLeave={() => onMouseLeave('phoneNumber')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.phoneNumber')}
						onChange={handleInputChange('phoneNumber')}
						onClick={() => !user.advancedUser && onTooltipClick('phoneNumber')}
						value={formData.phoneNumber}
						type='tel'
						prefix='+'
						error={errors.phoneNumber}
						isValid={formData.phoneNumber.length > 0 && !errors.phoneNumber}
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.phoneNumber.name')}
							text={tProfile('informationTooltips.phoneNumber.description')}
							visible={tooltipVisible.phoneNumber}
							isClicked={isTooltipClicked.phoneNumber}
						/>
					)}
				</div>

				{/* extraPhoneNumber */}
				<div
					className='relative'
					onMouseEnter={() => onMouseEnter('extraPhoneNumber')}
					onMouseLeave={() => onMouseLeave('extraPhoneNumber')}
				>
					<ProfileFormInput
						label={tProfile('informationFormInputs.extraPhoneNumber')}
						onChange={handleInputChange('extraPhoneNumber')}
						onClick={() =>
							!user.advancedUser && onTooltipClick('extraPhoneNumber')
						}
						value={formData.extraPhoneNumber}
						type='tel'
						prefix='+'
					/>
					{!user.advancedUser && (
						<Tooltip
							title={tProfile('informationTooltips.extraPhoneNumber.name')}
							text={tProfile(
								'informationTooltips.extraPhoneNumber.description'
							)}
							visible={tooltipVisible.extraPhoneNumber}
							isClicked={isTooltipClicked.extraPhoneNumber}
						/>
					)}
				</div>
			</form>
		</div>
	)
}
