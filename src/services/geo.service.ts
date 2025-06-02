export interface City {
	id: number
	name: string
	countryCode: string
}

export class GeoService {
	private apiKey: string
	private apiHost: string
	private baseUrl: string
	private cache: Map<string, City[]> = new Map()

	constructor() {
		this.apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY || ''
		this.apiHost = process.env.NEXT_PUBLIC_GEO_API_HOST || ''
		this.baseUrl =
			process.env.NEXT_PUBLIC_GEO_API_URL ||
			'https://wft-geo-db.p.rapidapi.com/v1/geo/'

		if (!this.apiKey || !this.apiHost) {
			throw new Error(
				'GeoDB Cities API key or host is missing in environment variables'
			)
		}
	}

	async fetchCitiesByCountry(
		countryCode: string,
		limit: number = 10,
		offset: number = 0,
		languageCode: string = 'en'
	): Promise<City[]> {
		try {
			const cacheKey = `${countryCode}-${offset}-${languageCode}`
			if (this.cache.has(cacheKey)) {
				console.log(
					`Returning cached cities for ${countryCode}, offset ${offset} language ${languageCode}`
				)
				return this.cache.get(cacheKey)!
			}

			const url = `${this.baseUrl}/cities?countryIds=${countryCode}&limit=${limit}&offset=${offset}&languageCode=${languageCode}`
			console.log('Fetching cities from:', url)

			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'x-rapidapi-key': this.apiKey,
					'x-rapidapi-host': this.apiHost,
				},
			})

			if (!res.ok) {
				throw new Error(`Failed to fetch cities: ${res.statusText}`)
			}

			const data = await res.json()
			console.log('data: ', data)
			const cities = data.data.map((city: City) => ({
				id: city.id,
				name: city.name,
				countryCode: city.countryCode,
			}))
			this.cache.set(cacheKey, cities)
			console.log(
				`Fetched ${cities.length} cities for ${countryCode}, offset ${offset}`
			)
			return cities
		} catch (error) {
			throw new Error(
				`Error fetching cities for ${countryCode}: ${(error as Error).message}`
			)
		}
	}
}

export const geoService = new GeoService()
