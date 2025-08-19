import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react'
import { Event, User } from '../types'
import { useTelegram } from './useTelegram'

interface EventsContextValue {
  events: Event[]
  addEvent: (event: Event) => void
  updateEvent: (eventId: number, updates: Partial<Event>) => void
  deleteEvent: (eventId: number) => void
  joinEvent: (eventId: number, participant: User) => void
  leaveEvent: (eventId: number, participantTelegramId: number) => void
  getEventById: (id: number) => Event | undefined
  myJoinedEventsCount: number
  myCreatedEventsCount: number
  myClubs: any[]
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined)

const STORAGE_KEY = 'younggo_events'

function loadEventsFromStorage(): Event[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Преобразуем строки дат обратно в объекты Date
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

function saveEventsToStorage(events: Event[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error('Error saving events to storage:', error)
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
      updatedAt: new Date()
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
      difficulty: 'intermediate'
    }
  ]
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(loadEventsFromStorage)
  const { user } = useTelegram()

  // Сохраняем события в localStorage при каждом изменении
  useEffect(() => {
    saveEventsToStorage(events)
  }, [events])

  const addEvent = (event: Event) => {
    setEvents(prev => [event, ...prev])
  }

  const updateEvent = (eventId: number, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updates, updatedAt: new Date() } : e))
  }

  const deleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }

  const joinEvent = (eventId: number, participant: User) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e
      const already = e.participants.some(p => p.telegramId === participant.telegramId)
      const participants = already ? e.participants : [...e.participants, participant]
      return {
        ...e,
        participants,
        currentParticipants: participants.length
      }
    }))
  }

  const leaveEvent = (eventId: number, participantTelegramId: number) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e
      const participants = e.participants.filter(p => p.telegramId !== participantTelegramId)
      return {
        ...e,
        participants,
        currentParticipants: participants.length
      }
    }))
  }

  const getEventById = (id: number) => events.find(e => e.id === id)

  // Вычисляем статистику для текущего пользователя
  const myJoinedEventsCount = useMemo(() => {
    if (!user) return 0
    return events.filter(e => e.participants.some(p => p.telegramId === user.id)).length
  }, [events, user])

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
    myClubs
  }), [events, myJoinedEventsCount, myCreatedEventsCount, myClubs])

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


