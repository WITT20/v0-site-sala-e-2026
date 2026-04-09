'use client'

import { useState, useEffect, useMemo } from 'react'
import { getAllPosts, getAllUsers } from '@/lib/actions'
import { type Post, type Materia, type TipoConteudo, type Semestre } from '@/lib/db'
import { PostCard } from '@/components/post-card'
import { PostModal } from '@/components/post-modal'
import { MateriasSidebar } from '@/components/materias-sidebar'
import { FeedFilters } from '@/components/feed-filters'
import { Empty } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { FileText, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { isSameDay } from 'date-fns'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Filters
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null)
  const [selectedTipo, setSelectedTipo] = useState<TipoConteudo | null>(null)
  const [selectedSemestre, setSelectedSemestre] = useState<Semestre | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    async function loadData() {
      const [postsData, usersData] = await Promise.all([
        getAllPosts(),
        getAllUsers()
      ])
      setPosts(postsData)
      setUsers(usersData)
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedMateria && post.materia !== selectedMateria) return false
      if (selectedTipo && post.tipo !== selectedTipo) return false
      if (selectedSemestre && post.semestre !== selectedSemestre) return false
      if (selectedDate && !isSameDay(new Date(post.criadoEm), selectedDate)) return false
      return true
    })
  }, [posts, selectedMateria, selectedTipo, selectedSemestre, selectedDate])

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <MateriasSidebar 
        selectedMateria={selectedMateria} 
        onSelectMateria={setSelectedMateria} 
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Feed da Sala</h1>
            <p className="text-muted-foreground">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'publicação' : 'publicações'}
            </p>
          </div>
          <Link href="/publicar">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </Link>
        </div>

        <FeedFilters
          selectedMateria={selectedMateria}
          setSelectedMateria={setSelectedMateria}
          selectedTipo={selectedTipo}
          setSelectedTipo={setSelectedTipo}
          selectedSemestre={selectedSemestre}
          setSelectedSemestre={setSelectedSemestre}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {filteredPosts.length === 0 ? (
          <Empty className="mt-12">
            <Empty.Icon>
              <FileText className="w-10 h-10" />
            </Empty.Icon>
            <Empty.Title>Nenhuma publicação encontrada</Empty.Title>
            <Empty.Description>
              {posts.length === 0 
                ? 'Seja o primeiro a publicar algo para a sala!'
                : 'Tente ajustar os filtros para ver mais resultados.'
              }
            </Empty.Description>
            {posts.length === 0 && (
              <Empty.Actions>
                <Link href="/publicar">
                  <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Criar primeira publicação
                  </Button>
                </Link>
              </Empty.Actions>
            )}
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => handlePostClick(post)} 
              />
            ))}
          </div>
        )}
      </div>

      <PostModal
        post={selectedPost}
        open={modalOpen}
        onOpenChange={setModalOpen}
        allUsers={users}
      />
    </div>
  )
}
