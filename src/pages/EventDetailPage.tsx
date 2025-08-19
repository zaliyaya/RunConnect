import React from 'react'
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
  User as UserIcon,
  CheckCircle,
  XCircle,
  Edit,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTelegram } from '../hooks/useTelegram'
import { useEvents } from '../hooks/useEvents'
import { Event, User } from '../types'

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useTelegram()
  const { getEventById, joinEvent, leaveEvent } = useEvents()

  const event: Event | undefined = id ? getEventById(parseInt(id)) : undefined

  const formatDate = (date: Date) => format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: ru })

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

  if (!event) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Событие не найдено</p>
      </div>
    )
  }

  const isOrganizer = user && event.organizer.type === 'user' && event.organizer.id === user.id
  const isJoined = !!user && event.participants.some(p => p.telegramId === user.id)

  const handleJoin = async () => {
    if (!user) return
    const participant: User = {
      id: user.id,
      telegramId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: undefined,
      phone: undefined,
      avatar: user.photo_url,
      city: undefined,
      bio: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      
      events: [],
      isTrainer: false,
      isOrganizer: false,
    }
    joinEvent(event.id, participant)
  }

  const handleLeave = async () => {
    if (!user) return
    leaveEvent(event.id, user.id)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>{getStatusText(event.status)}</span>
            {event.isTraining && (
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Тренировка</span>
            )}
          </div>
        </div>
      </div>

      {/* Image */}
      {event.images.length > 0 && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main info */}
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
              {event.address && <p className="text-sm text-gray-500">{event.address}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Участники</p>
              <p className="font-medium">{event.currentParticipants}{event.maxParticipants && ` / ${event.maxParticipants}`}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Стоимость</p>
              <p className="font-medium">{event.isFree ? 'Бесплатно' : `${event.price} ${event.currency}`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Training section */}
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
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(event.difficulty)}`}>{getDifficultyText(event.difficulty)}</span>
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
                  <span key={index} className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Описание</h2>
        <p className="text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      {/* Organizer */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Организатор</h2>
        <div className="flex items-center space-x-3">
          {event.organizer.avatar ? (
            <img src={event.organizer.avatar} alt={event.organizer.name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{event.organizer.name}</p>
            <p className="text-sm text-gray-600">Организатор</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {isOrganizer ? (
          <div className="flex space-x-4">
            <button
              disabled={event.currentParticipants > 0}
              onClick={() => navigate(`/events/${event.id}/edit`)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors ${event.currentParticipants > 0 ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
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
              <button onClick={handleLeave} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <XCircle className="w-5 h-5" />
                <span>Отменить участие</span>
              </button>
            ) : (
              <button onClick={handleJoin} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" disabled={!!event.maxParticipants && event.currentParticipants >= event.maxParticipants}>
                <CheckCircle className="w-5 h-5" />
                <span>Присоединиться</span>
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
