import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Calendar, Plus, Activity } from 'lucide-react'
import { EventFilters } from '../types'
import EventCard from '../components/EventCard'
import { useEvents } from '../hooks/useEvents'

const EventsPage: React.FC = () => {
  const navigate = useNavigate()
  const { events } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<EventFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showPast, setShowPast] = useState<boolean>(false)

  const now = new Date()

  const filteredEvents = events.filter(event => {
    // Hide/show past events
    const isPast = new Date(event.startDate) < now
    if (showPast ? !isPast : isPast) return false

    // Search by title/description
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // City
    if (filters.city && event.city !== filters.city) return false

    // Date range
    if (filters.dateFrom && new Date(event.startDate) < filters.dateFrom) return false
    if (filters.dateTo && new Date(event.startDate) > filters.dateTo) return false

    // Price
    if (filters.priceFrom && event.price < filters.priceFrom) return false
    if (filters.priceTo && event.price > filters.priceTo) return false

    // Free
    if (filters.isFree !== undefined && event.isFree !== filters.isFree) return false

    // Training type
    if (filters.isTraining !== undefined && event.isTraining !== filters.isTraining) return false

    // Sport type
    if (filters.sportType && event.sportType !== filters.sportType) return false

    // Difficulty
    if (filters.difficulty && event.difficulty !== filters.difficulty) return false

    // Tags
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        event.tags.some(eventTag => eventTag.toLowerCase().includes(tag.toLowerCase()))
      )
      if (!hasMatchingTag) return false
    }

    return true
  })

  const cities = Array.from(new Set(events.map(event => event.city)))
  const allTags = Array.from(new Set(events.flatMap(event => event.tags)))
  const sportTypes = Array.from(new Set(events.filter(e => e.sportType).map(e => e.sportType!)))

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">События</h1>
        <p className="text-gray-600">Найди интересные события и участвуй</p>
      </div>

      {/* Create training button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/create-training')}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Создать тренировку</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="space-y-4">
        {/* Search */}
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

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
        </button>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 space-y-4">
            {/* Past events */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPast}
                onChange={(e) => setShowPast(e.target.checked)}
                className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">Прошедшие события</span>
            </label>

            {/* City */}
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

            {/* Type */}
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

            {/* Sport type */}
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

            {/* Difficulty */}
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

            {/* Tags */}
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

            {/* Reset */}
            <button
              onClick={() => { setFilters({}); setShowPast(false) }}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Results */}
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