import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Activity,
  ArrowLeft,
  Save
} from 'lucide-react'
import { useTelegram } from '../hooks/useTelegram'
import { Event } from '../types'
import { useEvents } from '../hooks/useEvents'

const CreateTrainingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useTelegram()
  const { addEvent } = useEvents()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endTime: '',
    location: '',
    city: '',
    maxParticipants: '',
    eventType: 'training' as 'training' | 'competition' | 'seminar' | 'masterclass' | 'performance',
    sportType: '',
    distance: '',
    pace: '',
    duration: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    notes: ''
  })

  const eventTypes = [
    { value: 'training', label: 'Тренировка' },
    { value: 'competition', label: 'Соревнование' },
    { value: 'seminar', label: 'Семинар' },
    { value: 'masterclass', label: 'Мастер-класс' },
    { value: 'performance', label: 'Выступление' }
  ]

  const sportTypes = [
    'Бег',
    'Велосипед',
    'Плавание',
    'Триатлон',
    'Йога',
    'Силовая тренировка',
    'Кардио',
    'Стретчинг',
    'Другое'
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      const id = Date.now()
      const start = new Date(`${formData.startDate}T${formData.startTime}`)
      const end = formData.endTime ? new Date(`${formData.startDate}T${formData.endTime}`) : undefined

      const training: Event = {
        id,
        title: formData.title,
        description: formData.description,
        startDate: start,
        endDate: end,
        location: formData.location,
        city: formData.city,
        address: undefined,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        currentParticipants: 0,
        price: 0,
        currency: 'RUB',
        isFree: true,
        registrationRequired: true,
        organizer: {
          id: user.id,
          type: 'user',
          name: `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`,
          avatar: user.photo_url
        },
        participants: [],
        tags: [], // Не добавляем sportType в теги
        images: [],
        status: start > new Date() ? 'upcoming' : 'ongoing',
        createdAt: new Date(),
        updatedAt: new Date(),
        isTraining: formData.eventType === 'training',
        sportType: formData.sportType,
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
        pace: formData.pace || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        difficulty: formData.difficulty,
        notes: formData.notes || undefined,
        eventType: formData.eventType
      }

      await addEvent(training)
      
      navigate('/events')
    } catch (error) {
      console.error('Ошибка при создании тренировки:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Создать событие</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Тип события */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Тип события</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('eventType', type.value)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.eventType === type.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Основная информация */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название события *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Например: Утренняя пробежка в парке"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишите событие, что планируете делать..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Время и дата */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Время и дата
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Время начала *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Время окончания (необязательно)
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Место проведения */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Место проведения
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Город *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Москва"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Место или адрес *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Например: Парк Горького или ул. Крымский Вал, 9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* TODO: точка на карте по желанию */}
          </div>
        </div>

        {/* Параметры тренировки */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Параметры события
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Вид спорта *
                </label>
                <select
                  required
                  value={formData.sportType}
                  onChange={(e) => handleInputChange('sportType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Выберите вид спорта</option>
                  {sportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сложность
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="beginner">Начинающий</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дистанция (км)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => handleInputChange('distance', e.target.value)}
                  placeholder="5.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Темп (мин/км)
                </label>
                <input
                  type="text"
                  value={formData.pace}
                  onChange={(e) => handleInputChange('pace', e.target.value)}
                  placeholder="5:30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Продолжительность (мин)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дополнительные заметки
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Дополнительная информация о событии..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Участники */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Участники
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Максимальное количество участников
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
              placeholder="Не ограничено"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Оставьте пустым, если количество участников не ограничено
            </p>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Создание...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Создать событие</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTrainingPage
