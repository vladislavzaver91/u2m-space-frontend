import { SwiperClass } from 'swiper/react'

export class SwiperPaginationManager {
	static pagination = {
		clickable: true,
		renderBullet: (index: number, className: string) => {
			return `<span class="${className}"></span>`
		},
	}

	static updateForCard(swiper: SwiperClass | null) {
		if (!swiper) return

		const bullets = swiper.pagination?.bullets as unknown as HTMLElement[]
		if (!bullets || !bullets.length) return

		const activeIndex = swiper.activeIndex

		bullets.forEach((bullet, index) => {
			bullet.classList.remove('is-prev', 'is-next', 'is-far')

			if (index === activeIndex - 1) {
				bullet.classList.add('is-prev')
			} else if (index === activeIndex + 1) {
				bullet.classList.add('is-next')
			} else if (index !== activeIndex) {
				bullet.classList.add('is-far')
			}
		})
	}

	static updateBase(swiper: SwiperClass | null) {
		if (!swiper) return

		const bullets = swiper.pagination?.bullets as unknown as HTMLElement[]
		if (!bullets || !bullets.length) return

		bullets.forEach(bullet => {
			bullet.classList.remove('is-prev', 'is-next', 'is-far')
		})
	}
}
