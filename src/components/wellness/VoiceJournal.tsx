'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
// MoodType definition for voice journal integration
type MoodType = string;

// Voice recording states
type VoiceState = 'idle' | 'recording' | 'processing' | 'transcribing' | 'complete';

interface EmotionalTone {
  dominant: string;
  confidence: number;
  undertones: string[];
  energy: 'low' | 'medium' | 'high';
  valence: 'negative' | 'neutral' | 'positive';
}

interface VoiceEntry {
  id: string;
  audioBlob?: Blob;
  audioUrl?: string;
  transcript: string;
  duration: number;
  emotionalTone: EmotionalTone;
  timestamp: Date;
  mood?: MoodType;
  waveformData?: number[];
}

interface VoiceJournalProps {
  onEntryComplete?: (entry: VoiceEntry) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

const VoiceJournal: React.FC<VoiceJournalProps> = ({
  onEntryComplete,
  maxDuration = 300, // 5 minutes default
  className = ''
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<EmotionalTone | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [volume, setVolume] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  const { currentMood, getMoodData } = useMoodContext();

  // Memoized waveform visualization
  const waveformVisualization = useMemo(() => {
    if (waveformData.length === 0) return null;
    
    const maxBars = 60;
    const step = Math.max(1, Math.floor(waveformData.length / maxBars));
    const displayData = [];
    
    for (let i = 0; i < waveformData.length; i += step) {
      const chunk = waveformData.slice(i, i + step);
      const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
      displayData.push(avg);
    }
    
    return displayData;
  }, [waveformData]);

  // Real-time audio analysis
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate volume
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const avgVolume = sum / bufferLength;
    setVolume(avgVolume);
    
    // Store waveform data for visualization
    setWaveformData(prev => [...prev.slice(-119), avgVolume]);
    
    if (voiceState === 'recording') {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [voiceState]);

  // Initialize audio context for analysis
  const initializeAudioContext = useCallback(async (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      analyzeAudio();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, [analyzeAudio]);

  // Start voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      audioChunksRef.current = [];
      setWaveformData([]);
      setDuration(0);
      setVoiceState('recording');

      // Initialize audio analysis
      await initializeAudioContext(stream);

      // Start recording
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setVoiceState('processing');
        
        // Start transcription and analysis
        processAudioEntry(audioBlob);
        
        // Stop audio context
        if (audioContextRef.current?.state !== 'closed') {
          audioContextRef.current?.close();
        }
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms for smooth visualization

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50]);
      }

    } catch (error) {
      console.error('Failed to start recording:', error);
      setVoiceState('idle');
    }
  }, [maxDuration, initializeAudioContext]);

  // Stop voice recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setVolume(0);
  }, []);

  // Process audio entry with transcription and emotional analysis
  const processAudioEntry = useCallback(async (audioBlob: Blob) => {
    setVoiceState('transcribing');
    
    try {
      // Mock transcription service (replace with actual service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcript based on emotional context
      const mockTranscript = currentMood 
        ? `I'm feeling ${currentMood} right now... [Voice transcription would appear here]`
        : "Today I wanted to share what's on my heart... [Voice transcription would appear here]";
      
      setTranscript(mockTranscript);

      // Mock emotional analysis
      const mockAnalysis: EmotionalTone = {
        dominant: currentMood || 'contemplative',
        confidence: 0.85,
        undertones: ['vulnerable', 'hopeful'],
        energy: volume > 50 ? 'high' : volume > 25 ? 'medium' : 'low',
        valence: currentMood === 'grateful' ? 'positive' : currentMood === 'raw' ? 'negative' : 'neutral'
      };
      
      setEmotionalAnalysis(mockAnalysis);
      setVoiceState('complete');

      // Create voice entry
      const voiceEntry: VoiceEntry = {
        id: Date.now().toString(),
        audioBlob,
        audioUrl: audioUrl || undefined,
        transcript: mockTranscript,
        duration,
        emotionalTone: mockAnalysis,
        timestamp: new Date(),
        mood: currentMood || undefined,
        waveformData
      };

      // Save to localStorage for persistence
      const savedEntries = JSON.parse(localStorage.getItem('alchm_voice_entries') || '[]');
      savedEntries.push({...voiceEntry, audioBlob: undefined}); // Don't save blob to localStorage
      localStorage.setItem('alchm_voice_entries', JSON.stringify(savedEntries));

      onEntryComplete?.(voiceEntry);

      // Haptic feedback for completion
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }

    } catch (error) {
      console.error('Failed to process audio:', error);
      setVoiceState('idle');
    }
  }, [audioUrl, currentMood, duration, onEntryComplete, volume, waveformData]);

  // Reset to start new recording
  const resetRecording = useCallback(() => {
    setVoiceState('idle');
    setDuration(0);
    setTranscript('');
    setEmotionalAnalysis(null);
    setWaveformData([]);
    setVolume(0);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl]);

  // Format duration display
  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [audioUrl]);

  return (
    <div className={`voice-journal ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Voice Journaling
        </h3>
        <p className="text-sm text-gray-600">
          Sometimes words flow easier when spoken
        </p>
      </div>

      {/* Main Recording Interface */}
      <div className="voice-interface bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
        
        {/* Waveform Visualization */}
        {(voiceState === 'recording' || waveformVisualization) && (
          <div className="waveform-container mb-8 h-24 flex items-end justify-center gap-1 bg-gradient-to-b from-sage-50 to-sage-100 rounded-2xl p-4">
            {voiceState === 'recording' ? (
              // Real-time waveform
              Array.from({ length: 40 }, (_, i) => (
                <div
                  key={i}
                  className="waveform-bar bg-gradient-to-t from-sage-400 to-sage-300 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(4, (volume + Math.random() * 20) / 4)}px`,
                    width: '3px',
                    opacity: voiceState === 'recording' ? 0.8 + Math.random() * 0.2 : 0.6
                  }}
                />
              ))
            ) : (
              // Static waveform from recording
              waveformVisualization?.map((value, i) => (
                <div
                  key={i}
                  className="waveform-bar bg-sage-300 rounded-full"
                  style={{
                    height: `${Math.max(4, value / 3)}px`,
                    width: '2px',
                    opacity: 0.7
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* Recording Controls */}
        <div className="recording-controls flex flex-col items-center gap-6">
          
          {/* Timer and Status */}
          <div className="status-display text-center">
            <div className="text-3xl font-light text-gray-700 mb-2">
              {formatDuration(duration)}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              {voiceState === 'recording' && (
                <>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Recording</span>
                </>
              )}
              {voiceState === 'processing' && (
                <>
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse"></div>
                  <span>Processing</span>
                </>
              )}
              {voiceState === 'transcribing' && (
                <>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Transcribing</span>
                </>
              )}
              {voiceState === 'complete' && (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Complete</span>
                </>
              )}
            </div>
          </div>

          {/* Main Action Button */}
          <button
            onClick={voiceState === 'idle' ? startRecording : voiceState === 'recording' ? stopRecording : undefined}
            disabled={voiceState === 'processing' || voiceState === 'transcribing'}
            className={`
              recording-button w-20 h-20 rounded-full border-4 transition-all duration-300 
              flex items-center justify-center text-2xl relative overflow-hidden
              ${voiceState === 'recording' 
                ? 'bg-red-400 border-red-300 text-white shadow-lg scale-110 animate-pulse' 
                : voiceState === 'idle'
                ? 'bg-sage-400 border-sage-300 text-white hover:bg-sage-500 hover:scale-105 shadow-md'
                : 'bg-gray-200 border-gray-300 text-gray-500'
              }
              ${voiceState === 'processing' || voiceState === 'transcribing' ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {voiceState === 'idle' && '🎤'}
            {voiceState === 'recording' && '⏹️'}
            {(voiceState === 'processing' || voiceState === 'transcribing') && (
              <div className="animate-spin">⚡</div>
            )}
            {voiceState === 'complete' && '✓'}
          </button>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed">
            {voiceState === 'idle' && 'Tap the microphone to start recording your thoughts'}
            {voiceState === 'recording' && `Recording... Tap stop when finished (${maxDuration - duration}s remaining)`}
            {voiceState === 'processing' && 'Processing your voice entry...'}
            {voiceState === 'transcribing' && 'Converting speech to text and analyzing emotions...'}
            {voiceState === 'complete' && 'Voice entry saved! Review below or start a new one'}
          </p>
        </div>

        {/* Playback Controls */}
        {audioUrl && voiceState === 'complete' && (
          <div className="playback-section mt-8 p-6 bg-sage-50 rounded-2xl">
            <audio 
              controls 
              src={audioUrl}
              className="w-full mb-4"
              style={{
                height: '40px',
                borderRadius: '20px'
              }}
            />
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Duration: {formatDuration(duration)}</span>
              <button
                onClick={resetRecording}
                className="text-sage-600 hover:text-sage-800 font-medium"
              >
                Record New Entry
              </button>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && voiceState === 'complete' && (
          <div className="transcript-section mt-6 p-6 bg-white rounded-2xl border border-sage-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Transcript</h4>
            <p className="text-gray-800 leading-relaxed text-sm">
              {transcript}
            </p>
          </div>
        )}

        {/* Emotional Analysis */}
        {emotionalAnalysis && voiceState === 'complete' && (
          <div className="analysis-section mt-6 p-6 bg-gradient-to-br from-sage-50 to-green-50 rounded-2xl">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Emotional Tone Analysis</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Dominant Emotion</div>
                <div className="font-semibold text-sage-700 capitalize">
                  {emotionalAnalysis.dominant}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-600 mb-1">Confidence</div>
                <div className="font-semibold text-sage-700">
                  {Math.round(emotionalAnalysis.confidence * 100)}%
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-600 mb-1">Energy Level</div>
                <div className="font-semibold text-sage-700 capitalize">
                  {emotionalAnalysis.energy}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-600 mb-1">Emotional Valence</div>
                <div className="font-semibold text-sage-700 capitalize">
                  {emotionalAnalysis.valence}
                </div>
              </div>
            </div>
            
            {emotionalAnalysis.undertones.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-gray-600 mb-2">Undertones</div>
                <div className="flex flex-wrap gap-2">
                  {emotionalAnalysis.undertones.map((tone, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-sage-200 text-sage-800 rounded-full text-xs capitalize"
                    >
                      {tone}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceJournal;