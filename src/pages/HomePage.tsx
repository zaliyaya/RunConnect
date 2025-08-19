import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Calendar, 
  Activity
} from 'lucide-react'
import { useTelegram } from '../hooks/useTelegram'
import { Event } from '../types'
import EventCard from '../components/EventCard'
import { useEvents } from '../hooks/useEvents'


const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useTelegram()
  const { events } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const upcoming = events
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
    .slice(0, 5)

  return (
    <div className="p-4 space-y-6">
      {/* Приветствие */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Добро пожаловать в YoungGo!
        </h1>
        <p className="text-gray-600">Создавай тренировки и присоединяйся к ним</p>
      </div>

      {/* Поиск */}
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск событий и клубов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/events')}
          className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
        >
          <Calendar className="w-8 h-8 text-secondary-600 mb-2" />
          <span className="text-sm font-medium text-secondary-700">Календарь</span>
        </button>

        <button
          onClick={() => navigate('/create-training')}
          className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Activity className="w-8 h-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-purple-700">Создать тренировку</span>
        </button>
      </div>

      {/* Ближайшие события */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Ближайшие события</h2>
          <button
            onClick={() => navigate('/events')}
            className="text-primary-600 text-sm font-medium hover:text-primary-700"
          >
            Все события →
          </button>
        </div>
        
        <div className="space-y-4">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Блок клубов удалён */}

      {/* Статистика пользователя */}
      {user && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ваша статистика</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">{events.filter(e => e.isTraining).length}</div>
              <div className="text-sm text-gray-600">Тренировок</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-600">{events.length}</div>
              <div className="text-sm text-gray-600">Всего событий</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage 