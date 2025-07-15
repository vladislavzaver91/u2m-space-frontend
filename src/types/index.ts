export interface ApiError {
	response?: {
		status?: number
		data?: {
			error?: string
		}
	}
	message?: string
}

export interface AuthTokens {
	accessToken: string
	refreshToken: string
}

export interface AuthLinkItem {
	icon: string
	name: string
	href?: string /* временно, пока не настроим apple */
}

export interface Classifieds {
	largeFirst: Classified[]
	largeSecond: Classified[]
	small: Classified[]
}

export interface ClassifiedsResponse {
	classifieds: Classifieds
	total: number
	hasMoreSmall: boolean
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
	city?: string
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

export interface PriceRange {
	min: number
	max: number
	currency: string
	convertedMin: number
	convertedMax: number
	convertedCurrency: string
}

export interface FilterClassifiedsResponse extends ClassifiedsResponse {
	priceRange: PriceRange
	availableTags: string[]
	availableCities: string[]
}

export interface ClassifiedData {
	title: string
	description: string
	price: string
	images?: File[] | string[]
	tags: string[]
}

export interface PartialUpdateClassifiedData {
	isActive?: boolean
	title?: string
	description?: string
	price?: string
	tags?: string[]
	images?: File[] | string[]
}

export interface UserClassifiedsResponse {
	classifieds: Classified[]
	total: number
	hasMore: boolean
}

export interface ToggleFavoriteResponse {
	id: string
	favorites: number
	favoritesBool: boolean
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

export interface AuthResponse {
	user: User
	accessToken: string
	refreshToken: string
}

export interface LoginData {
	email: string
	password: string
}

export interface User {
	id: string
	email: string
	name: string
	plan: 'light' | 'smart' | 'extremum'
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

export interface GuestSettings {
	language: 'en' | 'uk' | 'pl'
	currency: 'USD' | 'UAH' | 'EUR'
	city: string | null
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

export interface convertedCurrencyItems {
	currency: string
	symbol: string
	price: string | undefined
}

export type CityOption = {
	id: number
	name: string
}

export interface Notification {
	id: string
	type: string
	messageData: { [key: string]: string }
	isRead: boolean
	createdAt: string
}

export interface PaymentIntent {
	paymentIntent: {
		id: string
		status: string
	}
}
