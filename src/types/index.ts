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
	currency: 'USD' | 'UAH' | 'EUR' // Оригинальная валюта
	convertedPrice: number // Конвертированная цена
	convertedCurrency: 'USD' | 'UAH' | 'EUR' // Конвертированная валюта
	images: string[]
	isActive: boolean
	favoritesBool: boolean
	category?: string
	createdAt: string
	plan: 'light' | 'smart' | 'extremum'
	lastPromoted: string
	user: {
		id: string
		nickname: string
		avatarUrl: string
		trustRating: number
		bonuses: number
		phoneNumber?: string
		successfulDeals?: number
		showPhone: boolean
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
	favorites?: string[]
	legalSurname: string | null
	nickname: string
	phoneNumber?: string
	provider: string
	avatarUrl?: string | null
	extraPhoneNumber: string | null
	gender: 'Male' | 'Female' | null
	birthday: string | null
	trustRating: number
	bonuses: number
	language: 'en' | 'uk' | 'pl'
	currency: 'USD' | 'UAH' | 'EUR'
	city: string | null
	successfulDeals?: string
	notifications: boolean
	showPhone: boolean
	advancedUser: boolean
	deleteReason: string | null
	createdAt: string
	updatedAt: string
}

export interface UpdateUserProfileData {
	email?: string
	name?: string | null
	legalSurname?: string | null
	nickname?: string
	phoneNumber?: string
	extraPhoneNumber?: string | null
	gender?: 'Male' | 'Female' | null
	birthday?: string | null
	language?: 'en' | 'uk' | 'pl'
	currency?: 'USD' | 'UAH' | 'EUR'
	city?: string | null
	notifications?: boolean
	showPhone?: boolean
	advancedUser?: boolean
	deleteReason?: string | null
	removeAvatar?: boolean
	avatar?: File
}

export interface Tag {
	id: string
	name: string
	createdAt: string
	updatedAt: string
}

export interface CurrencyConversionResponse {
	USD: number
	UAH: number
	EUR: number
}

export interface convertedCurrencyItems {
	currency: string
	symbol: string
	price: string | undefined
}

export type CityOption = {
	id: number
	name: string
}
