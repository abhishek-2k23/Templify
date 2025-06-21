import type React from 'react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Home, History, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { HistoryProvider } from '../context/HistoryContext';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'History', href: '/history', icon: History },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <HistoryProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 glass border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                to="/"
                className="text-2xl font-bold text-white hover:text-purple-300 transition-colors"
              >
                Templify
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                        isActive(item.href)
                          ? 'text-white bg-white/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {isActive(item.href) && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <SignedIn>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      baseTheme: dark,
                      variables: {
                        colorBackground: 'hsl(217.2 32.6% 17.5%)',
                        colorText: 'hsl(210 40% 98%)',
                      },
                      elements: {
                        userButtonPopoverCard: 'border border-white/20',
                        userButtonPopoverFooter: 'hidden',
                      },
                    }}
                  />
                </SignedIn>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden glass-dark border-t border-white/20">
              <div className="px-6 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'text-white bg-white/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-white/20 pt-4 mt-4 flex items-center space-x-4">
                  <SignedIn>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        baseTheme: dark,
                        variables: {
                          colorBackground: 'hsl(217.2 32.6% 17.5%)',
                          colorText: 'hsl(210 40% 98%)',
                        },
                        elements: {
                          userButtonPopoverCard: 'border border-white/20',
                          userButtonPopoverFooter: 'hidden',
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="relative z-10">{children}</main>
      </div>
    </HistoryProvider>
  );
}
