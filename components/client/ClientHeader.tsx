'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDashboard = () => {
    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">AF</span>
          </div>
          <span className="font-semibold text-lg text-foreground hidden sm:block">
            AutoForge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/brands"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Brands
          </Link>
          <Link
            href="/vehicles"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Vehicles
          </Link>
          <Link
            href="/customize"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Customize
          </Link>
        </div>

        {/* CTA and Menu Button */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                    <span className="text-xs mt-1 px-2 py-0.5 bg-primary/10 text-primary rounded-md w-fit">
                      {user?.role === 'admin' ? '👑 Admin' : '👤 Client'}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={handleDashboard}>
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" size="sm" className="border-border hover:cursor-pointer hover:text-white bg-transparent">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/brands"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>
            <Link
              href="/vehicles"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Vehicles
            </Link>
            <Link
              href="/customize"
              className="text-sm text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Customize
            </Link>
            {isAuthenticated ? (
              <>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Signed in as</p>
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => {
                      handleDashboard();
                      setIsMenuOpen(false);
                    }}
                  >
                    Admin Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-border bg-transparent">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
