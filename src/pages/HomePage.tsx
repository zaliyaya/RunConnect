import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Users, 
  Calendar, 
  TrendingUp, 
  MapPin,
  Clock,
  Activity
} from 'lucide-react'
import { useTelegram } from '../hooks/useTelegram'
import { Event, Club } from '../types'
import EventCard from '../components/EventCard'
import ClubCard from '../components/ClubCard'
import { useEvents } from '../hooks/useEvents'

// Моковые данные для демонстрации клубов
const mockClubs: Club[] = [
  {
    id: 1,
    name: 'Беговой клуб "Стрела"',
    description: 'Дружелюбное сообщество бегунов всех уровней. Регулярные тренировки и участие в соревнованиях.',
    city: 'Москва',
    avatar: 'https://via.placeholder.com/64',
    isPrivate: false,
    isModerated: false,
    membersCount: 156,
    maxMembers: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 1,
      telegramId: 123456789,
      firstName: 'Алексей',
      lastName: 'Петров',
      clubs: [],
      events: [],
      isTrainer: false,
      isOrganizer: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    members: [],
    moderators: [],
    events: [],
    tags: ['бег', 'тренировки', 'соревнования']
  },
  {
    id: 2,
    name: 'Триатлон клуб "Железный человек"',
    description: 'Специализируемся на подготовке к триатлону. Плавание, велосипед, бег.',
    city: 'Москва',
    avatar: 'https://via.placeholder.com/64',
    isPrivate: true,
    isModerated: true,
    membersCount: 89,
    maxMembers: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 2,
      telegramId: 987654321,
      firstName: 'Мария',
      lastName: 'Иванова',
      clubs: [],
      events: [],
      isTrainer: true,
      isOrganizer: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    members: [],
    moderators: [],
    events: [],
    tags: ['триатлон', 'плавание', 'велосипед']
  }
]

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
        <p className="text-gray-600">
          Найди свой беговой клуб и участвуй в событиях
        </p>
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
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/clubs')}
          className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <Users className="w-8 h-8 text-primary-600 mb-2" />
          <span className="text-sm font-medium text-primary-700">Найти клуб</span>
        </button>
        
        <button
          onClick={() => navigate('/events')}
          className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
        >
          <Calendar className="w-8 h-8 text-secondary-600 mb-2" />
          <span className="text-sm font-medium text-secondary-700">События</span>
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

      {/* Популярные клубы */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Популярные клубы</h2>
          <button
            onClick={() => navigate('/clubs')}
            className="text-primary-600 text-sm font-medium hover:text-primary-700"
          >
            Все клубы →
          </button>
        </div>
        
        <div className="space-y-4">
          {mockClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>

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