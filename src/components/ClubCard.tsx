import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MapPin, Lock, Calendar } from 'lucide-react'
import { Club } from '../types'

interface ClubCardProps {
  club: Club
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/clubs/${club.id}`)
  }

  return (
    <div 
      className="card cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Аватар клуба */}
        <div className="flex-shrink-0">
          {club.avatar ? (
            <img 
              src={club.avatar} 
              alt={club.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          )}
        </div>

        {/* Информация о клубе */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {club.name}
            </h3>
            {club.isPrivate && (
              <Lock className="w-4 h-4 text-gray-500" />
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {club.description}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{club.city}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{club.membersCount} участников</span>
            </div>

            {club.events.length > 0 && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{club.events.length} событий</span>
              </div>
            )}
          </div>

          {/* Теги */}
          {club.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {club.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {club.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{club.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClubCard 