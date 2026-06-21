import React from 'react';
import { 
  Users, Zap, Trophy, Video, 
  BrainCircuit, Mic, FileText, LineChart, MessageSquare, Clock 
} from 'lucide-react';

export const statsData = [
  {
    id: 1,
    icon: <Users className="w-8 h-8 text-blue-500" />,
    value: 200,
    suffix: "k+",
    label: "Interviews Completed"
  },
  {
    id: 2,
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    value: 10,
    suffix: "X",
    label: "Faster Preparation"
  },
  {
    id: 3,
    icon: <Trophy className="w-8 h-8 text-emerald-500" />,
    value: 93,
    suffix: "%",
    label: "Success Rate"
  },
  {
    id: 4,
    icon: <Video className="w-8 h-8 text-indigo-500" />,
    value: 50,
    suffix: "+",
    label: "Platforms Supported"
  }
];

export const featuresData = [
  {
    icon: <BrainCircuit className="w-6 h-6 text-blue-500" />,
    title: "AI-Powered Insights",
    description: "Receive instant, tailored feedback based on your answers using our advanced AI algorithms."
  },
  {
    icon: <Mic className="w-6 h-6 text-indigo-500" />,
    title: "Voice Analysis",
    description: "Practice with realistic audio interviews. Our AI listens to your tone, pacing, and speech clarity."
  },
  {
    icon: <FileText className="w-6 h-6 text-purple-500" />,
    title: "Resume-Based Questions",
    description: "Upload your resume to get highly specific interview questions tailored to your actual experience."
  },
  {
    icon: <LineChart className="w-6 h-6 text-emerald-500" />,
    title: "Performance Tracking",
    description: "Monitor your progress over time with detailed scoring metrics and improvement areas."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
    title: "Real-time Suggestions",
    description: "Get subtle hints and optimal answer structures live during your practice sessions."
  },
  {
    icon: <Clock className="w-6 h-6 text-rose-500" />,
    title: "Flexible Sessions",
    description: "Practice anytime, anywhere. Choose your preferred interview duration from 5 to 60 minutes."
  }
];

export const faqsData = [
  {
    question: "How does the AI provide real-time feedback?",
    answer: "Our AI listens to your audio or text input in real-time. It analyzes your answer structure, tone, and pacing against industry-standard responses for the specific role you are practicing for, providing immediate on-screen suggestions."
  },
  {
    question: "Can I practice for specific job roles?",
    answer: "Yes! You can upload your resume or paste a job description. The AI will tailor the interview questions specifically to the role, company, and your past experience."
  },
  {
    question: "Is my interview data kept private?",
    answer: "Absolutely. We do not share your resumes, interview audio, or personal data with any employers or third parties. All your practice data is strictly for your own review and improvement."
  },
  {
    question: "What languages do you support?",
    answer: "Currently, our primary AI model supports English for both text and voice analysis. We are actively working on adding support for Spanish, French, and German in the near future."
  },
  {
    question: "Do I need to download any software?",
    answer: "No, the entire platform runs directly in your web browser. Just ensure you give microphone and camera permissions if you want to use the live video/audio features."
  }
];

export const testimonialsData = [
  {
    id: 1,
    name: "Emily R.",
    role: "Software Engineer at Google",
    content: "Live Interview AI transformed my interview experience. The real-time suggestions were spot-on!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
  },
  {
    id: 2,
    name: "Michael B.",
    role: "Marketing Manager at Apple",
    content: "This tool was a game-changer. It boosted my confidence significantly.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    id: 3,
    name: "Sofia L.",
    role: "Financial Analyst at Morgan Stanley",
    content: "I was skeptical at first, but Live Interview AI exceeded my expectations. The AI-generated answers felt natural.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia"
  },
  {
    id: 4,
    name: "Carlos M.",
    role: "Data Scientist at Meta",
    content: "I aced my interview and got hired at my dream company thanks to the precise real-time feedback.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
  },
  {
    id: 5,
    name: "Aisha T.",
    role: "Product Manager at Amazon",
    content: "The behavioral question practice is unmatched. It helped me structure my thoughts perfectly.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha"
  }
];
