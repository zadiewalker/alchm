'use client';
import { useState, useRef, useEffect } from 'react';

interface VoiceProcessorProps {
  onTranscript: (text: string) => void;
  onEmotionalAnalysis?: (analysis: {
    emotions: string[];
    intensity: number;
    breakthrough: boolean;
    patterns: string[];
  }) => void;
  className?: string;
}

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
};

type SpeechRecognitionErrorLike = {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export default function VoiceProcessor({ 
  onTranscript, 
  onEmotionalAnalysis, 
  className = '' 
}: VoiceProcessorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const speechWindow: SpeechRecognitionWindow = window;
    const SpeechRecognition = speechWindow.webkitSpeechRecognition ?? speechWindow.SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
          analyzeEmotionalContent(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const analyzeEmotionalContent = async (text: string) => {
    if (!onEmotionalAnalysis) return;
    
    setIsAnalyzing(true);

    // Emotional word detection
    const emotionalWords = {
      anger: ['angry', 'furious', 'rage', 'mad', 'irritated', 'frustrated'],
      sadness: ['sad', 'grief', 'sorrow', 'heartbroken', 'depressed', 'melancholy'],
      fear: ['scared', 'afraid', 'terrified', 'anxious', 'worried', 'nervous'],
      joy: ['happy', 'joyful', 'excited', 'elated', 'delighted', 'thrilled'],
      shame: ['ashamed', 'guilty', 'embarrassed', 'humiliated', 'mortified'],
      vulnerability: ['vulnerable', 'exposed', 'raw', 'open', 'defenseless']
    };

    // Breakthrough indicators
    const breakthroughPhrases = [
      'i realize', 'i understand', 'i see now', 'it makes sense',
      'breakthrough', 'revelation', 'clarity', 'insight',
      'i never knew', 'i never thought', 'for the first time'
    ];

    // Pattern recognition
    const shadowPatterns = [
      { pattern: ['control', 'controlling', 'must'], category: 'Control issues' },
      { pattern: ['perfect', 'flawless', 'mistake'], category: 'Perfectionism' },
      { pattern: ['weak', 'failure', 'not enough'], category: 'Self-worth issues' },
      { pattern: ['judge', 'criticism', 'wrong'], category: 'Inner critic' }
    ];

    const lowerText = text.toLowerCase();
    let detectedEmotions: string[] = [];
    let intensity = 0;
    let breakthrough = false;
    let patterns: string[] = [];

    // Detect emotions
    for (const [emotion, words] of Object.entries(emotionalWords)) {
      for (const word of words) {
        if (lowerText.includes(word)) {
          detectedEmotions.push(emotion);
          intensity += 1;
          break;
        }
      }
    }

    // Check for breakthroughs
    breakthrough = breakthroughPhrases.some(phrase => lowerText.includes(phrase));

    // Detect patterns
    for (const { pattern, category } of shadowPatterns) {
      if (pattern.some(p => lowerText.includes(p))) {
        patterns.push(category);
      }
    }

    // Normalize intensity (0-10 scale)
    intensity = Math.min(Math.ceil(intensity * 2), 10);

    setTimeout(() => {
      onEmotionalAnalysis({
        emotions: [...new Set(detectedEmotions)],
        intensity,
        breakthrough,
        patterns: [...new Set(patterns)]
      });
      setIsAnalyzing(false);
    }, 500);
  };

  const startRecording = async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);
      
      // Start visualization
      visualizeAudio();

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);
      setTranscript('');
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsRecording(false);
    setAudioLevel(0);

    if (transcript.trim()) {
      onTranscript(transcript.trim());
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current || !isRecording) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateLevel = () => {
      if (!isRecording) return;

      const analyser = analyserRef.current;
      if (!analyser) return;

      analyser.getByteFrequencyData(dataArray);
      const average = bufferLength > 0 ? dataArray.reduce((acc, val) => acc + val, 0) / bufferLength : 0;
      const level = Math.max(0, Math.min(100, (average / 255) * 100));
      setAudioLevel(isNaN(level) ? 0 : level);
      
      requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  return (
    <div className={`voice-processor ${className}`}>
      {/* Recording Interface */}
      <div className="flex flex-col items-center space-y-4">
        {/* Audio Visualization */}
        {isRecording && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-purple-400 rounded-full transition-all duration-150 ${
                    audioLevel > i * 20 ? 'h-8' : 'h-2'
                  }`}
                />
              ))}
            </div>
            <span className="text-purple-300 text-sm">Listening...</span>
          </div>
        )}

        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`relative w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center ${
            isRecording
              ? 'bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30'
              : 'bg-purple-500/20 border-2 border-purple-500 hover:bg-purple-500/30'
          }`}
        >
          {isRecording ? (
            <div className="w-6 h-6 bg-red-500 rounded-sm"></div>
          ) : (
            <div className="w-8 h-8 text-purple-300">🎤</div>
          )}
          
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping"></div>
          )}
        </button>

        <p className="text-white/60 text-sm text-center max-w-xs">
          {isRecording 
            ? 'Speak freely about your thoughts and feelings...' 
            : 'Tap to start voice processing session'
          }
        </p>

        {/* Analysis Indicator */}
        {isAnalyzing && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-indigo-300 text-xs">Analyzing emotional content...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg max-w-xs">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Live Transcript */}
        {transcript && (
          <div className="mt-4 p-4 bg-black/30 rounded-xl border border-gray-500/20 max-w-md">
            <h4 className="text-white/80 text-sm font-light mb-2">Live Transcript:</h4>
            <p className="text-white/60 text-sm italic leading-relaxed">{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}
