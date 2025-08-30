'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { 
  Trophy, Flame, Star, Target, Clock, BookOpen, 
  TrendingUp, Award, Zap, Heart, Users, Calendar
} from 'lucide-react'

interface DashboardStats {
  cases_completed: number
  current_streak: number
  longest_streak: number
  total_points: number
  recent_badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    color: string
    points_value: number
  }>
  active_assignments: Array<{
    id: string
    case: {
      title: string
      urgency_score: number
    }
    status: string
    created_at: string
  }>
  recent_activities: Array<{
    activity_type: string
    points_earned: number
    created_at: string
  }>
  community_rank: number
  stories_published: number
}

export function VolunteerDashboardClient() {
  const t = useTranslations()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      fetchDashboardStats()
    }
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Only access localStorage in the browser
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        console.error('No authentication token found')
        setLoading(false)
        return
      }

      const response = await fetch('/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600'
    if (streak >= 14) return 'text-orange-600'
    if (streak >= 7) return 'text-red-600'
    if (streak >= 3) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🚀'
    if (streak >= 30) return '🌟'
    if (streak >= 14) return '💫'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '🔥'
    return '✨'
  }

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '👑'
    if (rank <= 5) return '🥇'
    if (rank <= 10) return '🥈'
    if (rank <= 20) return '🥉'
    return '⭐'
  }

  const getBadgeIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      trophy: Trophy,
      flame: Flame,
      star: Star,
      target: Target,
      clock: Clock,
      book: BookOpen,
      trending: TrendingUp,
      award: Award,
      zap: Zap,
      heart: Heart,
      users: Users,
      calendar: Calendar
    }
    return icons[iconName] || Trophy
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Unavailable</h2>
            <p className="text-gray-600">Unable to load your volunteer dashboard. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center py-8 bg-white rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('volunteer.dashboard.welcome')}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {t('volunteer.dashboard.subtitle')}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cases Completed */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Cases Completed</p>
                  <p className="text-3xl font-bold">{stats.cases_completed}</p>
                </div>
                <Target className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Current Streak</p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold mr-2">{stats.current_streak}</p>
                    <span className="text-2xl">{getStreakEmoji(stats.current_streak)}</span>
                  </div>
                </div>
                <Flame className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          {/* Total Points */}
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Points</p>
                  <p className="text-3xl font-bold">{stats.total_points.toLocaleString()}</p>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          {/* Community Rank */}
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Community Rank</p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold mr-2">#{stats.community_rank}</p>
                    <span className="text-2xl">{getRankEmoji(stats.community_rank)}</span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Badges */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Recent Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recent_badges?.length > 0 ? (
                stats.recent_badges.slice(0, 3).map((badge) => {
                  const IconComponent = getBadgeIcon(badge.icon)
                  return (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full bg-${badge.color}-100`}>
                        <IconComponent className={`h-4 w-4 text-${badge.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{badge.name}</p>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          +{badge.points_value} points
                        </Badge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent badges</p>
                  <p className="text-sm">Complete more cases to earn badges!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Assignments */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Active Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.active_assignments?.length > 0 ? (
                stats.active_assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{assignment.case.title}</h4>
                      <Badge variant={assignment.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Urgency: {assignment.case.urgency_score}/10
                      </span>
                      <span className="text-gray-500">
                        {new Date(assignment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress 
                      value={assignment.case.urgency_score * 10} 
                      className="mt-2 h-2"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No active assignments</p>
                  <p className="text-sm">New cases will appear here when assigned!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <Zap className="h-5 w-5 mr-2 text-purple-500" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recent_activities?.length > 0 ? (
                stats.recent_activities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 capitalize">
                        {activity.activity_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        +{activity.points_earned}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activities</p>
                  <p className="text-sm">Your activities will appear here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Streak Progress & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Streak Progress */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <Flame className="h-5 w-5 mr-2 text-orange-500" />
                Streak Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Current Streak</span>
                  <div className="flex items-center">
                    <span className={`text-2xl font-bold ${getStreakColor(stats.current_streak)}`}>
                      {stats.current_streak}
                    </span>
                    <span className="ml-2 text-xl">{getStreakEmoji(stats.current_streak)}</span>
                  </div>
                </div>
                <Progress value={(stats.current_streak / Math.max(stats.longest_streak, 30)) * 100} className="h-3" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Personal Best: {stats.longest_streak} days</span>
                  <span>Next Goal: {Math.ceil(stats.current_streak / 7) * 7} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Sharing */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <BookOpen className="h-5 w-5 mr-2 text-green-500" />
                Story Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.stories_published}</div>
                  <div className="text-sm text-gray-600">Stories Published</div>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Share Your Story
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Share your volunteer experience to inspire others!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
