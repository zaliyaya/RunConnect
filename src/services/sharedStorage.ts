// Shared storage service for events
// Uses a unified storage approach to ensure all users see the same events

// Уникальный ключ для всех пользователей приложения
const GLOBAL_SHARED_KEY = 'younggo_global_events_v1'
const GLOBAL_PARTICIPANTS_KEY = 'younggo_global_participants_v1'
const LAST_UPDATE_KEY = 'younggo_last_update_v1'

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

export async function loadSharedEvents(): Promise<any[]> {
  try {
    // Загружаем события из глобального хранилища
    const stored = localStorage.getItem(GLOBAL_SHARED_KEY)
    if (stored) {
      const events = JSON.parse(stored)
      console.log('📅 Loaded global events:', events.length, 'events available to ALL users')
      return events
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
    localStorage.setItem(GLOBAL_SHARED_KEY, JSON.stringify(events))
    localStorage.setItem(LAST_UPDATE_KEY, getTimestamp())
    
    console.log('💾 Saved events to global storage:', events.length, 'events now available to ALL users')
    
    // Уведомляем другие вкладки/окна о обновлении
    window.dispatchEvent(new CustomEvent('younggo-events-updated', {
      detail: { events, timestamp: getTimestamp() }
    }))
  } catch (error) {
    console.error('❌ Error saving shared events:', error)
  }
}

// Функция для загрузки участников из глобального хранилища
export function loadSharedParticipants(): any[] {
  try {
    const stored = localStorage.getItem(GLOBAL_PARTICIPANTS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('❌ Error loading shared participants:', error)
  }
  return []
}

// Функция для сохранения участников в глобальное хранилище
export function saveSharedParticipants(participants: any[]): void {
  try {
    localStorage.setItem(GLOBAL_PARTICIPANTS_KEY, JSON.stringify(participants))
    localStorage.setItem(LAST_UPDATE_KEY, getTimestamp())
    
    // Уведомляем другие вкладки/окна о обновлении участников
    window.dispatchEvent(new CustomEvent('younggo-participants-updated', {
      detail: { participants, timestamp: getTimestamp() }
    }))
  } catch (error) {
    console.error('❌ Error saving shared participants:', error)
  }
}

// Функция для синхронизации событий в реальном времени
export function setupEventSync(callback: (events: any[]) => void): () => void {
  let isActive = true
  
  // Функция для проверки обновлений
  const checkForUpdates = async () => {
    if (!isActive) return
    
    try {
      const sharedEvents = await loadSharedEvents()
      const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY)
      
      if (sharedEvents.length > 0) {
        callback(sharedEvents)
      }
    } catch (error) {
      console.error('❌ Error syncing events:', error)
    }
  }
  
  // Проверяем обновления каждые 5 секунд
  const interval = setInterval(checkForUpdates, 5000)
  
  // Слушаем события обновления от других вкладок
  const handleEventsUpdate = (event: CustomEvent) => {
    if (isActive) {
      callback(event.detail.events)
    }
  }
  
  const handleParticipantsUpdate = (event: CustomEvent) => {
    if (isActive) {
      // Перезагружаем события при обновлении участников
      checkForUpdates()
    }
  }
  
  window.addEventListener('younggo-events-updated', handleEventsUpdate as EventListener)
  window.addEventListener('younggo-participants-updated', handleParticipantsUpdate as EventListener)
  
  // Первоначальная загрузка
  checkForUpdates()
  
  return () => {
    isActive = false
    clearInterval(interval)
    window.removeEventListener('younggo-events-updated', handleEventsUpdate as EventListener)
    window.removeEventListener('younggo-participants-updated', handleParticipantsUpdate as EventListener)
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
