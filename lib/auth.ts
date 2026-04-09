'use server'

import { cookies } from 'next/headers'
import { db, type User } from './db'

const SESSION_COOKIE = 'sala-e-session'

export async function login(nome: string, senha: string): Promise<{ success: boolean; error?: string; user?: Omit<User, 'senha'> }> {
  const user = db.findUserByNome(nome)
  
  if (!user) {
    return { success: false, error: 'Usuário não encontrado' }
  }
  
  if (user.senha !== senha) {
    return { success: false, error: 'Senha incorreta' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })

  const { senha: _, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
}

export async function register(
  nome: string, 
  senha: string, 
  confirmarSenha: string,
  telefone?: string
): Promise<{ success: boolean; error?: string; user?: Omit<User, 'senha'> }> {
  if (senha !== confirmarSenha) {
    return { success: false, error: 'As senhas não coincidem' }
  }

  if (senha.length < 4) {
    return { success: false, error: 'A senha deve ter pelo menos 4 caracteres' }
  }

  if (nome.length < 3) {
    return { success: false, error: 'O nome deve ter pelo menos 3 caracteres' }
  }

  const existingUser = db.findUserByNome(nome)
  if (existingUser) {
    return { success: false, error: 'Já existe um usuário com este nome' }
  }

  const user = db.createUser(nome, senha, telefone)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  const { senha: _, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<Omit<User, 'senha'> | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value

    if (!sessionId) {
      return null
    }

    const user = db.users.get(sessionId)
    if (!user) {
      return null
    }

    const { senha: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<Omit<User, 'senha'>> {
  const user = await getSession()
  if (!user) {
    throw new Error('Não autorizado')
  }
  return user
}

export async function requireAdmin(): Promise<Omit<User, 'senha'>> {
  const user = await requireAuth()
  if (!user.isAdmin) {
    throw new Error('Acesso restrito ao administrador')
  }
  return user
}
