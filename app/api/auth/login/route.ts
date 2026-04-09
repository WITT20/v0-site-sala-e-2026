import { NextResponse } from 'next/server'
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

    const { senha: _, ...userWithoutPassword } = user
    
    const response = NextResponse.json({ success: true, user: userWithoutPassword })
    
    response.cookies.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return response
  } catch {
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 })
  }
}
