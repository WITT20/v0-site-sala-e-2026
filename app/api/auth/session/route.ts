import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

const SESSION_COOKIE = 'sala-e-session'

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value

  console.log('[v0] Session check, cookie:', sessionId)

  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = db.users.get(sessionId)
  
  if (!user) {
    console.log('[v0] User not found for session:', sessionId)
    return NextResponse.json({ user: null }, { status: 401 })
  }

  console.log('[v0] Session valid for:', user.nome)

  const { senha: _, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword })
}
