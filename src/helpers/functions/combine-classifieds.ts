import { Classified, Classifieds } from '@/types'

export const combineClassifieds = (classifieds: Classifieds): Classified[] => {
	return [
		...(classifieds.largeFirst || []),
		...(classifieds.largeSecond || []),
		...(classifieds.small || []),
	]
}
