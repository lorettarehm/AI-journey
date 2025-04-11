
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const ThemeSelector = () => {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as any);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          Pick your mood
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Pick your mood</SheetTitle>
          <SheetDescription>
            Customize the appearance of the app to match your mood.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium">Dark Mode</h4>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Accent Color</h4>
            <p className="text-sm text-muted-foreground">
              Choose your preferred accent color
            </p>
            <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 mt-4">
            {['purple', 'blue', 'green', 'orange', 'pink'].map((color) => (
              <div 
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${colorScheme === color ? 'border-foreground' : 'border-transparent'}`}
                style={{ backgroundColor: `var(--${color})` }}
                onClick={() => setColorScheme(color as any)}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ThemeSelector;
