import { BookOpen, Target, Users } from 'lucide-react'

export const practiceOptions = [
  {
    id: 'technical',
    icon: BookOpen,
    title: 'Technical Interview',
    description: 'Practice coding questions and technical problem-solving',
    topics: ['Data Structures', 'Algorithms', 'System Design'],
    color: 'from-blue-500 to-blue-600',
    lightColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    id: 'behavioral',
    icon: Target,
    title: 'Behavioral Interview',
    description: 'Master common interview questions and storytelling',
    topics: ['STAR Method', 'Company Culture', 'Career Goals'],
    color: 'from-green-500 to-emerald-600',
    lightColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    id: 'mixed',
    icon: Users,
    title: 'Mock Interview',
    description: 'Simulate a real interview with AI feedback',
    topics: ['Full Practice', 'Time Management', 'Communication'],
    color: 'from-purple-500 to-indigo-600',
    lightColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
]

export const difficulties = ['Beginner', 'Intermediate', 'Advanced']
