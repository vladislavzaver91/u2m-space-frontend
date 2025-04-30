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
	createdAt: string
	user: { name: string }
}

export interface User {
	id: string
	email: string
	name: string
	provider: string
}
