import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Star,
  MapPin,
  Clock
} from 'lucide-react'
import { useTelegram } from '../hooks/useTelegram'
import { Event, Club } from '../types'
import EventCard from '../components/EventCard'
import ClubCard from '../components/ClubCard'

// Моковые данные для демонстрации
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Утренняя пробежка в парке Горького',
    description: 'Присоединяйтесь к нашей утренней пробежке! Подходит для всех уровней подготовки.',
    startDate: new Date('2024-02-15T08:00:00'),
    endDate: new Date('2024-02-15T09:30:00'),
    location: 'Парк Горького',
    city: 'Москва',
    address: 'ул. Крымский Вал, 9',
    maxParticipants: 50,
    currentParticipants: 23,
    price: 0,
    currency: 'RUB',
    isFree: true,
    registrationRequired: true,
    organizer: {
      id: 1,
      type: 'club',
      name: 'Беговой клуб "Стрела"',
      avatar: 'https://via.placeholder.com/40'
    },
    participants: [],
    tags: ['бег', 'утро', 'парк'],
    images: ['https://via.placeholder.com/300x200'],
    status: 'upcoming',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Полумарафон "Весенний ветер"',
    description: 'Ежегодный полумарафон с живописной трассой по центру города.',
    startDate: new Date('2024-03-20T09:00:00'),
    endDate: new Date('2024-03-20T12:00:00'),
    location: 'Центральная площадь',
    city: 'Москва',
    address: 'Красная площадь',
    maxParticipants: 1000,
    currentParticipants: 567,
    price: 2500,
    currency: 'RUB',
    isFree: false,
    registrationRequired: true,
    registrationDeadline: new Date('2024-03-15T23:59:59'),
    organizer: {
      id: 2,
      type: 'company',
      name: 'Организаторы марафонов',
      avatar: 'https://via.placeholder.com/40'
    },
    participants: [],
    tags: ['марафон', 'соревнования', 'весна'],
    images: ['https://via.placeholder.com/300x200'],
    status: 'upcoming',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

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
      points: 1250,
      level: 5,
      achievements: [],
      clubs: [],
      events: [],
      isTrainer: false,
      isOrganizer: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    members: [],
    moderators: [],
    events: mockEvents.filter(e => e.organizer.id === 1),
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
      points: 2100,
      level: 8,
      achievements: [],
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
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Приветствие */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Добро пожаловать в RunConnect!
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
      <div className="grid grid-cols-2 gap-4">
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
          {mockEvents.map((event) => (
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
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">12</div>
              <div className="text-sm text-gray-600">Событий</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-600">3</div>
              <div className="text-sm text-gray-600">Клуба</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">850</div>
              <div className="text-sm text-gray-600">Очков</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage 