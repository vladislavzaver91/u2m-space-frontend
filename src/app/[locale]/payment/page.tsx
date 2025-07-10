'use client'

import { NavigationButtons } from '@/components/ui/navigation-buttons'
import { PaymentHistorySection } from '@/components/ui/payment-history-section'
import { PaymentPlanSection } from '@/components/ui/payment-plan-section'
import { PaymentTabs } from '@/components/ui/payment-tabs'
import { useAuth } from '@/helpers/contexts/auth-context'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function PaymentPage() {
	const tPayment = useTranslations('Payment')
	const tMyClassifieds = useTranslations('MyClassifieds')

	const { authUser } = useAuth()
	const { id } = useParams<{ id: string }>()
	const router = useRouter()

	const [activeTab, setActiveTab] = useState(tPayment('tabs.plan'))

	const tabs = useMemo(
		() => [tPayment('tabs.plan'), tPayment('tabs.paymentHistory')],
		[tPayment]
	)

	useEffect(() => {
		if (!authUser) {
			router.push('/selling-classifieds')
		}
	}, [authUser, router])

	if (!authUser) {
		console.log('authUser not found')
		return null
	}

	const handleTabChange = (tab: string) => {
		setActiveTab(tab)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 pt-14 pb-10 md:pt-[88px] 2-5xl:pt-40!'>
				<NavigationButtons activePage={tMyClassifieds('buttons.payment')} />

				<div className='flex-1 flex sm:justify-center w-full'>
					<div className='pb-4 md:pb-8 flex flex-col sm:items-center justify-center max-w-[768px] w-full'>
						<PaymentTabs
							tabs={tabs}
							activeTab={activeTab}
							onTabChange={handleTabChange}
						/>
					</div>
				</div>

				<div className='w-full'>
					<div className='custom-container'>
						<div className='grid grid-cols-4 sm:grid-cols-12 max-[641px]:gap-4 max-[1281px]:gap-[30px] gap-[60px]'>
							<div className='col-start-1 col-end-5 sm:col-start-1 sm:col-end-13'>
								<div className='w-full mx-auto'>
									{activeTab === tPayment('tabs.plan') ? (
										<PaymentPlanSection />
									) : (
										<PaymentHistorySection />
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
