import React from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { 
  User, 
  Trophy, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Star,
  Award,
  Target
} from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user } = useTelegram()

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

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">850</div>
            <div className="text-sm text-gray-600">Очков</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600">5</div>
            <div className="text-sm text-gray-600">Уровень</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-600">Достижений</div>
          </div>
        </div>

        {/* Прогресс уровня */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Прогресс до следующего уровня</span>
            <span className="text-sm text-gray-500">850/1000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Достижения */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Последние достижения
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Первая пробежка</p>
              <p className="text-xs text-gray-500">Завершили первую пробежку</p>
            </div>
            <span className="text-xs text-gray-400">2 дня назад</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Командный игрок</p>
              <p className="text-xs text-gray-500">Присоединились к клубу</p>
            </div>
            <span className="text-xs text-gray-400">1 неделя назад</span>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm text-gray-700">Участие в событиях</span>
            </div>
            <span className="text-sm font-medium text-gray-900">12</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary-600" />
              </div>
              <span className="text-sm text-gray-700">Членство в клубах</span>
            </div>
            <span className="text-sm font-medium text-gray-900">3</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-700">Завершенные цели</span>
            </div>
            <span className="text-sm font-medium text-gray-900">8</span>
          </div>
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