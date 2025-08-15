import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Settings, 
  Lightbulb, 
  Plus, 
  Video, 
  Grid3X3, 
  Bell, 
  ChevronDown,
  Home,
  Calendar,
  Star,
  Grid,
  User,
  HelpCircle,
  CheckCircle,
  Clock,
  CalendarDays,
  FileText,
  MessageSquare,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  Zap
} from 'lucide-react';

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      weekday: 'short' 
    };
    return date.toLocaleDateString('pt-BR', options);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Top Purple Notification Bar */}
      <div className="bg-[#8854F7] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-white" />
          <span className="text-sm text-white">
            A ClickUp precisa de sua permissão para enviar notificações
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 px-3 py-1 text-sm"
          >
            Habilitado
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 px-3 py-1 text-sm"
          >
            Lembre-me
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 p-1"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#1A1A1A] px-6 py-3 flex items-center justify-between border-b border-[#2A2A2A]">
        <div className="flex items-center gap-4">
          {/* ClickUp Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8854F7] via-[#6366F1] to-[#10B981] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-white font-medium">Início</span>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8854F7] focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
            <Lightbulb className="h-5 w-5" />
            <span className="ml-2 text-sm">IA</span>
          </Button>
          <Button className="bg-[#8854F7] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Fazer upgrade
          </Button>
          <Button variant="outline" className="border-[#3A3A3A] text-[#8854F7] hover:bg-[#8854F7] hover:text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
            <Grid3X3 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-16 bg-[#1A1A1A] min-h-screen flex flex-col items-center py-6 border-r border-[#2A2A2A]">
          <div className="flex flex-col items-center gap-6">
            <Button variant="ghost" size="sm" className="w-10 h-10 bg-[#8854F7] text-white hover:bg-[#7C3AED] rounded-full">
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-full">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-full">
              <Star className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-full">
              <Grid className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-full">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-auto flex flex-col items-center gap-4">
            <Button variant="ghost" size="sm" className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-full">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-full">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Header with Greeting and Manage Cards Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-white">
              Boa noite, Davi
            </h1>
            <Button className="bg-[#8854F7] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Gerenciar cartões
            </Button>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1: Recentes */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <h2 className="text-lg font-semibold text-white mb-4">Recentes</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 bg-[#8854F7] rounded-full flex items-center justify-center">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Projeto 1</p>
                    <p className="text-gray-400 text-xs">• em Projeto 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Tarefa 2</p>
                    <p className="text-gray-400 text-xs">• em Projeto 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors duration-200">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Tarefa 3</p>
                    <p className="text-gray-400 text-xs">• em Projeto 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Agenda */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <h2 className="text-lg font-semibold text-white mb-4">Agenda</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-gray-400 text-sm">{formatDate(currentDate)}</span>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[#3A3A3A] text-white hover:bg-[#2A2A2A] px-3 py-1 text-sm flex items-center gap-2"
                  onClick={goToToday}
                >
                  <CalendarDays className="h-4 w-4" />
                  Hoje
                </Button>
              </div>
              <div className="text-center py-8">
                <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-sm mb-4">
                  Os itens da agenda dos seus calendários aparecem aqui. Saiba mais
                </p>
                <Button className="bg-[#8854F7] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  + Adicionar integrações ao calendário
                </Button>
              </div>
            </div>

            {/* Bloco 3: Meu trabalho */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <h2 className="text-lg font-semibold text-white mb-4">Meu trabalho</h2>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  As tarefas e os lembretes atribuídos a você serão exibidos aqui. 
                  <span className="text-[#8854F7] underline cursor-pointer ml-1">Saiba mais</span>
                </p>
                <Button className="bg-[#8854F7] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  + Adicionar tarefa ou lembrete
                </Button>
              </div>
            </div>

            {/* Bloco 4: Atribuídas a mim */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <h2 className="text-lg font-semibold text-white mb-4">Atribuídas a mim</h2>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  As tarefas atribuídas a você aparecerão aqui. 
                  <span className="text-[#8854F7] underline cursor-pointer ml-1">Saiba mais</span>
                </p>
                <Button className="bg-[#8854F7] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  + Adicionar tarefa
                </Button>
              </div>
            </div>

            {/* Bloco 5: Lista pessoal */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-white">Lista pessoal</h2>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  A lista pessoal contém todas as suas tarefas. 
                  <span className="text-[#8854F7] underline cursor-pointer ml-1">Saiba mais</span>
                </p>
                <Button className="bg-[#8854F7] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  + Criar uma tarefa
                </Button>
              </div>
            </div>

            {/* Bloco 6: Comentários atribuídos */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <h2 className="text-lg font-semibold text-white mb-4">Comentários atribuídos</h2>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-white text-sm mb-2">Nenhum comentário</p>
                <p className="text-gray-400 text-sm mb-4">
                  Você não tem comentários atribuídos. 
                  <span className="text-[#8854F7] underline cursor-pointer ml-1">Saiba mais</span>
                </p>
              </div>
            </div>

            {/* Bloco 7: Prioridades */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-white">Prioridades</h2>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Bloco 8: StandUp da IA */}
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#2A2A2A]">
              <h2 className="text-lg font-semibold text-white mb-4">StandUp da IA</h2>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8854F7] via-[#6366F1] to-[#10B981] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
