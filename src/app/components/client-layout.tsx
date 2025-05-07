'use client'

import { useScrollStyle } from '../helpers/hooks/use-scroll-style'
import { useVisitRedirect } from '../helpers/hooks/use-visit-redirect'
import { Loader } from './ui/loader'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const shouldRender = useVisitRedirect()
	useScrollStyle()

	if (!shouldRender) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<Loader />
			</div>
		)
	}

	return <main className='flex-1'>{children}</main>
}
