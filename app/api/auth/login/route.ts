import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

const SESSION_COOKIE = 'sala-e-session'

export async function POST(request: Request) {
  try {
    const { nome, senha } = await request.json()
    
    const user = db.findUserByNome(nome)
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario nao encontrado' })
    }
    
    if (user.senha !== senha) {
      return NextResponse.json({ success: false, error: 'Senha incorreta' })
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    })

    const { senha: _, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch {
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 })
  }
}
