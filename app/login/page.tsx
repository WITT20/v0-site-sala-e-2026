'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GraduationCap, Users, BookOpen, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { login, register, loading } = useAuth()
  const [error, setError] = useState('')

  // Login form
  const [loginNome, setLoginNome] = useState('')
  const [loginSenha, setLoginSenha] = useState('')

  // Register form
  const [registerNome, setRegisterNome] = useState('')
  const [registerTelefone, setRegisterTelefone] = useState('')
  const [registerSenha, setRegisterSenha] = useState('')
  const [registerConfirmarSenha, setRegisterConfirmarSenha] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await login(loginNome, loginSenha)
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await register(registerNome, registerSenha, registerConfirmarSenha, registerTelefone || undefined)
    if (!result.success) {
      setError(result.error || 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Sala E 2026</h1>
          <p className="text-muted-foreground mt-2">1º Ano E - Ensino Médio</p>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>Colaborativo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span>Materiais</span>
          </div>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Bem-vindo!</CardTitle>
            <CardDescription>Entre ou crie sua conta para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full" onValueChange={() => setError('')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-nome">Nome completo</Label>
                    <Input
                      id="login-nome"
                      type="text"
                      placeholder="Seu nome"
                      value={loginNome}
                      onChange={(e) => setLoginNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-senha">Senha</Label>
                    <Input
                      id="login-senha"
                      type="password"
                      placeholder="Sua senha"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nome">Nome completo *</Label>
                    <Input
                      id="register-nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerNome}
                      onChange={(e) => setRegisterNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-telefone">Telefone (opcional)</Label>
                    <Input
                      id="register-telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={registerTelefone}
                      onChange={(e) => setRegisterTelefone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-senha">Senha *</Label>
                    <Input
                      id="register-senha"
                      type="password"
                      placeholder="Crie uma senha"
                      value={registerSenha}
                      onChange={(e) => setRegisterSenha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirmar-senha">Confirmar Senha *</Label>
                    <Input
                      id="register-confirmar-senha"
                      type="password"
                      placeholder="Repita a senha"
                      value={registerConfirmarSenha}
                      onChange={(e) => setRegisterConfirmarSenha(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Plataforma colaborativa para os alunos do 1º Ano E
        </p>
      </div>
    </div>
  )
}
