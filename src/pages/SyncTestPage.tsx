import React, { useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useTelegram } from '../hooks/useTelegram'

const SyncTestPage: React.FC = () => {
  const { events, addEvent, isLoading } = useEvents()
  const { user } = useTelegram()
  const [testEventTitle, setTestEventTitle] = useState('')

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Пользователь не найден</p>
      </div>
    )
  }

  const createTestEvent = async () => {
    if (!testEventTitle.trim()) return

    const testEvent = {
      id: Date.now() + Math.random(),
      title: testEventTitle,
      description: `Тестовое событие от ${user.first_name}`,
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      location: 'Тестовая локация',
      city: 'Москва',
      address: 'Тестовый адрес',
      maxParticipants: 10,
      currentParticipants: 0,
      price: 0,
      currency: 'RUB',
      isFree: true,
      registrationRequired: true,
      organizer: {
        id: user.id,
        type: 'user',
        name: user.first_name || 'Пользователь',
        avatar: user.photo_url
      },
      participants: [],
      tags: ['тест'],
      images: [],
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date(),
      eventType: 'training'
    }

    await addEvent(testEvent)
    setTestEventTitle('')
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Тест синхронизации</h1>
        <p className="text-gray-600">Проверка синхронизации событий между пользователями</p>
      </div>

      {/* Создание тестового события */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Создать тестовое событие</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={testEventTitle}
            onChange={(e) => setTestEventTitle(e.target.value)}
            placeholder="Название тестового события"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={createTestEvent}
            disabled={!testEventTitle.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Создать
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Это событие будет видно всем пользователям приложения
        </p>
      </div>

      {/* Статистика */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Всего событий:</span>
            <span className="ml-2 text-blue-600">{events.length}</span>
          </div>
          <div>
            <span className="font-medium">Текущий пользователь:</span>
            <span className="ml-2 text-green-600">{user.first_name} (ID: {user.id})</span>
          </div>
        </div>
      </div>

      {/* Список событий */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Все события</h2>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Загрузка...</p>
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-600 text-center py-4">Событий пока нет</p>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-600">
                    Создатель: {event.organizer?.name} (ID: {event.organizer?.id})
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.startDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">
                    {event.currentParticipants}/{event.maxParticipants || '∞'}
                  </div>
                  {event.organizer?.id === user.id && (
                    <div className="text-xs text-green-600">(Ваше)</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Инструкции */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Как тестировать:</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>1. Откройте приложение в двух разных браузерах</p>
          <p>2. Войдите под разными пользователями</p>
          <p>3. Создайте тестовые события в каждом браузере</p>
          <p>4. Убедитесь, что события видны в обоих браузерах</p>
        </div>
      </div>
    </div>
  )
}

export default SyncTestPage
