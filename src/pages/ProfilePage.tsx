import React from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useEvents } from '../hooks/useEvents'
import { 
  User, 
  Calendar, 
  Settings, 
  LogOut
} from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user } = useTelegram()
  const { events } = useEvents()

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Пользователь не найден</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Профиль</h1>
      </div>

      {/* Информация о пользователе */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          {user.photo_url ? (
            <img 
              src={user.photo_url} 
              alt={user.first_name}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </h2>
            {user.username && (
              <p className="text-gray-600">@{user.username}</p>
            )}
          </div>
        </div>
      </div>

      {/* Активность */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Активность
        </h3>
        <div className="space-y-4">
          {/* Мои участия */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm text-gray-700">Мои участия</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{events.filter(e => e.participants.some(p => p.telegramId === user.id)).length}</span>
          </div>

          {/* Мои события */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-secondary-600" />
              </div>
              <span className="text-sm text-gray-700">Мои события</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{events.filter(e => e.organizer.type === 'user' && e.organizer.id === user.id).length}</span>
          </div>

          {/* Мои клубы: временный плейсхолдер (нет данных о клубах пользователя) */}
        </div>
      </div>

      {/* Настройки */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Настройки
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Уведомления</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Приватность</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Язык</span>
              <span className="text-gray-400">Русский →</span>
            </div>
          </button>
        </div>
      </div>

      {/* Выход */}
      <button className="w-full flex items-center justify-center space-x-2 px-6 py-4 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
        <LogOut className="w-5 h-5" />
        <span>Выйти из аккаунта</span>
      </button>
    </div>
  )
}

export default ProfilePage 