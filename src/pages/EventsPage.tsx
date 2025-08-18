import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Calendar, MapPin, DollarSign, Plus, Activity } from 'lucide-react'
import { Event, EventFilters } from '../types'
import EventCard from '../components/EventCard'

// Моковые данные
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
  },
  {
    id: 3,
    title: 'Трейлраннинг в Подмосковье',
    description: 'Бег по лесным тропам и холмам. Дистанции 5, 10 и 21 км.',
    startDate: new Date('2024-04-10T07:00:00'),
    endDate: new Date('2024-04-10T14:00:00'),
    location: 'Лесной массив',
    city: 'Подмосковье',
    address: 'Истринский район',
    maxParticipants: 200,
    currentParticipants: 89,
    price: 1500,
    currency: 'RUB',
    isFree: false,
    registrationRequired: true,
    organizer: {
      id: 3,
      type: 'club',
      name: 'Клуб трейлраннинга',
      avatar: 'https://via.placeholder.com/40'
    },
    participants: [],
    tags: ['трейлраннинг', 'природа', 'лес'],
    images: ['https://via.placeholder.com/300x200'],
    status: 'upcoming',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    title: 'Вечерняя пробежка 5км',
    description: 'Легкая пробежка в парке. Подходит для начинающих.',
    startDate: new Date('2024-02-20T19:00:00'),
    endDate: new Date('2024-02-20T20:00:00'),
    location: 'Парк Сокольники',
    city: 'Москва',
    address: 'ул. Сокольнический Вал, 1',
    maxParticipants: 15,
    currentParticipants: 8,
    price: 0,
    currency: 'RUB',
    isFree: true,
    registrationRequired: true,
    organizer: {
      id: 4,
      type: 'user',
      name: 'Алексей Петров',
      avatar: 'https://via.placeholder.com/40'
    },
    participants: [],
    tags: ['бег', 'вечер', 'начинающие'],
    images: [],
    status: 'upcoming',
    isTraining: true,
    sportType: 'Бег',
    distance: 5,
    pace: '6:00',
    duration: 60,
    difficulty: 'beginner',
    equipment: ['Кроссовки', 'Вода'],
    notes: 'Приносите с собой воду',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    title: 'Интервальная тренировка',
    description: 'Интенсивная тренировка с интервалами. Для подготовленных бегунов.',
    startDate: new Date('2024-02-22T18:00:00'),
    endDate: new Date('2024-02-22T19:30:00'),
    location: 'Стадион Лужники',
    city: 'Москва',
    address: 'Лужнецкая наб., 24',
    maxParticipants: 10,
    currentParticipants: 5,
    price: 0,
    currency: 'RUB',
    isFree: true,
    registrationRequired: true,
    organizer: {
      id: 5,
      type: 'user',
      name: 'Мария Иванова',
      avatar: 'https://via.placeholder.com/40'
    },
    participants: [],
    tags: ['бег', 'интервалы', 'тренировка'],
    images: [],
    status: 'upcoming',
    isTraining: true,
    sportType: 'Бег',
    distance: 8,
    pace: '4:30',
    duration: 90,
    difficulty: 'advanced',
    equipment: ['Кроссовки', 'Спортивные часы', 'Вода'],
    notes: 'Разминка 15 минут, основная часть 60 минут, заминка 15 минут',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const EventsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<EventFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  const filteredEvents = mockEvents.filter(event => {
    // Поиск по названию и описанию
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Фильтр по городу
    if (filters.city && event.city !== filters.city) {
      return false
    }

    // Фильтр по дате
    if (filters.dateFrom && new Date(event.startDate) < filters.dateFrom) {
      return false
    }
    if (filters.dateTo && new Date(event.startDate) > filters.dateTo) {
      return false
    }

    // Фильтр по цене
    if (filters.priceFrom && event.price < filters.priceFrom) {
      return false
    }
    if (filters.priceTo && event.price > filters.priceTo) {
      return false
    }

    // Фильтр по бесплатности
    if (filters.isFree !== undefined && event.isFree !== filters.isFree) {
      return false
    }

    // Фильтр по типу тренировки
    if (filters.isTraining !== undefined && event.isTraining !== filters.isTraining) {
      return false
    }

    // Фильтр по виду спорта
    if (filters.sportType && event.sportType !== filters.sportType) {
      return false
    }

    // Фильтр по сложности
    if (filters.difficulty && event.difficulty !== filters.difficulty) {
      return false
    }

    // Фильтр по тегам
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        event.tags.some(eventTag => eventTag.toLowerCase().includes(tag.toLowerCase()))
      )
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })

  const cities = Array.from(new Set(mockEvents.map(event => event.city)))
  const allTags = Array.from(new Set(mockEvents.flatMap(event => event.tags)))
  const sportTypes = Array.from(new Set(mockEvents.filter(e => e.sportType).map(e => e.sportType!)))

  return (
    <div className="p-4 space-y-4">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">События</h1>
        <p className="text-gray-600">Найди интересные события и участвуй</p>
      </div>

      {/* Кнопка создания тренировки */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/create-training')}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Создать тренировку</span>
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-4">
        {/* Поиск */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск событий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Кнопка фильтров */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
        </button>

        {/* Панель фильтров */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 space-y-4">
            {/* Город */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Город
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Все города</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Тип события */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип события
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isTraining === true}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      isTraining: e.target.checked ? true : undefined 
                    }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    Тренировки
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isFree === true}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      isFree: e.target.checked ? true : undefined 
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Бесплатные</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isFree === false}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      isFree: e.target.checked ? false : undefined 
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Платные</span>
                </label>
              </div>
            </div>

            {/* Вид спорта (для тренировок) */}
            {sportTypes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Вид спорта
                </label>
                <select
                  value={filters.sportType || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, sportType: e.target.value || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Все виды спорта</option>
                  {sportTypes.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Сложность (для тренировок) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сложность
              </label>
              <select
                value={filters.difficulty || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Любая сложность</option>
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>

            {/* Цена */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена от
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceFrom || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceFrom: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена до
                </label>
                <input
                  type="number"
                  placeholder="∞"
                  value={filters.priceTo || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceTo: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Теги */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категории
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      const currentTags = filters.tags || []
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter(t => t !== tag)
                        : [...currentTags, tag]
                      setFilters(prev => ({ ...prev, tags: newTags.length > 0 ? newTags : undefined }))
                    }}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      (filters.tags || []).includes(tag)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Сброс фильтров */}
            <button
              onClick={() => setFilters({})}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Результаты */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Найдено событий: {filteredEvents.length}
          </h2>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              События не найдены
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage 