'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { CustomToggle } from './custom-toggle'
import { useAuth } from '@/helpers/contexts/auth-context'
import { useRouter } from '@/i18n/routing'
import { useNotifications } from '@/helpers/contexts/notification-context'
import { planService } from '@/services/plan.service'
import { Loader } from './loader'
import { useUser } from '@/helpers/contexts/user-context'

interface Plan {
	id: string
	title: string
	maxClassifieds: number | string
	liftInterval: string
	liftingType: string
	searchVisibility: string
	monthlyPrice: number
}

export const PaymentPlanSection = () => {
	const tPlan = useTranslations('Payment.planSection')

	const { authUser, handleAuthSuccess } = useAuth()
	const { user, updateUser } = useUser()
	const { fetchNotifications } = useNotifications()
	const router = useRouter()

	const [isYearly, setIsYearly] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<string>('light')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const plans: Plan[] = useMemo(
		() => [
			{
				id: 'light',
				title: tPlan('light.title'),
				maxClassifieds: 8,
				liftInterval: tPlan('light.liftInterval'),
				liftingType: tPlan('light.liftingType'),
				searchVisibility: tPlan('light.searchVisibility'),
				monthlyPrice: 0,
			},
			{
				id: 'smart',
				title: tPlan('smart.title'),
				maxClassifieds: 16,
				liftInterval: tPlan('smart.liftInterval'),
				liftingType: tPlan('smart.liftingType'),
				searchVisibility: tPlan('smart.searchVisibility'),
				monthlyPrice: 4,
			},
			{
				id: 'extremum',
				title: tPlan('extremum.title'),
				maxClassifieds: tPlan('extremum.maxClassifieds'),
				liftInterval: tPlan('extremum.liftInterval'),
				liftingType: tPlan('extremum.liftingType'),
				searchVisibility: tPlan('extremum.searchVisibility'),
				monthlyPrice: 8,
			},
		],
		[tPlan]
	)

	const displayedPrices = useMemo(
		() =>
			plans.map(plan => ({
				...plan,
				price: isYearly ? plan.monthlyPrice / 2 : plan.monthlyPrice,
				period: isYearly ? tPlan('toggle.yearly') : tPlan('toggle.monthly'),
			})),
		[plans, isYearly, tPlan]
	)

	// Устанавливаем текущий план пользователя
	useEffect(() => {
		if (user?.plan) {
			setSelectedPlan(user.plan)
		}
		console.log(selectedPlan, 'selectedPlan')
	}, [user, selectedPlan])

	const handleChoosePlan = async (planId: string) => {
		if (!authUser) {
			console.log('authUser not found')
			router.push('/selling-classifieds')
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			const res = await planService.purchasePlan(planId)
			if (res.paymentIntent.status === 'succeeded') {
				setSelectedPlan(planId)
				updateUser({
					...authUser,
					plan: planId as 'light' | 'smart' | 'extremum',
				})

				await fetchNotifications(authUser.id)
			} else {
				throw new Error('Payment failed')
			}
		} catch (error: any) {
			console.error('Error purchasing plan:', error)
			const errorMessage = error.response?.data?.error
			setError(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='max-[769px]:w-full max-xl:max-w-[772px] max-w-[832px] mx-auto lg:px-8'>
			<div className='mb-4 relative flex justify-center max-sm:h-[60px]'>
				<CustomToggle
					label={isYearly ? tPlan('toggle.yearly') : tPlan('toggle.monthly')}
					checked={isYearly}
					onChange={setIsYearly}
					paymentPage
				/>
				{isYearly && (
					<p className='absolute sm:left-1/2 sm:ml-14 bottom-0 sm:top-2 text-[16px] font-bold text-[#F9329C]'>
						{tPlan('toggle.info')}
					</p>
				)}
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-3 max-sm:gap-4 max-[1281px]:gap-[30px] gap-[60px]'>
				{displayedPrices.map(plan => (
					<div
						key={plan.id}
						className={`border ${
							selectedPlan === plan.id ? 'border-[#F9329C]' : 'border-[#BDBDBD]'
						} rounded-[13px] p-4 bg-white flex flex-col items-center text-center space-y-4`}
					>
						{/* title */}
						<h2
							className={`text-[18px] font-bold uppercase mb-2 ${
								selectedPlan === plan.id ? 'text-[#F9329C]' : 'text-[#3486FE]'
							}`}
						>
							{plan.title}
						</h2>

						{/* Max classifieds */}
						<div className='max-sm:w-full max-sm:flex max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between'>
							<p className='font-bold text-[16px]'>{plan.maxClassifieds}</p>
							<p className='font-normal text-[16px] leading-[22px]'>
								{tPlan('generalItems.maxClassifieds')}
							</p>
						</div>

						{/* Lift interval */}
						<div className='max-sm:w-full max-sm:flex max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between'>
							<p className='font-bold text-[16px]'>{plan.liftInterval}</p>
							<p className='font-normal text-[16px] leading-[22px]'>
								{tPlan('generalItems.liftInterval')}
							</p>
						</div>

						{/* lifting Type */}
						<div className='max-sm:w-full max-sm:flex max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between'>
							<p className='font-bold text-[16px]'>{plan.liftingType}</p>
							<p className='font-normal text-[16px] leading-[22px]'>
								{tPlan('generalItems.liftingType')}
							</p>
						</div>

						{/* search Visibility */}
						<div className='max-sm:w-full max-sm:flex max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between'>
							<p className='font-bold text-[16px]'>{plan.searchVisibility}</p>
							<p className='font-normal text-[16px] leading-[22px]'>
								{tPlan('generalItems.searchVisibility')}
							</p>
						</div>

						{/* price*/}
						<div className='max-sm:w-full max-sm:flex max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between'>
							<p className='font-bold text-[16px]'>${plan.price}</p>
							<p className='font-normal text-[16px] leading-[22px]'>
								{tPlan('generalItems.price')}
							</p>
						</div>

						<button
							className={`relative max-sm:max-w-[296px] w-full px-4 py-2 h-10 rounded-lg text-white font-bold text-[16px] ${
								selectedPlan === plan.id || isLoading
									? 'bg-[#BDBDBD] cursor-not-allowed'
									: 'bg-[#6FCF97] cursor-pointer'
							}`}
							disabled={selectedPlan === plan.id || isLoading}
							onClick={() => handleChoosePlan(plan.id)}
						>
							{isLoading && selectedPlan === plan.id ? (
								<div className='flex items-center justify-center'>
									<Loader size='6' />
								</div>
							) : selectedPlan === plan.id ? (
								tPlan('buttons.active')
							) : (
								tPlan('buttons.choose')
							)}
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
