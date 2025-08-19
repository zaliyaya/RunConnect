import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Event, User } from '../types'

interface EventsContextValue {
  events: Event[]
  addEvent: (event: Event) => void
  updateEvent: (eventId: number, updates: Partial<Event>) => void
  deleteEvent: (eventId: number) => void
  joinEvent: (eventId: number, participant: User) => void
  leaveEvent: (eventId: number, participantTelegramId: number) => void
  getEventById: (id: number) => Event | undefined
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined)

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
        type: 'club',
        name: 'Беговой клуб "Стрела"',
        avatar: 'https://via.placeholder.com/40'
      },
      participants: [],
      tags: ['бег', 'утро', 'парк'],
      images: ['https://via.placeholder.com/300x200'],
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(seedEvents())

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

  const value = useMemo<EventsContextValue>(() => ({
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    getEventById
  }), [events])

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


