// Пользователь
export interface User {
  id: number
  telegramId: number
  firstName: string
  lastName?: string
  username?: string
  email?: string
  phone?: string
  avatar?: string
  city?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
  points: number
  level: number
  achievements: Achievement[]
  clubs: Club[]
  events: Event[]
  isTrainer: boolean
  isOrganizer: boolean
}

// Клуб
export interface Club {
  id: number
  name: string
  description: string
  city: string
  avatar?: string
  coverImage?: string
  isPrivate: boolean
  isModerated: boolean
  membersCount: number
  maxMembers?: number
  createdAt: Date
  updatedAt: Date
  owner: User
  members: User[]
  moderators: User[]
  events: Event[]
  tags: string[]
  rules?: string
  contactInfo?: {
    phone?: string
    email?: string
    website?: string
  }
}

// Событие
export interface Event {
  id: number
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  city: string
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
  maxParticipants?: number
  currentParticipants: number
  price: number
  currency: string
  isFree: boolean
  registrationRequired: boolean
  registrationDeadline?: Date
  organizer: Organizer
  club?: Club
  participants: User[]
  tags: string[]
  images: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

// Организатор (может быть пользователь, клуб, тренер или компания)
export interface Organizer {
  id: number
  type: 'user' | 'club' | 'trainer' | 'company'
  name: string
  description?: string
  avatar?: string
  contactInfo?: {
    phone?: string
    email?: string
    website?: string
  }
  rating?: number
  reviewsCount?: number
}

// Тренер
export interface Trainer {
  id: number
  user: User
  specialization: string[]
  experience: number
  certifications: string[]
  rating: number
  reviewsCount: number
  hourlyRate?: number
  bio: string
  achievements: Achievement[]
}

// Достижение
export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  points: number
  unlockedAt?: Date
  category: 'running' | 'social' | 'events' | 'clubs' | 'special'
}

// Чат сообщение
export interface ChatMessage {
  id: number
  clubId: number
  userId: number
  user: User
  content: string
  type: 'text' | 'image' | 'file'
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

// Рейтинг
export interface Rating {
  id: number
  userId: number
  user: User
  clubId?: number
  eventId?: number
  score: number
  category: 'running' | 'social' | 'events' | 'overall'
  period: 'weekly' | 'monthly' | 'yearly' | 'all-time'
  createdAt: Date
}

// Задание
export interface Task {
  id: number
  clubId: number
  title: string
  description: string
  points: number
  deadline?: Date
  isCompleted: boolean
  completedBy: User[]
  createdAt: Date
  updatedAt: Date
}

// Подписка
export interface Subscription {
  id: number
  userId: number
  type: 'premium' | 'club' | 'event'
  targetId?: number
  price: number
  currency: string
  startDate: Date
  endDate: Date
  status: 'active' | 'expired' | 'cancelled'
  autoRenew: boolean
}

// Платеж
export interface Payment {
  id: number
  userId: number
  amount: number
  currency: string
  description: string
  type: 'subscription' | 'event' | 'donation'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

// Уведомление
export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: 'event' | 'club' | 'achievement' | 'payment' | 'system'
  isRead: boolean
  data?: Record<string, any>
  createdAt: Date
}

// Фильтры для поиска
export interface EventFilters {
  city?: string
  dateFrom?: Date
  dateTo?: Date
  organizer?: number
  priceFrom?: number
  priceTo?: number
  tags?: string[]
  isFree?: boolean
}

export interface ClubFilters {
  city?: string
  isPrivate?: boolean
  tags?: string[]
  hasEvents?: boolean
}

// API ответы
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
} 