"use client"

import { useState, useRef, useEffect } from 'react'
import { Camera, History, Lightbulb, Calendar, BookOpen, Settings, X, Upload, Loader2, ChevronRight, TrendingDown, Flame, Apple, Activity } from 'lucide-react'

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

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'camera' | 'analysis' | 'history' | 'tips' | 'plans' | 'diary' | 'settings'>('home')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [foodHistory, setFoodHistory] = useState<FoodAnalysis[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<FoodAnalysis | null>(null)
  const [dailyGoal, setDailyGoal] = useState(2000)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar histórico do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('foodHistory')
    if (saved) {
      const parsed = JSON.parse(saved)
      setFoodHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })))
    }
    const savedGoal = localStorage.getItem('dailyGoal')
    if (savedGoal) setDailyGoal(parseInt(savedGoal))
  }, [])

  // Salvar histórico no localStorage
  useEffect(() => {
    if (foodHistory.length > 0) {
      localStorage.setItem('foodHistory', JSON.stringify(foodHistory))
    }
  }, [foodHistory])

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
      // Simular análise com dados realistas
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Dados simulados de análise nutricional
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
                {dailyStats.mealsCount} refeições registradas hoje
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
              {/* Imagem */}
              {capturedImage && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                  <img src={capturedImage} alt="Alimento" className="w-full h-64 object-cover" />
                </div>
              )}

              {/* Resultado da Análise */}
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

                {/* Informações Nutricionais */}
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
        title: 'Hidratação é Fundamental',
        description: 'Beba pelo menos 2 litros de água por dia. A água ajuda na digestão e acelera o metabolismo.',
        icon: '💧'
      },
      {
        title: 'Coma Devagar',
        description: 'Mastigue bem os alimentos e faça refeições sem pressa. Isso ajuda na digestão e aumenta a saciedade.',
        icon: '🍽️'
      },
      {
        title: 'Durma Bem',
        description: 'Tenha 7-8 horas de sono por noite. O sono adequado regula hormônios da fome e saciedade.',
        icon: '😴'
      },
      {
        title: 'Exercícios Regulares',
        description: 'Pratique atividades físicas pelo menos 3x por semana. Combine cardio com treino de força.',
        icon: '💪'
      },
      {
        title: 'Evite Açúcar Refinado',
        description: 'Reduza o consumo de doces e refrigerantes. Prefira frutas para satisfazer a vontade de doce.',
        icon: '🍬'
      },
      {
        title: 'Proteína em Todas as Refeições',
        description: 'Inclua fontes de proteína em cada refeição. Isso aumenta a saciedade e preserva massa muscular.',
        icon: '🥩'
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

          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Dicas de Emagrecimento</h1>

          <div className="space-y-4">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{tip.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">{tip.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
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
              <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Atividades de Hoje</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-100">Caminhada</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">30 minutos</div>
                    </div>
                  </div>
                  <div className="text-blue-600 font-bold">150 kcal</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-purple-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-100">Musculação</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">45 minutos</div>
                    </div>
                  </div>
                  <div className="text-purple-600 font-bold">280 kcal</div>
                </div>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300">
                + Adicionar Atividade
              </button>
            </div>

            {/* Progresso Semanal */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Progresso Semanal</h2>
              
              <div className="grid grid-cols-7 gap-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">{day}</div>
                    <div className={`w-full h-20 rounded-lg ${i < 4 ? 'bg-gradient-to-t from-emerald-500 to-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tela de Configurações
  if (currentView === 'settings') {
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

          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Configurações</h1>

          <div className="space-y-6">
            {/* Meta Diária */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Meta Diária de Calorias</h2>
              
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setDailyGoal(value)
                    localStorage.setItem('dailyGoal', value.toString())
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100 font-bold text-lg"
                />
                <span className="text-gray-600 dark:text-gray-400">kcal</span>
              </div>
            </div>

            {/* Perfil */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Perfil</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Peso Atual (kg)</label>
                  <input type="number" placeholder="70" className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100" />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Altura (cm)</label>
                  <input type="number" placeholder="170" className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100" />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Meta de Peso (kg)</label>
                  <input type="number" placeholder="65" className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-100" />
                </div>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300">
                Salvar Alterações
              </button>
            </div>

            {/* Limpar Dados */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Dados</h2>
              
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                    setFoodHistory([])
                    localStorage.removeItem('foodHistory')
                  }
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Limpar Histórico
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
