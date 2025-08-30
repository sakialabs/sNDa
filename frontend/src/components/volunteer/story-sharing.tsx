"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Upload, 
  Link, 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon,
  Video,
  FileText,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  media: {
    type: 'image' | 'video' | 'link';
    url: string;
    thumbnail?: string;
    title?: string;
  }[];
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

interface StoryFormData {
  title: string;
  content: string;
  links: string[];
  tags: string[];
}

export function StorySharing() {
  const t = useTranslations();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    content: '',
    links: [''],
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const handleRemoveLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? value : link)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitStory = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newStory: Story = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        author: {
          name: "Current User", // Would come from auth context
          role: "Volunteer"
        },
        media: [
          ...formData.links.filter(link => link.trim()).map(link => ({
            type: 'link' as const,
            url: link,
            title: 'Shared Link'
          })),
          ...uploadedFiles.map(file => ({
            type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
            url: URL.createObjectURL(file),
            title: file.name
          }))
        ],
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        tags: formData.tags
      };

      setStories(prev => [newStory, ...prev]);
      setFormData({ title: '', content: '', links: [''], tags: [] });
      setUploadedFiles([]);
      setShowForm(false);
      toast.success("Story shared successfully!");
    } catch (error) {
      toast.error("Failed to share story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("stories.title")}</h2>
          <p className="text-muted-foreground">{t("stories.subtitle")}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="animate-fade-in">
          <FileText className="w-4 h-4 mr-2" />
          {t("stories.shareButton")}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-slide-in-from-top">
            <CardHeader>
            <CardTitle>{t("stories.form.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">{t("stories.form.titleLabel")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t("stories.form.titlePlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="content">{t("stories.form.contentLabel")}</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={t("stories.form.contentPlaceholder")}
                rows={6}
              />
            </div>

            <div>
              <Label>Upload Photos/Videos</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("stories.form.uploadHint")}</p>
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-6 h-6" />
                        ) : (
                          <Video className="w-6 h-6" />
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs truncate mt-1">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Related Links</Label>
              {formData.links.map((link, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://example.com"
                  />
                  {formData.links.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddLink}
                className="mt-2"
              >
                <Link className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">Add</Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmitStory} disabled={loading} className="flex-1">
                {loading ? "Sharing..." : "Share Story"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {loading && (
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        )}

        {stories.map((story) => (
          <Card key={story.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={story.author.avatar} />
                  <AvatarFallback>{story.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{story.author.name}</h3>
                  <p className="text-sm text-muted-foreground">{story.author.role}</p>
                </div>
              </div>
              <CardTitle className="mt-4">{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{story.content}</p>
              
              {story.media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {story.media.map((media, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      {media.type === 'image' && <ImageIcon className="w-8 h-8" />}
                      {media.type === 'video' && <Video className="w-8 h-8" />}
                      {media.type === 'link' && <Link className="w-8 h-8" />}
                    </div>
                  ))}
                </div>
              )}

              {story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    {story.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {story.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {stories.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your volunteer experience!
              </p>
              <Button onClick={() => setShowForm(true)}>
                Share Your Story
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
