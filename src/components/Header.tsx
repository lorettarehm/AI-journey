
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun, Menu, MessageCircle } from 'lucide-react';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="font-semibold text-xl">
            NeuroDev
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link 
              to="/" 
              className={`text-sm transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/assessment" 
                  className={`text-sm transition-colors hover:text-primary ${location.pathname === '/assessment' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  Assessment
                </Link>
                <Link 
                  to="/techniques" 
                  className={`text-sm transition-colors hover:text-primary ${location.pathname === '/techniques' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  Techniques
                </Link>
                <Link 
                  to="/chat" 
                  className={`text-sm transition-colors hover:text-primary ${location.pathname === '/chat' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  AI Coach
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-sm transition-colors hover:text-primary ${location.pathname === '/profile' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  Profile
                </Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSelector />
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <MoonStar className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {user ? (
            <>
              <Link to="/chat">
                <Button variant="outline" size="icon" className="mr-2">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
