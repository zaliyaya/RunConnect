import React, { useState } from 'react'
import { Search, Filter, MapPin, Users, Lock } from 'lucide-react'
import { Club, ClubFilters } from '../types'
import ClubCard from '../components/ClubCard'

// Моковые данные
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
  },
  {
    id: 3,
    name: 'Клуб любителей трейлраннинга',
    description: 'Бег по пересеченной местности и горным тропам. Организуем походы и соревнования.',
    city: 'Санкт-Петербург',
    avatar: 'https://via.placeholder.com/64',
    isPrivate: false,
    isModerated: false,
    membersCount: 234,
    maxMembers: 300,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 3,
      telegramId: 555666777,
      firstName: 'Дмитрий',
      lastName: 'Сидоров',
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
    tags: ['трейлраннинг', 'горы', 'природа']
  }
]

const ClubsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ClubFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  const filteredClubs = mockClubs.filter(club => {
    // Поиск по названию и описанию
    if (searchQuery && !club.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !club.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Фильтр по городу
    if (filters.city && club.city !== filters.city) {
      return false
    }

    // Фильтр по типу клуба
    if (filters.isPrivate !== undefined && club.isPrivate !== filters.isPrivate) {
      return false
    }

    // Фильтр по тегам
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        club.tags.some(clubTag => clubTag.toLowerCase().includes(tag.toLowerCase()))
      )
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })

  const cities = Array.from(new Set(mockClubs.map(club => club.city)))
  const allTags = Array.from(new Set(mockClubs.flatMap(club => club.tags)))

  return (
    <div className="p-4 space-y-4">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Клубы</h1>
        <p className="text-gray-600">Найди свой беговой клуб</p>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-4">
        {/* Поиск */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск клубов..."
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

            {/* Тип клуба */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип клуба
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isPrivate === false}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      isPrivate: e.target.checked ? false : undefined 
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Открытые клубы</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isPrivate === true}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      isPrivate: e.target.checked ? true : undefined 
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Закрытые клубы</span>
                </label>
              </div>
            </div>

            {/* Теги */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Направления
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 6).map(tag => (
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
            Найдено клубов: {filteredClubs.length}
          </h2>
        </div>

        {filteredClubs.length > 0 ? (
          <div className="space-y-4">
            {filteredClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Клубы не найдены
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

export default ClubsPage 