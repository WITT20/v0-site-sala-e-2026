'use client'

import { MATERIAS } from '@/lib/db'
import { cn } from '@/lib/utils'
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  MapPin, 
  Leaf, 
  Atom, 
  FlaskConical, 
  Languages, 
  Palette, 
  Dumbbell, 
  Brain, 
  Users 
} from 'lucide-react'

const materiaIcons: Record<string, React.ElementType> = {
  'Português': BookOpen,
  'Matemática': Calculator,
  'História': Globe,
  'Geografia': MapPin,
  'Biologia': Leaf,
  'Física': Atom,
  'Química': FlaskConical,
  'Inglês': Languages,
  'Artes': Palette,
  'Educação Física': Dumbbell,
  'Filosofia': Brain,
  'Sociologia': Users,
}

const materiaColors: Record<string, string> = {
  'Português': 'text-blue-500',
  'Matemática': 'text-red-500',
  'História': 'text-amber-600',
  'Geografia': 'text-green-600',
  'Biologia': 'text-emerald-500',
  'Física': 'text-purple-500',
  'Química': 'text-orange-500',
  'Inglês': 'text-sky-500',
  'Artes': 'text-pink-500',
  'Educação Física': 'text-lime-500',
  'Filosofia': 'text-indigo-500',
  'Sociologia': 'text-teal-500',
}

interface MateriasSidebarProps {
  selectedMateria: string | null
  onSelectMateria: (materia: string | null) => void
}

export function MateriasSidebar({ selectedMateria, onSelectMateria }: MateriasSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 p-4 rounded-xl bg-card border border-border/50">
        <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
          Filtrar por Matéria
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectMateria(null)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedMateria === null
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            )}
          >
            <BookOpen className="w-4 h-4" />
            Todas as Matérias
          </button>
          {MATERIAS.map((materia) => {
            const Icon = materiaIcons[materia] || BookOpen
            const colorClass = materiaColors[materia] || 'text-muted-foreground'
            return (
              <button
                key={materia}
                onClick={() => onSelectMateria(materia)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedMateria === materia
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <Icon className={cn('w-4 h-4', selectedMateria === materia ? '' : colorClass)} />
                {materia}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export function MateriaBadge({ materia }: { materia: string }) {
  const Icon = materiaIcons[materia] || BookOpen
  const colorClass = materiaColors[materia] || 'text-muted-foreground'
  
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium">
      <Icon className={cn('w-3 h-3', colorClass)} />
      {materia}
    </span>
  )
}
