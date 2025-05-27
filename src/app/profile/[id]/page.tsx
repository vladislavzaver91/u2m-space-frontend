'use client'

import { Loader } from '@/app/components/ui/loader'
import { NavigationButtons } from '@/app/components/ui/navigation-buttons'
import { ProfileInformationForm } from '@/app/components/ui/profile-information-form'
import { ProfileSettingsForm } from '@/app/components/ui/profile-settings-form'
import { ProfileTabs } from '@/app/components/ui/profile-tabs'
import { useAuth } from '@/app/helpers/contexts/auth-context'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState('Information')
	const { user, logout } = useAuth()
	const { id } = useParams<{ id: string }>()
	const router = useRouter()

	useEffect(() => {
		if (!user) {
			router.push('/selling-classifieds')
		} else if (user.id !== id) {
			router.push('/selling-classifieds')
		}
	}, [user, id, router])

	if (!user) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center'>
				<Loader />
			</div>
		)
	}

	if (user.id !== id) {
		return null
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
				<NavigationButtons activePage='Profile' />

				<div className='flex-1 flex sm:justify-center w-full'>
					<div className='pb-4 md:pb-8 flex flex-col items-center justify-center max-md:max-w-[768px] max-md:min-w-fit md:w-[768px] min-w-full'>
						<ProfileTabs
							tabs={['Information', 'Settings']}
							activeTab={activeTab}
							onTabChange={setActiveTab}
						/>
					</div>
				</div>

				<div className='w-full'>
					<div className='custom-container mx-auto'>
						{activeTab === 'Information' ? (
							<ProfileInformationForm user={user} />
						) : (
							<ProfileSettingsForm />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
