'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, getAllUsers } from '@/lib/actions'
import { MATERIAS, TIPOS_CONTEUDO, SEMESTRES, type Materia, type TipoConteudo, type Semestre } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, AlertCircle, ImagePlus, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function PublicarPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<{ id: string; nome: string }[]>([])

  // Form state
  const [autorNome, setAutorNome] = useState('')
  const [tipo, setTipo] = useState<TipoConteudo>('Atividade')
  const [titulo, setTitulo] = useState('')
  const [materia, setMateria] = useState<Materia>('Português')
  const [descricao, setDescricao] = useState('')
  const [fotos, setFotos] = useState<string[]>([])
  const [semestre, setSemestre] = useState<Semestre>('1º Semestre 2026')
  const [dataAula, setDataAula] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [membrosGrupo, setMembrosGrupo] = useState<string[]>([])

  useEffect(() => {
    getAllUsers().then(setUsers)
  }, [])

  const needsDataAula = ['Atividade', 'Resumo', 'Prova', 'Material'].includes(tipo)
  const needsDatasTrabalhoProjeto = ['Trabalho', 'Projeto'].includes(tipo)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPhotos: string[] = []
    
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError('Apenas imagens são permitidas')
        continue
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Imagens devem ter no máximo 5MB')
        continue
      }

      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      newPhotos.push(base64)
    }

    setFotos((prev) => [...prev, ...newPhotos])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removePhoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleMembro = (userId: string) => {
    setMembrosGrupo((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createPost({
        tipo,
        titulo,
        materia,
        descricao,
        fotos,
        semestre,
        dataAula: needsDataAula ? dataAula : undefined,
        dataInicio: needsDatasTrabalhoProjeto ? dataInicio : undefined,
        dataEntrega: needsDatasTrabalhoProjeto ? dataEntrega : undefined,
        membrosGrupo: needsDatasTrabalhoProjeto ? membrosGrupo : undefined,
        autorNome,
      })

      if (result.success) {
        toast.success('Publicação criada com sucesso!')
        router.push('/')
      } else {
        setError(result.error || 'Erro ao criar publicação')
      }
    } catch {
      setError('Erro ao criar publicação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl">Nova Publicação</CardTitle>
          <CardDescription>
            Compartilhe conteúdo com sua turma - fotos do caderno, atividades, resumos e mais!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seu Nome */}
            <div className="space-y-2">
              <Label htmlFor="autorNome">Seu Nome *</Label>
              <Select value={autorNome} onValueChange={setAutorNome} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu nome" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.nome}>{u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Conteúdo */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Conteúdo *</Label>
              <Select value={tipo} onValueChange={(value) => setTipo(value as TipoConteudo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_CONTEUDO.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Exercícios de Matemática - Página 45"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            {/* Matéria */}
            <div className="space-y-2">
              <Label htmlFor="materia">Matéria *</Label>
              <Select value={materia} onValueChange={(value) => setMateria(value as Materia)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o conteúdo em detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* Upload de Fotos */}
            <div className="space-y-2">
              <Label>Fotos</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <ImagePlus className="w-10 h-10 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clique para adicionar fotos ou arraste aqui
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG até 5MB
                  </span>
                </label>
              </div>

              {/* Photo Previews */}
              {fotos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {fotos.map((foto, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data da Aula (para Atividade, Resumo, Prova, Material) */}
            {needsDataAula && (
              <div className="space-y-2">
                <Label htmlFor="dataAula">Data da Aula</Label>
                <Input
                  id="dataAula"
                  type="date"
                  value={dataAula}
                  onChange={(e) => setDataAula(e.target.value)}
                />
              </div>
            )}

            {/* Datas de Trabalho/Projeto */}
            {needsDatasTrabalhoProjeto && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">Data de Início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataEntrega">Data de Entrega</Label>
                    <Input
                      id="dataEntrega"
                      type="date"
                      value={dataEntrega}
                      onChange={(e) => setDataEntrega(e.target.value)}
                    />
                  </div>
                </div>

                {/* Membros do Grupo */}
                <div className="space-y-2">
                  <Label>Membros do Grupo</Label>
                  <ScrollArea className="h-48 border rounded-lg p-3">
                    <div className="space-y-2">
                      {users.map((u) => (
                        <div key={u.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={u.id}
                            checked={membrosGrupo.includes(u.id)}
                            onCheckedChange={() => toggleMembro(u.id)}
                          />
                          <label
                            htmlFor={u.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {u.nome}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {membrosGrupo.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {membrosGrupo.length} {membrosGrupo.length === 1 ? 'membro selecionado' : 'membros selecionados'}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Semestre */}
            <div className="space-y-2">
              <Label htmlFor="semestre">Semestre *</Label>
              <Select value={semestre} onValueChange={(value) => setSemestre(value as Semestre)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTRES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading || !autorNome}>
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Publicando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publicar na Sala
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
