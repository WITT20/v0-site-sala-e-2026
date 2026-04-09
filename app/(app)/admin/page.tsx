'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { getSalaConfig, updateSalaConfig } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Save, MessageCircle, Instagram, Shield, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/')
      return
    }

    async function loadConfig() {
      const config = await getSalaConfig()
      setWhatsappLink(config.whatsappLink)
      setInstagramLink(config.instagramLink)
      setLoading(false)
    }
    loadConfig()
  }, [user, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const result = await updateSalaConfig({
      whatsappLink,
      instagramLink
    })

    if (result.success) {
      toast.success('Configurações salvas com sucesso!')
    } else {
      toast.error(result.error || 'Erro ao salvar configurações')
    }

    setSaving(false)
  }

  if (!user?.isAdmin) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie os links da turma</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Links da Turma</CardTitle>
          <CardDescription>
            Configure os links do WhatsApp e Instagram que aparecerão para todos os alunos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                Link do Grupo do WhatsApp
              </Label>
              <Input
                id="whatsapp"
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Cole o link de convite do grupo do WhatsApp da turma
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Link do Instagram da Sala
              </Label>
              <Input
                id="instagram"
                type="url"
                placeholder="https://instagram.com/..."
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Cole o link do perfil do Instagram da turma
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50 mt-6">
        <CardHeader>
          <CardTitle>Informações do Admin</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Você está logado como administrador.</p>
          <p className="mt-2">
            Para alterar a senha do admin, edite o arquivo <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">lib/db.ts</code> e procure pelo comentário indicando onde alterar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
