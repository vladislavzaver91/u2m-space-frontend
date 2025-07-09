'use client'

import { IconCustom } from '@/components/ui/icon-custom'
import { RichTextRerender } from '@/components/ui/rich-text-rerender'
import { useTranslations } from 'next-intl'

export default function UserDataDeletionPage() {
	const tUserDataDeletion = useTranslations('Rules.userDataDeletion')

	const howToRequestDataDeletionItems = [
		tUserDataDeletion.raw('howToRequestDataDeletion.items.1'),
		tUserDataDeletion.raw('howToRequestDataDeletion.items.2'),
	]

	const whatWillBeDeletedItems = [
		tUserDataDeletion.raw('whatWillBeDeleted.items.1'),
		tUserDataDeletion.raw('whatWillBeDeleted.items.2'),
		tUserDataDeletion.raw('whatWillBeDeleted.items.3'),
	]

	return (
		<div className='min-h-screen flex flex-col'>
			<div className='flex-1 lg:max-w-[790px] 2xl:max-w-[1046px] 3xl:max-w-[770px]! lg:mx-auto max-lg:px-8 max-sm:px-4 pb-[79px] md:pb-20 xl:pb-[200px] 2xl:pb-[264px] 3xl:pb-40! pt-[72px] md:pt-40! space-y-8'>
				{/* title */}
				<h1 className='text-[24px] font-bold text-[#4F4F4F]'>
					{tUserDataDeletion('title')}
				</h1>

				{/* we respect / preTitle */}
				<p className='text-[16px] font-bold text-[#4F4F4F]'>
					{tUserDataDeletion('preTitle')}
				</p>

				{/* howToRequestDataDeletion */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tUserDataDeletion('howToRequestDataDeletion.title')}
					</h2>
					<div>
						<p className='text-[16px] font-normal leading-[22px]'>
							{tUserDataDeletion('howToRequestDataDeletion.description')}
						</p>
						<ul className='space-y-2'>
							{howToRequestDataDeletionItems.map((item, index) => (
								<li key={index} className='flex items-center gap-2'>
									<RichTextRerender
										html={item}
										className='text-[16px] font-normal leading-[22px]'
									/>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* whatWillBeDeleted */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tUserDataDeletion('whatWillBeDeleted.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tUserDataDeletion('whatWillBeDeleted.description')}
					</p>
					<ul className='space-y-2'>
						{whatWillBeDeletedItems.map((item, index) => (
							<li key={index} className='flex gap-2'>
								<IconCustom
									name='check'
									iconThumb
									className='w-6 h-6 text-[#6FCF97] fill-none'
								/>
								<p className='text-[16px] font-normal leading-[22px]'>{item}</p>
							</li>
						))}
					</ul>
				</div>

				{/* processingTime */}
				<div className='space-y-2 text-[#4F4F4F]'>
					<h2 className='text-[18px] font-bold'>
						{tUserDataDeletion('processingTime.title')}
					</h2>
					<p className='text-[16px] font-normal leading-[22px] mb-8'>
						{tUserDataDeletion('processingTime.description')}
					</p>
					<p className='text-[16px] font-normal leading-[22px]'>
						{tUserDataDeletion('processingTime.info')}
					</p>
				</div>
			</div>
		</div>
	)
}
