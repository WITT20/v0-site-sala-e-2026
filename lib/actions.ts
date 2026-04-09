'use server'

import { revalidatePath } from 'next/cache'
import { db, type Post, type TipoConteudo, type Materia, type Semestre, type SalaConfig } from './db'
import { getSession } from './auth'

export async function createPost(formData: {
  tipo: TipoConteudo
  titulo: string
  materia: Materia
  descricao: string
  fotos: string[]
  semestre: Semestre
  dataAula?: string
  dataInicio?: string
  dataEntrega?: string
  membrosGrupo?: string[]
  autorNome: string
}): Promise<{ success: boolean; error?: string; post?: Post }> {
  try {
    if (!formData.titulo || !formData.descricao) {
      return { success: false, error: 'Título e descrição são obrigatórios' }
    }

    if (!formData.autorNome) {
      return { success: false, error: 'Selecione seu nome' }
    }

    const post = db.createPost({
      tipo: formData.tipo,
      titulo: formData.titulo,
      materia: formData.materia,
      descricao: formData.descricao,
      fotos: formData.fotos,
      semestre: formData.semestre,
      dataAula: formData.dataAula,
      dataInicio: formData.dataInicio,
      dataEntrega: formData.dataEntrega,
      membrosGrupo: formData.membrosGrupo,
      autorId: 'anon',
      autorNome: formData.autorNome
    })

    revalidatePath('/', 'max')

    return { success: true, post }
  } catch {
    return { success: false, error: 'Erro ao criar post' }
  }
}

export async function deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getSession()
    const post = db.getPostById(postId)

    if (!post) {
      return { success: false, error: 'Post não encontrado' }
    }

    // Apenas admin pode deletar
    if (!user?.isAdmin) {
      return { success: false, error: 'Apenas o administrador pode deletar posts' }
    }

    db.deletePost(postId)
    revalidatePath('/', 'max')

    return { success: true }
  } catch {
    return { success: false, error: 'Erro ao deletar post' }
  }
}

export async function updateSalaConfig(config: Partial<SalaConfig>): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getSession()
    if (!user?.isAdmin) {
      return { success: false, error: 'Acesso restrito ao administrador' }
    }
    db.updateConfig(config)
    revalidatePath('/', 'max')
    return { success: true }
  } catch {
    return { success: false, error: 'Acesso restrito ao administrador' }
  }
}

export async function getSalaConfig(): Promise<SalaConfig> {
  return db.getConfig()
}

export async function getAllPosts(): Promise<Post[]> {
  return db.getAllPosts()
}

export async function getPostsByUser(userId: string): Promise<Post[]> {
  return db.getPostsByUser(userId)
}

export async function getAllUsers() {
  return db.getAllUsers().map(u => ({
    id: u.id,
    nome: u.nome
  }))
}
