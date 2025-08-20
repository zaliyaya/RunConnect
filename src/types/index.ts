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
  events: Event[]
  isTrainer: boolean
  isOrganizer: boolean
}

// Событие
export interface Event {
  id: number
  title: string
  description: string
  startDate: Date
  endDate?: Date
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
  participants: User[]
  tags: string[]
  images: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  // Поля для тренировок
  isTraining?: boolean
  sportType?: string
  distance?: number // в километрах
  pace?: string // темп (например, "5:30/км")
  duration?: number // в минутах
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  equipment?: string[]
  notes?: string
  // Тип события
  eventType?: 'training' | 'competition' | 'seminar' | 'masterclass' | 'performance'
}

// Организатор (может быть пользователь, тренер или компания)
export interface Organizer {
  id: number
  type: 'user' | 'trainer' | 'company'
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
}

// Подписка
export interface Subscription {
  id: number
  userId: number
  type: 'premium' | 'event'
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
  type: 'event' | 'payment' | 'system'
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
  isTraining?: boolean
  sportType?: string
  difficulty?: string
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