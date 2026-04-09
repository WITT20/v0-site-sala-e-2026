// ===========================================
// BANCO DE DADOS IN-MEMORY - SALA E 2026
// ===========================================
// ADMIN: login "WITT" | senha "12345678"
// ===========================================

export type TipoConteudo = 'Atividade' | 'Trabalho' | 'Projeto' | 'Resumo' | 'Material' | 'Prova'

export type Materia = 
  | 'Português' 
  | 'Matemática' 
  | 'História' 
  | 'Geografia' 
  | 'Biologia' 
  | 'Física' 
  | 'Química' 
  | 'Inglês' 
  | 'Artes' 
  | 'Educação Física' 
  | 'Filosofia' 
  | 'Sociologia'

export type Semestre = '1º Semestre 2026' | '2º Semestre 2026'

export interface User {
  id: string
  nome: string
  telefone?: string
  senha: string
  isAdmin: boolean
  criadoEm: Date
}

export interface Post {
  id: string
  tipo: TipoConteudo
  titulo: string
  materia: Materia
  descricao: string
  fotos: string[] // base64
  dataAula?: string // para Atividade, Resumo, Prova, Material
  dataInicio?: string // para Trabalho, Projeto
  dataEntrega?: string // para Trabalho, Projeto
  membrosGrupo?: string[] // IDs dos alunos para Trabalho, Projeto
  semestre: Semestre
  autorId: string
  autorNome: string
  criadoEm: Date
}

export interface SalaConfig {
  whatsappLink: string
  instagramLink: string
}

// Banco de dados in-memory
class Database {
  users: Map<string, User> = new Map()
  posts: Map<string, Post> = new Map()
  config: SalaConfig = {
    whatsappLink: '',
    instagramLink: ''
  }

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Admin fixo
    const admin: User = {
      id: 'admin',
      nome: 'WITT',
      senha: '12345678',
      isAdmin: true,
      criadoEm: new Date()
    }
    this.users.set(admin.id, admin)

    // 8 alunos fictícios
    const alunosFicticios = [
      { nome: 'Ana Clara Silva', telefone: '11999001001' },
      { nome: 'Bruno Santos', telefone: '11999002002' },
      { nome: 'Carla Mendes', telefone: '11999003003' },
      { nome: 'Daniel Oliveira', telefone: '11999004004' },
      { nome: 'Eduarda Costa', telefone: '11999005005' },
      { nome: 'Felipe Martins', telefone: '11999006006' },
      { nome: 'Gabriela Lima', telefone: '11999007007' },
      { nome: 'Henrique Souza', telefone: '11999008008' },
    ]

    alunosFicticios.forEach((aluno, index) => {
      const user: User = {
        id: `aluno-${index + 1}`,
        nome: aluno.nome,
        telefone: aluno.telefone,
        senha: '123456',
        isAdmin: false,
        criadoEm: new Date(Date.now() - (8 - index) * 24 * 60 * 60 * 1000)
      }
      this.users.set(user.id, user)
    })

    // 6 posts de exemplo
    const postsExemplo: Omit<Post, 'id' | 'criadoEm'>[] = [
      {
        tipo: 'Atividade',
        titulo: 'Exercícios de Equações do 1º Grau',
        materia: 'Matemática',
        descricao: 'Exercícios da página 45 a 48 do livro. Resolver todas as equações mostrando o passo a passo. Entregar na próxima aula.',
        fotos: [],
        dataAula: '2026-03-10',
        semestre: '1º Semestre 2026',
        autorId: 'aluno-1',
        autorNome: 'Ana Clara Silva'
      },
      {
        tipo: 'Resumo',
        titulo: 'Resumo: Primeira Guerra Mundial',
        materia: 'História',
        descricao: 'Resumo completo sobre as causas, desenvolvimento e consequências da Primeira Guerra Mundial. Inclui os principais países envolvidos, datas importantes e tratados.',
        fotos: [],
        dataAula: '2026-03-12',
        semestre: '1º Semestre 2026',
        autorId: 'aluno-2',
        autorNome: 'Bruno Santos'
      },
      {
        tipo: 'Trabalho',
        titulo: 'Trabalho sobre Ecossistemas Brasileiros',
        materia: 'Biologia',
        descricao: 'Trabalho em grupo sobre os principais ecossistemas brasileiros: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pantanal e Pampa. Cada grupo deve apresentar um ecossistema.',
        fotos: [],
        dataInicio: '2026-03-15',
        dataEntrega: '2026-04-05',
        membrosGrupo: ['aluno-1', 'aluno-3', 'aluno-5'],
        semestre: '1º Semestre 2026',
        autorId: 'aluno-3',
        autorNome: 'Carla Mendes'
      },
      {
        tipo: 'Material',
        titulo: 'Fórmulas de Física - Cinemática',
        materia: 'Física',
        descricao: 'Compilado das principais fórmulas de cinemática: MRU, MRUV, queda livre e lançamentos. Útil para as provas!',
        fotos: [],
        dataAula: '2026-03-18',
        semestre: '1º Semestre 2026',
        autorId: 'aluno-4',
        autorNome: 'Daniel Oliveira'
      },
      {
        tipo: 'Prova',
        titulo: 'Conteúdo da Prova de Química',
        materia: 'Química',
        descricao: 'A prova vai cair: Tabela Periódica, Ligações Químicas (iônica, covalente e metálica), Geometria Molecular e Polaridade. Estudem o capítulo 3 e 4 do livro.',
        fotos: [],
        dataAula: '2026-03-25',
        semestre: '1º Semestre 2026',
        autorId: 'aluno-5',
        autorNome: 'Eduarda Costa'
      },
      {
        tipo: 'Projeto',
        titulo: 'Projeto Interdisciplinar: Sustentabilidade',
        materia: 'Geografia',
        descricao: 'Projeto sobre sustentabilidade e impactos ambientais na nossa cidade. Precisamos fazer pesquisa de campo, entrevistas e criar uma apresentação. Envolve Geografia, Biologia e Sociologia.',
        fotos: [],
        dataInicio: '2026-04-01',
        dataEntrega: '2026-05-15',
        membrosGrupo: ['aluno-2', 'aluno-4', 'aluno-6', 'aluno-8'],
        semestre: '1º Semestre 2026',
        autorId: 'aluno-6',
        autorNome: 'Felipe Martins'
      }
    ]

    postsExemplo.forEach((post, index) => {
      const fullPost: Post = {
        ...post,
        id: `post-${index + 1}`,
        criadoEm: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
      }
      this.posts.set(fullPost.id, fullPost)
    })

    // Links iniciais da turma
    this.config.whatsappLink = 'https://chat.whatsapp.com/exemplo'
    this.config.instagramLink = 'https://instagram.com/salae2026'
  }

  // Métodos de usuário
  findUserByNome(nome: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.nome.toLowerCase() === nome.toLowerCase())
  }

  createUser(nome: string, senha: string, telefone?: string): User {
    const id = `aluno-${Date.now()}`
    const user: User = {
      id,
      nome,
      telefone,
      senha,
      isAdmin: false,
      criadoEm: new Date()
    }
    this.users.set(id, user)
    return user
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).filter(u => !u.isAdmin)
  }

  // Métodos de post
  createPost(post: Omit<Post, 'id' | 'criadoEm'>): Post {
    const id = `post-${Date.now()}`
    const fullPost: Post = {
      ...post,
      id,
      criadoEm: new Date()
    }
    this.posts.set(id, fullPost)
    return fullPost
  }

  getAllPosts(): Post[] {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    )
  }

  getPostsByUser(userId: string): Post[] {
    return this.getAllPosts().filter(p => p.autorId === userId)
  }

  getPostById(id: string): Post | undefined {
    return this.posts.get(id)
  }

  deletePost(id: string): boolean {
    return this.posts.delete(id)
  }

  // Métodos de configuração
  updateConfig(config: Partial<SalaConfig>) {
    this.config = { ...this.config, ...config }
  }

  getConfig(): SalaConfig {
    return this.config
  }
}

// Singleton - mantém os dados enquanto o servidor estiver rodando
export const db = new Database()

// Constantes úteis
export const MATERIAS: Materia[] = [
  'Português',
  'Matemática',
  'História',
  'Geografia',
  'Biologia',
  'Física',
  'Química',
  'Inglês',
  'Artes',
  'Educação Física',
  'Filosofia',
  'Sociologia'
]

export const TIPOS_CONTEUDO: TipoConteudo[] = [
  'Atividade',
  'Trabalho',
  'Projeto',
  'Resumo',
  'Material',
  'Prova'
]

export const SEMESTRES: Semestre[] = [
  '1º Semestre 2026',
  '2º Semestre 2026'
]
