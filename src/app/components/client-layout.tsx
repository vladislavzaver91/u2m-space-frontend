'use client'

import { useVisitRedirect } from '../helpers/hooks/use-visit-redirect'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	useVisitRedirect()
	return <main className='flex-1'>{children}</main>
}
