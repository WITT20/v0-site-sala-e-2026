import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

const SESSION_COOKIE = 'sala-e-session'

export async function POST(request: Request) {
  try {
    const { nome, senha, confirmarSenha, telefone } = await request.json()
    
    if (senha !== confirmarSenha) {
      return NextResponse.json({ success: false, error: 'As senhas nao coincidem' })
    }

    if (senha.length < 4) {
      return NextResponse.json({ success: false, error: 'A senha deve ter pelo menos 4 caracteres' })
    }

    if (nome.length < 3) {
      return NextResponse.json({ success: false, error: 'O nome deve ter pelo menos 3 caracteres' })
    }

    const existingUser = db.findUserByNome(nome)
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Ja existe um usuario com este nome' })
    }

    const user = db.createUser(nome, senha, telefone)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    const { senha: _, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch {
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 })
  }
}
