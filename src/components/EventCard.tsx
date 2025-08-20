import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, DollarSign, Activity, Target, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Event } from '../types'
import { useTelegram } from '../hooks/useTelegram'
import { useEvents } from '../hooks/useEvents'

interface EventCardProps {
  event: Event
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate()
  const { user } = useTelegram()
  const { getEventById } = useEvents()

  // Получаем актуальную информацию о событии с участниками
  const eventWithParticipants = getEventById(event.id)
  const isJoined = !!user && eventWithParticipants?.participants.some(p => p.telegramId === user.id)

  const handleClick = () => {
    navigate(`/events/${event.id}`)
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM, HH:mm', { locale: ru })
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

  return (
    <div 
      className="card cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={handleClick}
    >
      {/* Индикатор участия */}
      {isJoined && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-500 text-white rounded-full p-1">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Изображение события */}
      {event.images.length > 0 && (
        <div className="mb-3">
          <img 
            src={event.images[0]} 
            alt={event.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Статус события */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
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

      {/* Заголовок */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {event.title}
      </h3>

      {/* Основная информация */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            {eventWithParticipants?.currentParticipants || event.currentParticipants}
            {event.maxParticipants && ` / ${event.maxParticipants}`} участников
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{event.isFree ? 'Бесплатно' : `${event.price} ${event.currency}`}</span>
        </div>
      </div>

      {/* Информация о тренировке */}
      {event.isTraining && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Параметры тренировки</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {event.sportType && (
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-purple-500" />
                <span className="text-gray-700">{event.sportType}</span>
              </div>
            )}
            
            {event.difficulty && (
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3 text-purple-500" />
                <span className={`px-1 py-0.5 rounded text-xs ${getDifficultyColor(event.difficulty)}`}>
                  {getDifficultyText(event.difficulty)}
                </span>
              </div>
            )}
            
            {event.distance && (
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3 text-purple-500" />
                <span className="text-gray-700">{event.distance} км</span>
              </div>
            )}
            
            {event.pace && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-purple-500" />
                <span className="text-gray-700">{event.pace}/км</span>
              </div>
            )}
            
            {event.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-purple-500" />
                <span className="text-gray-700">{event.duration} мин</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Теги */}
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Организатор */}
      <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
        {event.organizer.avatar ? (
          <img 
            src={event.organizer.avatar} 
            alt={event.organizer.name}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
        )}
        <span className="text-sm text-gray-600">{event.organizer.name}</span>
      </div>
    </div>
  )
}

export default EventCard 