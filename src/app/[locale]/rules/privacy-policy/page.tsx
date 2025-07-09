'use client'

import { IconCustom } from '@/components/ui/icon-custom'
import { ParagraphWithBreaks } from '@/components/ui/paragraph-with-breaks'
import { useTranslations } from 'next-intl'

export default function PrivacyPolicyPage() {
	const tPrivacyPolicy = useTranslations('Rules.privacyPolicy')

	const generalProvisionsItems = [
		tPrivacyPolicy('generalProvisions.items.1'),
		tPrivacyPolicy('generalProvisions.items.2'),
		tPrivacyPolicy('generalProvisions.items.3'),
	]

	const informationWeCollectItems = [
		tPrivacyPolicy('informationWeCollect.items.1'),
		tPrivacyPolicy('informationWeCollect.items.2'),
		tPrivacyPolicy('informationWeCollect.items.3'),
		tPrivacyPolicy('informationWeCollect.items.4'),
		tPrivacyPolicy('informationWeCollect.items.5'),
		tPrivacyPolicy('informationWeCollect.items.6'),
		tPrivacyPolicy('informationWeCollect.items.7'),
	]

	const howWeUseYourInformationItems = [
		tPrivacyPolicy('howWeUseYourInformation.items.1'),
		tPrivacyPolicy('howWeUseYourInformation.items.2'),
		tPrivacyPolicy('howWeUseYourInformation.items.3'),
		tPrivacyPolicy('howWeUseYourInformation.items.4'),
		tPrivacyPolicy('howWeUseYourInformation.items.5'),
		tPrivacyPolicy('howWeUseYourInformation.items.6'),
		tPrivacyPolicy('howWeUseYourInformation.items.7'),
	]

	const dataSharingAndDisclosureItems = [
		tPrivacyPolicy('dataSharingAndDisclosure.items.1'),
		tPrivacyPolicy('dataSharingAndDisclosure.items.2'),
		tPrivacyPolicy('dataSharingAndDisclosure.items.3'),
	]

	const managingYourDataItems = [
		tPrivacyPolicy('managingYourData.items.1'),
		tPrivacyPolicy('managingYourData.items.2'),
		tPrivacyPolicy('managingYourData.items.3'),
	]

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 lg:max-w-[790px] 2xl:max-w-[1046px] 3xl:max-w-[770px]! lg:mx-auto max-lg:px-8 max-sm:px-4 pb-[79px] md:pb-20 xl:pb-[200px] 2xl:pb-[264px] 3xl:pb-40! pt-[72px] md:pt-40! space-y-8'>
				{/* title */}
				<h1 className='text-[24px] font-bold text-[#4F4F4F]'>
					{tPrivacyPolicy('title')}
				</h1>

				{/* welcome / preTitle */}
				<p className='text-[16px] font-bold text-[#4F4F4F]'>
					{tPrivacyPolicy('preTitle')}
				</p>

				{/* description */}
				<p className='text-[16px] font-normal leading-[22px] text-[#4F4F4F]'>
					{tPrivacyPolicy('description')}
				</p>

				{/* generalProvisions */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('generalProvisions.title')}
					</h2>
					<ParagraphWithBreaks
						text={tPrivacyPolicy('generalProvisions.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
					<ul className='space-y-2'>
						{generalProvisionsItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='circle-small'
									iconThumb
									className='w-6 h-6 text-[#4F4F4F] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* informationWeCollect */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('informationWeCollect.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tPrivacyPolicy('informationWeCollect.description')}
					</p>
					<ul className='space-y-2'>
						{informationWeCollectItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='circle-small'
									iconThumb
									className='w-6 h-6 text-[#4F4F4F] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* howWeUseYourInformation */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('howWeUseYourInformation.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tPrivacyPolicy('howWeUseYourInformation.description')}
					</p>
					<ul className='space-y-2'>
						{howWeUseYourInformationItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='circle-small'
									iconThumb
									className='w-6 h-6 text-[#4F4F4F] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* dataSharingAndDisclosure */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('dataSharingAndDisclosure.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tPrivacyPolicy('dataSharingAndDisclosure.description')}
					</p>
					<ul className='space-y-2'>
						{dataSharingAndDisclosureItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='circle-small'
									iconThumb
									className='w-6 h-6 text-[#4F4F4F] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* protectingYourInformation */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('protectingYourInformation.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tPrivacyPolicy('protectingYourInformation.description')}
					</p>
				</div>

				{/* managingYourData */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('managingYourData.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tPrivacyPolicy('managingYourData.description')}
					</p>
					<ul className='space-y-2'>
						{managingYourDataItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='circle-small'
									iconThumb
									className='w-6 h-6 text-[#4F4F4F] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* policyUpdates */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('policyUpdates.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tPrivacyPolicy('policyUpdates.description')}
					</p>
				</div>

				{/* additionalTerms */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tPrivacyPolicy('additionalTerms.title')}
					</h2>
					<ParagraphWithBreaks
						text={tPrivacyPolicy('additionalTerms.description')}
						className='text-[16px] font-normal leading-[22px]'
					/>
				</div>

				{/* contactInformation */}
				<div className='space-y-2'>
					<h2 className='text-[18px] font-bold text-[#4F4F4F]'>
						{tPrivacyPolicy('contactInformation.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px] text-[#4F4F4F]'>
						{tPrivacyPolicy('contactInformation.description')}
					</p>
					<p className='text-[16px] font-normal leading-[22px] underline text-[#3486FE]'>
						privacy@u2m.space
					</p>
				</div>
			</div>
		</div>
	)
}
