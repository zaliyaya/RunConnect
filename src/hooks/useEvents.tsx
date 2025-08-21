import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react'
import { Event, User } from '../types'
import { useTelegram } from './useTelegram'
import { loadSharedEvents, saveSharedEvents, setupEventSync } from '../services/sharedStorage'

interface EventsContextValue {
  events: Event[]
  addEvent: (event: Event) => Promise<void>
  updateEvent: (eventId: number, updates: Partial<Event>) => Promise<void>
  deleteEvent: (eventId: number) => Promise<void>
  joinEvent: (eventId: number, participant: User) => void
  leaveEvent: (eventId: number, participantTelegramId: number) => void
  getEventById: (id: number) => Event | undefined
  myJoinedEventsCount: number
  myCreatedEventsCount: number
  myClubs: any[]
  isLoading: boolean
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined)

const STORAGE_KEY = 'younggo_events_v2'
const PARTICIPANTS_STORAGE_KEY = 'younggo_participants_v2'
const SHARED_EVENTS_KEY = 'younggo_shared_events'

// Интерфейс для хранения участников отдельно
interface EventParticipants {
  eventId: number
  participants: User[]
}

async function loadEventsFromStorage(): Promise<Event[]> {
  try {
    // Загружаем события из общего хранилища
    const sharedEvents = await loadSharedEvents()
    if (sharedEvents.length > 0) {
      // Преобразуем строки дат обратно в объекты Date
      return sharedEvents.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : undefined,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }))
    }
    
    // Если общих событий нет, загружаем локальные
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : undefined,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }))
    }
  } catch (error) {
    console.error('Error loading events from storage:', error)
  }
  return seedEvents()
}

function loadParticipantsFromStorage(): EventParticipants[] {
  try {
    const stored = localStorage.getItem(PARTICIPANTS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading participants from storage:', error)
  }
  return []
}

async function saveEventsToStorage(events: Event[]): Promise<void> {
  try {
    // Сохраняем в общее хранилище для всех пользователей
    await saveSharedEvents(events)
    // Также сохраняем локально как резервную копию
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error('Error saving events to storage:', error)
  }
}

function saveParticipantsToStorage(participants: EventParticipants[]): void {
  try {
    localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participants))
  } catch (error) {
    console.error('Error saving participants to storage:', error)
  }
}

function seedEvents(): Event[] {
  return [
    {
      id: 1,
      title: 'Утренняя пробежка в парке Горького',
      description: 'Присоединяйтесь к нашей утренней пробежке! Подходит для всех уровней подготовки.',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      location: 'Парк Горького',
      city: 'Москва',
      address: 'ул. Крымский Вал, 9',
      maxParticipants: 50,
      currentParticipants: 23,
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
      createdAt: new Date(),
      updatedAt: new Date(),
      eventType: 'training'
    },
    {
      id: 2,
      title: 'Вечерняя тренировка по бегу',
      description: 'Интенсивная тренировка для опытных бегунов. Дистанция 10 км.',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      location: 'Лужники',
      city: 'Москва',
      address: 'Лужнецкая наб., 24',
      maxParticipants: 30,
      currentParticipants: 15,
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
      createdAt: new Date(),
      updatedAt: new Date(),
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

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [eventParticipants, setEventParticipants] = useState<EventParticipants[]>(loadParticipantsFromStorage)
  const { user } = useTelegram()
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем события при инициализации
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const loadedEvents = await loadEventsFromStorage()
        setEvents(loadedEvents)
      } catch (error) {
        console.error('Error loading events:', error)
        setEvents(seedEvents())
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [])

  // Сохраняем события в общее хранилище при каждом изменении
  useEffect(() => {
    if (!isLoading && events.length > 0) {
      saveEventsToStorage(events)
    }
  }, [events, isLoading])

  // Настраиваем синхронизацию событий в реальном времени
  useEffect(() => {
    if (!isLoading) {
      const cleanup = setupEventSync((sharedEvents) => {
        // Преобразуем строки дат обратно в объекты Date
        const parsedEvents = sharedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : undefined,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }))
        
        // Обновляем события только если они отличаются
        if (JSON.stringify(parsedEvents) !== JSON.stringify(events)) {
          setEvents(parsedEvents)
        }
      })
      
      return cleanup
    }
  }, [isLoading, events])

  // Сохраняем участников в localStorage при каждом изменении
  useEffect(() => {
    saveParticipantsToStorage(eventParticipants)
  }, [eventParticipants])

  // Функция для получения участников события
  const getEventParticipants = (eventId: number): User[] => {
    const eventParticipant = eventParticipants.find(ep => ep.eventId === eventId)
    return eventParticipant ? eventParticipant.participants : []
  }

  // Функция для обновления участников события
  const updateEventParticipants = (eventId: number, participants: User[]) => {
    setEventParticipants(prev => {
      const existing = prev.find(ep => ep.eventId === eventId)
      if (existing) {
        return prev.map(ep => ep.eventId === eventId ? { ...ep, participants } : ep)
      } else {
        return [...prev, { eventId, participants }]
      }
    })
  }

  const addEvent = async (event: Event) => {
    const newEvents = [event, ...events]
    setEvents(newEvents)
    await saveEventsToStorage(newEvents)
  }

  const updateEvent = async (eventId: number, updates: Partial<Event>) => {
    const updatedEvents = events.map(e => e.id === eventId ? { ...e, ...updates, updatedAt: new Date() } : e)
    setEvents(updatedEvents)
    await saveEventsToStorage(updatedEvents)
  }

  const deleteEvent = async (eventId: number) => {
    const filteredEvents = events.filter(e => e.id !== eventId)
    setEvents(filteredEvents)
    await saveEventsToStorage(filteredEvents)
    // Также удаляем участников события
    setEventParticipants(prev => prev.filter(ep => ep.eventId !== eventId))
  }

  const joinEvent = (eventId: number, participant: User) => {
    const currentParticipants = getEventParticipants(eventId)
    const already = currentParticipants.some(p => p.telegramId === participant.telegramId)
    
    if (!already) {
      const newParticipants = [...currentParticipants, participant]
      updateEventParticipants(eventId, newParticipants)
      
      // Обновляем счетчик участников в событии
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, currentParticipants: newParticipants.length }
          : e
      ))
    }
  }

  const leaveEvent = (eventId: number, participantTelegramId: number) => {
    const currentParticipants = getEventParticipants(eventId)
    const newParticipants = currentParticipants.filter(p => p.telegramId !== participantTelegramId)
    updateEventParticipants(eventId, newParticipants)
    
    // Обновляем счетчик участников в событии
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, currentParticipants: newParticipants.length }
        : e
    ))
  }

  const getEventById = (id: number) => {
    const event = events.find(e => e.id === id)
    if (event) {
      // Добавляем актуальных участников к событию
      const participants = getEventParticipants(id)
      return { ...event, participants }
    }
    return undefined
  }

  // Вычисляем статистику для текущего пользователя
  const myJoinedEventsCount = useMemo(() => {
    if (!user) return 0
    return eventParticipants.filter(ep => 
      ep.participants.some(p => p.telegramId === user.id)
    ).length
  }, [eventParticipants, user])

  const myCreatedEventsCount = useMemo(() => {
    if (!user) return 0
    return events.filter(e => e.organizer.type === 'user' && e.organizer.id === user.id).length
  }, [events, user])

  const myClubs = useMemo(() => {
    // Клубы больше не поддерживаются
    return []
  }, [])

  const value = useMemo<EventsContextValue>(() => ({
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    getEventById,
    myJoinedEventsCount,
    myCreatedEventsCount,
    myClubs,
    isLoading
  }), [events, myJoinedEventsCount, myCreatedEventsCount, myClubs, isLoading])

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents(): EventsContextValue {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}


