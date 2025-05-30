'use client'

import { Link } from '@/i18n/routing'
import { IconCustom } from './icon-custom'
import { useTranslations } from 'next-intl'

interface AddClassifiedButtonProps {
	href?: string
}

export const AddClassifiedButton = ({
	href = '/classifieds-create',
}: AddClassifiedButtonProps) => {
	const tMyClassifieds = useTranslations('MyClassifieds')

	return (
		<Link
			href={href}
			className='border-2 border-dashed border-[#bdbdbd] rounded-[13px] flex flex-col items-center justify-center transition-all hover:border-[#f9329c] hover:bg-[#F7F7F7] w-full max-sm:h-[84px] sm:h-[396px] lg:h-[294px] 3xl:h-[375px]! space-y-2 cursor-pointer group select-none'
		>
			<IconCustom
				name='add_plus'
				hover
				hoverColor='#f9329c'
				className='w-6 h-6 text-[#4f4f4f] group-hover:text-[#f9329c] group-focus:text-[#f9329c] fill-none'
			/>
			<p className='text-[#4f4f4f] text-[16px] font-bold leading-5'>
				{tMyClassifieds('buttons.addClassifieds')}
			</p>
		</Link>
	)
}
