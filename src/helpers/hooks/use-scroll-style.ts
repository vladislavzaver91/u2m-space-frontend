'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function useScrollStyle() {
  const pathname = usePathname()

  useEffect(() => {
    const body = document.body
    const updateScrollClass = () => {
      // Список страниц, где ожидается контент
      const pagesWithExpectedContent = ['/my-classifieds']
      const isExpectedContentPage = pagesWithExpectedContent.includes(pathname)
      // Проверяем, нужен ли скролл
      const hasOverflow = document.documentElement.scrollHeight > window.innerHeight

      if (pathname !== '/' && (hasOverflow || isExpectedContentPage)) {
        body.classList.add('has-scroll')
      } else {
        body.classList.remove('has-scroll')
      }
    }

    // Проверяем сразу и при изменении
    updateScrollClass()
    window.addEventListener('resize', updateScrollClass)
    const observer = new MutationObserver(updateScrollClass)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('resize', updateScrollClass)
      observer.disconnect()
    }
  }, [pathname])
}