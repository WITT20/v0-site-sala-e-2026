'use client'

import { type Post } from '@/lib/db'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MateriaBadge } from '@/components/materias-sidebar'
import { Calendar, User, Image as ImageIcon, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const tipoColors: Record<string, string> = {
  'Atividade': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  'Trabalho': 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  'Projeto': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  'Resumo': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  'Material': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
  'Prova': 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
}

interface PostCardProps {
  post: Post
  onClick: () => void
}

export function PostCard({ post, onClick }: PostCardProps) {
  const coverImage = post.fotos[0]
  const formattedDate = format(new Date(post.criadoEm), "d 'de' MMM", { locale: ptBR })

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
      onClick={onClick}
    >
      {/* Cover Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={post.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        {post.fotos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium">
            +{post.fotos.length - 1} fotos
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="outline" className={tipoColors[post.tipo]}>
            {post.tipo}
          </Badge>
          <MateriaBadge materia={post.materia} />
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {post.titulo}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.descricao}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate max-w-24">{post.autorNome}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {post.membrosGrupo && post.membrosGrupo.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{post.membrosGrupo.length} membros</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
