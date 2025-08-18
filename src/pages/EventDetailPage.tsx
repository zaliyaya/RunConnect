import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  ArrowLeft,
  Activity,
  Target,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTelegram } from '../hooks/useTelegram'
import { Event } from '../types'

// Моковые данные (в реальном приложении это будет API)
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
  }
]

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useTelegram()
  const [event, setEvent] = useState<Event | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id) {
      const foundEvent = mockEvents.find(e => e.id === parseInt(id))
      setEvent(foundEvent || null)
      
      // Проверяем, присоединился ли пользователь к событию
      if (foundEvent && user) {
        const isUserJoined = foundEvent.participants.some(p => p.telegramId === user.id)
        setIsJoined(isUserJoined)
      }
    }
  }, [id, user])

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: ru })
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Начинающий'
      case 'intermediate':
        return 'Средний'
      case 'advanced':
        return 'Продвинутый'
      default:
        return 'Не указано'
    }
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Скоро'
      case 'ongoing':
        return 'Сейчас'
      case 'completed':
        return 'Завершено'
      case 'cancelled':
        return 'Отменено'
      default:
        return 'Неизвестно'
    }
  }

  const handleJoinEvent = async () => {
    if (!event || !user) return

    setIsLoading(true)
    try {
      // Здесь будет API вызов для присоединения к событию
      console.log('Присоединение к событию:', event.id)
      
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsJoined(true)
      setEvent(prev => prev ? {
        ...prev,
        currentParticipants: prev.currentParticipants + 1
      } : null)
    } catch (error) {
      console.error('Ошибка при присоединении к событию:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveEvent = async () => {
    if (!event || !user) return

    setIsLoading(true)
    try {
      // Здесь будет API вызов для отмены участия
      console.log('Отмена участия в событии:', event.id)
      
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsJoined(false)
      setEvent(prev => prev ? {
        ...prev,
        currentParticipants: Math.max(0, prev.currentParticipants - 1)
      } : null)
    } catch (error) {
      console.error('Ошибка при отмене участия:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isOrganizer = event?.organizer.id === user?.id

  if (!event) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Событие не найдено</p>
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
              {getStatusText(event.status)}
            </span>
            {event.isTraining && (
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                Тренировка
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Изображение */}
      {event.images.length > 0 && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <img 
            src={event.images[0]} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Основная информация */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация о событии</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Дата и время</p>
              <p className="font-medium">{formatDate(event.startDate)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Место проведения</p>
              <p className="font-medium">{event.location}</p>
              {event.address && (
                <p className="text-sm text-gray-500">{event.address}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Участники</p>
              <p className="font-medium">
                {event.currentParticipants}
                {event.maxParticipants && ` / ${event.maxParticipants}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Стоимость</p>
              <p className="font-medium">
                {event.isFree ? 'Бесплатно' : `${event.price} ${event.currency}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Информация о тренировке */}
      {event.isTraining && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Параметры тренировки
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Вид спорта</p>
                <p className="font-medium">{event.sportType}</p>
              </div>
            </div>

            {event.difficulty && (
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Сложность</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(event.difficulty)}`}>
                    {getDifficultyText(event.difficulty)}
                  </span>
                </div>
              </div>
            )}

            {event.distance && (
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Дистанция</p>
                  <p className="font-medium">{event.distance} км</p>
                </div>
              </div>
            )}

            {event.pace && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Темп</p>
                  <p className="font-medium">{event.pace}/км</p>
                </div>
              </div>
            )}

            {event.duration && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Продолжительность</p>
                  <p className="font-medium">{event.duration} мин</p>
                </div>
              </div>
            )}
          </div>

          {event.equipment && event.equipment.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Необходимое снаряжение:</p>
              <div className="flex flex-wrap gap-2">
                {event.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.notes && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-1">Дополнительные заметки:</p>
              <p className="text-sm text-purple-700">{event.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Описание */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Описание</h2>
        <p className="text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      {/* Организатор */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Организатор</h2>
        <div className="flex items-center space-x-3">
          {event.organizer.avatar ? (
            <img 
              src={event.organizer.avatar} 
              alt={event.organizer.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{event.organizer.name}</p>
            <p className="text-sm text-gray-600">{event.organizer.type}</p>
          </div>
        </div>
      </div>

      {/* Теги */}
      {event.tags.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Категории</h2>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="space-y-4">
        {isOrganizer ? (
          <div className="flex space-x-4">
            <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit className="w-5 h-5" />
              <span>Редактировать</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Trash2 className="w-5 h-5" />
              <span>Удалить</span>
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            {isJoined ? (
              <button
                onClick={handleLeaveEvent}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Отмена...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Отменить участие</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleJoinEvent}
                disabled={isLoading || (event.maxParticipants ? event.currentParticipants >= event.maxParticipants : false)}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Присоединение...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Присоединиться</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {event.maxParticipants && event.currentParticipants >= event.maxParticipants && !isJoined && (
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">Мест больше нет</p>
            <p className="text-sm text-yellow-600">Это событие полностью заполнено</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetailPage
