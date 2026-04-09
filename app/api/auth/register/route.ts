import { NextResponse } from 'next/server'
import { register } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { nome, senha, confirmarSenha, telefone } = await request.json()
    const result = await register(nome, senha, confirmarSenha, telefone)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ success: false, error: 'Erro no servidor' }, { status: 500 })
  }
}
