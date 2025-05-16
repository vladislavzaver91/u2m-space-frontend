import { SwiperClass } from 'swiper/react'

export class SwiperPaginationService {
	static paginationBase = {
		clickable: true,
		renderBullet: (index: number, className: string) => {
			return `<span class="${className}"></span>`
		},
	}

	// обычные точки по правкам на 16.05.25
	static paginationForCard = {
		clickable: true,
		renderBullet: (index: number, className: string) => {
			return `<span class="${className}"></span>`
		},
	}

	// обычные точки по правкам на 16.05.25
	static updateForCard(swiper: SwiperClass | null) {
		if (!swiper) return

		const bullets = swiper.pagination?.bullets as unknown as HTMLElement[]
		if (!bullets || !bullets.length) return
	}

	// обычные точки по правкам на 16.05.25
	static updateBase(swiper: SwiperClass | null) {
		if (!swiper) return

		const bullets = swiper.pagination?.bullets as unknown as HTMLElement[]
		if (!bullets || !bullets.length) return
	}

	// динамические точки, как были ранее до 16.05.25
	// static paginationForCard = {
	// 	clickable: true,
	// 	dynamicBullets: true,
	// 	dynamicMainBullets: 1,
	// 	renderBullet: (index: number, className: string) => {
	// 		return `<span class="${className}"></span>`
	// 	},
	// }

	// динамические точки, как были ранее до 16.05.25
	// static updateForCard(swiper: SwiperClass | null) {
	// 	if (!swiper) return

	// 	const bullets = swiper.pagination?.bullets as unknown as HTMLElement[]
	// 	if (!bullets || !bullets.length) return

	// 	const activeIndex = swiper.activeIndex

	// 	bullets.forEach((bullet, index) => {
	// 		bullet.classList.remove(
	// 			'is-prev',
	// 			'is-next',
	// 			'is-far',
	// 			'is-even-far',
	// 			'is-hidden'
	// 		)

	// 		// Скрываем всё, что выходит за пределы 5 точек (слева и справа от активной)
	// 		const distanceFromActive = Math.abs(index - activeIndex)

	// 		// if (distanceFromActive > 3) {
	// 		// 	bullet.classList.add('is-hidden')
	// 		// } else if (index === activeIndex - 3) {
	// 		// 	bullet.classList.add('is-far')
	// 		// } else if (index === activeIndex - 1) {
	// 		// 	bullet.classList.add('is-prev')
	// 		// } else if (index === activeIndex + 1) {
	// 		// 	bullet.classList.add('is-next')
	// 		// } else if (index === activeIndex + 2) {
	// 		// 	bullet.classList.add('is-far')
	// 		// } else if (index === activeIndex + 3) {
	// 		// 	bullet.classList.add('is-even-far')
	// 		// }

	// 		// вариант 2
	// 		if (distanceFromActive > 2) {
	// 			bullet.classList.add('is-hidden')
	// 		} else if (index === activeIndex - 2) {
	// 			bullet.classList.add('is-far')
	// 		} else if (index === activeIndex - 1) {
	// 			bullet.classList.add('is-prev')
	// 		} else if (index === activeIndex + 1) {
	// 			bullet.classList.add('is-next')
	// 		} else if (index === activeIndex + 2) {
	// 			bullet.classList.add('is-far')
	// 		}

	// 		// Активную не скрываем
	// 		if (bullet.classList.contains('swiper-pagination-bullet-active')) {
	// 			bullet.classList.remove('is-hidden')
	// 		}
	// 	})
	// }

	// static updateBase(swiper: SwiperClass | null) {
	// 	if (!swiper) return

	// 	const bullets = swiper.pagination?.bullets as unknown as HTMLElement[]
	// 	if (!bullets || !bullets.length) return

	// 	bullets.forEach(bullet => {
	// 		bullet.classList.remove('is-prev', 'is-next', 'is-far')
	// 	})
	// }
}
