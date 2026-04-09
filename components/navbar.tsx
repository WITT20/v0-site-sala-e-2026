'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  GraduationCap, 
  Home, 
  PlusCircle, 
  FileText, 
  Settings, 
  LogOut, 
  LogIn,
  Menu,
  MessageCircle,
  Instagram
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { getSalaConfig } from '@/lib/actions'

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/publicar', label: 'Publicar', icon: PlusCircle },
  { href: '/meus-posts', label: 'Meus Posts', icon: FileText },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState({ whatsappLink: '', instagramLink: '' })

  useEffect(() => {
    getSalaConfig().then(setConfig)
  }, [])

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setOpen(false)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              mobile && 'w-full'
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        )
      })}
      {user?.isAdmin && (
        <Link
          href="/admin"
          onClick={() => mobile && setOpen(false)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname === '/admin'
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            mobile && 'w-full'
          )}
        >
          <Settings className="w-4 h-4" />
          Admin
        </Link>
      )}
    </>
  )

  const SocialLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('flex items-center gap-2', mobile && 'flex-col w-full')}>
      {config.whatsappLink && (
        <a 
          href={config.whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
            mobile && 'w-full'
          )}
        >
          <MessageCircle className="w-4 h-4 text-green-500" />
          {mobile && 'Grupo WhatsApp'}
        </a>
      )}
      {config.instagramLink && (
        <a 
          href={config.instagramLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
            mobile && 'w-full'
          )}
        >
          <Instagram className="w-4 h-4 text-pink-500" />
          {mobile && 'Instagram da Sala'}
        </a>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">Sala E 2026</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLinks />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Social Links - Desktop */}
          <div className="hidden md:flex">
            <SocialLinks />
          </div>

          <ThemeToggle />

          {/* User info & Logout - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Olá, <span className="font-medium text-foreground">{user.nome}</span>
                </span>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only">Sair</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-center gap-2 px-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Sala E 2026</p>
                    <p className="text-xs text-muted-foreground">{user?.nome || 'Visitante'}</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  <NavLinks mobile />
                </nav>

                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2 px-3">Links da Turma</p>
                  <SocialLinks mobile />
                </div>

                {user ? (
                  <Button 
                    variant="outline" 
                    className="mt-auto mx-3" 
                    onClick={() => { setOpen(false); logout(); }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)} className="mx-3">
                    <Button variant="default" className="w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
