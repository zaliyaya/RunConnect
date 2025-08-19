import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Event, User } from '../types'

interface EventsContextValue {
	events: Event[]
	addEvent: (event: Event) => void
	joinEvent: (eventId: number, participant: User) => void
	leaveEvent: (eventId: number, participantTelegramId: number) => void
	getEventById: (id: number) => Event | undefined
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined)

function getInitialEvents(): Event[] {
	return [
		{
			id: 1,
			title: 'Утренняя пробежка в парке Горького',
			description: 'Присоединяйтесь к нашей утренней пробежке! Подходит для всех уровней подготовки.',
			startDate: new Date('2024-02-15T08:00:00'),
			endDate: new Date('2024-02-15T09:30:00'),
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
		},
		{
			id: 2,
			title: 'Полумарафон "Весенний ветер"',
			description: 'Ежегодный полумарафон с живописной трассой по центру города.',
			startDate: new Date('2024-03-20T09:00:00'),
			endDate: new Date('2024-03-20T12:00:00'),
			location: 'Центральная площадь',
			city: 'Москва',
			address: 'Красная площадь',
			maxParticipants: 1000,
			currentParticipants: 567,
			price: 2500,
			currency: 'RUB',
			isFree: false,
			registrationRequired: true,
			registrationDeadline: new Date('2024-03-15T23:59:59'),
			organizer: {
				id: 2,
				type: 'company',
				name: 'Организаторы марафонов',
				avatar: 'https://via.placeholder.com/40'
			},
			participants: [],
			tags: ['марафон', 'соревнования', 'весна'],
			images: ['https://via.placeholder.com/300x200'],
			status: 'upcoming',
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: 4,
			title: 'Вечерняя пробежка 5км',
			description: 'Легкая пробежка в парке. Подходит для начинающих.',
			startDate: new Date('2025-02-20T19:00:00'),
			endDate: new Date('2025-02-20T20:00:00'),
			location: 'Парк Сокольники',
			city: 'Москва',
			address: 'ул. Сокольнический Вал, 1',
			maxParticipants: 15,
			currentParticipants: 8,
			price: 0,
			currency: 'RUB',
			isFree: true,
			registrationRequired: true,
			organizer: {
				id: 4,
				type: 'user',
				name: 'Алексей Петров',
				avatar: 'https://via.placeholder.com/40'
			},
			participants: [],
			tags: ['бег', 'вечер', 'начинающие'],
			images: [],
			status: 'upcoming',
			isTraining: true,
			sportType: 'Бег',
			distance: 5,
			pace: '6:00',
			duration: 60,
			difficulty: 'beginner',
			equipment: ['Кроссовки', 'Вода'],
			notes: 'Приносите с собой воду',
			createdAt: new Date(),
			updatedAt: new Date()
		}
	]
}

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [events, setEvents] = useState<Event[]>(getInitialEvents())

	const addEvent = (event: Event) => {
		setEvents(prev => [event, ...prev])
	}

	const joinEvent = (eventId: number, participant: User) => {
		setEvents(prev => prev.map(e => {
			if (e.id !== eventId) return e
			// Avoid duplicate
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

	const value = useMemo<EventsContextValue>(() => ({ events, addEvent, joinEvent, leaveEvent, getEventById }), [events])

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
