'use client'

import { IconCustom } from '@/components/ui/icon-custom'
import { ParagraphWithBreaks } from '@/components/ui/paragraph-with-breaks'
import { useTranslations } from 'next-intl'

export default function ModerationRulesPage() {
	const tModerationRules = useTranslations('Rules.moderationRules')

	const adContentPhotosItems = [
		tModerationRules('mainReviewCriteria.adContent.description.photos.items.1'),
		tModerationRules('mainReviewCriteria.adContent.description.photos.items.2'),
		tModerationRules('mainReviewCriteria.adContent.description.photos.items.3'),
	]

	const postingRulesItems = [
		tModerationRules('mainReviewCriteria.postingRules.items.1'),
		tModerationRules('mainReviewCriteria.postingRules.items.2'),
		tModerationRules('mainReviewCriteria.postingRules.items.3'),
		tModerationRules('mainReviewCriteria.postingRules.items.4'),
		tModerationRules('mainReviewCriteria.postingRules.items.5'),
	]

	const moderatorWorkflowItems = [
		tModerationRules('moderatorWorkflow.items.1'),
		tModerationRules('moderatorWorkflow.items.2'),
		tModerationRules('moderatorWorkflow.items.3'),
		tModerationRules('moderatorWorkflow.items.4'),
	]

	const makeDecisionItems = [
		{
			label: tModerationRules('moderatorWorkflow.makeDecision.items.1'),
			icon: 'check',
			iconColor: '#6FCF97',
		},
		{
			label: tModerationRules('moderatorWorkflow.makeDecision.items.2'),
			icon: 'triangle-warning',
			iconColor: '#3486FE',
		},
		{
			label: tModerationRules('moderatorWorkflow.makeDecision.items.3'),
			icon: 'close',
			iconColor: '#F9329C',
		},
	]

	const examplesOfRejectionReasonsItems = [
		tModerationRules('examplesOfRejectionReasons.items.1'),
		tModerationRules('examplesOfRejectionReasons.items.2'),
		tModerationRules('examplesOfRejectionReasons.items.3'),
		tModerationRules('examplesOfRejectionReasons.items.4'),
	]

	const importantItems = [
		tModerationRules('important.items.1'),
		tModerationRules('important.items.2'),
		tModerationRules('important.items.3'),
	]

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 lg:max-w-[790px] 2xl:max-w-[1046px] 3xl:max-w-[770px]! lg:mx-auto max-lg:px-8 max-sm:px-4 pb-[79px] md:pb-20 xl:pb-[200px] 2xl:pb-[264px] 3xl:pb-40! pt-[72px] md:pt-40! space-y-8'>
				{/* title */}
				<h1 className='text-[24px] font-bold text-[#4F4F4F]'>
					{tModerationRules('title')}
				</h1>

				{/* moderationGoal */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tModerationRules('moderationGoal.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tModerationRules('moderationGoal.description')}
					</p>
				</div>

				{/* mainReviewCriteria / title */}
				<h2 className='text-[18px] font-bold text-[#4F4F4F]'>
					{tModerationRules('mainReviewCriteria.title')}
				</h2>

				{/* mainReviewCriteria /  adContent */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<p className='text-[16px] font-bold'>
						{tModerationRules('mainReviewCriteria.adContent.title')}
					</p>
					<div className='space-y-8'>
						<p className='text-[16px] font-normal leading-[22px]'>
							{tModerationRules(
								'mainReviewCriteria.adContent.description.title'
							)}
						</p>
						<p className='text-[16px] font-normal leading-[22px]'>
							{tModerationRules(
								'mainReviewCriteria.adContent.description.description'
							)}
						</p>
						<div className='space-y-2'>
							<p className='text-[16px] font-normal leading-[22px]'>
								{tModerationRules(
									'mainReviewCriteria.adContent.description.photos.title'
								)}
							</p>
							<ul className='space-y-2'>
								{adContentPhotosItems.map((item, index) => (
									<li key={index} className='flex gap-2'>
										<IconCustom
											name='check'
											iconThumb={true}
											className='w-6 h-6 text-[#6FCF97] fill-none'
										/>
										<p className='text-[16px] font-normal leading-[22px]'>
											{item}
										</p>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* mainReviewCriteria /  categoryTags */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<p className='text-[16px] font-bold'>
						{tModerationRules('mainReviewCriteria.categoryTags.title')}
					</p>
					<ParagraphWithBreaks
						text={tModerationRules(
							'mainReviewCriteria.categoryTags.description'
						)}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* mainReviewCriteria /  postingRules */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<p className='text-[16px] font-bold'>
						{tModerationRules('mainReviewCriteria.postingRules.title')}
					</p>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tModerationRules('mainReviewCriteria.postingRules.description')}
					</p>
					<ul className='space-y-2'>
						{postingRulesItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='close'
									iconThumb={true}
									className='w-6 h-6 text-[#F9329C] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* moderatorWorkflow */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<p className='text-[16px] font-bold'>
						{tModerationRules('moderatorWorkflow.title')}
					</p>
					<ParagraphWithBreaks
						text={tModerationRules('moderatorWorkflow.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
					<ul className='space-y-2'>
						{moderatorWorkflowItems.map((item, index) => (
							<li key={index} className='flex items-center gap-2'>
								<IconCustom
									name='check'
									iconThumb={true}
									className='w-6 h-6 text-[#6FCF97] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tModerationRules('moderatorWorkflow.makeDecision.title')}
					</p>
					<ul className='space-y-2'>
						{makeDecisionItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name={item.icon}
									iconThumb={item.icon === 'close'}
									className={`'w-6 h-6' text-[${item.iconColor}] fill-none`}
								/>
								<p className='text-[16px] font-normal leading-[22px]'>
									{item.label}
								</p>
							</li>
						))}
					</ul>
				</div>

				{/* examplesOfRejectionReasons */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<p className='text-[16px] font-bold'>
						{tModerationRules('examplesOfRejectionReasons.title')}
					</p>
					<ul className='space-y-2'>
						{examplesOfRejectionReasonsItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='close'
									iconThumb={true}
									className='w-6 h-6 text-[#F9329C] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* important */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<p className='text-[16px] font-bold'>
						{tModerationRules('important.title')}
					</p>
					<ul className='space-y-2'>
						{importantItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='circle-small'
									iconThumb={true}
									className='w-6 h-6 text-[#4F4F4F] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
