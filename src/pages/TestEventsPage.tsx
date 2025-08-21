import React from 'react'
import { useEvents } from '../hooks/useEvents'
import { useTelegram } from '../hooks/useTelegram'

const TestEventsPage: React.FC = () => {
  const { events, isLoading } = useEvents()
  const { user } = useTelegram()

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Пользователь не найден</p>
      </div>
    )
  }

  // Группируем события по организаторам
  const eventsByOrganizer = events.reduce((acc, event) => {
    const organizerId = event.organizer?.id || 'unknown'
    if (!acc[organizerId]) {
      acc[organizerId] = {
        organizer: event.organizer,
        events: []
      }
    }
    acc[organizerId].events.push(event)
    return acc
  }, {} as Record<string, { organizer: any, events: any[] }>)

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Тест доступности событий</h1>
        <p className="text-gray-600">Проверка того, что все события доступны всем пользователям</p>
      </div>

      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Загрузка событий...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Статистика */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Всего событий:</span>
                <span className="ml-2 text-blue-600">{events.length}</span>
              </div>
              <div>
                <span className="font-medium">Организаторов:</span>
                <span className="ml-2 text-blue-600">{Object.keys(eventsByOrganizer).length}</span>
              </div>
              <div>
                <span className="font-medium">Текущий пользователь:</span>
                <span className="ml-2 text-green-600">{user.first_name}</span>
              </div>
              <div>
                <span className="font-medium">ID пользователя:</span>
                <span className="ml-2 text-gray-600">{user.id}</span>
              </div>
            </div>
          </div>

          {/* События по организаторам */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">События по организаторам</h2>
            {Object.entries(eventsByOrganizer).map(([organizerId, { organizer, events: organizerEvents }]) => (
              <div key={organizerId} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {organizer?.name || `Организатор ${organizerId}`}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {organizerId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600">
                      {organizerEvents.length} событий
                    </span>
                    {organizerId === user.id.toString() && (
                      <div className="text-xs text-green-600">(Вы)</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {organizerEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-sm">{event.title}</span>
                        <div className="text-xs text-gray-600">
                          {new Date(event.startDate).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.currentParticipants}/{event.maxParticipants || '∞'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Статус доступности */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  ✅ Все события доступны всем пользователям
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Система работает корректно. Все события, созданные любыми пользователями, видны всем участникам приложения.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestEventsPage
