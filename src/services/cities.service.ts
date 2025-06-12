import citiesUS from '../data/cities_us.json'
import citiesUA from '../data/cities_ua.json'
import citiesPL from '../data/cities_pl.json'

interface City {
	id: number
	name: {
		en: string
		uk: string
		pl: string
	}
	countryCode: string
}

interface CityOption {
	id: number
	name: string
}

export class CityService {
	private citiesByCountry: { [key: string]: City[] } = {
		US: citiesUS,
		UA: citiesUA,
		PL: citiesPL,
	}

	private allCities: City[] = [...citiesUS, ...citiesUA, ...citiesPL]

	fetchAllCities(languageCode: 'en' | 'uk' | 'pl'): CityOption[] {
		try {
			return this.allCities.map(city => ({
				id: city.id,
				name: city.name[languageCode],
			}))
		} catch (error) {
			console.error('Error fetching cities:', error)
			throw new Error('Failed to load cities')
		}
	}

	searchCities(
		searchTerm: string,
		languageCode: 'en' | 'uk' | 'pl'
	): CityOption[] {
		try {
			const lowerCaseSearch = searchTerm.toLowerCase()
			return this.allCities
				.filter(city =>
					city.name[languageCode].toLowerCase().includes(lowerCaseSearch)
				)
				.map(city => ({
					id: city.id,
					name: city.name[languageCode],
				}))
		} catch (error) {
			console.error('Error searching cities:', error)
			throw new Error('Failed to search cities')
		}
	}

	getTranslatedCityName(
		cityName: string,
		targetLanguageCode: 'en' | 'uk' | 'pl'
	): string | null {
		try {
			const foundCity = this.allCities.find(
				city =>
					city.name.en.toLowerCase() === cityName.toLowerCase() ||
					city.name.uk.toLowerCase() === cityName.toLowerCase() ||
					city.name.pl.toLowerCase() === cityName.toLowerCase()
			)

			// Если город найден, возвращаем его имя на целевом языке
			return foundCity ? foundCity.name[targetLanguageCode] : null
		} catch (error) {
			console.error('Error translating city:', error)
			return null
		}
	}

	getTotalAllCities(): number {
		return this.allCities.length
	}
}

export const cityService = new CityService()
