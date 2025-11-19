"use client"

import { useState, useRef, useEffect } from 'react'
import { Camera, History, Lightbulb, Calendar, BookOpen, Settings, X, Upload, Loader2, ChevronRight, TrendingDown, Flame, Apple, Activity, Check, ArrowRight, Bell, Plus, Trash2, User, Target, Scale, Ruler } from 'lucide-react'

interface FoodAnalysis {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  timestamp: Date
  imageUrl?: string
}

interface DailyStats {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  mealsCount: number
}

interface QuizAnswers {
  currentWeight: string
  goalWeight: string
  height: string
  dietExperience: string
  exerciseFrequency: string
  waterIntake: string
  sleepHours: string
}

interface ActivityEntry {
  id: string
  type: string
  duration: number
  calories: number
  timestamp: Date
  notes: string
}

interface Reminder {
  id: string
  activity: string
  time: string
  days: string[]
  enabled: boolean
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'quiz' | 'home' | 'camera' | 'analysis' | 'history' | 'tips' | 'plans' | 'diary' | 'settings'>('quiz')
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    currentWeight: '',
    goalWeight: '',
    height: '',
    dietExperience: '',
    exerciseFrequency: '',
    waterIntake: '',
    sleepHours: ''
  })
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [foodHistory, setFoodHistory] = useState<FoodAnalysis[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<FoodAnalysis | null>(null)
  const [dailyGoal, setDailyGoal] = useState(2000)
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    type: '',
    duration: '',
    calories: '',
    notes: ''
  })
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    activity: '',
    time: '',
    days: [] as string[]
  })
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Solicitar permissão de notificação
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      if (permission === 'granted') {
        new Notification('NutriLife', {
          body: 'Notificações ativadas! Você receberá lembretes das suas atividades.',
          icon: '💪'
        })
      }
    }
  }

  // Verificar lembretes a cada minuto
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const currentDay = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][now.getDay()]

      reminders.forEach(reminder => {
        if (
          reminder.enabled &&
          reminder.time === currentTime &&
          reminder.days.includes(currentDay) &&
          notificationPermission === 'granted'
        ) {
          new Notification('🏃 Hora da Atividade!', {
            body: `Lembrete: ${reminder.activity}`,
            icon: '💪',
            badge: '🔔'
          })
        }
      })
    }

    const interval = setInterval(checkReminders, 60000) // Verifica a cada minuto
    return () => clearInterval(interval)
  }, [reminders, notificationPermission])

  // Carregar dados do localStorage
  useEffect(() => {
    const savedQuiz = localStorage.getItem('quizCompleted')
    if (savedQuiz === 'true') {
      setCurrentView('home')
    }

    const saved = localStorage.getItem('foodHistory')
    if (saved) {
      const parsed = JSON.parse(saved)
      setFoodHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })))
    }

    const savedActivities = localStorage.getItem('activities')
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities)
      setActivities(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })))
    }

    const savedReminders = localStorage.getItem('reminders')
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }

    const savedGoal = localStorage.getItem('dailyGoal')
    if (savedGoal) setDailyGoal(parseInt(savedGoal))

    const savedAnswers = localStorage.getItem('quizAnswers')
    if (savedAnswers) setQuizAnswers(JSON.parse(savedAnswers))
  }, [])

  // Salvar histórico no localStorage
  useEffect(() => {
    if (foodHistory.length > 0) {
      localStorage.setItem('foodHistory', JSON.stringify(foodHistory))
    }
  }, [foodHistory])

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('activities', JSON.stringify(activities))
    }
  }, [activities])

  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem('reminders', JSON.stringify(reminders))
    }
  }, [reminders])

  // Calcular estatísticas diárias
  const getDailyStats = (): DailyStats => {
    const today = new Date().toDateString()
    const todayMeals = foodHistory.filter(item => 
      new Date(item.timestamp).toDateString() === today
    )
    
    return {
      totalCalories: todayMeals.reduce((sum, item) => sum + item.calories, 0),
      totalProtein: todayMeals.reduce((sum, item) => sum + item.protein, 0),
      totalCarbs: todayMeals.reduce((sum, item) => sum + item.carbs, 0),
      totalFat: todayMeals.reduce((sum, item) => sum + item.fat, 0),
      mealsCount: todayMeals.length
    }
  }

  const getTodayActivities = () => {
    const today = new Date().toDateString()
    return activities.filter(item => 
      new Date(item.timestamp).toDateString() === today
    )
  }

  const getTotalCaloriesBurned = () => {
    return getTodayActivities().reduce((sum, item) => sum + item.calories, 0)
  }

  const handleQuizNext = () => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      localStorage.setItem('quizCompleted', 'true')
      localStorage.setItem('quizAnswers', JSON.stringify(quizAnswers))
      setCurrentView('home')
    }
  }

  const handleAddActivity = () => {
    if (newActivity.type && newActivity.duration && newActivity.calories) {
      const activity: ActivityEntry = {
        id: Date.now().toString(),
        type: newActivity.type,
        duration: parseInt(newActivity.duration),
        calories: parseInt(newActivity.calories),
        notes: newActivity.notes,
        timestamp: new Date()
      }
      setActivities([activity, ...activities])
      setNewActivity({ type: '', duration: '', calories: '', notes: '' })
      setShowAddActivity(false)
    }
  }

  const handleAddReminder = () => {
    if (newReminder.activity && newReminder.time && newReminder.days.length > 0) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        activity: newReminder.activity,
        time: newReminder.time,
        days: newReminder.days,
        enabled: true
      }
      setReminders([...reminders, reminder])
      setNewReminder({ activity: '', time: '', days: [] })
      setShowAddReminder(false)
    }
  }

  const toggleReminderDay = (day: string) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result as string)
        analyzeImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true)
    setCurrentView('analysis')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockFoods = [
        { name: 'Arroz com Feijão', calories: 350, protein: 12, carbs: 65, fat: 5, fiber: 8 },
        { name: 'Frango Grelhado', calories: 280, protein: 45, carbs: 0, fat: 10, fiber: 0 },
        { name: 'Salada Verde', calories: 80, protein: 3, carbs: 12, fat: 2, fiber: 5 },
        { name: 'Macarrão Integral', calories: 320, protein: 11, carbs: 60, fat: 4, fiber: 7 },
        { name: 'Peixe Assado', calories: 250, protein: 40, carbs: 0, fat: 9, fiber: 0 },
        { name: 'Batata Doce', calories: 180, protein: 4, carbs: 40, fat: 0.5, fiber: 6 },
        { name: 'Ovo Mexido', calories: 200, protein: 18, carbs: 2, fat: 14, fiber: 0 },
        { name: 'Frutas Variadas', calories: 120, protein: 2, carbs: 30, fat: 0.5, fiber: 4 }
      ]
      
      const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)]
      
      const analysis: FoodAnalysis = {
        id: Date.now().toString(),
        ...randomFood,
        timestamp: new Date(),
        imageUrl: imageData
      }

      setCurrentAnalysis(analysis)
      setFoodHistory(prev => [analysis, ...prev])
    } catch (error) {
      console.error('Erro na análise:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const dailyStats = getDailyStats()
  const caloriesPercentage = (dailyStats.totalCalories / dailyGoal) * 100

  const quizQuestions = [
    {
      question: 'Qual é o seu peso atual?',
      field: 'currentWeight' as keyof QuizAnswers,
      type: 'number',
      placeholder: 'Ex: 75',
      suffix: 'kg'
    },
    {
      question: 'Qual é o seu peso ideal?',
      field: 'goalWeight' as keyof QuizAnswers,
      type: 'number',
      placeholder: 'Ex: 65',
      suffix: 'kg'
    },
    {
      question: 'Qual é a sua altura?',
      field: 'height' as keyof QuizAnswers,
      type: 'number',
      placeholder: 'Ex: 170',
      suffix: 'cm'
    },
    {
      question: 'Como está sua experiência com dietas?',
      field: 'dietExperience' as keyof QuizAnswers,
      type: 'select',
      options: [
        'Nunca fiz dieta',
        'Já tentei algumas vezes',
        'Faço dieta regularmente',
        'Sou experiente em nutrição'
      ]
    },
    {
      question: 'Com que frequência você se exercita?',
      field: 'exerciseFrequency' as keyof QuizAnswers,
      type: 'select',
      options: [
        'Sedentário (não me exercito)',
        '1-2 vezes por semana',
        '3-4 vezes por semana',
        '5+ vezes por semana'
      ]
    },
    {
      question: 'Quantos litros de água você bebe por dia?',
      field: 'waterIntake' as keyof QuizAnswers,
      type: 'select',
      options: [
        'Menos de 1 litro',
        '1-2 litros',
        '2-3 litros',
        'Mais de 3 litros'
      ]
    },
    {
      question: 'Quantas horas você dorme por noite?',
      field: 'sleepHours' as keyof QuizAnswers,
      type: 'select',
      options: [
        'Menos de 5 horas',
        '5-6 horas',
        '7-8 horas',
        'Mais de 8 horas'
      ]
    }
  ]

  // Tela de Quiz Inicial
  if (currentView === 'quiz') {
    const currentQuestion = quizQuestions[quizStep]
    const progress = ((quizStep + 1) / quizQuestions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pergunta {quizStep + 1} de {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-emerald-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-4">
              {currentQuestion.type === 'number' ? (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={quizAnswers[currentQuestion.field]}
                    onChange={(e) => setQuizAnswers({
                      ...quizAnswers,
                      [currentQuestion.field]: e.target.value
                    })}
                    placeholder={currentQuestion.placeholder}
                    className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 text-xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  {currentQuestion.suffix && (
                    <span className="text-xl font-medium text-gray-600 dark:text-gray-400">
                      {currentQuestion.suffix}
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setQuizAnswers({
                        ...quizAnswers,
                        [currentQuestion.field]: option
                      })}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                        quizAnswers[currentQuestion.field] === option
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {quizAnswers[currentQuestion.field] === option && (
                          <Check className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              {quizStep > 0 && (
                <button
                  onClick={() => setQuizStep(quizStep - 1)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={handleQuizNext}
                disabled={!quizAnswers[currentQuestion.field]}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {quizStep === quizQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tela Inicial
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pt-8 pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                NutriLife
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Seu app de emagrecimento e desenvolvimento pessoal
            </p>
          </div>

          {/* Estatísticas Diárias */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hoje</h2>
              <span className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            
            <div className="space-y-4">
              {/* Barra de Progresso de Calorias */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calorias</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {dailyStats.totalCalories} / {dailyGoal} kcal
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(caloriesPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dailyStats.totalProtein}g</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Proteína</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dailyStats.totalCarbs}g</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Carboidratos</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{dailyStats.totalFat}g</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Gordura</div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                {dailyStats.mealsCount} refeições • {getTotalCaloriesBurned()} kcal queimadas
              </div>
            </div>
          </div>

          {/* Menu Principal */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setCurrentView('camera')
                fileInputRef.current?.click()
              }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <Camera className="w-12 h-12 mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Tirar Foto</div>
              <div className="text-xs opacity-90 mt-1">Analisar alimento</div>
            </button>

            <button
              onClick={() => setCurrentView('history')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 group"
            >
              <History className="w-12 h-12 mb-3 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Histórico</div>
              <div className="text-xs text-gray-500 mt-1">{foodHistory.length} registros</div>
            </button>

            <button
              onClick={() => setCurrentView('tips')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 group"
            >
              <Lightbulb className="w-12 h-12 mb-3 mx-auto text-yellow-500 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Dicas</div>
              <div className="text-xs text-gray-500 mt-1">Emagrecimento</div>
            </button>

            <button
              onClick={() => setCurrentView('plans')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 group"
            >
              <Calendar className="w-12 h-12 mb-3 mx-auto text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Planos</div>
              <div className="text-xs text-gray-500 mt-1">Dieta personalizada</div>
            </button>

            <button
              onClick={() => setCurrentView('diary')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 group"
            >
              <BookOpen className="w-12 h-12 mb-3 mx-auto text-purple-500 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Diário</div>
              <div className="text-xs text-gray-500 mt-1">Atividades</div>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 group"
            >
              <Settings className="w-12 h-12 mb-3 mx-auto text-gray-500 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-lg">Configurações</div>
              <div className="text-xs text-gray-500 mt-1">Preferências</div>
            </button>
          </div>

          {/* Input oculto para captura de imagem */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />
        </div>
      </div>
    )
  }

  // Tela de Análise
  if (currentView === 'analysis') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-2xl mx-auto p-6">
          <button
            onClick={() => {
              setCurrentView('home')
              setCapturedImage(null)
              setCurrentAnalysis(null)
            }}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
            Fechar
          </button>

          {analyzing ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-emerald-600 animate-spin" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Analisando imagem...</h2>
              <p className="text-gray-600 dark:text-gray-400">Identificando alimento e calculando nutrientes</p>
            </div>
          ) : currentAnalysis ? (
            <div className="space-y-6">
              {capturedImage && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                  <img src={capturedImage} alt="Alimento" className="w-full h-64 object-cover" />
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
                    <Apple className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {currentAnalysis.name}
                  </h2>
                  <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
                    <Flame className="w-5 h-5 text-emerald-600" />
                    <span className="text-2xl font-bold text-emerald-600">
                      {currentAnalysis.calories} kcal
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Informações Nutricionais</h3>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300">Proteínas</span>
                    <span className="font-bold text-blue-600">{currentAnalysis.protein}g</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300">Carboidratos</span>
                    <span className="font-bold text-orange-600">{currentAnalysis.carbs}g</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300">Gorduras</span>
                    <span className="font-bold text-purple-600">{currentAnalysis.fat}g</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300">Fibras</span>
                    <span className="font-bold text-green-600">{currentAnalysis.fiber}g</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('home')
                    setCapturedImage(null)
                    setCurrentAnalysis(null)
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  Registrado com Sucesso!
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  // Tela de Histórico
  if (currentView === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-2xl mx-auto p-6">
          <button
            onClick={() => setCurrentView('home')}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
            Voltar
          </button>

          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Histórico de Refeições</h1>

          {foodHistory.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Nenhuma refeição registrada ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {foodHistory.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString('pt-BR')}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg font-medium">
                          {item.calories} kcal
                        </span>
                        <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg">
                          P: {item.protein}g
                        </span>
                        <span className="text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-lg">
                          C: {item.carbs}g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Tela de Dicas
  if (currentView === 'tips') {
    const tips = [
      {
        title: 'Planejamento de Refeições',
        description: 'Planeje suas refeições com antecedência para evitar escolhas impulsivas. Use um diário alimentar para monitorar sua ingestão calórica e ajustar conforme necessário. Estudos mostram que o planejamento aumenta em 50% as chances de sucesso na dieta.',
        icon: '📋',
        category: 'Estratégia'
      },
      {
        title: 'Controle de Porções',
        description: 'Use pratos menores (20-22cm) para ajudar a controlar as porções naturalmente. Pesquisas indicam que isso pode reduzir a ingestão calórica em até 22% sem sensação de privação. Mastigue devagar e faça pausas durante as refeições.',
        icon: '🍽️',
        category: 'Alimentação'
      },
      {
        title: 'Equilíbrio de Macronutrientes',
        description: 'Cada refeição deve conter proteínas (25-30%), carboidratos complexos (40-50%) e gorduras saudáveis (20-30%). Esse equilíbrio mantém energia estável, prolonga saciedade e preserva massa muscular durante o emagrecimento.',
        icon: '⚖️',
        category: 'Nutrição'
      },
      {
        title: 'Consumo Adequado de Fibras',
        description: 'Inclua 25-30g de fibras diárias através de vegetais, frutas e grãos integrais. As fibras melhoram a digestão, regulam o açúcar no sangue e aumentam a saciedade. Aumente gradualmente para evitar desconforto digestivo.',
        icon: '🥗',
        category: 'Nutrição'
      },
      {
        title: 'Hidratação Estratégica',
        description: 'Beba 35ml de água por kg de peso corporal diariamente. A hidratação adequada acelera o metabolismo em até 30%, melhora a digestão e reduz a retenção de líquidos. Beba água antes das refeições para aumentar a saciedade.',
        icon: '💧',
        category: 'Hábitos'
      },
      {
        title: 'Qualidade do Sono',
        description: 'Durma 7-9 horas por noite em horários regulares. O sono inadequado aumenta em 55% o risco de obesidade, desregula hormônios da fome (grelina e leptina) e reduz a força de vontade para escolhas saudáveis.',
        icon: '😴',
        category: 'Recuperação'
      },
      {
        title: 'Exercícios Combinados',
        description: 'Combine treino de força (3x/semana) com exercícios aeróbicos (150min/semana). O treino de força preserva massa muscular durante o déficit calórico e aumenta o metabolismo basal em até 7%. Varie os estímulos.',
        icon: '💪',
        category: 'Atividade Física'
      },
      {
        title: 'Alimentação Consciente (Mindful Eating)',
        description: 'Pratique atenção plena durante as refeições: coma sem distrações, mastigue 20-30 vezes, perceba sabores e texturas. Essa prática reduz em 30% o consumo excessivo e melhora a relação com a comida.',
        icon: '🧘',
        category: 'Comportamento'
      },
      {
        title: 'Monitoramento de Progresso',
        description: 'Acompanhe múltiplos indicadores: peso (1x/semana), medidas corporais (quinzenal), fotos (mensal) e como as roupas ajustam. O peso pode variar 1-2kg diariamente por retenção de líquidos - foque na tendência geral.',
        icon: '📊',
        category: 'Acompanhamento'
      },
      {
        title: 'Acompanhamento Profissional',
        description: 'Consulte nutricionista e educador físico para plano personalizado baseado em suas necessidades, objetivos e condições de saúde. O acompanhamento profissional aumenta em 3x as chances de sucesso sustentável.',
        icon: '👨‍⚕️',
        category: 'Suporte'
      }
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto p-6">
          <button
            onClick={() => setCurrentView('home')}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Dicas Baseadas em Evidências</h1>
            <p className="text-gray-600 dark:text-gray-400">Estratégias comprovadas cientificamente para emagrecimento saudável e sustentável</p>
          </div>

          <div className="space-y-4">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0">{tip.icon}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">{tip.title}</h3>
                      <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                        {tip.category}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Lembre-se</h3>
                <p className="text-sm opacity-90">
                  O emagrecimento saudável é gradual (0,5-1kg por semana) e sustentável. Mudanças pequenas e consistentes são mais eficazes que dietas restritivas extremas. Consulte sempre profissionais de saúde antes de iniciar qualquer programa de emagrecimento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tela de Planos
  if (currentView === 'plans') {
    const plans = [
      {
        name: 'Plano Iniciante',
        duration: '4 semanas',
        calories: '1800 kcal/dia',
        description: 'Perfeito para quem está começando a jornada de emagrecimento',
        features: ['3 refeições + 2 lanches', 'Receitas simples', 'Lista de compras', 'Suporte básico']
      },
      {
        name: 'Plano Intermediário',
        duration: '8 semanas',
        calories: '1600 kcal/dia',
        description: 'Para quem já tem experiência e quer resultados mais rápidos',
        features: ['5 refeições balanceadas', 'Receitas variadas', 'Plano de treino', 'Acompanhamento semanal']
      },
      {
        name: 'Plano Avançado',
        duration: '12 semanas',
        calories: '1400 kcal/dia',
        description: 'Transformação completa com acompanhamento personalizado',
        features: ['Dieta personalizada', 'Treino intensivo', 'Suplementação', 'Acompanhamento diário']
      }
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-2xl mx-auto p-6">
          <button
            onClick={() => setCurrentView('home')}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
            Voltar
          </button>

          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Planos de Dieta Personalizados</h1>

          <div className="space-y-6">
            {plans.map((plan, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-800 dark:text-gray-100 mb-1">{plan.name}</h3>
                    <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>⏱️ {plan.duration}</span>
                      <span>🔥 {plan.calories}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-bold">
                    Popular
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <ChevronRight className="w-4 h-4 text-emerald-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg">
                  Assinar Agora
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Tela de Diário
  if (currentView === 'diary') {
    const todayActivities = getTodayActivities()
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-2xl mx-auto p-6">
          <button
            onClick={() => setCurrentView('home')}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
            Voltar
          </button>

          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Diário de Atividades</h1>

          <div className="space-y-6">
            {/* Atividades de Hoje */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">Atividades de Hoje</h2>
                <div className="text-sm font-bold text-emerald-600">
                  {getTotalCaloriesBurned()} kcal queimadas
                </div>
              </div>
              
              {todayActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma atividade registrada hoje</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {todayActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-bold text-gray-800 dark:text-gray-100">{activity.type}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.duration} minutos
                            {activity.notes && ` • ${activity.notes}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-blue-600 font-bold">{activity.calories} kcal</div>
                    </div>
                  ))}
                </div>
              )}

              {!showAddActivity ? (
                <button 
                  onClick={() => setShowAddActivity(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  + Adicionar Atividade
                </button>
              ) : (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="">Selecione a atividade</option>
                    <option value="Caminhada">Caminhada</option>
                    <option value="Corrida">Corrida</option>
                    <option value="Musculação">Musculação</option>
                    <option value="Natação">Natação</option>
                    <option value="Ciclismo">Ciclismo</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Dança">Dança</option>
                    <option value="Outro">Outro</option>
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Duração (min)"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})}
                      className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Calorias"
                      value={newActivity.calories}
                      onChange={(e) => setNewActivity({...newActivity, calories: e.target.value})}
                      className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Observações (opcional)"
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowAddActivity(false)
                        setNewActivity({ type: '', duration: '', calories: '', notes: '' })
                      }}
                      className="flex-1 px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddActivity}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Progresso Semanal com Lembretes */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">Progresso Semanal</h2>
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all text-sm"
                >
                  <Bell className="w-4 h-4" />
                  Lembretes
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day, i) => {
                  const hasActivity = i < 4
                  const height = hasActivity ? Math.random() * 60 + 40 : 20
                  return (
                    <div key={i} className="text-center">
                      <div className="text-xs text-gray-500 mb-2">{day}</div>
                      <div 
                        className={`w-full rounded-lg transition-all ${
                          hasActivity 
                            ? 'bg-gradient-to-t from-emerald-500 to-teal-500' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Notificação de Permissão */}
              {notificationPermission !== 'granted' && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Ative as notificações para receber lembretes das suas atividades
                      </p>
                      <button
                        onClick={requestNotificationPermission}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold text-sm transition-all lasy-highlight"
                      >
                        Ativar Notificações
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Lembretes */}
              {reminders.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Meus Lembretes</h3>
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                      <div className="flex items-center gap-3 flex-1">
                        <Bell className={`w-5 h-5 ${reminder.enabled ? 'text-purple-600' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <div className="font-bold text-gray-800 dark:text-gray-100">{reminder.activity}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {reminder.time} • {reminder.days.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleReminder(reminder.id)}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            reminder.enabled
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {reminder.enabled ? 'Ativo' : 'Inativo'}
                        </button>
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulário de Adicionar Lembrete */}
              {showAddReminder && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">Novo Lembrete</h3>
                  
                  <input
                    type="text"
                    placeholder="Nome da atividade"
                    value={newReminder.activity}
                    onChange={(e) => setNewReminder({...newReminder, activity: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                  />

                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                  />

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Dias da semana:</p>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day}
                          onClick={() => toggleReminderDay(day)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                            newReminder.days.includes(day)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowAddReminder(false)
                        setNewReminder({ activity: '', time: '', days: [] })
                      }}
                      className="flex-1 px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddReminder}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all"
                    >
                      Salvar Lembrete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tela de Configurações
  if (currentView === 'settings') {
    const calculateBMI = () => {
      if (quizAnswers.currentWeight && quizAnswers.height) {
        const weight = parseFloat(quizAnswers.currentWeight)
        const heightM = parseFloat(quizAnswers.height) / 100
        const bmi = weight / (heightM * heightM)
        return bmi.toFixed(1)
      }
      return null
    }

    const getBMICategory = (bmi: number) => {
      if (bmi < 18.5) return { text: 'Abaixo do peso', color: 'text-blue-600' }
      if (bmi < 25) return { text: 'Peso normal', color: 'text-green-600' }
      if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-600' }
      return { text: 'Obesidade', color: 'text-red-600' }
    }

    const bmi = calculateBMI()
    const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto p-6">
          <button
            onClick={() => setCurrentView('home')}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Configurações</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas preferências e dados pessoais</p>
          </div>

          <div className="space-y-6">
            {/* Perfil do Usuário */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">Perfil Pessoal</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Suas informações e métricas</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Peso Atual */}
                {quizAnswers.currentWeight && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Scale className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso Atual</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{quizAnswers.currentWeight} kg</div>
                  </div>
                )}

                {/* Peso Meta */}
                {quizAnswers.goalWeight && (
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso Meta</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{quizAnswers.goalWeight} kg</div>
                  </div>
                )}

                {/* Altura */}
                {quizAnswers.height && (
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Ruler className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Altura</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{quizAnswers.height} cm</div>
                  </div>
                )}

                {/* IMC */}
                {bmi && (
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">IMC</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{bmi}</div>
                    {bmiCategory && (
                      <div className={`text-sm font-semibold mt-1 ${bmiCategory.color}`}>
                        {bmiCategory.text}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Informações Adicionais */}
              {(quizAnswers.dietExperience || quizAnswers.exerciseFrequency) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {quizAnswers.dietExperience && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Experiência com Dietas</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{quizAnswers.dietExperience}</span>
                    </div>
                  )}
                  {quizAnswers.exerciseFrequency && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Frequência de Exercícios</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{quizAnswers.exerciseFrequency}</span>
                    </div>
                  )}
                  {quizAnswers.waterIntake && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Consumo de Água</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{quizAnswers.waterIntake}</span>
                    </div>
                  )}
                  {quizAnswers.sleepHours && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Horas de Sono</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{quizAnswers.sleepHours}</span>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => {
                  localStorage.removeItem('quizCompleted')
                  setCurrentView('quiz')
                  setQuizStep(0)
                }}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                Atualizar Perfil
              </button>
            </div>

            {/* Meta Diária de Calorias */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">Meta Diária de Calorias</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ajuste seu objetivo calórico diário</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setDailyGoal(value)
                    localStorage.setItem('dailyGoal', value.toString())
                  }}
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 font-bold text-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-xl font-bold text-gray-600 dark:text-gray-400">kcal</span>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Dica:</strong> Para perder peso de forma saudável, mantenha um déficit de 300-500 kcal por dia. Consulte um nutricionista para uma meta personalizada.
                </p>
              </div>
            </div>

            {/* Gerenciamento de Dados */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">Gerenciamento de Dados</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Controle suas informações armazenadas</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Histórico de Refeições</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{foodHistory.length} registros</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Atividades Físicas</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{activities.length} registros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Lembretes Ativos</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{reminders.filter(r => r.enabled).length} de {reminders.length}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('⚠️ Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
                      setFoodHistory([])
                      setActivities([])
                      localStorage.removeItem('foodHistory')
                      localStorage.removeItem('activities')
                    }
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  Limpar Todo Histórico
                </button>
              </div>
            </div>

            {/* Informações do App */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Apple className="w-6 h-6" />
                <h3 className="font-bold text-lg">NutriLife</h3>
              </div>
              <p className="text-sm opacity-90 mb-2">Versão 1.0.0</p>
              <p className="text-sm opacity-90">
                Seu companheiro para uma vida mais saudável. Desenvolvido com foco em resultados sustentáveis e bem-estar.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
