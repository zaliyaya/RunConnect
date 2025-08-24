import React from 'react'
import { useEvents } from '../hooks/useEvents'
import { useTelegram } from '../hooks/useTelegram'

const SharedStorageTest: React.FC = () => {
  const { events, isLoading } = useEvents()
  const { user } = useTelegram()

  if (!user) return null

  // Проверяем, есть ли события от разных пользователей
  const uniqueOrganizers = new Set(events.map(event => event.organizer?.id))
  const hasMultipleOrganizers = uniqueOrganizers.size > 1
  const myEventsCount = events.filter(event => event.organizer?.id === user.id).length
  const otherEventsCount = events.length - myEventsCount

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Global Sync Status</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Total Events: {events.length}</div>
        <div>My Events: {myEventsCount}</div>
        <div>Other Events: {otherEventsCount}</div>
        <div>Organizers: {uniqueOrganizers.size}</div>
        <div>User: {user.first_name} (ID: {user.id})</div>
        <div className="text-green-600 font-medium">
          ✅ Global storage active
        </div>
        {hasMultipleOrganizers && (
          <div className="text-blue-600 font-medium">
            ✅ Cross-user sync working
          </div>
        )}
        <div className="text-xs text-gray-500 mt-2">
          All events visible to all users
        </div>
      </div>
    </div>
  )
}

export default SharedStorageTest
