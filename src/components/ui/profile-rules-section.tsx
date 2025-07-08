'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface ProfileRuleItem {
	title: string
	description: string
	href: string
}

export const ProfileRulesSection = () => {
	const tRules = useTranslations('Profile.rules')

	const RULES: ProfileRuleItem[] = [
		{
			title: tRules('items.privacyPolicy.title'),
			description: tRules('items.privacyPolicy.description'),
			href: '/rules/privacy-policy',
		},
		{
			title: tRules('items.userDataDeletion.title'),
			description: tRules('items.userDataDeletion.description'),
			href: '/rules/user-data-deletion',
		},
		{
			title: tRules('items.moderation.title'),
			description: tRules('items.moderation.description'),
			href: '/rules/moderation-rules',
		},
		{
			title: tRules('items.basicPrinciples.title'),
			description: tRules('items.basicPrinciples.description'),
			href: '/rules/core-principles',
		},
	]

	return (
		<div className='flex flex-col gap-4 max-w-[328px] sm:max-w-[300px] mx-auto'>
			<div className='flex flex-col gap-4'>
				{RULES.map((item, index) => (
					<Link
						href={item.href}
						key={index}
						className='w-full min-h-[74px] h-full text-[16px] p-4 font-bold text-[#4f4f4f] border border-[#bdbdbd] rounded-[13px] active:border-[#f9329c] active:bg-transparent hover:bg-[#F7F7F7] transition-colors cursor-pointer'
					>
						<p className='font-bold text-[16px] text-[#4F4F4F] leading-[18px]'>
							{item.title}
						</p>
						<p className='font-normal text-[16px] text-[#4F4F4F] leading-[18px]'>
							{item.description}
						</p>
					</Link>
				))}
			</div>
		</div>
	)
}
