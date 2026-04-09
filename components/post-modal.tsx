'use client'

import { type Post } from '@/lib/db'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MateriaBadge } from '@/components/materias-sidebar'
import { Calendar, User, Users, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect } from 'react'

const tipoColors: Record<string, string> = {
  'Atividade': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  'Trabalho': 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  'Projeto': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  'Resumo': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  'Material': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
  'Prova': 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
}

interface PostModalProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
  allUsers?: { id: string; nome: string }[]
}

export function PostModal({ post, open, onOpenChange, allUsers = [] }: PostModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [post])

  if (!post) return null

  const getMemberNames = () => {
    if (!post.membrosGrupo) return []
    return post.membrosGrupo.map(id => {
      const user = allUsers.find(u => u.id === id)
      return user?.nome || 'Aluno'
    })
  }

  const formattedCreatedDate = format(new Date(post.criadoEm), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })

  const nextImage = () => {
    if (post.fotos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % post.fotos.length)
    }
  }

  const prevImage = () => {
    if (post.fotos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + post.fotos.length) % post.fotos.length)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={tipoColors[post.tipo]}>
              {post.tipo}
            </Badge>
            <MateriaBadge materia={post.materia} />
            <Badge variant="secondary" className="ml-auto">
              {post.semestre}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{post.titulo}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="p-6 pt-4 space-y-6">
            {/* Images Gallery */}
            {post.fotos.length > 0 && (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={post.fotos[currentImageIndex]}
                  alt={`Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain bg-black/5 dark:bg-white/5"
                />
                
                {post.fotos.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {post.fotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex 
                              ? 'bg-primary' 
                              : 'bg-background/60 hover:bg-background/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {post.fotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {post.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    <img
                      src={foto}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Descrição</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{post.descricao}</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.dataAula && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Data da aula:</span>
                  <span className="font-medium">
                    {format(new Date(post.dataAula), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              )}
              {post.dataInicio && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Início:</span>
                  <span className="font-medium">
                    {format(new Date(post.dataInicio), "d 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
              )}
              {post.dataEntrega && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-muted-foreground">Entrega:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {format(new Date(post.dataEntrega), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              )}
            </div>

            {/* Group Members */}
            {post.membrosGrupo && post.membrosGrupo.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Membros do Grupo
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getMemberNames().map((nome, index) => (
                    <Badge key={index} variant="secondary">
                      {nome}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Publicado por <span className="font-medium text-foreground">{post.autorNome}</span></span>
              </div>
              <span>{formattedCreatedDate}</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
