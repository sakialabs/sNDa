"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Upload, 
  Link, 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon,
  Video,
  FileText,
  X,
  Calendar,
  User,
  MapPin,
  Clock,
  Award,
  Eye,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface CaseReference {
  id: string;
  title: string;
  status: string;
  clientName: string;
  completedAt?: string;
}

interface Assignment {
  id: string;
  caseTitle: string;
  status: string;
  completedAt?: string;
  actualHours?: number;
}

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  storyType: 'EXPERIENCE' | 'CASE_UPDATE' | 'REFLECTION' | 'MILESTONE';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  relatedCase?: CaseReference;
  relatedAssignment?: Assignment;
  media: {
    type: 'image' | 'video' | 'link' | 'document';
    url: string;
    thumbnail?: string;
    title?: string;
  }[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  publishedAt?: string;
  tags: string[];
}

interface StoryFormData {
  title: string;
  content: string;
  storyType: Story['storyType'];
  relatedCaseId?: string;
  relatedAssignmentId?: string;
  links: string[];
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
}

export function EnhancedStorySharing() {
  const [stories, setStories] = useState<Story[]>([]);
  const [userCases, setUserCases] = useState<CaseReference[]>([]);
  const [userAssignments, setUserAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    content: '',
    storyType: 'EXPERIENCE',
    links: [''],
    tags: [],
    status: 'PUBLISHED'
  });
  const [newTag, setNewTag] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | Story['storyType']>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | Story['status']>('ALL');

  useEffect(() => {
    loadUserData();
    loadStories();
  }, []);

  const loadUserData = async () => {
    try {
      // Simulate loading user's cases and assignments
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserCases([
        {
          id: '1',
          title: 'Medical Support for Sarah',
          status: 'COMPLETED',
          clientName: 'Sarah Johnson',
          completedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Family Support Services',
          status: 'IN_PROGRESS',
          clientName: 'Maria Rodriguez'
        }
      ]);

      setUserAssignments([
        {
          id: '1',
          caseTitle: 'Medical Support for Sarah',
          status: 'COMPLETED',
          completedAt: '2024-01-15T10:00:00Z',
          actualHours: 12
        }
      ]);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadStories = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStories([
        {
          id: '1',
          title: 'A Journey of Hope: Supporting Sarah\'s Recovery',
          content: 'Working with Sarah and her family has been one of the most rewarding experiences of my volunteer journey. When I first met them, Sarah was struggling with her medical condition, and the family was overwhelmed by the complexity of navigating the healthcare system...',
          author: {
            name: 'Ahmed Hassan',
            role: 'Volunteer'
          },
          storyType: 'CASE_UPDATE',
          status: 'PUBLISHED',
          relatedCase: {
            id: '1',
            title: 'Medical Support for Sarah',
            status: 'COMPLETED',
            clientName: 'Sarah Johnson',
            completedAt: '2024-01-15T10:00:00Z'
          },
          media: [
            {
              type: 'image',
              url: '/placeholder-image.jpg',
              title: 'Community Support Event'
            }
          ],
          likes: 24,
          comments: 8,
          shares: 3,
          views: 156,
          createdAt: '2024-01-16T14:30:00Z',
          publishedAt: '2024-01-16T14:30:00Z',
          tags: ['medical-support', 'family-care', 'success-story']
        }
      ]);
    } catch (error) {
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStory = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const relatedCase = formData.relatedCaseId 
        ? userCases.find(c => c.id === formData.relatedCaseId)
        : undefined;
      
      const relatedAssignment = formData.relatedAssignmentId
        ? userAssignments.find(a => a.id === formData.relatedAssignmentId)
        : undefined;

      const newStory: Story = {
        id: editingStory?.id || Date.now().toString(),
        title: formData.title,
        content: formData.content,
        author: {
          name: "Current User",
          role: "Volunteer"
        },
        storyType: formData.storyType,
        status: formData.status,
        relatedCase,
        relatedAssignment,
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
        likes: editingStory?.likes || 0,
        comments: editingStory?.comments || 0,
        shares: editingStory?.shares || 0,
        views: editingStory?.views || 0,
        createdAt: editingStory?.createdAt || new Date().toISOString(),
        publishedAt: formData.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
        tags: formData.tags
      };

      if (editingStory) {
        setStories(prev => prev.map(s => s.id === editingStory.id ? newStory : s));
        toast.success("Story updated successfully!");
      } else {
        setStories(prev => [newStory, ...prev]);
        toast.success(`Story ${formData.status === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully!`);
      }

      resetForm();
    } catch (error) {
      toast.error("Failed to save story");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      storyType: 'EXPERIENCE',
      links: [''],
      tags: [],
      status: 'PUBLISHED'
    });
    setUploadedFiles([]);
    setShowForm(false);
    setEditingStory(null);
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      content: story.content,
      storyType: story.storyType,
      relatedCaseId: story.relatedCase?.id,
      relatedAssignmentId: story.relatedAssignment?.id,
      links: story.media.filter(m => m.type === 'link').map(m => m.url).concat(['']),
      tags: story.tags,
      status: story.status
    });
    setShowForm(true);
  };

  const filteredStories = stories.filter(story => {
    const typeMatch = filterType === 'ALL' || story.storyType === filterType;
    const statusMatch = filterStatus === 'ALL' || story.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const getStoryTypeColor = (type: Story['storyType']) => {
    switch (type) {
      case 'EXPERIENCE': return 'default';
      case 'CASE_UPDATE': return 'secondary';
      case 'REFLECTION': return 'outline';
      case 'MILESTONE': return 'destructive';
      default: return 'outline';
    }
  };

  const getStoryTypeLabel = (type: Story['storyType']) => {
    switch (type) {
      case 'EXPERIENCE': return 'Experience';
      case 'CASE_UPDATE': return 'Case Update';
      case 'REFLECTION': return 'Reflection';
      case 'MILESTONE': return 'Milestone';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Impact Stories</h2>
          <p className="text-muted-foreground">Share your experiences and connect them to your volunteer work</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="animate-fade-in">
          <FileText className="w-4 h-4 mr-2" />
          {editingStory ? 'Edit Story' : 'Share Story'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 animate-fade-in">
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="EXPERIENCE">Experience</SelectItem>
            <SelectItem value="CASE_UPDATE">Case Update</SelectItem>
            <SelectItem value="REFLECTION">Reflection</SelectItem>
            <SelectItem value="MILESTONE">Milestone</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Story Form */}
      {showForm && (
        <Card className="animate-slide-in-from-top">
          <CardHeader>
            <CardTitle>{editingStory ? 'Edit Story' : 'Share Your Story'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Story Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your story a compelling title..."
                />
              </div>
              <div>
                <Label htmlFor="story-type">Story Type</Label>
                <Select value={formData.storyType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, storyType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPERIENCE">Experience Share</SelectItem>
                    <SelectItem value="CASE_UPDATE">Case Update</SelectItem>
                    <SelectItem value="REFLECTION">Personal Reflection</SelectItem>
                    <SelectItem value="MILESTONE">Milestone Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Case/Assignment Connection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="related-case">Related Case (Optional)</Label>
                <Select value={formData.relatedCaseId || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, relatedCaseId: value || undefined }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No case selected</SelectItem>
                    {userCases.map((case_) => (
                      <SelectItem key={case_.id} value={case_.id}>
                        {case_.title} - {case_.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="related-assignment">Related Assignment (Optional)</Label>
                <Select value={formData.relatedAssignmentId || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, relatedAssignmentId: value || undefined }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignment..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No assignment selected</SelectItem>
                    {userAssignments.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id}>
                        {assignment.caseTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Your Story</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your experience, challenges overcome, or moments of impact..."
                rows={8}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'PUBLISHED' }));
                  handleSubmitStory();
                }} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Publishing..." : "Publish Story"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'DRAFT' }));
                  handleSubmitStory();
                }}
                disabled={loading}
              >
                Save Draft
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stories List */}
      <div className="grid gap-6">
        {loading && filteredStories.length === 0 && (
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

        {filteredStories.map((story) => (
          <Card key={story.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2">
                  <Badge variant={getStoryTypeColor(story.storyType)}>
                    {getStoryTypeLabel(story.storyType)}
                  </Badge>
                  <Badge variant={story.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {story.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStory(story)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4">{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Case/Assignment Connection */}
              {(story.relatedCase || story.relatedAssignment) && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  {story.relatedCase && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Related Case:</span>
                      <span>{story.relatedCase.title} - {story.relatedCase.clientName}</span>
                      <Badge variant="outline">{story.relatedCase.status}</Badge>
                    </div>
                  )}
                  {story.relatedAssignment && (
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Assignment:</span>
                      <span>{story.relatedAssignment.caseTitle}</span>
                      {story.relatedAssignment.actualHours && (
                        <span>({story.relatedAssignment.actualHours}h)</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <p className="text-muted-foreground mb-4 line-clamp-3">{story.content}</p>
              
              {story.media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {story.media.slice(0, 6).map((media, index) => (
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
                    <Badge key={tag} variant="outline">#{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {story.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {story.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    {story.shares}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {story.views}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : 'Draft'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredStories.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No stories found</h3>
              <p className="text-muted-foreground mb-4">
                {filterType !== 'ALL' || filterStatus !== 'ALL' 
                  ? 'Try adjusting your filters or create a new story.'
                  : 'Start sharing your volunteer experiences and impact stories!'
                }
              </p>
              <Button onClick={() => setShowForm(true)}>
                Share Your First Story
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
