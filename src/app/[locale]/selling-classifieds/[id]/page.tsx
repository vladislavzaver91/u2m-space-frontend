import type { Metadata } from 'next'
import { ClientClassifiedDetail } from './client-classified-detail'
import { apiService } from '@/services/api.service'
import { Classified } from '@/types'

type Props = {
	params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params
	try {
		const classified = await apiService.getClassifiedById(id)
		const title =
			classified.title.length > 50
				? `${classified.title.slice(0, 50)}...`
				: classified.title
		return {
			title: `${title}`,
			description: `${classified.description.slice(0, 100)}...`,
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'Classifieds not found | U2M SPACE',
			description:
				'Sorry, the classifieds you are looking for is not available on U2M SPACE',
		}
	}
}

export default async function ClassifiedDetailPage({ params }: Props) {
	const { id } = await params
	let classified: Classified | null = null
	let classifieds: Classified[] = []
	let error: string | null = null

	try {
		classified = await apiService.getClassifiedById(id)
		classifieds = (await apiService.getClassifieds({ page: 1, limit: 10 }))
			.classifieds
	} catch (err: any) {
		console.error('Error fetching data:', err)
		error =
			err.response?.status === 404
				? 'Classifieds not found'
				: 'The classifieds could not be loaded. Please try again later.'
	}

	return (
		<ClientClassifiedDetail
			initialClassified={classified}
			initialClassifieds={classifieds}
			id={id}
		/>
	)
}
