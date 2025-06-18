'use client'

import { NavigationButtons } from '@/components/ui/navigation-buttons'
import { ProfileInformationForm } from '@/components/ui/profile-information-form'
import { ProfileSettingsForm } from '@/components/ui/profile-settings-form'
import { ProfileTabs } from '@/components/ui/profile-tabs'
import { useAuth } from '@/helpers/contexts/auth-context'
import { useUser } from '@/helpers/contexts/user-context'
import { useRouter } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
	const [infoTooltipVisible, setInfoTooltipVisible] = useState({
		nickname: false,
		name: false,
		surname: false,
		gender: false,
		birthday: false,
		email: false,
		phoneNumber: false,
		extraPhoneNumber: false,
	})
	const [settingTooltipVisible, setSettingTooltipVisible] = useState({
		language: false,
		currency: false,
		city: false,
		notifications: false,
		showPhone: false,
		advancedUser: false,
		deleteReason: false,
	})
	const [isTooltipClicked, setIsTooltipClicked] = useState({
		nickname: false,
		name: false,
		surname: false,
		gender: false,
		birthday: false,
		email: false,
		phoneNumber: false,
		extraPhoneNumber: false,
		language: false,
		currency: false,
		city: false,
		notifications: false,
		showPhone: false,
		advancedUser: false,
		deleteReason: false,
	})

	const [nicknameError, setNicknameError] = useState('')

	const { authUser } = useAuth()
	const { user } = useUser()

	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const locale = useLocale()
	const tProfile = useTranslations('Profile')
	const tMyClassifieds = useTranslations('MyClassifieds')

	const [activeTab, setActiveTab] = useState(tProfile('tabs.information'))

	useEffect(() => {
		if (!authUser) {
			router.push(`/selling-classifieds`)
		} else if (authUser.id !== id) {
			router.push(`/selling-classifieds`)
		}
	}, [authUser, id, router])

	if (!authUser || !user) {
		return console.log('authUser not found')
	}

	const handleInfoTooltipMouseEnter = (
		field: keyof typeof infoTooltipVisible
	) => {
		setInfoTooltipVisible(prev => ({ ...prev, [field]: true }))
	}

	const handleInfoTooltipMouseLeave = (
		field: keyof typeof infoTooltipVisible
	) => {
		setInfoTooltipVisible(prev => ({ ...prev, [field]: false }))
	}

	const handleSettingTooltipMouseEnter = (
		field: keyof typeof settingTooltipVisible
	) => {
		setSettingTooltipVisible(prev => ({ ...prev, [field]: true }))
	}

	const handleSettingTooltipMouseLeave = (
		field: keyof typeof settingTooltipVisible
	) => {
		setSettingTooltipVisible(prev => ({ ...prev, [field]: false }))
	}

	const handleTooltipClick = (field: keyof typeof isTooltipClicked) => {
		setIsTooltipClicked(prev => ({ ...prev, [field]: true }))

		if (field in infoTooltipVisible) {
			setInfoTooltipVisible(prev => ({ ...prev, [field]: false }))
		} else if (field in settingTooltipVisible) {
			setSettingTooltipVisible(prev => ({ ...prev, [field]: false }))
		}

		setTimeout(() => {
			setIsTooltipClicked(prev => ({ ...prev, [field]: false }))
		}, 50)
	}

	const handleTabChange = (tab: string) => {
		if (tab === tProfile('tabs.setting') && !user.nickname) {
			setNicknameError(tProfile('informationFormInputs.errorNicknameRequired'))
			return
		}
		setActiveTab(tab)
		setNicknameError('') // Сбрасываем ошибку при успешном переключении
	}

	if (authUser.id !== id) {
		return null
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
				<NavigationButtons
					activePage={tMyClassifieds('buttons.profile')}
					setNicknameError={setNicknameError}
				/>

				<div className='flex-1 flex sm:justify-center w-full'>
					<div className='pb-4 md:pb-8 flex flex-col items-center justify-center max-md:max-w-[768px] max-md:min-w-fit md:w-[768px] min-w-full'>
						<ProfileTabs
							tabs={[tProfile('tabs.information'), tProfile('tabs.setting')]}
							activeTab={activeTab}
							onTabChange={handleTabChange}
						/>
					</div>
				</div>

				<div className='w-full'>
					<div className='custom-container mx-auto'>
						<div className='grid grid-cols-4 sm:grid-cols-12 gap-4 min-[769px]:gap-8 xl:gap-[60px]'>
							<div className='col-start-1 col-end-5 sm:col-start-1 sm:col-end-13'>
								<div className='w-full mx-auto'>
									{activeTab === tProfile('tabs.information') ? (
										<ProfileInformationForm
											onMouseEnter={(field: keyof typeof infoTooltipVisible) =>
												handleInfoTooltipMouseEnter(field)
											}
											onMouseLeave={(field: keyof typeof infoTooltipVisible) =>
												handleInfoTooltipMouseLeave(field)
											}
											onTooltipClick={handleTooltipClick}
											tooltipVisible={infoTooltipVisible}
											isTooltipClicked={isTooltipClicked}
											externalNicknameError={nicknameError}
										/>
									) : (
										<ProfileSettingsForm
											onMouseEnter={(
												field: keyof typeof settingTooltipVisible
											) => handleSettingTooltipMouseEnter(field)}
											onMouseLeave={(
												field: keyof typeof settingTooltipVisible
											) => handleSettingTooltipMouseLeave(field)}
											onTooltipClick={handleTooltipClick}
											tooltipVisible={settingTooltipVisible}
											isTooltipClicked={isTooltipClicked}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
