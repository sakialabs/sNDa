'use client'

import { useState, useEffect } from 'react'
import { connectWS } from '@/lib/ws'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Heart, Trophy, Target, Users, BookOpen, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useFormatter, useLocale } from 'next-intl'

interface PublicStory {
  id: string
  title: string
  content: string
  author_name: string
  case_title: string
  story_type: string
  tags: string[]
  likes_count: number
  published_at: string
  media: any[]
}

interface CommunityGoal {
  id: string
  title: string
  description: string
  goal_type: string
  target_value: number
  current_value: number
  progress_percentage: number
  icon: string
  is_completed: boolean
  end_date: string
}

interface CommunityStats {
  total_cases_resolved: number
  total_volunteers: number
  total_stories: number
  active_goals: number
  top_volunteers: Array<{
    name: string
    points: number
    cases_completed: number
    current_streak: number
  }>
  recent_achievements: Array<{
    volunteer_name: string
    badge_name: string
    badge_icon: string
    earned_at: string
  }>
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    }
  }
}

export default function CommunityClient() {
  const locale = useLocale()
  const f = useFormatter()
  const prefix = `/${locale}`
  const isAR = locale === 'ar'
  const [stories, setStories] = useState<PublicStory[]>([])
  const [goals, setGoals] = useState<CommunityGoal[]>([])
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommunityData()
  }, [])

  // Live updates via WebSocket
  useEffect(() => {
    // Connect once component is mounted
    const disconnect = connectWS<any>("/ws/stories/", (msg) => {
      const story: PublicStory | undefined = msg?.story ?? msg
      if (!story || !story.id || !story.title) return
      setStories((prev) => [story, ...prev])
    })
    return () => disconnect()
  }, [])

  const fetchCommunityData = async () => {
    try {
      setLoading(true)
      
      // Mock data for development
      const mockStats: CommunityStats = {
        total_cases_resolved: 1247,
        total_volunteers: 89,
        total_stories: 156,
        active_goals: 4,
        top_volunteers: [
          { name: "Sarah Ahmed", points: 2850, cases_completed: 23, current_streak: 12 },
          { name: "Omar Hassan", points: 2340, cases_completed: 19, current_streak: 8 },
          { name: "Layla Mahmoud", points: 2100, cases_completed: 17, current_streak: 15 },
          { name: "Yusuf Ali", points: 1890, cases_completed: 15, current_streak: 6 }
        ],
        recent_achievements: [
          { volunteer_name: "Sarah Ahmed", badge_name: "Case Champion", badge_icon: "🏆", earned_at: "2024-01-15" },
          { volunteer_name: "Omar Hassan", badge_name: "Story Teller", badge_icon: "📖", earned_at: "2024-01-14" },
          { volunteer_name: "Layla Mahmoud", badge_name: "Streak Master", badge_icon: "🔥", earned_at: "2024-01-13" }
        ]
      }

      const mockGoals: CommunityGoal[] = [
        {
          id: "1",
          title: "Monthly Case Resolution",
          description: "Resolve 50 cases this month",
          goal_type: "cases",
          target_value: 50,
          current_value: 34,
          progress_percentage: 68,
          icon: "🎯",
          is_completed: false,
          end_date: "2024-01-31"
        },
        {
          id: "2", 
          title: "New Volunteer Recruitment",
          description: "Welcome 10 new volunteers",
          goal_type: "volunteers",
          target_value: 10,
          current_value: 7,
          progress_percentage: 70,
          icon: "👥",
          is_completed: false,
          end_date: "2024-01-31"
        },
        {
          id: "3",
          title: "Story Sharing",
          description: "Share 20 inspiring stories",
          goal_type: "stories",
          target_value: 20,
          current_value: 15,
          progress_percentage: 75,
          icon: "📚",
          is_completed: false,
          end_date: "2024-01-31"
        }
      ]

      const mockStories: PublicStory[] = [
        {
          id: "1",
          title: "A New Beginning for Amira",
          content: "When I first met Amira, she was struggling with her studies and feeling isolated. Through our mentorship program, we worked together on building her confidence. Today, she's excelling in school and has made wonderful friends. Seeing her smile and enthusiasm for learning reminds me why I volunteer.",
          author_name: "Sarah Ahmed",
          case_title: "Educational Support - Amira K.",
          story_type: "success",
          tags: ["education", "mentorship", "confidence"],
          likes_count: 24,
          published_at: "2024-01-10",
          media: []
        },
        {
          id: "2",
          title: "Building Bridges Through Art",
          content: "Omar came to us withdrawn and struggling to express himself. We introduced him to art therapy, and the transformation has been incredible. His paintings now tell stories of hope and resilience. Art became his voice when words failed him.",
          author_name: "Layla Mahmoud", 
          case_title: "Emotional Support - Omar T.",
          story_type: "breakthrough",
          tags: ["art therapy", "emotional support", "creativity"],
          likes_count: 31,
          published_at: "2024-01-08",
          media: []
        },
        {
          id: "3",
          title: "From Fear to Friendship",
          content: "Nour was afraid to interact with other children due to past trauma. Through patient support and group activities, she slowly opened up. Last week, she organized a small party for her new friends. Her journey from isolation to leadership inspires us all.",
          author_name: "Omar Hassan",
          case_title: "Social Integration - Nour M.",
          story_type: "progress",
          tags: ["social skills", "trauma recovery", "leadership"],
          likes_count: 18,
          published_at: "2024-01-05",
          media: []
        }
      ]

      setStats(mockStats)
      setGoals(mockGoals)
      setStories(mockStories)
    } catch (error) {
      console.error('Error fetching community data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto py-8">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 w-72 bg-muted animate-pulse rounded mx-auto mb-3" />
            <div className="h-4 w-[36rem] max-w-full bg-muted animate-pulse rounded mx-auto" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="h-6 w-6 bg-muted animate-pulse rounded mb-3" />
                <div className="h-7 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-28 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>

          {/* Goals + Stories skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-lg border p-6">
                <div className="h-5 w-40 bg-muted animate-pulse rounded mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 mb-3">
                    <div className="h-4 w-56 bg-muted animate-pulse rounded" />
                    <div className="h-2 w-full bg-muted animate-pulse rounded" />
                    <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>

              <div className="rounded-lg border p-6">
                <div className="h-5 w-48 bg-muted animate-pulse rounded mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-lg border p-6">
              <div className="h-5 w-48 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border-l-4 pl-4 border-primary/20 py-2">
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 w-2/3 bg-muted animate-pulse rounded mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Community Impact
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Together, we're creating lasting change in the lives of children and families. 
            Every volunteer contribution, every story shared, and every goal achieved brings us closer to our mission.
          </p>
        </motion.div>

        {/* Community Stats */}
        {stats && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <motion.div variants={itemVariants}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold text-foreground">{f.number(stats.total_cases_resolved)}</div>
                  <p className="text-sm text-muted-foreground">Cases Resolved</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold text-foreground">{f.number(stats.total_volunteers)}</div>
                  <p className="text-sm text-muted-foreground">Active Volunteers</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold text-foreground">{f.number(stats.total_stories)}</div>
                  <p className="text-sm text-muted-foreground">Stories Shared</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold text-foreground">{f.number(stats.active_goals)}</div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Community Goals */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Community Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal.icon} {goal.title}</span>
                      <Badge variant={goal.is_completed ? "default" : "secondary"}>
                        {f.number(goal.current_value)}/{f.number(goal.target_value)}
                      </Badge>
                    </div>
                    <Progress value={goal.progress_percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Volunteers */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.top_volunteers.map((volunteer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                        </div>
                        <div>
                          <div className="font-medium">{volunteer.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {f.number(volunteer.cases_completed)} cases • {f.number(volunteer.current_streak)} day streak
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{f.number(volunteer.points)} pts</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Wall of Love - Stories */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Wall of Love
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real stories from our volunteers making a difference
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stories.map((story, idx) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 12, backgroundColor: 'rgba(var(--primary), 0.04)' as any }}
                      animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)' as any }}
                      transition={{ duration: 0.5, delay: Math.min(idx * 0.02, 0.2) }}
                      className={`${isAR ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-primary/20 py-2 rounded`}
                      layout
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{story.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {story.author_name} • {story.case_title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{f.number(story.likes_count)}</span>
                        </div>
                      </div>
                      
                      <p className="text-foreground mb-3 line-clamp-3">{story.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {story.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{f.dateTime(new Date(story.published_at), { dateStyle: 'medium' })}</span>
                      </div>
                    </motion.div>
                  ))}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`${isAR ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-primary/20 py-2`}>
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-3 w-2/3 bg-muted animate-pulse rounded mb-3" />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Achievements */}
        {stats && stats.recent_achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.recent_achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl">{achievement.badge_icon}</div>
                      <div>
                        <div className="font-medium">{achievement.volunteer_name}</div>
                        <div className="text-sm text-muted-foreground">earned {achievement.badge_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.dateTime(new Date(achievement.earned_at), { dateStyle: 'medium' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Join Our Community</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Be part of the change. Every volunteer makes a difference in a child's life.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={`${prefix}/login`}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Become a Volunteer
                  </Button>
                </Link>
                <Link href={`${prefix}/volunteer`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
