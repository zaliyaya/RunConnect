import React from 'react'
import { useEvents } from '../hooks/useEvents'
import { useTelegram } from '../hooks/useTelegram'

const SharedStorageTest: React.FC = () => {
  const { events, isLoading } = useEvents()
  const { user } = useTelegram()

  if (!user) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Shared Storage Status</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Events: {events.length}</div>
        <div>User: {user.first_name}</div>
        <div className="text-green-600 font-medium">
          ✅ Shared storage active
        </div>
      </div>
    </div>
  )
}

export default SharedStorageTest
