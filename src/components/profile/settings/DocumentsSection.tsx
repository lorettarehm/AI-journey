
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, Trash2, FileText, Eye, Download, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string;
  content_text: string | null;
  processed: boolean;
  created_at: string;
}

const DocumentsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocContent, setSelectedDocContent] = useState<string | null>(null);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string>('');

  // Fetch user documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Upload document
  const uploadMutation = useMutation({
    mutationFn: async ({ file, title, description }: { file: File, title: string, description: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Step 1: Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Step 2: Create document record in database
      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          title,
          description: description || null,
          file_path: filePath,
          file_type: file.type
        })
        .select();
      
      if (error) throw error;
      
      // Step 3: Trigger text extraction (if necessary)
      if (data && data[0]) {
        try {
          await fetch(`${window.location.origin}/api/extract-document-text`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              documentId: data[0].id
            }),
          });
        } catch (extractError) {
          console.error("Error triggering text extraction:", extractError);
          // We'll continue even if extraction fails
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully and is being processed.",
      });
    },
    onError: (error) => {
      console.error("Error uploading document:", error);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete document
  const deleteMutation = useMutation({
    mutationFn: async (document: Document) => {
      // Step 1: Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('user_documents')
        .remove([document.file_path]);
      
      if (storageError) throw storageError;
      
      // Step 2: Delete document record from database
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', document.id);
      
      if (error) throw error;
      
      return document.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast({
        title: "Document Deleted",
        description: "The document has been removed from your profile.",
      });
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Process document text extraction
  const processDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`${window.location.origin}/api/extract-document-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error processing document');
      }
      
      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast({
        title: "Document Processing",
        description: "The document is being processed. This may take a moment.",
      });
    },
    onError: (error) => {
      console.error("Error processing document:", error);
      toast({
        title: "Processing Failed",
        description: error.message || "There was an error processing your document.",
        variant: "destructive",
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      
      // Auto-fill title with file name (without extension)
      const fileName = e.target.files[0].name;
      setTitle(fileName.substring(0, fileName.lastIndexOf('.')) || fileName);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for the document.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate progress during upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      await uploadMutation.mutate({ 
        file: selectedFile, 
        title: title.trim(), 
        description: description.trim() 
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (error) {
      clearInterval(progressInterval);
      // Error is handled in the mutation callbacks
    }
  };

  const viewDocumentContent = async (document: Document) => {
    setSelectedDocTitle(document.title);
    
    if (document.content_text) {
      setSelectedDocContent(document.content_text);
    } else {
      setSelectedDocContent("This document has not been processed yet or contains no extractable text.");
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('user_documents')
        .download(document.file_path);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your document is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('word') || fileType.includes('document')) return '📃';
    return '📁';
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload Documents</CardTitle>
          <CardDescription>
            Upload documents to enhance your profile and help us better understand your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <div className="mt-1 flex items-center">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="flex-1"
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your document"
                disabled={isUploading}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a brief description of the document..."
                rows={3}
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                </p>
              </div>
            )}
            
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !title.trim() || isUploading}
              className="w-full"
            >
              <FileUp size={16} className="mr-2" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Documents</CardTitle>
          <CardDescription>
            Manage documents you've uploaded to your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-5 bg-accent/10 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-accent/5 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <FileText size={36} className="mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No Documents Uploaded</h3>
              <p className="text-muted-foreground text-sm">
                Upload documents to enhance your profile and improve personalization.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc: Document) => (
                <div key={doc.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getFileIcon(doc.file_type)}</span>
                        <h4 className="font-medium">{doc.title}</h4>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                        {doc.processed ? ' • Processed' : ' • Processing'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => viewDocumentContent(doc)}
                            disabled={!doc.processed}
                            title="View Content"
                          >
                            <Eye size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{selectedDocTitle}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 overflow-auto max-h-[60vh] p-4 bg-muted/20 rounded-md whitespace-pre-wrap">
                            {selectedDocContent || "Loading content..."}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => downloadDocument(doc)}
                        title="Download"
                      >
                        <Download size={16} />
                      </Button>
                      
                      {!doc.processed && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => processDocumentMutation.mutate(doc.id)}
                          title="Reprocess"
                        >
                          <RefreshCw size={16} />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this document?')) {
                            deleteMutation.mutate(doc);
                          }
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsSection;
