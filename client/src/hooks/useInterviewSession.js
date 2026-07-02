import { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';

export const useInterviewSession = (config) => {
  const [sessionState, setSessionState] = useState('setup'); // setup, active, completed, cancelled
  const [interviewId, setInterviewId] = useState(null);
  
  const [chat, setChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [inputText, setInputText] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [timer, setTimer] = useState(0);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const totalQuestions = 5;
  const isLastQuestion = questionIndex >= totalQuestions;

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

  const handleStartInterview = async () => {
    setIsLoading(true);
    try {
      const res = await aiService.startInterview({
        type: config.type,
        position: config.position
      });
      
      const interview = res.data;
      setInterviewId(interview._id);
      setSessionState('active');
      setChat([{ role: 'system', content: `Interview started (Target: ${config.position})` }]);
      toast.success('Interview session started. Good luck!');
      
      fetchNextQuestion(interview._id);
    } catch (err) {
      console.error('Failed to start interview:', err);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextQuestion = async (id = interviewId) => {
    setIsQuestionLoading(true);
    try {
      const res = await aiService.getQuestion(id);
      const nextQ = res.data.question;
      setCurrentQuestion(nextQ);
      setChat(prev => [...prev, { role: 'ai', content: nextQ }]);
    } catch (err) {
      console.error('Failed to get question:', err);
      toast.error('Could not fetch the next question.');
      setCurrentQuestion("Could not fetch the next question.");
    } finally {
      setIsQuestionLoading(false);
    }
  };

  const handleEndInterview = async () => {
    setIsLoading(true);
    try {
      await aiService.generateFeedback(interviewId);
      setSessionState('completed');
      toast.success('Interview finished! Review your performance.');
    } catch (err) {
      console.error('Failed to generate feedback:', err);
      toast.error('Failed to generate final report.');
      setSessionState('completed'); // Ensure they can still exit
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInterview = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSessionState('cancelled');
      setIsLoading(false);
    }, 500);
  };

  const submitAnswer = async (answer) => {
    if (!answer.trim()) return;
    
    const userMessage = { role: 'user', content: answer };
    setChat(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      const res = await aiService.submitAnswer(interviewId, {
        question: currentQuestion,
        answer: answer
      });
      
      const evaluation = res.data;
      setChat(prev => [...prev, { 
        role: 'system', 
        content: `Feedback: ${evaluation.feedback} (Score: ${evaluation.score}/100)`,
        idealAnswer: evaluation.idealAnswer,
        starEvaluation: evaluation.starEvaluation
      }]);
      
      if (isLastQuestion) {
        await handleEndInterview();
      } else {
        setQuestionIndex(prev => prev + 1);
        await fetchNextQuestion();
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      toast.error("Failed to evaluate answer.");
      setChat(prev => [...prev, { role: 'system', content: "Error: Failed to evaluate answer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const recognitionRef = useRef(null);
  // Store the text that was already in the box when recording started
  const originalTextRef = useRef('');

  const startRecording = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice typing is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      originalTextRef.current = inputText ? inputText + ' ' : '';
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Update the textarea with the original text + finalized speech + currently speaking speech
        setInputText(originalTextRef.current + finalTranscript + interimTranscript);
        
        // If final, update our baseline so it doesn't get overwritten
        if (finalTranscript) {
          originalTextRef.current += finalTranscript + ' ';
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast.error('Microphone error. Please try again.');
          stopRecording();
        }
      };

      recognition.onend = () => {
        // Auto-restart if we are still supposed to be recording
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsRecording(false);
            isRecordingRef.current = false;
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      isRecordingRef.current = true;
    } catch (err) {
      console.error('Error starting recognition:', err);
      toast.error('Failed to start microphone.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false); // Set this first so onend doesn't restart it
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // We no longer need submitVoiceAnswer since we are just filling the textarea for them to submit normally
  const submitVoiceAnswer = async (audioBlob) => {
    // Deprecated
  };

  return {
    sessionState, interviewId, chat, currentQuestion, inputText, setInputText,
    isRecording, isLoading, isQuestionLoading, questionIndex, timer, totalQuestions, isLastQuestion,
    formatTime, handleStartInterview, handleCancelInterview, handleEndInterview,
    submitAnswer, startRecording, stopRecording
  };
};
