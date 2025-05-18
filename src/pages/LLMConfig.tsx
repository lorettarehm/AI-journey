import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

interface LLMModel {
  id: string;
  model_name: string;
  api_key: string;
  invocation_order: number;
  api_url: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Function to validate API key format based on common patterns
const validateAPIKey = (apiKey: string, modelName: string): { isValid: boolean; error?: string } => {
  if (!apiKey) {
    return { isValid: false, error: 'API key is required' };
  }

  // Remove any whitespace
  const cleanKey = apiKey.trim();

  // Check for minimum length
  if (cleanKey.length < 20) {
    return { isValid: false, error: 'API key seems too short' };
  }

  // Check for common API key patterns based on model name
  if (modelName.toLowerCase().includes('openai')) {
    if (!cleanKey.startsWith('sk-')) {
      return { isValid: false, error: 'OpenAI API keys should start with "sk-"' };
    }
  } else if (modelName.toLowerCase().includes('anthropic')) {
    if (!cleanKey.startsWith('sk-ant-')) {
      return { isValid: false, error: 'Anthropic API keys should start with "sk-ant-"' };
    }
  } else if (modelName.toLowerCase().includes('mistral')) {
    // Add specific validation for Mistral if needed
  }

  // Check for invalid characters
  if (!/^[A-Za-z0-9_-]+$/.test(cleanKey)) {
    return { isValid: false, error: 'API key contains invalid characters' };
  }

  return { isValid: true };
};

// Function to validate API URL
const validateAPIURL = (url: string): { isValid: boolean; error?: string } => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

const LLMConfig = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [models, setModels] = useState<LLMModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<{
    model_name?: string;
    api_key?: string;
    api_url?: string;
  }>({});
  
  // Form state for adding/editing models
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModel, setCurrentModel] = useState<LLMModel | null>(null);
  const [formData, setFormData] = useState({
    model_name: '',
    api_key: '',
    api_url: '',
    enabled: true
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

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
  }, [user, navigate]);

  // Fetch LLM models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('llm_models')
          .select('*')
          .order('invocation_order', { ascending: true });
        
        if (error) throw error;
        
        setModels(data || []);
        
        // Initialize showApiKeys state
        const initialShowState: Record<string, boolean> = {};
        data?.forEach(model => {
          initialShowState[model.id] = false;
        });
        setShowApiKeys(initialShowState);
      } catch (error) {
        console.error('Error fetching LLM models:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch LLM models',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [toast]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error when field is modified
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: {
      model_name?: string;
      api_key?: string;
      api_url?: string;
    } = {};

    if (!formData.model_name.trim()) {
      errors.model_name = 'Model name is required';
    }

    const apiKeyValidation = validateAPIKey(formData.api_key, formData.model_name);
    if (!apiKeyValidation.isValid) {
      errors.api_key = apiKeyValidation.error;
    }

    const apiUrlValidation = validateAPIURL(formData.api_url);
    if (!apiUrlValidation.isValid) {
      errors.api_url = apiUrlValidation.error;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open dialog for adding a new model
  const handleAddModel = () => {
    setIsEditing(false);
    setCurrentModel(null);
    setFormData({
      model_name: '',
      api_key: '',
      api_url: '',
      enabled: true
    });
    setValidationErrors({});
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing model
  const handleEditModel = (model: LLMModel) => {
    setIsEditing(true);
    setCurrentModel(model);
    setFormData({
      model_name: model.model_name,
      api_key: model.api_key,
      api_url: model.api_url,
      enabled: model.enabled
    });
    setValidationErrors({});
    setIsDialogOpen(true);
  };

  // Save model (add or update)
  const handleSaveModel = async () => {
    try {
      if (!validateForm()) {
        toast({
          title: 'Validation Error',
          description: 'Please correct the errors in the form',
          variant: 'destructive',
        });
        return;
      }

      if (isEditing && currentModel) {
        // Update existing model
        const { error } = await supabase
          .from('llm_models')
          .update({
            model_name: formData.model_name.trim(),
            api_key: formData.api_key.trim(),
            api_url: formData.api_url.trim(),
            enabled: formData.enabled,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentModel.id);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'LLM model updated successfully',
        });
      } else {
        // Add new model with the next available order
        const nextOrder = models.length > 0 
          ? Math.max(...models.map(m => m.invocation_order)) + 1 
          : 1;
        
        const { error } = await supabase
          .from('llm_models')
          .insert({
            model_name: formData.model_name.trim(),
            api_key: formData.api_key.trim(),
            api_url: formData.api_url.trim(),
            enabled: formData.enabled,
            invocation_order: nextOrder
          });
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'LLM model added successfully',
        });
      }

      // Refresh the models list
      const { data, error } = await supabase
        .from('llm_models')
        .select('*')
        .order('invocation_order', { ascending: true });
      
      if (error) throw error;
      
      setModels(data || []);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving LLM model:', error);
      toast({
        title: 'Error',
        description: 'Failed to save LLM model',
        variant: 'destructive',
      });
    }
  };

  // Delete model
  const handleDeleteModel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('llm_models')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setModels(models.filter(model => model.id !== id));
      
      toast({
        title: 'Success',
        description: 'LLM model deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting LLM model:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete LLM model',
        variant: 'destructive',
      });
    }
  };

  // Move model up in order
  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    try {
      const modelToMove = models[index];
      const modelAbove = models[index - 1];
      
      // Swap invocation orders
      const { error: error1 } = await supabase
        .from('llm_models')
        .update({ invocation_order: modelAbove.invocation_order })
        .eq('id', modelToMove.id);
      
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('llm_models')
        .update({ invocation_order: modelToMove.invocation_order })
        .eq('id', modelAbove.id);
      
      if (error2) throw error2;
      
      // Update local state
      const updatedModels = [...models];
      updatedModels[index] = { ...modelAbove, invocation_order: modelToMove.invocation_order };
      updatedModels[index - 1] = { ...modelToMove, invocation_order: modelAbove.invocation_order };
      updatedModels.sort((a, b) => a.invocation_order - b.invocation_order);
      setModels(updatedModels);
      
      toast({
        title: 'Success',
        description: 'Model order updated',
      });
    } catch (error) {
      console.error('Error updating model order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update model order',
        variant: 'destructive',
      });
    }
  };

  // Move model down in order
  const handleMoveDown = async (index: number) => {
    if (index >= models.length - 1) return;
    
    try {
      const modelToMove = models[index];
      const modelBelow = models[index + 1];
      
      // Swap invocation orders
      const { error: error1 } = await supabase
        .from('llm_models')
        .update({ invocation_order: modelBelow.invocation_order })
        .eq('id', modelToMove.id);
      
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('llm_models')
        .update({ invocation_order: modelToMove.invocation_order })
        .eq('id', modelBelow.id);
      
      if (error2) throw error2;
      
      // Update local state
      const updatedModels = [...models];
      updatedModels[index] = { ...modelBelow, invocation_order: modelToMove.invocation_order };
      updatedModels[index + 1] = { ...modelToMove, invocation_order: modelBelow.invocation_order };
      updatedModels.sort((a, b) => a.invocation_order - b.invocation_order);
      setModels(updatedModels);
      
      toast({
        title: 'Success',
        description: 'Model order updated',
      });
    } catch (error) {
      console.error('Error updating model order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update model order',
        variant: 'destructive',
      });
    }
  };

  // Toggle model enabled status
  const handleToggleEnabled = async (model: LLMModel) => {
    try {
      const { error } = await supabase
        .from('llm_models')
        .update({ 
          enabled: !model.enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', model.id);
      
      if (error) throw error;
      
      // Update local state
      setModels(models.map(m => 
        m.id === model.id ? { ...m, enabled: !m.enabled } : m
      ));
      
      toast({
        title: 'Success',
        description: `Model ${model.enabled ? 'disabled' : 'enabled'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling model status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update model status',
        variant: 'destructive',
      });
    }
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Mask API key for display
  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                  You do not have permission to access this page. This page is restricted to administrators only.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">LLM Configuration</h1>
            <p className="text-muted-foreground">
              Manage the LLM models used by the application. Models are tried in order of priority until a successful response is received.
            </p>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>LLM Models</CardTitle>
                <CardDescription>
                  Configure the models used for AI features. The system will try models in order until one succeeds.
                </CardDescription>
              </div>
              <Button onClick={handleAddModel}>
                <Plus className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : models.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground mb-4">No LLM models configured yet</p>
                  <Button onClick={handleAddModel}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Model
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Order</TableHead>
                        <TableHead>Model Name</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead>API URL</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {models.map((model, index) => (
                        <TableRow key={model.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <span className="mr-2">{model.invocation_order}</span>
                              <div className="flex flex-col">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  className="h-6 w-6"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === models.length - 1}
                                  className="h-6 w-6"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{model.model_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-mono text-sm">
                                {showApiKeys[model.id] ? model.api_key : maskApiKey(model.api_key)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleApiKeyVisibility(model.id)}
                                className="ml-2 h-6 w-6"
                              >
                                {showApiKeys[model.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[200px]">
                            {model.api_url}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={model.enabled}
                              onCheckedChange={() => handleToggleEnabled(model)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditModel(model)}
                              className="mr-1"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete LLM Model</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the "{model.model_name}" model? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteModel(model.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      {/* Dialog for adding/editing models */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit LLM Model' : 'Add LLM Model'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the configuration for this LLM model.' 
                : 'Configure a new LLM model for the application.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="model_name">Model Name</Label>
              <Input
                id="model_name"
                name="model_name"
                value={formData.model_name}
                onChange={handleInputChange}
                placeholder="e.g., Mistral-7B-Instruct-v0.2"
              />
              {validationErrors.model_name && (
                <p className="text-sm text-destructive">{validationErrors.model_name}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                name="api_key"
                value={formData.api_key}
                onChange={handleInputChange}
                placeholder="Enter API key"
                type="password"
              />
              {validationErrors.api_key && (
                <p className="text-sm text-destructive">{validationErrors.api_key}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="api_url">API URL</Label>
              <Input
                id="api_url"
                name="api_url"
                value={formData.api_url}
                onChange={handleInputChange}
                placeholder="e.g., https://api-inference.huggingface.co/models/..."
              />
              {validationErrors.api_url && (
                <p className="text-sm text-destructive">{validationErrors.api_url}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                name="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, enabled: checked }))
                }
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveModel}>
              {isEditing ? 'Update' : 'Add'} Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LLMConfig;