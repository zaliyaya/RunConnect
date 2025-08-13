import { useState, useEffect } from 'react'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initTelegram = () => {
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp
        
        // Устанавливаем тему
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color',
          webApp.themeParams.bg_color || '#ffffff'
        )
        document.documentElement.style.setProperty(
          '--tg-theme-text-color',
          webApp.themeParams.text_color || '#000000'
        )
        document.documentElement.style.setProperty(
          '--tg-theme-button-color',
          webApp.themeParams.button_color || '#2481cc'
        )
        document.documentElement.style.setProperty(
          '--tg-theme-button-text-color',
          webApp.themeParams.button_text_color || '#ffffff'
        )

        // Получаем данные пользователя
        if (webApp.initDataUnsafe?.user) {
          setUser(webApp.initDataUnsafe.user)
        }

        setIsReady(true)
      } else {
        // Для разработки вне Telegram
        setUser({
          id: 123456789,
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          username: 'test_user',
          language_code: 'ru'
        })
        setIsReady(true)
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTelegram)
    } else {
      initTelegram()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', initTelegram)
    }
  }, [])

  const showMainButton = (text: string, callback: () => void) => {
    if (window.Telegram?.WebApp) {
      const mainButton = window.Telegram.WebApp.MainButton
      mainButton.setText(text)
      mainButton.onClick(callback)
      mainButton.show()
    }
  }

  const hideMainButton = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.MainButton.hide()
    }
  }

  const showBackButton = (callback: () => void) => {
    if (window.Telegram?.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton
      backButton.onClick(callback)
      backButton.show()
    }
  }

  const hideBackButton = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide()
    }
  }

  const hapticFeedback = {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style)
      }
    },
    notification: (type: 'error' | 'success' | 'warning' = 'success') => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type)
      }
    },
    selection: () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged()
      }
    }
  }

  return {
    user,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback
  }
} 