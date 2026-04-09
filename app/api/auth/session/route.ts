import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

const SESSION_COOKIE = 'sala-e-session'

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value

  if (!sessionId) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = db.users.get(sessionId)
  
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const { senha: _, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword })
}
