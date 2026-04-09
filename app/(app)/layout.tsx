import { getSession } from '@/lib/auth'
import { AuthProvider } from '@/components/auth-provider'
import { Navbar } from '@/components/navbar'
import { Toaster } from 'sonner'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <AuthProvider initialUser={user}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  )
}
