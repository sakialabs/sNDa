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

export default function VolunteerDashboard() {
  const t = useTranslations()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    if (rank <= 3) return '🥇'
    if (rank <= 10) return '🏆'
    if (rank <= 25) return '🥈'
    if (rank <= 50) return '🥉'
    return '🏅'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="container mx-auto px-4 py-8">Error loading dashboard</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('volunteer.dashboard.welcomeTitle')}</h1>
          <p className="text-gray-600">{t('volunteer.dashboard.welcomeSubtitle')}</p>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.cases_completed}
              </div>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4" />
                {t('volunteer.dashboard.casesCompleted')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className={`text-3xl font-bold mb-1 ${getStreakColor(stats.current_streak)}`}>
                {stats.current_streak}
              </div>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Flame className="h-4 w-4" />
                {t('volunteer.dashboard.currentStreak')} {getStreakEmoji(stats.current_streak)}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.total_points}
              </div>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Star className="h-4 w-4" />
                {t('volunteer.dashboard.totalPoints')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                #{stats.community_rank}
              </div>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {t('volunteer.dashboard.communityRank')} {getRankEmoji(stats.community_rank)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Achievements & Progress */}
          <div className="space-y-6">
            {/* Recent Badges */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  {t('volunteer.dashboard.recentAchievements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recent_badges.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recent_badges.map((badge) => (
                      <div key={badge.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
                        <div className="text-2xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{badge.name}</div>
                          <div className="text-sm text-gray-600">{badge.description}</div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          +{badge.points_value} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>{t('volunteer.dashboard.completeFirstCase')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Streak Progress */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Flame className={`h-5 w-5 ${getStreakColor(stats.current_streak)}`} />
                  {t('volunteer.dashboard.activityStreak')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getStreakColor(stats.current_streak)}`}>
                      {stats.current_streak} {getStreakEmoji(stats.current_streak)}
                    </div>
                    <p className="text-sm text-gray-600">{t('volunteer.dashboard.daysActive')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('volunteer.dashboard.personalBest', { days: stats.longest_streak })}</span>
                      <span>{t('volunteer.dashboard.nextGoal', { days: Math.ceil((stats.current_streak + 1) / 7) * 7 })}</span>
                    </div>
                    <Progress 
                      value={(stats.current_streak % 7) * (100 / 7)} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i}
                        className={`h-8 rounded text-xs flex items-center justify-center ${
                          i < (stats.current_streak % 7) 
                            ? 'bg-orange-200 text-orange-800' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Active Work */}
          <div className="space-y-6">
            {/* Active Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Active Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.active_assignments.length > 0 ? (
                  <div className="space-y-3">
                    {stats.active_assignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {assignment.case.title}
                          </h4>
                          <Badge variant={assignment.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                            {assignment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(assignment.created_at).toLocaleDateString()}
                          </span>
                          {assignment.case.urgency_score && (
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Urgency: {assignment.case.urgency_score}/10
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="mb-2">{t('volunteer.dashboard.noActiveAssignments')}</p>
                    <Button variant="outline" size="sm">{t('volunteer.dashboard.browseCases')}</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  {t('volunteer.dashboard.quickActions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm">{t('volunteer.dashboard.shareStory')}</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">{t('volunteer.dashboard.viewCommunity')}</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Heart className="h-6 w-6" />
                    <span className="text-sm">{t('volunteer.dashboard.donate')}</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Trophy className="h-6 w-6" />
                    <span className="text-sm">{t('volunteer.dashboard.leaderboard')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Stats */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  {t('volunteer.dashboard.recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recent_activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                                <div className="text-sm font-medium">
                                  {activity.activity_type.replace('_', ' ').toLowerCase()}
                                </div>
                          <div className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{activity.points_earned} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <Card>
                  <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  {t('volunteer.dashboard.yourImpact')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500 mb-1">
                      {stats.cases_completed + stats.stories_published}
                    </div>
                    <p className="text-sm text-gray-600">{t('volunteer.dashboard.livesTouched')}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {stats.stories_published}
                      </div>
                      <p className="text-xs text-gray-600">{t('volunteer.dashboard.storiesShared')}</p>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        {stats.longest_streak}
                      </div>
                      <p className="text-xs text-gray-600">{t('volunteer.dashboard.bestStreak')}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-700">{t('volunteer.dashboard.motivationalQuote')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Motivational Footer */}
        <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="text-center py-6">
            <h3 className="text-xl font-bold mb-2">{t('volunteer.dashboard.keepUpTitle')}</h3>
            <p className="mb-4">{t('volunteer.dashboard.keepUpSubtitle', { rank: stats.community_rank })}</p>
            <Button variant="secondary" size="lg">{t('volunteer.dashboard.findNewCases')}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
