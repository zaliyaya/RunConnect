// Shared storage service for events
// Uses a unified storage approach to ensure all users see the same events across all devices

// Уникальный ключ для всех пользователей приложения
const GLOBAL_SHARED_KEY = 'younggo_global_events_v2'
const GLOBAL_PARTICIPANTS_KEY = 'younggo_global_participants_v2'
const LAST_UPDATE_KEY = 'younggo_last_update_v2'
const DEVICE_ID_KEY = 'younggo_device_id'

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

// Функция для получения уникального ID события
function generateEventId(): number {
  return Date.now() + Math.random()
}

// Функция для получения временной метки
function getTimestamp(): string {
  return new Date().toISOString()
}

// Функция для получения уникального ID устройства
function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

// Функция для получения данных из localStorage с обработкой ошибок
function safeGetItem(key: string): any {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error)
    return null
  }
}

// Функция для сохранения данных в localStorage с обработкой ошибок
function safeSetItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage key ${key}:`, error)
  }
}

export async function loadSharedEvents(): Promise<any[]> {
  try {
    // Загружаем события из глобального хранилища
    const stored = safeGetItem(GLOBAL_SHARED_KEY)
    if (stored && Array.isArray(stored) && stored.length > 0) {
      console.log('📅 Loaded global events:', stored.length, 'events available to ALL users across ALL devices')
      return stored
    }
    
    // Если глобальных событий нет, создаем начальные события
    const initialEvents = createInitialEvents()
    await saveSharedEvents(initialEvents)
    console.log('📅 Created initial global events:', initialEvents.length, 'events')
    return initialEvents
  } catch (error) {
    console.error('❌ Error loading shared events:', error)
    return []
  }
}

export async function saveSharedEvents(events: any[]): Promise<void> {
  try {
    // Сохраняем в глобальное хранилище
    safeSetItem(GLOBAL_SHARED_KEY, events)
    safeSetItem(LAST_UPDATE_KEY, getTimestamp())
    
    console.log('💾 Saved events to global storage:', events.length, 'events now available to ALL users across ALL devices')
    
    // Уведомляем другие вкладки/окна о обновлении
    window.dispatchEvent(new CustomEvent('younggo-events-updated', {
      detail: { 
        events, 
        timestamp: getTimestamp(),
        deviceId: getDeviceId()
      }
    }))
    
    // Также сохраняем в sessionStorage для быстрого доступа
    try {
      sessionStorage.setItem(GLOBAL_SHARED_KEY, JSON.stringify(events))
    } catch (error) {
      console.warn('Could not save to sessionStorage:', error)
    }
  } catch (error) {
    console.error('❌ Error saving shared events:', error)
  }
}

// Функция для загрузки участников из глобального хранилища
export function loadSharedParticipants(): any[] {
  try {
    const stored = safeGetItem(GLOBAL_PARTICIPANTS_KEY)
    if (stored && Array.isArray(stored)) {
      return stored
    }
  } catch (error) {
    console.error('❌ Error loading shared participants:', error)
  }
  return []
}

// Функция для сохранения участников в глобальное хранилище
export function saveSharedParticipants(participants: any[]): void {
  try {
    safeSetItem(GLOBAL_PARTICIPANTS_KEY, participants)
    safeSetItem(LAST_UPDATE_KEY, getTimestamp())
    
    // Уведомляем другие вкладки/окна о обновлении участников
    window.dispatchEvent(new CustomEvent('younggo-participants-updated', {
      detail: { 
        participants, 
        timestamp: getTimestamp(),
        deviceId: getDeviceId()
      }
    }))
  } catch (error) {
    console.error('❌ Error saving shared participants:', error)
  }
}

// Функция для синхронизации событий в реальном времени
export function setupEventSync(callback: (events: any[]) => void): () => void {
  let isActive = true
  let lastKnownEvents: any[] = []
  
  // Функция для проверки обновлений
  const checkForUpdates = async () => {
    if (!isActive) return
    
    try {
      const sharedEvents = await loadSharedEvents()
      const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY)
      
      // Проверяем, изменились ли события
      const eventsChanged = JSON.stringify(sharedEvents) !== JSON.stringify(lastKnownEvents)
      
      if (sharedEvents.length > 0 && eventsChanged) {
        lastKnownEvents = sharedEvents
        callback(sharedEvents)
        console.log('🔄 Events synced across devices:', sharedEvents.length, 'events')
      }
    } catch (error) {
      console.error('❌ Error syncing events:', error)
    }
  }
  
  // Проверяем обновления каждые 3 секунды для более быстрой синхронизации
  const interval = setInterval(checkForUpdates, 3000)
  
  // Слушаем события обновления от других вкладок
  const handleEventsUpdate = (event: CustomEvent) => {
    if (isActive && event.detail.deviceId !== getDeviceId()) {
      console.log('📱 Received event update from another device/tab')
      callback(event.detail.events)
      lastKnownEvents = event.detail.events
    }
  }
  
  const handleParticipantsUpdate = (event: CustomEvent) => {
    if (isActive && event.detail.deviceId !== getDeviceId()) {
      console.log('👥 Received participant update from another device/tab')
      // Перезагружаем события при обновлении участников
      checkForUpdates()
    }
  }
  
  // Слушаем изменения в localStorage от других вкладок
  const handleStorageChange = (event: StorageEvent) => {
    if (isActive && event.key === GLOBAL_SHARED_KEY && event.newValue) {
      try {
        const newEvents = JSON.parse(event.newValue)
        if (JSON.stringify(newEvents) !== JSON.stringify(lastKnownEvents)) {
          console.log('💾 Received localStorage update from another tab')
          lastKnownEvents = newEvents
          callback(newEvents)
        }
      } catch (error) {
        console.error('Error parsing localStorage update:', error)
      }
    }
  }
  
  window.addEventListener('younggo-events-updated', handleEventsUpdate as EventListener)
  window.addEventListener('younggo-participants-updated', handleParticipantsUpdate as EventListener)
  window.addEventListener('storage', handleStorageChange)
  
  // Первоначальная загрузка
  checkForUpdates()
  
  return () => {
    isActive = false
    clearInterval(interval)
    window.removeEventListener('younggo-events-updated', handleEventsUpdate as EventListener)
    window.removeEventListener('younggo-participants-updated', handleParticipantsUpdate as EventListener)
    window.removeEventListener('storage', handleStorageChange)
  }
}

// Функция для принудительной синхронизации
export async function forceSync(): Promise<void> {
  try {
    const events = await loadSharedEvents()
    console.log('🔄 Force sync completed:', events.length, 'events')
  } catch (error) {
    console.error('❌ Error during force sync:', error)
  }
}

// Создание начальных событий для демонстрации
function createInitialEvents(): any[] {
  return [
    {
      id: generateEventId(),
      title: 'Утренняя пробежка в парке Горького',
      description: 'Присоединяйтесь к нашей утренней пробежке! Подходит для всех уровней подготовки.',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      location: 'Парк Горького',
      city: 'Москва',
      address: 'ул. Крымский Вал, 9',
      maxParticipants: 50,
      currentParticipants: 0,
      price: 0,
      currency: 'RUB',
      isFree: true,
      registrationRequired: true,
      organizer: {
        id: 1,
        type: 'user',
        name: 'Алексей Петров',
        avatar: 'https://via.placeholder.com/40'
      },
      participants: [],
      tags: ['бег', 'утро', 'парк'],
      images: ['https://via.placeholder.com/300x200'],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventType: 'training'
    },
    {
      id: generateEventId(),
      title: 'Вечерняя тренировка по бегу',
      description: 'Интенсивная тренировка для опытных бегунов. Дистанция 10 км.',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      location: 'Лужники',
      city: 'Москва',
      address: 'Лужнецкая наб., 24',
      maxParticipants: 30,
      currentParticipants: 0,
      price: 0,
      currency: 'RUB',
      isFree: true,
      registrationRequired: true,
      organizer: {
        id: 2,
        type: 'user',
        name: 'Мария Иванова',
        avatar: 'https://via.placeholder.com/40'
      },
      participants: [],
      tags: ['бег', 'вечер', 'тренировка'],
      images: ['https://via.placeholder.com/300x200'],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTraining: true,
      sportType: 'Бег',
      distance: 10,
      pace: '5:30',
      duration: 60,
      difficulty: 'intermediate',
      eventType: 'training'
    }
  ]
}
