'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { getPostsByUser, deletePost, getAllUsers } from '@/lib/actions'
import { type Post } from '@/lib/db'
import { PostCard } from '@/components/post-card'
import { PostModal } from '@/components/post-modal'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FileText, PlusCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function MeusPostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!user) return
      const [postsData, usersData] = await Promise.all([
        getPostsByUser(user.id),
        getAllUsers()
      ])
      setPosts(postsData)
      setUsers(usersData)
      setLoading(false)
    }
    loadData()
  }, [user])

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setModalOpen(true)
  }

  const handleDeleteClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation()
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!postToDelete) return
    setDeleting(true)
    
    const result = await deletePost(postToDelete.id)
    
    if (result.success) {
      setPosts(posts.filter(p => p.id !== postToDelete.id))
      toast.success('Publicação excluída com sucesso!')
    } else {
      toast.error(result.error || 'Erro ao excluir publicação')
    }
    
    setDeleting(false)
    setDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Minhas Publicações</h1>
          <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
          </p>
        </div>
        <Link href="/publicar">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Publicação
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Empty className="mt-12">
          <Empty.Icon>
            <FileText className="w-10 h-10" />
          </Empty.Icon>
          <Empty.Title>Você ainda não publicou nada</Empty.Title>
          <Empty.Description>
            Compartilhe conteúdo com sua turma - fotos do caderno, atividades, resumos e mais!
          </Empty.Description>
          <Empty.Actions>
            <Link href="/publicar">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar primeira publicação
              </Button>
            </Link>
          </Empty.Actions>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="relative group">
              <PostCard 
                post={post} 
                onClick={() => handlePostClick(post)} 
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={(e) => handleDeleteClick(post, e)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <PostModal
        post={selectedPost}
        open={modalOpen}
        onOpenChange={setModalOpen}
        allUsers={users}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir publicação?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir &quot;{postToDelete?.titulo}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Spinner className="w-4 h-4 mr-2" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
