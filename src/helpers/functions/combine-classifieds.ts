import { Classifieds } from '@/services/api.service'
import { Classified } from '@/types'

export const combineClassifieds = (classifieds: Classifieds): Classified[] => {
	return [
		...(classifieds.largeFirst || []),
		...(classifieds.largeSecond || []),
		...(classifieds.small || []),
	]
}
