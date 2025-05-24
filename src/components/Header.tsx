import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun, Menu, X, MessageCircle, Bug } from 'lucide-react';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfile } from '@/components/profile/settings/personal-info/useProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useProfile();
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('get_user_role');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data === 'supabase_admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

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
            AIva Chat
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm transition-colors hover:text-primary ${location.pathname === '/profile' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          {isAdmin && (
            <Link 
              to="/admin/llm-config" 
              className={`text-sm transition-colors hover:text-primary ${location.pathname === '/admin/llm-config' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              onClick={() => setIsOpen(false)}
            >
              LLM Config
            </Link>
          )}
          <Link 
            to="/debug/llm" 
            className={`text-sm transition-colors hover:text-primary ${location.pathname === '/debug/llm' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setIsOpen(false)}
          >
            <Bug className="h-4 w-4 inline mr-1" />
            Debug
          </Link>
        </>
      )}
    </>
  );

  // Get display name - user's full name if available, otherwise just the app name
  const getDisplayName = () => {
    if (user && profile?.full_name) {
      return (
        <span>
          <span className="text-accent">audhd.ai</span>
          <span className="text-muted-foreground font-normal"> + {profile.full_name}</span>
        </span>
      );
    }
    return <span className="text-accent">audhd.ai</span>;
  };

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
            {getDisplayName()}
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 mr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/settings">Settings</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/llm-config">LLM Configuration</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/debug/llm">
                      <Bug className="h-4 w-4 mr-2" />
                      Debug Tools
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    {getDisplayName()}
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
                          <MessageCircle className="h-5 w-4 mr-2" /> Chat
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