import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const SESSION_COOKIE = 'sala-e-session'

export async function POST(request: Request) {
  try {
    const { nome, senha } = await request.json()
    
    console.log('[v0] Login attempt:', nome)
    
    const user = db.findUserByNome(nome)
    
    if (!user) {
      console.log('[v0] User not found:', nome)
      return NextResponse.json({ success: false, error: 'Usuario nao encontrado' })
    }
    
    if (user.senha !== senha) {
      console.log('[v0] Wrong password for:', nome)
      return NextResponse.json({ success: false, error: 'Senha incorreta' })
    }

    console.log('[v0] Login successful for:', user.id)

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
  } catch (error) {
    console.log('[v0] Login error:', error)
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 })
  }
}
