import { Tag } from '@/types'
import $api from '../../lib/http'

export class TagsService {
	async getTags(): Promise<Tag[]> {
		const res = await $api.get('/api/tags')
		return res.data
	}

	async getTagByName(name: string): Promise<Tag> {
		const res = await $api.get('/api/tags', { params: { name } })
		return res.data
	}

	async createTag(name: string): Promise<Tag> {
		const res = await $api.post('/api/tags', { name })
		return res.data
	}

	async deleteTag(id: string): Promise<void> {
		await $api.delete(`/api/tags/${id}`)
	}
}

export const tagsService = new TagsService()
