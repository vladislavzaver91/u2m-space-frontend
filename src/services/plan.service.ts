import { PaymentIntent } from '@/types'
import $api from '../lib/http'

export class PlanService {
	async purchasePlan(plan: string): Promise<PaymentIntent> {
		const res = await $api.post('api/classifieds/purchase-plan', { plan })
		return res.data
	}
}

export const planService = new PlanService()
