import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, MessageSquare, AlertCircle, CheckCircle2, Bot, User, Clock, Loader2, ArrowRight, X, Sparkles } from 'lucide-react';

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialType = searchParams.get('type') || 'technical';
  const initialPosition = searchParams.get('position') || 'Software Engineer';
  
  const [sessionState, setSessionState] = useState('setup'); // setup, active, completed
  const [interviewId, setInterviewId] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const [config, setConfig] = useState({
    type: initialType,
    position: initialPosition,
  });

  const [chat, setChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [inputText, setInputText] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [timer, setTimer] = useState(0);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const chatEndRef = useRef(null);

  const totalQuestions = 10;
  const isLastQuestion = questionIndex >= totalQuestions;

  const mockQuestions = {
    technical: [
      "Tell me about a time you faced a significant technical challenge. How did you resolve it?",
      "Explain the concept of closures in JavaScript and give a practical use case.",
      "How do you optimize rendering performance in a large-scale React application?",
      "What is the difference between SQL and NoSQL databases, and when would you choose one over the other?",
      "Explain how RESTful API design handles resource versions.",
      "What are the benefits of using TypeScript over vanilla JavaScript?",
      "Describe the difference between server-side rendering (SSR) and static site generation (SSG).",
      "How does the Virtual DOM work in React under the hood?",
      "What is a memory leak in JavaScript, and how do you profile and debug it?",
      "How would you design a scalable caching layer for a high-traffic web application?"
    ],
    behavioral: [
      "Tell me about a time you had a conflict with a team member. How did you handle it?",
      "Describe a situation where you had to work under tight deadlines. How did you organize your tasks?",
      "Give an example of a time you took the lead on a project.",
      "Tell me about a time you failed. What did you learn from the experience?",
      "How do you handle constructive criticism from your peers or manager?",
      "Tell me about a project you are most proud of and why.",
      "Describe a time you had to explain a complex technical concept to a non-technical stakeholder.",
      "How do you stay motivated when working on repetitive tasks?",
      "Describe a time you solved a problem with very limited resources or time.",
      "Why do you want to join our organization, and how does it fit into your career roadmap?"
    ],
    mixed: [
      "Tell me about a time you faced a significant technical challenge. How did you resolve it?",
      "Explain the concept of closures in JavaScript and give a practical use case.",
      "Tell me about a time you had a conflict with a team member. How did you handle it?",
      "How do you optimize rendering performance in a large-scale React application?",
      "Describe a situation where you had to work under tight deadlines. How did you organize your tasks?",
      "What is the difference between SQL and NoSQL databases, and when would you choose one over the other?",
      "Give an example of a time you took the lead on a project.",
      "What are the benefits of using TypeScript over vanilla JavaScript?",
      "Tell me about a time you failed. What did you learn from the experience?",
      "How would you design a scalable caching layer for a high-traffic web application?"
    ]
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    let interval = null;
    if (sessionState === 'active') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartInterview = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockId = `mock-session-${Date.now()}`;
      setInterviewId(mockId);
      setSessionState('active');
      setChat([{ role: 'system', content: `Interview started (Target: ${config.position})` }]);
      
      const qList = mockQuestions[config.type] || mockQuestions.technical;
      setCurrentQuestion(qList[0]);
      setChat(prev => [...prev, { role: 'ai', content: qList[0] }]);
      setIsLoading(false);
    }, 800);
  };

  const fetchNextQuestion = (index) => {
    setIsQuestionLoading(true);
    setTimeout(() => {
      const qList = mockQuestions[config.type] || mockQuestions.technical;
      const nextQ = qList[index - 1] || "Can you elaborate on your experience in modular development?";
      setCurrentQuestion(nextQ);
      setChat(prev => [...prev, { role: 'ai', content: nextQ }]);
      setIsQuestionLoading(false);
    }, 600);
  };

  const submitAnswer = (answer) => {
    if (!answer.trim()) return;
    
    const userMessage = { role: 'user', content: answer };
    setChat(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock evaluation response
      setChat(prev => [...prev, { role: 'system', content: "Feedback: Good answer. You explained the logic structure and metrics well. Recruiter is preparing the next query." }]);
      setIsLoading(false);

      if (isLastQuestion) {
        handleEndInterview();
      } else {
        setQuestionIndex(prev => prev + 1);
        fetchNextQuestion(questionIndex + 1);
      }
    }, 1200);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        submitVoiceAnswer(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const submitVoiceAnswer = (audioBlob) => {
    setIsLoading(true);
    setChat(prev => [...prev, { role: 'user', content: '🎙️ Audio Answer Submitted' }]);

    setTimeout(() => {
      setChat(prev => {
         const newChat = [...prev];
         newChat[newChat.length - 1].content = `🎙️ Transcript: "I implemented a similar component logic on my previous team, integrating central handlers to address boundary conditions."`;
         return newChat;
      });
      
      setChat(prev => [...prev, { role: 'system', content: "Feedback: Evaluated voice response. Coherent structures and metrics recognized." }]);
      setIsLoading(false);

      if (isLastQuestion) {
        handleEndInterview();
      } else {
        setQuestionIndex(prev => prev + 1);
        fetchNextQuestion(questionIndex + 1);
      }
    }, 1200);
  };

  const handleEndInterview = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSessionState('completed');
      setIsLoading(false);
    }, 800);
  };

  if (sessionState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Start Your Interview</h1>
          <p className="text-slate-600 dark:text-slate-400">Configure your AI interviewer settings before we begin.</p>
        </div>
        
        <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto border border-blue-100 dark:border-blue-900/30 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Interview Type</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                value={config.type}
                onChange={(e) => setConfig({...config, type: e.target.value})}
              >
                <option value="technical">Technical Interview</option>
                <option value="behavioral">Behavioral Interview</option>
                <option value="mixed">Mixed (Technical & Behavioral)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Position</label>
              <input 
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                value={config.position}
                onChange={(e) => setConfig({...config, position: e.target.value})}
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
            
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleStartInterview}
                disabled={isLoading}
                className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:transform-none"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Bot className="w-6 h-6" />}
                {isLoading ? 'Preparing AI...' : 'Start Session Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionState === 'completed') {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        <div className="glass-card rounded-3xl p-10 text-center border-t-8 border-t-green-500 shadow-2xl">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Interview Completed!</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Great job completing your practice session. The AI has analyzed your responses and compiled a detailed feedback report.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate(`/history/${interviewId || '1'}`)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              View Full Report
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-white flex flex-col font-sans transition-colors duration-300">
      
      {/* Exit Confirmation Modal Overlay */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Exit Interview?</h3>
            </div>
            <p className="text-slate-600 dark:text-gray-300 text-base leading-relaxed mb-6">
              Are you sure you want to finish this interview early? Leaving the interview in between will affect the results.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  handleEndInterview();
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                Yes, Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <div className="h-16 border-b border-slate-200 dark:border-gray-800 px-6 flex items-center justify-between bg-white dark:bg-[#0B0F19] transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">{config.position}</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400">AI Interview Session</p>
          </div>
        </div>

        <div className="text-sm font-semibold text-slate-600 dark:text-gray-400">
          Question {questionIndex} of {totalQuestions}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-slate-200 dark:border-gray-700 rounded-full px-4 py-1.5 bg-slate-50 dark:bg-[#111423]">
            <Clock className="w-4 h-4 text-slate-500 dark:text-gray-400" />
            <span className="text-sm font-semibold text-slate-800 dark:text-white">{formatTime(timer)}</span>
          </div>
          <button 
            onClick={() => setShowExitConfirm(true)} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Question */}
        <div className="w-1/2 p-8 border-r border-slate-200 dark:border-gray-800 overflow-y-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-indigo-900/30 border border-blue-100 dark:border-indigo-800/50 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-6 h-6 text-blue-600 dark:text-indigo-400" />
            </div>
            <div className="bg-white dark:bg-[#131722] rounded-2xl p-6 border border-slate-200 dark:border-gray-800/60 shadow-lg mt-2 w-full">
              <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3">AI Recruiter</h3>
              {isQuestionLoading ? (
                <div className="animate-pulse space-y-3 w-full py-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700/80 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700/80 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700/80 rounded w-2/3"></div>
                </div>
              ) : (
                <p className="text-lg leading-relaxed text-slate-800 dark:text-gray-200">
                  {currentQuestion || "Initializing AI connection..."}
                </p>
              )}
            </div>
          </div>
          
          {/* Previous messages in a subtle way (optional, to maintain chat history) */}
          <div className="mt-8 space-y-6 opacity-60">
             {chat.map((msg, idx) => (
                msg.role === 'system' ? (
                   <div key={idx} className="text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                      {msg.content}
                   </div>
                ) : msg.content !== currentQuestion && (
                   <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                         msg.role === 'user' ? 'bg-slate-200 dark:bg-gray-800' : 'bg-blue-50 dark:bg-indigo-900/30 border border-blue-100 dark:border-indigo-800/50'
                      }`}>
                         {msg.role === 'user' ? <User className="w-4 h-4 text-slate-500 dark:text-gray-400" /> : <Bot className="w-4 h-4 text-blue-500 dark:text-indigo-400" />}
                      </div>
                      <div className={`max-w-[85%] rounded-xl p-4 text-sm shadow-sm ${
                         msg.role === 'user' ? 'bg-slate-100 dark:bg-[#1C2133] text-slate-700 dark:text-gray-300' : 'bg-white dark:bg-[#131722] text-slate-600 dark:text-gray-400 border border-slate-100 dark:border-slate-800'
                      }`}>
                         {msg.content}
                      </div>
                   </div>
                )
             ))}
             <div ref={chatEndRef} />
          </div>
        </div>

        {/* Right Panel - User Input */}
        <div className="w-1/2 p-8 flex flex-col gap-4 bg-slate-50 dark:bg-[#0B0F19]">
          <div className="bg-white dark:bg-[#151924] border border-slate-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-2 shadow-sm">
            <span className="font-semibold text-slate-800 dark:text-gray-300">Tip:</span>
            <span className="text-slate-600 dark:text-slate-400 text-sm">Use the STAR method: Situation, Task, Action, Result.</span>
          </div>

          <div className="flex-1 flex flex-col bg-white dark:bg-[#111423] border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-inner focus-within:border-indigo-500/50 dark:focus-within:border-indigo-500/50 transition-colors">
            <textarea
              className="flex-1 w-full bg-transparent p-6 outline-none text-slate-800 dark:text-gray-200 resize-none custom-scrollbar text-lg placeholder-slate-400 dark:placeholder-gray-600"
              placeholder="Type your answer here. Be specific and structured."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading || isQuestionLoading || isRecording}
            />
            
            <div className="p-4 bg-slate-50/50 dark:bg-[#0B0F19]/50 border-t border-slate-200 dark:border-gray-800/50 flex items-center justify-between">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || isQuestionLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30' 
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Stop Recording' : 'Voice input'}
              </button>
              
              <div className="text-xs font-medium text-slate-400 dark:text-gray-500">
                {inputText.length}/1500
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              submitAnswer(inputText);
            }}
            disabled={!inputText.trim() && !isRecording || isLoading || isQuestionLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {isLoading ? 'Submitting...' : isLastQuestion ? 'Finish Interview' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
}
