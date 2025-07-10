'use-client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { IconCustom } from './icon-custom'

interface PaymentHistory {
	id: string
	dateStart: string
	operationId: string
	type: string
	heading: string
	endDate: string | null
	amount: number
}

export const PaymentHistorySection = () => {
	const t = useTranslations('Payment.paymentHistory')

	const [openRow, setOpenRow] = useState<string | null>(null)

	const paymentHistory: PaymentHistory[] = useMemo(
		() => [
			{
				id: '1',
				dateStart: format(new Date('2025-04-10'), 'MMM d, yyyy'),
				operationId: '54117',
				type: t('types.monthlyRise'),
				heading: 'MacBook Pro - Extremum',
				endDate: null,
				amount: 24,
			},
			{
				id: '2',
				dateStart: format(new Date('2025-05-01'), 'MMM d, yyyy'),
				operationId: '32951',
				type: t('types.yearlyPlan'),
				heading: 'Extremum',
				endDate: format(new Date('2025-06-01'), 'MMM d, yyyy'),
				amount: 0,
			},
		],
		[t]
	)

	const toggleRow = (id: string) => {
		setOpenRow(openRow === id ? null : id)
	}

	const renderDesktopTable = () => (
		<table className='w-full'>
			<thead>
				<tr className='border-b border-[#BDBDBD] px-8'>
					<th className='text-left pl-8 py-4 text-[16px] font-bold text-[#4F4F4F]'>
						{t('columns.dateStart')}
					</th>
					<th className='text-left pl-4 py-4 text-[16px] font-bold text-[#4F4F4F]'>
						{t('columns.operationId')}
					</th>
					<th className='text-left pl-4 py-4 text-[16px] font-bold text-[#4F4F4F]'>
						{t('columns.type')}
					</th>
					<th className='text-left pl-4 py-4 text-[16px] font-bold text-[#4F4F4F]'>
						{t('columns.heading')}
					</th>
					<th className='text-left pl-4 py-4 text-[16px] font-bold text-[#4F4F4F]'>
						{t('columns.endDate')}
					</th>
					<th className='text-right pl-4 pr-8 py-4 text-[16px] font-bold text-[#4F4F4F]'>
						{t('columns.amount')}
					</th>
				</tr>
			</thead>
			<tbody>
				{paymentHistory.map(row => (
					<tr key={row.id} className='not-last:border-b border-[#BDBDBD]'>
						<td className='text-left pl-8 py-4 text-[16px] font-normal text-[#4F4F4F] leading-[22px]'>
							{row.dateStart}
						</td>
						<td className='text-left pl-4 py-4 text-[16px] font-bold text-[#3486FE]'>
							{row.operationId}
						</td>
						<td className='text-left pl-4 py-4 text-[16px] font-bold text-[#F9329C]'>
							{row.type}
						</td>
						<td className='text-left pl-4 py-4 text-[16px] font-bold text-[#3486FE]'>
							{row.heading}
						</td>
						<td className='text-left pl-4 py-4 text-[16px] font-normal text-[#4F4F4F] leading-[22px]'>
							{row.endDate || '—'}
						</td>
						<td className='text-right pl-4 pr-8 py-4 text-[16px] font-bold text-[#F9329C]'>
							<h2>-${row.amount}</h2>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)

	const renderMobileAccordion = () =>
		paymentHistory.map(row => (
			<div
				key={row.id}
				className='max-sm:first:border-b-0 border border-[#BDBDBD] first:rounded-t-[13px] last:rounded-b-[13px] sm:rounded-[13px] overflow-hidden'
			>
				{/* Header section - always visible */}
				<>
					<div className='max-sm:hidden p-4 flex justify-between items-center gap-4'>
						<div className='flex-1'>
							<p className='text-[16px] font-bold text-[#3486FE]'>
								{row.heading}
							</p>
							<p className='text-[16px] font-normal leading-[22px] text-[#4F4F4F]'>
								{row.dateStart}
							</p>
						</div>
						<div className='text-right'>
							<p className='text-[16px] font-bold text-[#F9329C]'>{row.type}</p>
							<h2 className='text-[18px] font-bold text-[#F9329C]'>
								-${row.amount}
							</h2>
						</div>
						<button
							className='w-6 h-6 flex items-center justify-center'
							onClick={() => toggleRow(row.id)}
						>
							<IconCustom
								name='arrow-down-select'
								iconThumb
								className={`w-6 h-6 fill-none text-[#4F4F4F] ${
									openRow === row.id && 'rotate-180'
								}`}
							/>
						</button>
					</div>

					<div className='sm:hidden p-4 flex justify-between items-center gap-4'>
						<div className='flex-1'>
							<p className='text-[16px] font-bold text-[#3486FE]'>
								{row.heading}
							</p>
							<p className='text-[16px] font-normal leading-[22px] text-[#4F4F4F]'>
								{row.dateStart}
							</p>
							<div className='flex items-center gap-4'>
								<p className='text-[16px] font-bold text-[#F9329C]'>
									{row.type}
								</p>
								<h2 className='text-[18px] font-bold text-[#F9329C]'>
									-${row.amount}
								</h2>
							</div>
						</div>
						<button
							className='w-6 h-6 flex items-center justify-center'
							onClick={() => toggleRow(row.id)}
						>
							<IconCustom
								name='arrow-down-select'
								iconThumb
								className={`w-6 h-6 fill-none text-[#4F4F4F] ${
									openRow === row.id && 'rotate-180'
								}`}
							/>
						</button>
					</div>
				</>

				{/* Expanded details section */}
				{openRow === row.id && (
					<div className=''>
						<table className='w-full'>
							<thead>
								<tr className='border-b border-t border-[#BDBDBD] px-8'>
									<th className='text-left pl-4 py-4 text-[13px] sm:text-[16px] font-bold text-[#4F4F4F]'>
										{t('columns.dateStart')}
									</th>
									<th className='text-left pl-4 py-4 text-[13px] sm:text-[16px] font-bold text-[#4F4F4F]'>
										{t('columns.operationId')}
									</th>
									<th className='text-left pl-4 py-4 text-[13px] sm:text-[16px] font-bold text-[#4F4F4F]'>
										{t('columns.type')}
									</th>

									<th className='text-right px-4 py-4 text-[13px] sm:text-[16px] font-bold text-[#4F4F4F]'>
										{t('columns.endDate')}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr key={row.id} className='not-last:border-b border-[#BDBDBD]'>
									<td className='text-left pl-4 py-4 text-[13px] sm:text-[16px] font-normal text-[#4F4F4F] sm:leading-[22px]'>
										{row.dateStart}
									</td>
									<td className='text-left pl-4 py-4 text-[13px] sm:text-[16px] font-bold text-[#3486FE]'>
										{row.operationId}
									</td>
									<td className='text-left pl-4 py-4 text-[13px] sm:text-[16px] font-bold text-[#F9329C]'>
										{row.type}
									</td>

									<td className='text-right px-4 py-4 text-[13px] sm:text-[16px] font-normal text-[#4F4F4F] sm:leading-[22px]'>
										{row.endDate || '—'}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
			</div>
		))

	return (
		<div className='grid grid-cols-4 sm:grid-cols-12 max-[641px]:gap-4 max-[1281px]:gap-[30px] gap-[60px]'>
			<div className='col-start-1 col-end-5 sm:col-start-1 sm:col-end-13 2-5xl:col-start-3! 2-5xl:col-end-11! min-[2280px]:col-start-1! min-[2280px]:col-end-13!'>
				{/* Desktop Table: Hidden on screens < 769px */}
				<div className='hidden lg:block border border-[#BDBDBD] rounded-[13px]'>
					{renderDesktopTable()}
				</div>

				{/* Mobile Accordion: Visible on screens < 769px */}
				<div className='lg:hidden sm:space-y-4'>{renderMobileAccordion()}</div>
			</div>
		</div>
	)
}
