
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun, Menu, X, MessageCircle } from 'lucide-react';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/" 
        className={`text-sm transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
        onClick={() => setIsOpen(false)}
      >
        Home
      </Link>
      {user && (
        <>
          <Link 
            to="/assessment" 
            className={`text-sm transition-colors hover:text-primary ${location.pathname === '/assessment' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setIsOpen(false)}
          >
            Assessment
          </Link>
          <Link 
            to="/techniques" 
            className={`text-sm transition-colors hover:text-primary ${location.pathname === '/techniques' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setIsOpen(false)}
          >
            Techniques
          </Link>
          <Link 
            to="/chat" 
            className={`text-sm transition-colors hover:text-primary ${location.pathname === '/chat' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setIsOpen(false)}
          >
            AI Coach
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm transition-colors hover:text-primary ${location.pathname === '/profile' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-8">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight flex items-center">
            <div className="bg-black rounded-lg p-1 mr-2">
              <img 
                src="/lovable-uploads/7ad3926c-6b1e-49e0-8dc6-5430f621384e.png" 
                alt="Brain logo" 
                className="h-5 w-5 md:h-6 md:w-6" 
              />
            </div>
            <span className="text-accent">audhd.ai</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {!isMobile && <ThemeSelector />}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:inline-flex">
            {theme === 'light' ? <MoonStar className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          {user ? (
            <>
              <Link to="/chat" className="hidden sm:block">
                <Button variant="outline" size="icon" className="mr-2">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="hidden sm:inline-flex"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth" className="hidden sm:block">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8 pb-4 border-b">
                  <Link 
                    to="/" 
                    className="text-xl font-bold flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="bg-black rounded-lg p-1 mr-2">
                      <img 
                        src="/lovable-uploads/7ad3926c-6b1e-49e0-8dc6-5430f621384e.png" 
                        alt="Brain logo" 
                        className="h-5 w-5" 
                      />
                    </div>
                    <span className="text-accent">audhd.ai</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col space-y-6 mb-8">
                  <NavLinks />
                </nav>
                
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <ThemeSelector />
                    
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                      {theme === 'light' ? <MoonStar className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </div>
                  
                  {user ? (
                    <div className="grid gap-2 grid-cols-2">
                      <Link to="/chat" className="col-span-1" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="h-5 w-5 mr-2" /> Chat
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full col-span-1"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" className="block w-full" onClick={() => setIsOpen(false)}>
                      <Button variant="default" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
