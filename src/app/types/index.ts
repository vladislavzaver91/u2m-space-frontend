export interface AuthLinkItem {
	icon: string
	name: string
	href?: string /* временно, пока не настроим apple */
}

export interface Classified {
	id: string
	title: string
	description: string
	price: number
	images: string[]
	isActive: boolean
	favoritesBool: boolean
	createdAt: string
	user: {
		id: string
		name: string
		avatarUrl: string
		phoneNumber?: string
		successfulDeals?: number
	}
	tags?: string[]
	views?: number
	messages?: number
	favorites?: number
}

export interface User {
	id: string
	email: string
	name: string
	provider: string
	avatarUrl?: string
	phoneNumber?: string
	successfulDeals?: string
}

export interface Tag {
	id: string
	name: string
	createdAt: string
	updatedAt: string
}
