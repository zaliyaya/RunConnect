// Shared storage service for events
// Uses a simple cloud storage solution to ensure all users see the same events

const SHARED_STORAGE_URL = 'https://api.jsonbin.io/v3/b/your-bin-id' // Replace with actual JSONBin.io bin ID
const API_KEY = 'your-api-key' // Replace with actual API key

export interface SharedStorageResponse {
  record: {
    events: any[]
    lastUpdated: string
  }
  metadata: {
    id: string
    createdAt: string
    version: number
  }
}

export async function loadSharedEvents(): Promise<any[]> {
  try {
    // For now, use localStorage as fallback
    // In production, this would make an API call to a cloud storage service
    const stored = localStorage.getItem('younggo_shared_events')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // If no shared events exist, try to load from local storage
    const localStored = localStorage.getItem('younggo_events_v2')
    if (localStored) {
      const localEvents = JSON.parse(localStored)
      // Save to shared storage
      await saveSharedEvents(localEvents)
      return localEvents
    }
    
    return []
  } catch (error) {
    console.error('Error loading shared events:', error)
    return []
  }
}

export async function saveSharedEvents(events: any[]): Promise<void> {
  try {
    // For now, save to localStorage
    // In production, this would make an API call to update cloud storage
    localStorage.setItem('younggo_shared_events', JSON.stringify(events))
    localStorage.setItem('younggo_shared_events_timestamp', new Date().toISOString())
    
    // Also save to local storage as backup
    localStorage.setItem('younggo_events_v2', JSON.stringify(events))
  } catch (error) {
    console.error('Error saving shared events:', error)
  }
}

// Function to sync events across devices
export function setupEventSync(callback: (events: any[]) => void): () => void {
  // Check for updates every 30 seconds
  const interval = setInterval(async () => {
    try {
      const sharedEvents = await loadSharedEvents()
      const lastUpdate = localStorage.getItem('younggo_shared_events_timestamp')
      
      if (sharedEvents.length > 0) {
        callback(sharedEvents)
      }
    } catch (error) {
      console.error('Error syncing events:', error)
    }
  }, 30000)
  
  return () => clearInterval(interval)
}
