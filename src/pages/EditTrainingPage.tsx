import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, MapPin, ArrowLeft, Save } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'

const EditTrainingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEventById, updateEvent } = useEvents()
  const event = useMemo(() => (id ? getEventById(parseInt(id)) : undefined), [id, getEventById])

  if (!event) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Событие не найдено</p>
      </div>
    )
  }

  const isLocked = event.currentParticipants > 0
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    startDate: new Date(event.startDate).toISOString().slice(0,10),
    startTime: new Date(event.startDate).toTimeString().slice(0,5),
    endTime: event.endDate ? new Date(event.endDate).toTimeString().slice(0,5) : '',
    city: event.city,
    location: event.location,
    sportType: event.sportType || '',
    distance: event.distance?.toString() || '',
    pace: event.pace || '',
    duration: event.duration?.toString() || '',
    difficulty: event.difficulty || 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    notes: event.notes || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return
    const start = new Date(`${formData.startDate}T${formData.startTime}`)
    const end = formData.endTime ? new Date(`${formData.startDate}T${formData.endTime}`) : undefined
    updateEvent(event.id, {
      title: formData.title,
      description: formData.description,
      startDate: start,
      endDate: end,
      city: formData.city,
      location: formData.location,
      sportType: formData.sportType || undefined,
      distance: formData.distance ? parseFloat(formData.distance) : undefined,
      pace: formData.pace || undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      difficulty: formData.difficulty,
      notes: formData.notes || undefined
    })
    navigate(`/events/${event.id}`)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Редактировать тренировку</h1>
      </div>

      {isLocked && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
          Нельзя редактировать: к событию уже присоединились участники.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Название тренировки *</label>
              <input type="text" required disabled={isLocked} value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
              <textarea disabled={isLocked} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2"/>Время и дата</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Дата *</label>
              <input type="date" required disabled={isLocked} value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Время начала *</label>
              <input type="time" required disabled={isLocked} value={formData.startTime} onChange={(e) => handleInputChange('startTime', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Время окончания (необязательно)</label>
              <input type="time" disabled={isLocked} value={formData.endTime} onChange={(e) => handleInputChange('endTime', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2"/>Место проведения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Город *</label>
              <input type="text" required disabled={isLocked} value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Место или адрес *</label>
              <input type="text" required disabled={isLocked} value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Отмена</button>
          <button type="submit" disabled={isLocked} className={`flex-1 px-6 py-3 rounded-lg text-white transition-colors ${isLocked ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}>
            <span className="inline-flex items-center space-x-2"><Save className="w-4 h-4"/><span>Сохранить</span></span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTrainingPage


