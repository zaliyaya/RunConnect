import React, { useState, useEffect } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useTelegram } from '../hooks/useTelegram'
import { forceSync } from '../services/sharedStorage'

const DeviceSyncTestPage: React.FC = () => {
  const { events, addEvent, isLoading } = useEvents()
  const { user } = useTelegram()
  const [testEventTitle, setTestEventTitle] = useState('')
  const [deviceId, setDeviceId] = useState<string>('')
  const [lastSync, setLastSync] = useState<string>('')
  const [syncStatus, setSyncStatus] = useState<string>('')

  useEffect(() => {
    // Получаем ID устройства
    const storedDeviceId = localStorage.getItem('younggo_device_id')
    if (storedDeviceId) {
      setDeviceId(storedDeviceId)
    }

    // Получаем время последней синхронизации
    const lastUpdate = localStorage.getItem('younggo_last_update_v2')
    if (lastUpdate) {
      setLastSync(new Date(lastUpdate).toLocaleTimeString('ru-RU'))
    }

    // Обновляем время синхронизации каждые 3 секунды
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('younggo_last_update_v2')
      if (lastUpdate) {
        setLastSync(new Date(lastUpdate).toLocaleTimeString('ru-RU'))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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
      description: `Тестовое событие от ${user.first_name} на устройстве ${deviceId.substring(0, 8)}`,
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
      tags: ['тест', 'устройство'],
      images: [],
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date(),
      eventType: 'training'
    }

    await addEvent(testEvent)
    setTestEventTitle('')
    setSyncStatus('Событие создано и синхронизируется...')
  }

  const handleForceSync = async () => {
    setSyncStatus('Принудительная синхронизация...')
    await forceSync()
    setSyncStatus('Синхронизация завершена')
    setTimeout(() => setSyncStatus(''), 3000)
  }

  const myEvents = events.filter(event => event.organizer?.id === user.id)
  const otherEvents = events.filter(event => event.organizer?.id !== user.id)

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Тест синхронизации между устройствами</h1>
        <p className="text-gray-600">Проверка синхронизации событий между ноутбуком и смартфоном</p>
      </div>

      {/* Информация об устройстве */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Информация об устройстве</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">ID устройства:</span>
            <span className="ml-2 text-blue-600">{deviceId}</span>
          </div>
          <div>
            <span className="font-medium">Пользователь:</span>
            <span className="ml-2 text-green-600">{user.first_name} (ID: {user.id})</span>
          </div>
          <div>
            <span className="font-medium">Последняя синхронизация:</span>
            <span className="ml-2 text-gray-600">{lastSync || 'Никогда'}</span>
          </div>
          <div>
            <span className="font-medium">Статус:</span>
            <span className="ml-2 text-green-600">Активен</span>
          </div>
        </div>
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
          Это событие будет видно на всех ваших устройствах
        </p>
        {syncStatus && (
          <p className="text-sm text-blue-600 mt-2">{syncStatus}</p>
        )}
      </div>

      {/* Принудительная синхронизация */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Принудительная синхронизация</h2>
        <button
          onClick={handleForceSync}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Синхронизировать сейчас
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Принудительно обновить данные со всех устройств
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
            <span className="font-medium">Мои события:</span>
            <span className="ml-2 text-green-600">{myEvents.length}</span>
          </div>
          <div>
            <span className="font-medium">События других:</span>
            <span className="ml-2 text-orange-600">{otherEvents.length}</span>
          </div>
          <div>
            <span className="font-medium">Загрузка:</span>
            <span className="ml-2 text-gray-600">{isLoading ? 'Да' : 'Нет'}</span>
          </div>
        </div>
      </div>

      {/* Мои события */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Мои события (должны быть видны на всех устройствах)</h2>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Загрузка...</p>
          </div>
        ) : myEvents.length === 0 ? (
          <p className="text-gray-600 text-center py-4">У вас пока нет событий</p>
        ) : (
          <div className="space-y-2">
            {myEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-600">
                    {event.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.startDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">
                    {event.currentParticipants}/{event.maxParticipants || '∞'}
                  </div>
                  <div className="text-xs text-green-600">(Ваше)</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Инструкции */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Как тестировать синхронизацию между устройствами:</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>1. Откройте приложение на ноутбуке и смартфоне</p>
          <p>2. Войдите под одним и тем же пользователем на обоих устройствах</p>
          <p>3. Создайте событие на ноутбуке</p>
          <p>4. Проверьте, что событие появилось на смартфоне (подождите 3-5 секунд)</p>
          <p>5. Создайте событие на смартфоне</p>
          <p>6. Проверьте, что событие появилось на ноутбуке</p>
        </div>
      </div>
    </div>
  )
}

export default DeviceSyncTestPage
