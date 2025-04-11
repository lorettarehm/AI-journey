
import React, { useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ThemeSelector = () => {
  const { theme, colorScheme, customColor, setTheme, setColorScheme, setCustomColor } = useTheme();
  const [tempCustomColor, setTempCustomColor] = useState(customColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as any);
    if (value === 'custom') {
      setShowColorPicker(true);
    } else {
      setShowColorPicker(false);
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempCustomColor(e.target.value);
  };

  const applyCustomColor = () => {
    setCustomColor(tempCustomColor);
  };

  const predefinedColors = [
    { name: 'Purple', value: 'purple', hex: '#9b87f5' },
    { name: 'Blue', value: 'blue', hex: '#0EA5E9' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Orange', value: 'orange', hex: '#F97316' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Custom', value: 'custom', hex: customColor },
  ];

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
                <SelectItem value="custom">Custom Color</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Color swatches */}
          <div className="flex flex-wrap gap-2 mt-4">
            {predefinedColors.slice(0, 5).map((color) => (
              <div 
                key={color.value}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${colorScheme === color.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setColorScheme(color.value as any)}
                title={color.name}
              />
            ))}
            <div 
              className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${colorScheme === 'custom' ? 'border-foreground scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: customColor }}
              onClick={() => handleColorSchemeChange('custom')}
              title="Custom"
            >
              <Palette className="h-4 w-4 m-1.5 text-white mix-blend-difference" />
            </div>
          </div>
          
          {/* Custom color picker */}
          {showColorPicker && (
            <Card className="mt-4">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Custom Color</h4>
                  
                  {/* Color preview */}
                  <div 
                    className="w-full h-12 rounded-md mb-2"
                    style={{ backgroundColor: tempCustomColor }}
                  />
                  
                  {/* Hex input */}
                  <div className="flex items-center gap-2">
                    <Input 
                      type="text" 
                      value={tempCustomColor} 
                      onChange={handleCustomColorChange}
                      placeholder="#RRGGBB"
                      pattern="^#([A-Fa-f0-9]{6})$"
                      className="font-mono"
                    />
                    <input 
                      type="color" 
                      value={tempCustomColor}
                      onChange={(e) => setTempCustomColor(e.target.value)}
                      className="w-10 h-10 rounded-md cursor-pointer"
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-2" 
                    onClick={applyCustomColor}
                  >
                    Apply Custom Color
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ThemeSelector;
