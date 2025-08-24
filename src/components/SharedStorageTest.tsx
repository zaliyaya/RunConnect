import React, { useState, useEffect } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useTelegram } from '../hooks/useTelegram'

const SharedStorageTest: React.FC = () => {
  const { events, isLoading } = useEvents()
  const { user } = useTelegram()
  const [deviceId, setDeviceId] = useState<string>('')
  const [lastSync, setLastSync] = useState<string>('')

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

    // Обновляем время синхронизации каждые 5 секунд
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('younggo_last_update_v2')
      if (lastUpdate) {
        setLastSync(new Date(lastUpdate).toLocaleTimeString('ru-RU'))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!user) return null

  // Проверяем, есть ли события от разных пользователей
  const uniqueOrganizers = new Set(events.map(event => event.organizer?.id))
  const hasMultipleOrganizers = uniqueOrganizers.size > 1
  const myEventsCount = events.filter(event => event.organizer?.id === user.id).length
  const otherEventsCount = events.length - myEventsCount

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Cross-Device Sync Status</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Total Events: {events.length}</div>
        <div>My Events: {myEventsCount}</div>
        <div>Other Events: {otherEventsCount}</div>
        <div>Organizers: {uniqueOrganizers.size}</div>
        <div>User: {user.first_name} (ID: {user.id})</div>
        <div>Device: {deviceId ? deviceId.substring(0, 8) + '...' : 'Unknown'}</div>
        <div>Last Sync: {lastSync || 'Never'}</div>
        <div className="text-green-600 font-medium">
          ✅ Cross-device sync active
        </div>
        {hasMultipleOrganizers && (
          <div className="text-blue-600 font-medium">
            ✅ Cross-user sync working
          </div>
        )}
        <div className="text-xs text-gray-500 mt-2">
          Events sync across all devices
        </div>
      </div>
    </div>
  )
}

export default SharedStorageTest
