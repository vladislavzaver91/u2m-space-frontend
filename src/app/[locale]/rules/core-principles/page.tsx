'use client'

import { ParagraphWithBreaks } from '@/components/ui/paragraph-with-breaks'
import { RichTextWithIcon } from '@/components/ui/rich-text-with-icon'
import { useTranslations } from 'next-intl'

export default function CorePrinciplesPage() {
	const tCorePrinciples = useTranslations('Rules.corePrinciples')

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 lg:max-w-[790px] 2xl:max-w-[1046px] 3xl:max-w-[770px]! lg:mx-auto max-lg:px-8 max-sm:px-4 pb-[79px] md:pb-20 xl:pb-[200px] 2xl:pb-[264px] 3xl:pb-40! pt-[72px] md:pt-40! space-y-8'>
				{/* title */}
				<h1 className='text-[24px] font-bold text-[#4F4F4F]'>
					{tCorePrinciples('title')}
				</h1>

				{/* nickname */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('nickname.title')}
					</h2>
					<ParagraphWithBreaks
						text={tCorePrinciples('nickname.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* realName */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('realName.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tCorePrinciples('realName.description')}
					</p>
				</div>

				{/* trustLevel */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('trustLevel.title')}
					</h2>
					<ParagraphWithBreaks
						text={tCorePrinciples('trustLevel.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* bonuses */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('bonuses.title')}
					</h2>
					<ParagraphWithBreaks
						text={tCorePrinciples('bonuses.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* emailAndPhone */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('emailAndPhone.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tCorePrinciples('emailAndPhone.description')}
					</p>
				</div>

				{/* afterAuthorization */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('afterAuthorization.title')}
					</h2>
					<ParagraphWithBreaks
						text={tCorePrinciples('afterAuthorization.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* languageRegionCurrencyLocation */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('languageRegionCurrencyLocation.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						<RichTextWithIcon
							text={tCorePrinciples(
								'languageRegionCurrencyLocation.description'
							)}
						/>
					</p>
				</div>

				{/* notifications */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('notifications.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						<RichTextWithIcon
							text={tCorePrinciples('notifications.description')}
						/>
					</p>
				</div>

				{/* experiencedUser */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('experiencedUser.title')}
					</h2>
					<ParagraphWithBreaks
						text={tCorePrinciples('experiencedUser.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* deleteAccount */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('deleteAccount.title')}
					</h2>
					<ParagraphWithBreaks
						text={tCorePrinciples('deleteAccount.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* hiddenDataAfterVerification */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tCorePrinciples('hiddenDataAfterVerification.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tCorePrinciples('hiddenDataAfterVerification.description')}
					</p>
				</div>
			</div>
		</div>
	)
}
