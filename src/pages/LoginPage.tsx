import React from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { Users, Calendar, Trophy, Target } from 'lucide-react'

const LoginPage: React.FC = () => {
  const { user } = useTelegram()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RunConnect</h1>
          <p className="text-gray-600">Сообщество бегунов и любителей спорта</p>
        </div>

        {/* Информация о приложении */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-600" />
            </div>
            <span className="text-sm text-gray-700">Найди свой беговой клуб</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-secondary-600" />
            </div>
            <span className="text-sm text-gray-700">Участвуй в событиях</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-700">Зарабатывай достижения</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-700">Ставь цели и достигай их</span>
          </div>
        </div>

        {/* Кнопка входа через Telegram */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
          </svg>
          <span>Войти через Telegram</span>
        </button>

        {/* Информация о безопасности */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Входя в приложение, вы соглашаетесь с нашими{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Условиями использования
            </a>{' '}
            и{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Политикой конфиденциальности
            </a>
          </p>
        </div>

        {/* Статистика приложения */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">500+</div>
              <div className="text-xs text-gray-600">Клубов</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-600">10K+</div>
              <div className="text-xs text-gray-600">Событий</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">50K+</div>
              <div className="text-xs text-gray-600">Участников</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 