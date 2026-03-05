import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert, Target, Zap, Activity, Brain, AlertTriangle, RefreshCw, X, Plus, Check, TrendingUp, TrendingDown, GitMerge, Skull, Info, Globe, Database, BookOpen } from 'lucide-react';
import { i18n, Language } from './i18n';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { addDailyRecord, getHistory, DailyRecord } from './db';

// --- Types ---
type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Extreme';

type GameState = {
  version: number;
  language: Language;
  initialized: boolean;
  identity: {
    current: string;
    anti: string;
    target: string;
  };
  fear: {
    worstLife: string;
    coreWords: string[];
  };
  vision: {
    threeYears: string;
    oneYear: string;
    oneMonth: string;
    dailyLevers: string;
    constraints: string;
  };
  stats: {
    identity: number;
    clarity: number;
    focus: number;
    execution: number;
    creativity: number;
    health: number;
    wealth: number;
    influence: number;
    exp: number;
    level: number;
    streak: number;
    deviation: number;
  };
  difficulty: Difficulty;
  tasks: {
    id: string;
    text: string;
    completed: boolean;
    expReward: number;
  }[];
  day: number;
  activeEventId: string | null;
  lastAuditAt: string | null;
};

const CURRENT_VERSION = 5;

const INITIAL_STATE: GameState = {
  version: CURRENT_VERSION,
  language: 'zh',
  initialized: false,
  identity: { current: '', anti: '', target: '' },
  fear: { worstLife: '', coreWords: [] },
  vision: { threeYears: '', oneYear: '', oneMonth: '', dailyLevers: '', constraints: '' },
  stats: { 
    identity: 30, clarity: 30, focus: 50, execution: 40, 
    creativity: 50, health: 60, wealth: 30, influence: 20, 
    exp: 0, level: 3, streak: 0, deviation: 0 
  },
  difficulty: 'Normal',
  tasks: [],
  day: 1,
  activeEventId: null,
  lastAuditAt: null
};

const generateId = () => Math.random().toString(36).substring(2, 9);
const clamp = (val: number) => Math.max(0, Math.min(100, val));

// --- Components ---

function ProgressBar({ value, max = 100, colorClass = "accent", label }: { value: number, max?: number, colorClass?: string, label?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-1 font-mono text-gray-400 uppercase">
          <span>{label}</span>
          <span>{Math.round(value)}/{max}</span>
        </div>
      )}
      <div className="progress-bar h-2 bg-[#222]">
        <div className={`progress-fill ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function SegmentedProgressBar({ value, max = 100, segments = 20, colorClass = "accent", label }: { value: number, max?: number, segments?: number, colorClass?: string, label?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const activeSegments = Math.floor((percentage / 100) * segments);
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-[10px] mb-1 font-mono text-gray-500 uppercase tracking-widest">
          <span>{label}</span>
          <span className={colorClass === 'accent' ? 'text-[#00ffcc]' : 'text-[#ff3366]'}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="flex gap-0.5 h-2">
        {Array.from({ length: segments }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 transition-all duration-500 ${
              i < activeSegments 
                ? (colorClass === 'accent' ? 'bg-[#00ffcc] shadow-[0_0_5px_rgba(0,255,204,0.5)]' : 'bg-[#ff3366] shadow-[0_0_5px_rgba(255,51,102,0.5)]') 
                : 'bg-white/5'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}

type ChatMessage = {
  id: string;
  sender: 'system' | 'user';
  text: string;
};

function Onboarding({ onComplete, lang, setLang }: { onComplete: (state: Partial<GameState>) => void, lang: Language, setLang: (l: Language) => void }) {
  const tc = i18n[lang].onboarding_chat;
  const td = i18n[lang].dashboard;
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [introStep, setIntroStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  useEffect(() => {
    if (!started) {
      if (introStep < tc.intro.length) {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setChatHistory(prev => [...prev, { id: generateId(), sender: 'system', text: tc.intro[introStep] }]);
          setIsTyping(false);
          setIntroStep(s => s + 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [introStep, started, tc.intro]);

  const startReset = () => {
    setStarted(true);
    askQuestion(0, 0);
  };

  const askQuestion = (gIdx: number, qIdx: number) => {
    setIsTyping(true);
    setTimeout(() => {
      const q = tc.groups[gIdx].questions[qIdx].q;
      setChatHistory(prev => [...prev, { id: generateId(), sender: 'system', text: q }]);
      setIsTyping(false);
    }, 800);
  };

  const handleAnswer = (text: string) => {
    if (!text.trim()) return;
    setChatHistory(prev => [...prev, { id: generateId(), sender: 'user', text }]);
    setCustomInput('');
    
    const newAnswers = [...answers, text];
    setAnswers(newAnswers);

    const currentGroup = tc.groups[groupIndex];
    if (questionIndex + 1 < currentGroup.questions.length) {
      setQuestionIndex(q => q + 1);
      askQuestion(groupIndex, questionIndex + 1);
    } else {
      // End of group
      setIsTyping(true);
      setTimeout(() => {
        setChatHistory(prev => [...prev, { id: generateId(), sender: 'system', text: currentGroup.feedback }]);
        setIsTyping(false);
        
        if (groupIndex + 1 < tc.groups.length) {
          setTimeout(() => {
            setGroupIndex(g => g + 1);
            setQuestionIndex(0);
            askQuestion(groupIndex + 1, 0);
          }, 1500);
        } else {
          // End of all
          finishOnboarding(newAnswers);
        }
      }, 1000);
    }
  };

  const finishOnboarding = (finalAnswers: string[]) => {
    setGenerating(true);
    setTimeout(() => {
      // finalAnswers map:
      // 0: Anti-vision
      // 1: Vision
      // 2: 1 year goal
      // 3: 1 month project
      // 4: Daily levers
      // 5: Constraints
      
      const currentId = lang === 'zh' ? `寻找方向的探索者` : `Seeker of Direction`;
      const antiId = lang === 'zh' ? `被困住的人` : `Trapped Individual`;
      const targetId = finalAnswers[1];
      
      const worstLife = finalAnswers[0];
      const coreWords = finalAnswers[0].split(/[,，\s]+/).slice(0, 3);
      
      const threeYears = finalAnswers[1];
      const oneYear = finalAnswers[2];
      const oneMonth = finalAnswers[3];
      const dailyLevers = finalAnswers[4];
      const constraints = finalAnswers[5];
      
      const clarity = clamp(40 + (targetId.length + antiId.length) / 2);

      onComplete({
        initialized: true,
        identity: {
          current: currentId,
          anti: antiId,
          target: targetId
        },
        fear: {
          worstLife: worstLife,
          coreWords: coreWords
        },
        vision: {
          threeYears: threeYears,
          oneYear: oneYear,
          oneMonth: oneMonth,
          dailyLevers: dailyLevers,
          constraints: constraints
        },
        stats: {
          ...INITIAL_STATE.stats,
          clarity,
          identity: 30,
          deviation: 0,
          level: 3 // Level 4 Self-Aware
        }
      });
    }, 3000);
  };

  const currentQuestion = started && groupIndex < tc.groups.length && questionIndex < tc.groups[groupIndex].questions.length && !isTyping && chatHistory[chatHistory.length - 1]?.sender === 'system' && !generating
    ? tc.groups[groupIndex].questions[questionIndex] 
    : null;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative overflow-hidden max-w-3xl mx-auto">
      {/* System Status Bar */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="status-dot"></span>
            <span className="label-caps text-[#00ffcc]">{td.neural_link}</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-700"></div>
            <span className="label-caps">{td.buffer}: {Math.floor(Math.random() * 100)}%</span>
          </div>
        </div>
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#00ffcc] transition-colors font-mono text-[10px] uppercase tracking-widest"
        >
          <Globe className="w-3 h-3" />
          {lang === 'zh' ? 'EN' : 'ZH'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-64 pt-16 space-y-6 relative z-10">
        <AnimatePresence>
          {chatHistory.map(msg => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 font-mono text-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-[#00ffcc]/5 border border-[#00ffcc]/30 text-[#00ffcc] clip-path-user' 
                  : 'tech-panel text-gray-300'
              }`}>
                {msg.sender === 'system' && (
                  <div className="flex items-center gap-2 mb-2 opacity-50">
                    <Terminal className="w-3 h-3 text-[#00ffcc]" />
                    <span className="text-[10px] uppercase tracking-tighter">{td.system_msg}</span>
                  </div>
                )}
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="tech-panel p-4">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#00ffcc] animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-[#00ffcc] animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 bg-[#00ffcc] animate-pulse delay-150" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          {!started && introStep >= tc.intro.length && !isTyping && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={startReset} 
              className="tech-button w-full py-5 text-xl"
            >
              {tc.ready_btn}
            </motion.button>
          )}

          {currentQuestion && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentQuestion.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="tech-button-outline text-left p-4 text-xs"
                  >
                    <span className="opacity-50 mr-2">[{i+1}]</span> {opt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnswer(customInput)}
                  placeholder={tc.custom_input_placeholder}
                  className="tech-input flex-1 p-4 text-sm"
                />
                <button 
                  onClick={() => handleAnswer(customInput)}
                  disabled={!customInput.trim()}
                  className="tech-button px-8"
                >
                  {tc.submit}
                </button>
              </div>
            </motion.div>
          )}

          {generating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tech-panel p-8 text-center border-[#00ffcc]">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <RefreshCw className="w-16 h-16 text-[#00ffcc] animate-spin opacity-20" />
                <Brain className="w-8 h-8 text-[#00ffcc] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p className="text-[#00ffcc] font-mono text-sm tracking-[0.3em] uppercase animate-pulse">{tc.generating}</p>
              <div className="mt-4 w-full bg-white/5 h-1 overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-1/2 h-full bg-[#00ffcc]"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const [mobileTab, setMobileTab] = useState<'status' | 'action' | 'vision'>('status');
  const [showEndDay, setShowEndDay] = useState(false);
  const [showMindLevels, setShowMindLevels] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showQuestLib, setShowQuestLib] = useState(false);
  const [showSelfReflect, setShowSelfReflect] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<DailyRecord[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedDebuffs, setSelectedDebuffs] = useState<string[]>([]);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'danger'|'warning'} | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA Install logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };
  // Load & Migrate state
  useEffect(() => {
    const saved = localStorage.getItem('life_os_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.version >= 2) {
          // Robust migration: merge with INITIAL_STATE to ensure all fields exist
          const migratedState = {
            ...INITIAL_STATE,
            ...parsed,
            identity: { ...INITIAL_STATE.identity, ...parsed.identity },
            fear: { ...INITIAL_STATE.fear, ...parsed.fear },
            vision: { ...INITIAL_STATE.vision, ...parsed.vision },
            stats: { ...INITIAL_STATE.stats, ...parsed.stats },
            version: CURRENT_VERSION
          };
          
          if (!migratedState.language) migratedState.language = 'zh';

          // Decay logic: -1 to core stats per day missed
          if (migratedState.lastAuditAt && migratedState.initialized) {
            const lastAudit = new Date(migratedState.lastAuditAt).getTime();
            const now = new Date().getTime();
            const daysPassed = Math.floor((now - lastAudit) / (1000 * 60 * 60 * 24));
            
            if (daysPassed > 0) {
              migratedState.stats.identity = clamp(migratedState.stats.identity - daysPassed);
              migratedState.stats.clarity = clamp(migratedState.stats.clarity - daysPassed);
              migratedState.stats.focus = clamp(migratedState.stats.focus - daysPassed);
              migratedState.stats.execution = clamp(migratedState.stats.execution - daysPassed);
              migratedState.stats.creativity = clamp(migratedState.stats.creativity - daysPassed);
              migratedState.stats.deviation = clamp(migratedState.stats.deviation + (daysPassed * 2));
              
              migratedState.lastAuditAt = new Date().toISOString();
              
              setTimeout(() => {
                const msg = migratedState.language === 'zh' 
                  ? `检测到系统闲置 ${daysPassed} 天。核心属性已衰减，偏离度上升。` 
                  : `System inactivity detected for ${daysPassed} days. Core stats decayed, deviation increased.`;
                showToast(msg, "danger");
              }, 1500);
            }
          } else if (migratedState.initialized && !migratedState.lastAuditAt) {
            migratedState.lastAuditAt = new Date().toISOString();
          }

          setState(migratedState);
        } else {
          console.warn("State version mismatch, resetting state.");
          localStorage.removeItem('life_os_state');
        }
      } catch (e) {
        console.error("Failed to parse saved state");
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    if (state.initialized) {
      localStorage.setItem('life_os_state', JSON.stringify(state));
    }
  }, [state]);

  const loadHistory = async () => {
    const records = await getHistory();
    setHistoryRecords(records.reverse());
  };

  useEffect(() => {
    if (showHistory) {
      loadHistory();
    }
  }, [showHistory]);

  const t = i18n[state.language];
  const activeEvent = state.activeEventId ? t.events.find(e => e.id === state.activeEventId) : null;

  const evolutionProgress = Math.round(
    (state.stats.identity + 
     state.stats.clarity + 
     state.stats.focus + 
     state.stats.execution + 
     state.stats.creativity + 
     state.stats.health + 
     state.stats.wealth + 
     state.stats.influence) / 8
  );

  const showToast = (msg: string, type: 'success'|'danger'|'warning' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOnboardingComplete = (partialState: Partial<GameState>) => {
    const events = t.events;
    const firstEventId = events[Math.floor(Math.random() * events.length)].id;
    setState(prev => ({ 
      ...prev, 
      ...partialState, 
      activeEventId: firstEventId,
      lastAuditAt: new Date().toISOString() 
    }));
  };

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'zh' ? 'en' : 'zh' }));
  };

  const addTask = (text: string = newTaskText, expReward: number = 10) => {
    if (!text.trim()) return;
    if (state.tasks.length >= 3) {
      showToast(t.toast.max_tasks, "warning");
      return;
    }
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: generateId(), text: text.trim(), completed: false, expReward }]
    }));
    setNewTaskText('');
    setShowQuestLib(false);
  };

  const toggleDebuff = (text: string) => {
    setSelectedDebuffs(prev => 
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };

  const handleApplyReflection = () => {
    const selectedItems = t.debuff_library.filter(d => selectedDebuffs.includes(d.text));
    if (selectedItems.length === 0) return;

    const totalPenalty = selectedItems.reduce((sum, d) => sum + d.penalty, 0);
    
    setState(prev => {
      let newExp = prev.stats.exp - totalPenalty;
      if (newExp < 0) newExp = 0;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          exp: newExp,
          deviation: clamp(prev.stats.deviation + Math.floor(totalPenalty / 2))
        }
      };
    });

    showToast(t.language === 'zh' ? `自我反思完成 | EXP -${totalPenalty}` : `Reflection Complete | EXP -${totalPenalty}`, "danger");
    setSelectedDebuffs([]);
    setShowSelfReflect(false);
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    }));
  };

  const removeTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  const handleInterrupt = (answer: 'vision' | 'fear' | 'escape') => {
    setShowInterrupt(false);
    setState(prev => {
      let newStats = { ...prev.stats };
      if (answer === 'vision') {
        newStats.focus = clamp(newStats.focus + 5);
        newStats.execution = clamp(newStats.execution + 2);
        newStats.deviation = clamp(newStats.deviation - 5);
        showToast(t.toast.int_v, "success");
      } else if (answer === 'fear') {
        newStats.clarity = clamp(newStats.clarity + 5);
        newStats.focus = clamp(newStats.focus - 5);
        newStats.deviation = clamp(newStats.deviation + 10);
        showToast(t.toast.int_f, "danger");
      } else {
        newStats.execution = clamp(newStats.execution - 5);
        newStats.deviation = clamp(newStats.deviation + 5);
        showToast(t.toast.int_e, "warning");
      }
      return { ...prev, stats: newStats };
    });
  };

  const handleEventChoice = (impact: Partial<Record<keyof GameState['stats'], number>>) => {
    setState(prev => {
      const newStats = { ...prev.stats };
      for (const key in impact) {
        const k = key as keyof GameState['stats'];
        if (k in newStats && impact[k] !== undefined) {
          newStats[k] = clamp(newStats[k] + (impact[k] as number));
        }
      }
      return { ...prev, stats: newStats, activeEventId: null };
    });
    showToast(t.toast.attr_upd, "success");
  };

  const handleEndDay = async () => {
    const completedCount = state.tasks.filter(task => task.completed).length;
    const totalCount = state.tasks.length;
    
    // Calculate new stats
    let newStats = { ...state.stats };
    let newDifficulty = state.difficulty;
    let expGained = 0;

    if (totalCount > 0) {
      const completionRate = completedCount / totalCount;
      const taskExp = state.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.expReward, 0);
      
      if (completionRate === 1) {
        expGained = taskExp + 10; // Bonus for full completion
        newStats.streak += 1;
        newStats.execution = clamp(newStats.execution + 5);
        newStats.identity = clamp(newStats.identity + 2);
        newStats.deviation = clamp(newStats.deviation - 10);
      } else if (completionRate >= 0.5) {
        expGained = taskExp;
        newStats.streak = 0;
        newStats.execution = clamp(newStats.execution + 1);
        newStats.deviation = clamp(newStats.deviation - 2);
      } else {
        expGained = taskExp;
        newStats.streak = 0;
        newStats.execution = clamp(newStats.execution - 5);
        newStats.deviation = clamp(newStats.deviation + 15);
      }

      if (newStats.streak >= 3) {
        if (newDifficulty === 'Easy') newDifficulty = 'Normal';
        else if (newDifficulty === 'Normal') newDifficulty = 'Hard';
        else if (newDifficulty === 'Hard') newDifficulty = 'Extreme';
      } else if (completionRate === 0 && newStats.streak === 0) {
        if (newDifficulty === 'Extreme') newDifficulty = 'Hard';
        else if (newDifficulty === 'Hard') newDifficulty = 'Normal';
        else if (newDifficulty === 'Normal') newDifficulty = 'Easy';
      }
    } else {
      newStats.streak = 0;
      newStats.execution = clamp(newStats.execution - 10);
      newStats.deviation = clamp(newStats.deviation + 20);
    }

    newStats.exp += expGained;
    let leveledUp = false;
    while (newStats.exp >= 100 && newStats.level < 8) {
      newStats.level += 1;
      newStats.exp -= 100;
      leveledUp = true;
    }

    // Save to Database
    const record: Omit<DailyRecord, 'id'> = {
      day: state.day,
      date: new Date().toISOString().split('T')[0],
      tasks: state.tasks.map(t => ({ text: t.text, completed: t.completed, expReward: t.expReward })),
      statsSnapshot: {
        identity: newStats.identity,
        clarity: newStats.clarity,
        focus: newStats.focus,
        execution: newStats.execution,
        creativity: newStats.creativity,
        health: newStats.health,
        wealth: newStats.wealth,
        influence: newStats.influence,
      }
    };
    await addDailyRecord(record);

    if (leveledUp) {
      showToast(`${t.toast.lvl_up} ${t.dashboard.level_label} ${newStats.level + 1}`, "success");
    } else {
      showToast(t.toast.day_end.replace('{exp}', expGained.toString()), "success");
    }

    const events = t.events;
    const nextEventId = events[Math.floor(Math.random() * events.length)].id;

    setState(prev => ({
      ...prev,
      stats: newStats,
      difficulty: newDifficulty,
      tasks: [],
      day: prev.day + 1,
      activeEventId: nextEventId,
      lastAuditAt: new Date().toISOString()
    }));
    
    setShowEndDay(false);
  };

  if (!state.initialized) {
    return <Onboarding onComplete={handleOnboardingComplete} lang={state.language} setLang={(l) => setState(prev => ({...prev, language: l}))} />;
  }

  const radarData = [
    { subject: t.stats.identity, A: state.stats.identity, fullMark: 100 },
    { subject: t.stats.clarity, A: state.stats.clarity, fullMark: 100 },
    { subject: t.stats.focus, A: state.stats.focus, fullMark: 100 },
    { subject: t.stats.execution, A: state.stats.execution, fullMark: 100 },
    { subject: t.stats.creativity, A: state.stats.creativity, fullMark: 100 },
    { subject: t.stats.health, A: state.stats.health, fullMark: 100 },
    { subject: t.stats.wealth, A: state.stats.wealth, fullMark: 100 },
    { subject: t.stats.influence, A: state.stats.influence, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Language & Install Toggle */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex gap-2">
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 text-[#00ffcc] hover:bg-[#00ffcc]/10 transition-colors font-mono text-sm border border-[#00ffcc]/30 px-3 py-1 rounded bg-[#050505]"
          >
            <Zap className="w-4 h-4" />
            INSTALL
          </button>
        )}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 text-gray-400 hover:text-[#00ffcc] transition-colors font-mono text-sm border border-gray-700 hover:border-[#00ffcc] px-3 py-1 rounded bg-[#050505]"
        >
          <Globe className="w-4 h-4" />
          {state.language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded border font-mono text-sm shadow-lg ${
              toast.type === 'success' ? 'bg-[#00ffcc]/10 border-[#00ffcc] text-[#00ffcc]' :
              toast.type === 'danger' ? 'bg-[#ff3366]/10 border-[#ff3366] text-[#ff3366]' :
              'bg-[#ffcc00]/10 border-[#ffcc00] text-[#ffcc00]'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 mt-10 md:mt-0">
        {/* Header / Game HUD */}
        <header className="tech-panel p-6 border-[#00ffcc]/20 relative overflow-hidden">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00ffcc 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Identity & System Info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#00ffcc]/10 border border-[#00ffcc]/30 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-[#00ffcc]/20 animate-pulse group-hover:bg-[#00ffcc]/40 transition-colors"></div>
                  <Terminal className="w-8 h-8 text-[#00ffcc] relative z-10" />
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#00ffcc]"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#00ffcc]"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-mono font-bold tracking-tighter text-white uppercase flex items-center gap-2">
                    LIFE_OS <span className="text-[10px] bg-[#00ffcc]/10 text-[#00ffcc] px-1 py-0.5 border border-[#00ffcc]/20">v2.5</span>
                  </h1>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    <span className="status-dot"></span>
                    {t.dashboard.neural_link}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-white/10 pl-3">
                  <span className="label-caps text-gray-500">{t.dashboard.day}</span>
                  <p className="text-xl font-mono text-white tracking-tighter">{state.day.toString().padStart(3, '0')}</p>
                </div>
                <div className="border-l-2 border-white/10 pl-3">
                  <span className="label-caps text-gray-500">{t.dashboard.streak}</span>
                  <p className="text-xl font-mono text-[#00ffcc] tracking-tighter flex items-center gap-1">
                    {state.stats.streak} <Zap className="w-4 h-4" />
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Evolution Progress */}
            <div className="lg:col-span-5 space-y-6 px-0 lg:px-8 border-x-0 lg:border-x border-white/5">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="label-caps text-gray-500">{t.dashboard.rank_label}</span>
                    <h2 className="text-2xl font-mono text-white uppercase tracking-tighter">
                      {t.mind_levels[state.stats.level]?.name || "UNKNOWN"}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="label-caps text-gray-500">{t.dashboard.level_label}</span>
                    <p className="text-2xl font-mono text-[#00ffcc]">{state.stats.level + 1}</p>
                  </div>
                </div>
                
                <SegmentedProgressBar 
                  value={state.stats.exp} 
                  label={t.dashboard.exp} 
                  colorClass="accent" 
                />
              </div>

              <div className="pt-2">
                <SegmentedProgressBar 
                  value={evolutionProgress} 
                  label={t.dashboard.life_progress} 
                  colorClass="accent" 
                />
              </div>
            </div>

            {/* Right: Status & Difficulty */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <span className="label-caps text-gray-500 mb-2 block">{t.dashboard.status_effects}</span>
                <div className="flex flex-wrap gap-2">
                  {state.stats.streak >= 3 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] text-[10px] font-mono rounded-sm animate-pulse">
                      <Zap className="w-3 h-3" /> {t.dashboard.streak_bonus}
                    </div>
                  )}
                  {state.stats.deviation > 50 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#ff3366]/10 border border-[#ff3366]/30 text-[#ff3366] text-[10px] font-mono rounded-sm">
                      <Skull className="w-3 h-3" /> {t.dashboard.deviation_malus}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 px-2 py-1 border text-[10px] font-mono rounded-sm ${
                    state.difficulty === 'Easy' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                    state.difficulty === 'Normal' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                    state.difficulty === 'Hard' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                    'bg-red-500/10 border-red-500/30 text-red-500'
                  }`}>
                    <Activity className="w-3 h-3" /> {
                      state.difficulty === 'Easy' ? t.dashboard.difficulty_easy : 
                      state.difficulty === 'Normal' ? t.dashboard.difficulty_normal :
                      state.difficulty === 'Hard' ? t.dashboard.difficulty_hard : 
                      t.dashboard.difficulty_extreme
                    }
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setShowMindLevels(true)}
                  className="w-full tech-button-outline py-2 text-[10px] flex items-center justify-center gap-2 group"
                >
                  <Brain className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                  {t.modals.mind_codex}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Deviation Warning */}
        {state.stats.deviation > 70 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="tech-panel border-[#ff3366] bg-[#ff3366]/10 p-4 flex items-center gap-4"
          >
            <Skull className="w-8 h-8 text-[#ff3366] animate-pulse" />
            <div>
              <h3 className="text-[#ff3366] font-mono font-bold uppercase">{t.dashboard.warning_title}</h3>
              <p className="text-sm text-[#ff3366]/80">{t.dashboard.warning_desc.replace('{dev}', state.stats.deviation.toString())}</p>
            </div>
          </motion.div>
        )}

        {/* Main Grid / Mobile Tabs */}
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Identity & Fear (Status Tab) */}
            <div className={`${mobileTab === 'status' ? 'block' : 'hidden'} lg:block space-y-6`}>
              <div className="tech-panel p-6">
              <div className="card-header">
                <h2 className="text-sm font-mono text-gray-300 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#00ffcc]" />
                  {t.dashboard.id_engine}
                </h2>
                <span className="label-caps">{t.dashboard.core_module}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="label-caps">{t.dashboard.cur_id}</span>
                  <p className="text-sm text-gray-400 mt-1 font-mono">{state.identity.current}</p>
                </div>
                <div>
                  <span className="label-caps text-[#00ffcc]">{t.dashboard.tar_id}</span>
                  <p className="text-sm text-[#00ffcc] mt-1 font-mono font-bold tracking-tight">{state.identity.target}</p>
                </div>
              </div>
            </div>

            <div className="tech-panel p-6 border-[#ff3366]/30">
              <div className="card-header">
                <h2 className="text-sm font-mono text-[#ff3366] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  {t.dashboard.fear_engine}
                </h2>
                <span className="label-caps text-[#ff3366]">{t.dashboard.threat_level}</span>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{t.dashboard.fear_quote}</p>
                <div className="p-3 bg-black/40 border border-[#ff3366]/20 text-sm text-gray-400 font-mono italic">
                  {state.fear.worstLife}
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.fear.coreWords.map((word, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-[#ff3366]/10 text-[#ff3366] font-mono border border-[#ff3366]/30">
                      {word}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <ProgressBar value={state.stats.deviation} label={t.dashboard.deviation} colorClass={state.stats.deviation > 70 ? "danger" : "warning"} />
                </div>
              </div>
            </div>
          </div>

            {/* Column 2: Action & Interrupt (Action Tab) */}
            <div className={`${mobileTab === 'action' ? 'block' : 'hidden'} lg:block space-y-6`}>
              <div className="tech-panel p-6 min-h-[400px] flex flex-col">
              <div className="card-header">
                <h2 className="text-sm font-mono text-[#00ffcc] flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {t.dashboard.action_engine}
                </h2>
                <span className="label-caps">{t.dashboard.execution_unit}</span>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="label-caps">{t.dashboard.daily_quests}</p>
                  <button 
                    onClick={() => setShowQuestLib(true)}
                    className="text-[10px] font-mono text-[#00ffcc] hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    <BookOpen className="w-3 h-3" />
                    {t.dashboard.quest_lib}
                  </button>
                  <button 
                    onClick={() => setShowSelfReflect(true)}
                    className="text-[10px] font-mono text-[#ff3366] hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {t.dashboard.self_reflect}
                  </button>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTask(newTaskText, 10)}
                    placeholder={t.dashboard.add_task}
                    className="tech-input flex-1 p-2 text-sm"
                    disabled={state.tasks.length >= 3}
                  />
                  <button 
                    onClick={() => addTask(newTaskText, 10)}
                    disabled={state.tasks.length >= 3 || !newTaskText.trim()}
                    className="tech-button-outline px-4 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <AnimatePresence>
                  {state.tasks.map(task => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex items-center gap-3 p-3 border transition-all ${
                        task.completed 
                          ? 'bg-[#00ffcc]/5 border-[#00ffcc]/20 text-gray-500' 
                          : 'bg-black/40 border-white/5 text-gray-200'
                      }`}
                    >
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-4 h-4 flex items-center justify-center border transition-colors ${
                          task.completed ? 'bg-[#00ffcc] border-[#00ffcc] text-black' : 'border-gray-600 hover:border-[#00ffcc]'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3" />}
                      </button>
                      <span className={`flex-1 text-sm font-mono ${task.completed ? 'line-through opacity-50' : ''}`}>{task.text}</span>
                      <span className="text-[10px] font-mono text-[#00ffcc] opacity-70">+{task.expReward} EXP</span>
                      <button onClick={() => removeTask(task.id)} className="text-gray-600 hover:text-[#ff3366] transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {state.tasks.length === 0 && (
                  <div className="text-center py-12 text-gray-600 text-[10px] font-mono border border-dashed border-white/5 uppercase tracking-[0.2em]">
                    {t.dashboard.no_quests}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <button 
                  onClick={() => setShowEndDay(true)}
                  className="tech-button w-full py-4 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t.dashboard.end_day}
                </button>
              </div>
            </div>

            <div className="tech-panel p-6 border-yellow-500/20">
              <div className="card-header">
                <h2 className="text-sm font-mono text-yellow-500 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {t.dashboard.interrupt_engine}
                </h2>
                <span className="label-caps text-yellow-500">{t.dashboard.manual_override}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 font-mono leading-relaxed">{t.dashboard.interrupt_desc}</p>
              <button 
                onClick={() => setShowInterrupt(true)}
                className="tech-button-outline w-full py-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
              >
                {t.dashboard.trigger}
              </button>
            </div>
          </div>

            {/* Column 3: Vision & Evolution (Vision Tab) */}
            <div className={`${mobileTab === 'vision' ? 'block' : 'hidden'} lg:block space-y-6`}>
              <div className="tech-panel p-6">
                <div className="card-header">
                  <h2 className="text-sm font-mono text-gray-300 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#00ffcc]" />
                    {t.dashboard.vision_engine}
                  </h2>
                  <span className="label-caps">{t.dashboard.strategic_map}</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-black/40 border border-white/5 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ffcc] opacity-50" />
                    <span className="label-caps text-[#00ffcc] mb-1 block">{t.dashboard.main_quest}</span>
                    <p className="text-sm text-gray-400 font-mono">{state.vision.threeYears}</p>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ffcc] opacity-30" />
                    <span className="label-caps text-[#00ffcc] mb-1 block">{t.dashboard.boss_quest}</span>
                    <p className="text-sm text-gray-400 font-mono">{state.vision.oneYear}</p>
                  </div>
                </div>
              </div>

              {/* Evolution Path Visualization */}
              <div className="tech-panel p-6 border-[#00ffcc]/10">
                <div className="card-header">
                  <h2 className="text-sm font-mono text-[#00ffcc] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t.dashboard.evolution_path}
                  </h2>
                  <span className="label-caps">v2.5_Path</span>
                </div>
                
                <div className="relative pt-4 pb-2">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5"></div>
                  <div className="space-y-6">
                    {t.mind_levels.slice(0, state.stats.level + 2).map((level, i) => {
                      const isCompleted = i < state.stats.level;
                      const isCurrent = i === state.stats.level;
                      const isNext = i === state.stats.level + 1;
                      
                      return (
                        <div key={i} className={`relative pl-10 transition-all duration-500 ${isNext ? 'opacity-40' : 'opacity-100'}`}>
                          <div className={`absolute left-[13px] top-1.5 w-2 h-2 rounded-full border ${
                            isCompleted ? 'bg-[#00ffcc] border-[#00ffcc] shadow-[0_0_8px_rgba(0,255,204,0.5)]' :
                            isCurrent ? 'bg-black border-[#00ffcc] animate-pulse' :
                            'bg-black border-gray-700'
                          }`}></div>
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-mono uppercase tracking-widest ${isCurrent ? 'text-[#00ffcc]' : 'text-gray-500'}`}>
                              {t.dashboard.level_label} {level.level}
                            </span>
                            <span className={`text-sm font-mono font-bold ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                              {level.name}
                            </span>
                            {isCurrent && (
                              <p className="text-[10px] text-gray-500 mt-1 font-mono leading-tight italic">
                                {level.description.substring(0, 60)}...
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="tech-panel p-6">
                <div className="card-header">
                  <h2 className="text-sm font-mono text-gray-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#00ffcc]" />
                    {t.dashboard.evo_stats}
                  </h2>
                  <span className="label-caps">{t.dashboard.biometric_data}</span>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <Radar
                        name={t.dashboard.stats_radar}
                        dataKey="A"
                        stroke="#00ffcc"
                        fill="#00ffcc"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {radarData.map((d, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1">
                      <span className="text-[10px] text-gray-500 font-mono uppercase">{d.subject}</span>
                      <span className="data-value text-xs">{d.A}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="tech-button-outline w-full py-2 mt-6 flex items-center justify-center gap-2 text-xs"
                >
                  <Database className="w-3 h-3" />
                  {t.dashboard.history}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40 px-4 py-3 flex justify-around items-center">
          <button 
            onClick={() => setMobileTab('status')}
            className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'status' ? 'text-[#00ffcc]' : 'text-gray-500'}`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">{t.dashboard.tabs?.status || 'Status'}</span>
          </button>
          <button 
            onClick={() => setMobileTab('action')}
            className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'action' ? 'text-[#00ffcc]' : 'text-gray-500'}`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">{t.dashboard.tabs?.action || 'Action'}</span>
          </button>
          <button 
            onClick={() => setMobileTab('vision')}
            className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'vision' ? 'text-[#00ffcc]' : 'text-gray-500'}`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">{t.dashboard.tabs?.vision || 'Vision'}</span>
          </button>
        </div>

        {/* Modals */}
      <AnimatePresence>
        {/* Mind Levels Modal */}
        {showMindLevels && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="tech-panel p-6 md:p-8 max-w-2xl w-full border-[#00ffcc]/30 relative overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffcc] opacity-50" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-mono text-[#00ffcc] flex items-center gap-3 tracking-tighter">
                  <Brain className="w-6 h-6" />
                  {t.modals.mind_codex}
                </h3>
                <button onClick={() => setShowMindLevels(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1">
                {t.mind_levels.map((level, idx) => (
                  <div key={idx} className={`p-5 border transition-all ${state.stats.level === idx ? 'bg-[#00ffcc]/10 border-[#00ffcc]' : 'bg-black/40 border-white/5 opacity-60'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-mono font-bold text-sm tracking-tight ${state.stats.level === idx ? 'text-[#00ffcc]' : 'text-gray-400'}`}>
                        <span className="opacity-50 mr-2">[{level.level}]</span> {level.name}
                      </h4>
                      {state.stats.level === idx && <span className="text-[10px] bg-[#00ffcc] text-black px-2 py-0.5 font-mono font-bold uppercase tracking-tighter">{t.modals.current}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mb-3 leading-relaxed font-mono">{level.description}</p>
                    <div className="p-3 bg-black/40 border-l border-white/10">
                      <p className="text-[10px] text-gray-500 italic font-mono leading-relaxed uppercase tracking-tighter">{t.dashboard.case_study}: {level.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* History Modal */}
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="tech-panel p-6 md:p-8 max-w-2xl w-full border-[#00ffcc]/30 relative overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffcc] opacity-50" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-mono text-[#00ffcc] flex items-center gap-3 tracking-tighter">
                  <Database className="w-6 h-6" />
                  {t.modals.history_title}
                </h3>
                <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1">
                {historyRecords.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-white/5">
                    <p className="text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">{t.modals.no_history}</p>
                  </div>
                ) : (
                  historyRecords.map((record, idx) => (
                    <div key={idx} className="p-5 bg-black/40 border border-white/5 relative group hover:border-[#00ffcc]/20 transition-colors">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ffcc] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h4 className="font-mono font-bold text-[#00ffcc] mb-4 flex justify-between items-center text-xs">
                        <span>{t.modals.day_record.replace('{day}', record.day.toString()).replace('{date}', record.date)}</span>
                        <span className="text-[10px] text-gray-600">{t.dashboard.id_hash}: {Math.random().toString(16).slice(2, 8)}</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="label-caps mb-3">{t.modals.tasks}</p>
                          <div className="space-y-2">
                            {record.tasks.length === 0 ? (
                              <p className="text-[10px] text-gray-600 italic uppercase font-mono">{t.modals.no_data}</p>
                            ) : (
                              record.tasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
                                  {task.completed ? <Check className="w-3 h-3 text-[#00ffcc]" /> : <X className="w-3 h-3 text-[#ff3366]" />}
                                  <span className={task.completed ? 'text-gray-400' : 'text-gray-600 line-through opacity-50'}>{task.text}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="label-caps mb-3">{t.modals.stats}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono">
                            <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">身份:</span> <span className="data-value">{record.statsSnapshot.identity}</span></div>
                            <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">清晰:</span> <span className="data-value">{record.statsSnapshot.clarity}</span></div>
                            <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">专注:</span> <span className="data-value">{record.statsSnapshot.focus}</span></div>
                            <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">执行:</span> <span className="data-value">{record.statsSnapshot.execution}</span></div>
                            <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">创造:</span> <span className="data-value">{record.statsSnapshot.creativity}</span></div>
                            <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">健康:</span> <span className="data-value">{record.statsSnapshot.health}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Life Choice Engine Modal */}
        {activeEvent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.8, rotateX: 20 }} animate={{ scale: 1, rotateX: 0 }} exit={{ scale: 0.8, rotateX: 20 }}
              className="tech-panel p-6 md:p-10 max-w-xl w-full border-[#00ffcc]/50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00ffcc]" />
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-mono text-[#00ffcc] flex items-center gap-3 tracking-widest">
                  <GitMerge className="w-6 h-6 animate-pulse" />
                  {t.modals.life_choice}
                </h3>
                <span className="label-caps text-[#00ffcc] animate-pulse">{t.dashboard.critical_event}</span>
              </div>
              
              <div className="mb-10">
                <h4 className="text-2xl text-white font-bold mb-4 font-mono tracking-tight">{activeEvent.title}</h4>
                <div className="p-4 bg-white/5 border-l-2 border-[#00ffcc] text-gray-300 text-sm leading-relaxed font-mono">
                  {activeEvent.description}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => handleEventChoice(activeEvent.choiceA.impact)} className="tech-button-outline w-full py-6 text-left px-6 flex flex-col gap-2 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#00ffcc]/0 group-hover:bg-[#00ffcc]/5 transition-colors" />
                  <span className="text-[#00ffcc] font-bold font-mono text-sm flex items-center gap-2">
                    <span className="opacity-50">[A]</span> {t.modals.opt_a}
                  </span>
                  <span className="text-xs text-gray-500 font-mono leading-relaxed">{activeEvent.choiceA.text}</span>
                </button>
                <button onClick={() => handleEventChoice(activeEvent.choiceB.impact)} className="tech-button-outline w-full py-6 text-left px-6 flex flex-col gap-2 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#00ffcc]/0 group-hover:bg-[#00ffcc]/5 transition-colors" />
                  <span className="text-[#00ffcc] font-bold font-mono text-sm flex items-center gap-2">
                    <span className="opacity-50">[B]</span> {t.modals.opt_b}
                  </span>
                  <span className="text-xs text-gray-500 font-mono leading-relaxed">{activeEvent.choiceB.text}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Interrupt Modal */}
        {showInterrupt && !activeEvent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="tech-panel p-6 md:p-8 max-w-md w-full border-yellow-500/50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
              <h3 className="text-xl font-mono text-yellow-500 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                {t.modals.sys_interrupt}
              </h3>
              <p className="text-gray-300 mb-8 text-lg">{t.modals.int_q}</p>
              
              <div className="space-y-3">
                <button onClick={() => handleInterrupt('vision')} className="tech-button w-full py-3 flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" /> {t.modals.int_vision}
                </button>
                <button onClick={() => handleInterrupt('fear')} className="tech-button-danger w-full py-3 flex items-center justify-center gap-2">
                  <TrendingDown className="w-4 h-4" /> {t.modals.int_fear}
                </button>
                <button onClick={() => handleInterrupt('escape')} className="tech-button-outline w-full py-3 border-gray-500 text-gray-400 hover:bg-gray-800">
                  {t.modals.int_escape}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Self Reflection Modal */}
        {showSelfReflect && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="tech-panel p-6 md:p-8 max-w-md w-full border-[#ff3366]/30 relative overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ff3366] opacity-50" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-mono text-[#ff3366] flex items-center gap-3 tracking-tighter">
                  <AlertTriangle className="w-6 h-6" />
                  {t.modals.self_reflect_title}
                </h3>
                <button onClick={() => { setShowSelfReflect(false); setSelectedDebuffs([]); }} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-xs text-gray-400 font-mono mb-6 leading-relaxed">
                {t.modals.self_reflect_desc}
              </p>

              <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                {t.debuff_library.map((debuff, idx) => {
                  const isSelected = selectedDebuffs.includes(debuff.text);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleDebuff(debuff.text)}
                      className={`flex items-center justify-between p-4 cursor-pointer border transition-all group ${
                        isSelected ? 'bg-[#ff3366]/10 border-[#ff3366]/50' : 'bg-black/40 border-white/5 hover:border-[#ff3366]/30'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-sm font-mono transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>{debuff.text}</span>
                        <span className="text-[10px] font-mono text-[#ff3366] mt-1 opacity-70">{t.modals.exp_penalty}: <span className="data-value">-{debuff.penalty} EXP</span></span>
                      </div>
                      <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-[#ff3366] border-[#ff3366]' : 'border-white/20'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <button 
                  onClick={handleApplyReflection}
                  disabled={selectedDebuffs.length === 0}
                  className={`w-full py-3 font-mono text-xs uppercase tracking-widest transition-all ${
                    selectedDebuffs.length > 0 
                      ? 'bg-[#ff3366] text-white hover:bg-[#ff3366]/80 shadow-[0_0_15px_rgba(255,51,102,0.3)]' 
                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {t.modals.reflect_btn} ({selectedDebuffs.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Quest Library Modal */}
        {showQuestLib && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="tech-panel p-6 md:p-8 max-w-md w-full border-[#00ffcc]/30 relative overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffcc] opacity-50" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-mono text-[#00ffcc] flex items-center gap-3 tracking-tighter">
                  <BookOpen className="w-6 h-6" />
                  {t.modals.quest_lib_title}
                </h3>
                <button onClick={() => setShowQuestLib(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                {t.quest_library.map((quest, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 hover:border-[#00ffcc]/30 transition-colors group">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-300 font-mono">{quest.text}</span>
                      <span className="text-[10px] font-mono text-[#00ffcc] mt-1 opacity-70">{t.dashboard.reward}: <span className="data-value">+{quest.exp} EXP</span></span>
                    </div>
                    <button 
                      onClick={() => addTask(quest.text, quest.exp)}
                      disabled={state.tasks.length >= 3}
                      className="tech-button-outline px-4 py-2 text-[10px] disabled:opacity-20"
                    >
                      {t.modals.select_quest}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-600 mt-6 text-center italic font-mono uppercase tracking-widest">{t.modals.manual_exp}</p>
            </motion.div>
          </motion.div>
        )}

        {/* End Day Modal */}
        {showEndDay && !activeEvent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="tech-panel p-6 md:p-10 max-w-md w-full border-[#00ffcc]/50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00ffcc]" />
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-mono text-[#00ffcc] flex items-center gap-3 tracking-widest">
                  <RefreshCw className="w-6 h-6" />
                  {t.modals.feedback}
                </h3>
                <span className="label-caps text-[#00ffcc]">Day_{state.day}</span>
              </div>
              
              <div className="mb-10">
                <p className="label-caps mb-4">{t.modals.today_exec}</p>
                <div className="bg-black/40 border border-white/5 p-4 space-y-3 font-mono">
                  {state.tasks.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-white/10">
                      <p className="text-gray-600 text-[10px] uppercase tracking-widest">{t.modals.no_tasks_warn}</p>
                    </div>
                  ) : (
                    state.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 text-xs">
                        <div className={`w-4 h-4 flex items-center justify-center border ${task.completed ? 'bg-[#00ffcc] border-[#00ffcc] text-black' : 'border-gray-700 text-gray-700'}`}>
                          {task.completed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        <span className={task.completed ? 'text-gray-300' : 'text-gray-600 line-through opacity-50'}>{task.text}</span>
                        <span className="text-[10px] text-[#00ffcc] opacity-70 ml-auto">+{task.expReward} EXP</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowEndDay(false)} className="tech-button-outline py-4 text-xs">
                  {t.modals.cancel}
                </button>
                <button onClick={handleEndDay} className="tech-button py-4 text-xs">
                  {t.modals.confirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
