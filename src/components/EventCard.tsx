import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Event } from '../types'

interface EventCardProps {
  event: Event
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate()

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

  return (
    <div 
      className="card cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
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
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
          {getStatusText(event.status)}
        </span>
        
        {event.isFree ? (
          <span className="text-green-600 text-sm font-medium">Бесплатно</span>
        ) : (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>{event.price} {event.currency}</span>
          </div>
        )}
      </div>

      {/* Заголовок и описание */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {event.title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {event.description}
      </p>

      {/* Информация о событии */}
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}, {event.city}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>
            {event.currentParticipants}
            {event.maxParticipants && ` / ${event.maxParticipants}`} участников
          </span>
        </div>
      </div>

      {/* Организатор */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {event.organizer.avatar ? (
            <img 
              src={event.organizer.avatar} 
              alt={event.organizer.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          )}
          <span className="text-sm text-gray-600">{event.organizer.name}</span>
        </div>
      </div>

      {/* Теги */}
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default EventCard 