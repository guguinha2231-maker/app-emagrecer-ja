"use client";

import { Heart, Users, Lightbulb, Mail, Menu, X } from "lucide-react";
import { useState } from "react";

export default function EmagrecerJaPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-emerald-600 fill-emerald-600" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Emagrecer Já
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex gap-8">
                <li>
                  <button
                    onClick={() => scrollToSection("sobre")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Sobre
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("depoimentos")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("dicas")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Dicas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contato")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-emerald-600"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden mt-4 pb-4">
              <ul className="flex flex-col gap-4">
                <li>
                  <button
                    onClick={() => scrollToSection("sobre")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors w-full text-left"
                  >
                    Sobre
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("depoimentos")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors w-full text-left"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("dicas")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors w-full text-left"
                  >
                    Dicas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contato")}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors w-full text-left"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Transforme Sua Vida Hoje!
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-emerald-50">
            Descubra o caminho para uma vida mais saudável e feliz
          </p>
          <button
            onClick={() => scrollToSection("sobre")}
            className="bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Comece Agora
          </button>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-4 bg-emerald-100 rounded-full mb-6">
              <Heart className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              Sobre o Aplicativo
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Descubra como emagrecer de forma saudável! Nosso aplicativo oferece
              um programa completo com dicas personalizadas, acompanhamento
              nutricional e exercícios adaptados ao seu ritmo. Transforme seu
              corpo e mente com métodos comprovados e suporte profissional.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Saúde em Primeiro Lugar
                </h3>
                <p className="text-gray-600">
                  Métodos seguros e aprovados por nutricionistas
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Comunidade Ativa
                </h3>
                <p className="text-gray-600">
                  Milhares de pessoas alcançando seus objetivos
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Dicas Personalizadas
                </h3>
                <p className="text-gray-600">
                  Conteúdo adaptado ao seu perfil e metas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block p-4 bg-emerald-100 rounded-full mb-6">
              <Users className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              O que nossos usuários dizem
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Histórias reais de transformação e superação
            </p>
            
            {/* Video Placeholder */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-2xl overflow-hidden mb-12">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-emerald-600 border-b-8 border-b-transparent ml-1"></div>
                </div>
                <p className="text-gray-600 font-medium">
                  Vídeo de depoimentos em breve
                </p>
              </div>
            </div>

            {/* Testimonials Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-800">Maria Silva</h4>
                    <p className="text-sm text-gray-600">Perdeu 15kg em 3 meses</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Incrível! Consegui emagrecer de forma saudável e sem passar fome.
                  O suporte da comunidade foi essencial!"
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    J
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-800">João Santos</h4>
                    <p className="text-sm text-gray-600">Perdeu 20kg em 4 meses</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Mudou minha vida! Aprendi a me alimentar melhor e ganhei muito
                  mais disposição no dia a dia."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dicas Section */}
      <section id="dicas" className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block p-4 bg-white rounded-full mb-6 shadow-lg">
              <Lightbulb className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              Dicas de Saúde
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Resultados reais de quem transformou a vida
            </p>
            
            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=800&fit=crop"
                  alt="Resultado 1 - Alimentação Saudável"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-bold text-xl p-6">
                    Alimentação Balanceada
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop"
                  alt="Resultado 2 - Exercícios"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-bold text-xl p-6">
                    Exercícios Regulares
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=800&fit=crop"
                  alt="Resultado 3 - Bem-estar"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-bold text-xl p-6">
                    Bem-estar Mental
                  </p>
                </div>
              </div>
            </div>

            {/* Tips Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-emerald-600 mb-2">💧 Hidratação</h4>
                <p className="text-gray-600 text-sm">
                  Beba pelo menos 2 litros de água por dia
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-emerald-600 mb-2">🥗 Alimentação</h4>
                <p className="text-gray-600 text-sm">
                  Priorize alimentos naturais e integrais
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-emerald-600 mb-2">🏃 Movimento</h4>
                <p className="text-gray-600 text-sm">
                  30 minutos de atividade física diária
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-emerald-600 mb-2">😴 Sono</h4>
                <p className="text-gray-600 text-sm">
                  Durma de 7 a 8 horas por noite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block p-4 bg-emerald-100 rounded-full mb-6">
              <Mail className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              Entre em Contato
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tem dúvidas? Estamos aqui para ajudar você!
            </p>
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Sua mensagem"
                  rows={5}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 fill-white" />
            <h3 className="text-2xl font-bold">Emagrecer Já</h3>
          </div>
          <p className="text-emerald-100 mb-6">
            Transformando vidas através da saúde e bem-estar
          </p>
          <div className="border-t border-emerald-400 pt-6">
            <p className="text-emerald-100">
              &copy; 2024 Emagrecer Já. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
