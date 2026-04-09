'use client'

import { MATERIAS, TIPOS_CONTEUDO, SEMESTRES, type Materia, type TipoConteudo, type Semestre } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, X, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface FeedFiltersProps {
  selectedMateria: Materia | null
  setSelectedMateria: (materia: Materia | null) => void
  selectedTipo: TipoConteudo | null
  setSelectedTipo: (tipo: TipoConteudo | null) => void
  selectedSemestre: Semestre | null
  setSelectedSemestre: (semestre: Semestre | null) => void
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
}

export function FeedFilters({
  selectedMateria,
  setSelectedMateria,
  selectedTipo,
  setSelectedTipo,
  selectedSemestre,
  setSelectedSemestre,
  selectedDate,
  setSelectedDate,
}: FeedFiltersProps) {
  const hasFilters = selectedMateria || selectedTipo || selectedSemestre || selectedDate

  const clearFilters = () => {
    setSelectedMateria(null)
    setSelectedTipo(null)
    setSelectedSemestre(null)
    setSelectedDate(undefined)
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros</span>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={clearFilters}>
            <X className="w-3 h-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Matéria - Mobile only (desktop uses sidebar) */}
        <div className="lg:hidden">
          <Select 
            value={selectedMateria || 'all'} 
            onValueChange={(value) => setSelectedMateria(value === 'all' ? null : value as Materia)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Matérias</SelectItem>
              {MATERIAS.map((materia) => (
                <SelectItem key={materia} value={materia}>{materia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <Select 
          value={selectedTipo || 'all'} 
          onValueChange={(value) => setSelectedTipo(value === 'all' ? null : value as TipoConteudo)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {TIPOS_CONTEUDO.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Semestre */}
        <Select 
          value={selectedSemestre || 'all'} 
          onValueChange={(value) => setSelectedSemestre(value === 'all' ? null : value as Semestre)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Semestres</SelectItem>
            {SEMESTRES.map((semestre) => (
              <SelectItem key={semestre} value={semestre}>{semestre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Data */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-44 justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Filtrar por data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              initialFocus
            />
            {selectedDate && (
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelectedDate(undefined)}>
                  Limpar data
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
