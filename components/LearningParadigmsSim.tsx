
import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Target, Users, CheckCircle2, XCircle, 
  Play, RotateCcw, Shuffle, MessageSquare, 
  ThumbsUp, ThumbsDown, Calculator, Scale,
  Microscope, Sparkles, AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

type Paradigm = 'unsupervised' | 'supervised' | 'rl' | 'rlhf' | 'rlvr';

const PARADIGMS: Record<Paradigm, { title: string; subtitle: string; icon: any; color: string; desc: string }> = {
  unsupervised: {
    title: '无监督学习 (Unsupervised)',
    subtitle: '自发寻找规律',
    icon: <Microscope className="w-4 h-4" />,
    color: 'text-blue-400',
    desc: '模型在没有标签的数据中“漫游”，自动发现数据的内在结构（如聚类）。就像婴儿自己学会区分苹果和橘子，没人教他名字。'
  },
  supervised: {
    title: '监督学习 (Supervised)',
    subtitle: '老师教，学生学',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-emerald-400',
    desc: '最经典的范式。输入数据带有明确标签（答案）。模型通过不断缩小预测结果与标准答案的误差（Loss）来学习。'
  },
  rl: {
    title: '强化学习 (RL)',
    subtitle: '试错与奖励',
    icon: <Target className="w-4 h-4" />,
    color: 'text-orange-400',
    desc: '智能体在环境中行动，做对了给糖（Reward），做错了惩罚。通过大量试错，学会获得最大回报的策略。'
  },
  rlhf: {
    title: 'RLHF (人类反馈)',
    subtitle: '对齐人类价值观',
    icon: <Users className="w-4 h-4" />,
    color: 'text-purple-400',
    desc: 'Reinforcement Learning from Human Feedback。当没有标准答案时（如写诗），由人类对回答进行排序，训练一个“奖励模型”来指导 AI。'
  },
  rlvr: {
    title: 'RLVR (可验证奖励)',
    subtitle: '逻辑与真理',
    icon: <Calculator className="w-4 h-4" />,
    color: 'text-rose-400',
    desc: 'Reinforcement Learning with Verifiable Rewards。DeepSeek-R1 等推理模型的核心。对于数学/代码等客观任务，系统可自动验证对错，无需人类主观打分。'
  }
};

const LearningParadigmsSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Paradigm>('supervised');
  
  // --- States for Supervised ---
  const [sEpoch, setSEpoch] = useState(0);
  const [sLoss, setSLoss] = useState(1.0);
  const [sAccuracy, setSAccuracy] = useState(10);
  const isSupervisedRunning = useRef(false);

  // --- States for Unsupervised ---
  const [uPoints, setUPoints] = useState<{x:number, y:number, group: number}[]>([]);
  const [uStep, setUStep] = useState(0);

  // --- States for RL (Grid World) ---
  const [rlAgentPos, setRlAgentPos] = useState(0);
  const [rlPath, setRlPath] = useState<number[]>([]);
  const [rlScore, setRlScore] = useState(0);

  // --- States for RLHF ---
  const [rlhfStep, setRlhfStep] = useState(0);
  const [rewardModelAccuracy, setRewardModelAccuracy] = useState(30);

  // --- States for RLVR ---
  const [rlvrProblem, setRlvrProblem] = useState<{q:string, a:number} | null>(null);
  const [rlvrSteps, setRlvrSteps] = useState<{thought: string, status: 'thinking'|'verified'|'wrong'}[]>([]);
  const rlvrIntervalRef = useRef<number | null>(null);

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      if (rlvrIntervalRef.current) clearInterval(rlvrIntervalRef.current);
    };
  }, []);

  // --- Logic: Supervised ---
  const runSupervised = () => {
    if (isSupervisedRunning.current) return;
    isSupervisedRunning.current = true;
    setSEpoch(0); setSLoss(1.0); setSAccuracy(10);
    
    const interval = setInterval(() => {
      setSEpoch(prev => {
        if (prev >= 20) {
          clearInterval(interval);
          isSupervisedRunning.current = false;
          return 20;
        }
        return prev + 1;
      });
      setSLoss(prev => Math.max(0.05, prev * 0.85));
      setSAccuracy(prev => Math.min(99, prev + (100-prev)*0.2));
    }, 200);
  };

  // --- Logic: Unsupervised ---
  const initUnsupervised = () => {
    const points = Array.from({length: 30}).map(() => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      group: 0
    }));
    setUPoints(points);
    setUStep(0);
  };
  const stepUnsupervised = () => {
    // Simple heuristic clustering sim
    setUPoints(prev => prev.map(p => ({
      ...p,
      group: p.x < 50 ? (p.y < 50 ? 1 : 2) : (p.y < 50 ? 3 : 4) // Quadrant clustering
    })));
    setUStep(1);
  };

  // --- Logic: RL ---
  const runRL = () => {
    setRlAgentPos(0);
    setRlPath([0]);
    let pos = 0;
    const interval = setInterval(() => {
      // Simple 4x4 grid, goal at 15
      const moves = [1, -1, 4, -4]; // R, L, D, U
      const validMoves = moves.filter(m => {
        const next = pos + m;
        return next >= 0 && next <= 15;
      });
      // Greedy heuristic + noise
      const bestMove = validMoves.sort((a,b) => Math.abs((pos+a)-15) - Math.abs((pos+b)-15))[0];
      const move = Math.random() > 0.7 ? validMoves[Math.floor(Math.random()*validMoves.length)] : bestMove;
      
      pos += move;
      setRlAgentPos(pos);
      setRlPath(p => [...p, pos]);

      if (pos === 15) {
        setRlScore(s => s + 10);
        clearInterval(interval);
      }
    }, 200);
  };

  // --- Logic: RLVR ---
  const runRLVR = () => {
    if (rlvrIntervalRef.current) clearInterval(rlvrIntervalRef.current);
    
    setRlvrProblem({ q: "计算 12 x 15 - 8 的结果", a: 172 });
    setRlvrSteps([]);
    
    const thinkingProcess = [
      { thought: "步骤 1: 将算式分解为乘法和减法。", status: 'thinking' as const },
      { thought: "步骤 2: 计算 12 x 10 = 120, 12 x 5 = 60。", status: 'thinking' as const },
      { thought: "步骤 3: 120 + 60 = 180。", status: 'thinking' as const },
      { thought: "步骤 4: 180 - 8 = 172。", status: 'verified' as const },
      { thought: "验证器: 调用 Python 计算器: 12*15-8 == 172 (True)", status: 'verified' as const }
    ];

    let i = 0;
    rlvrIntervalRef.current = window.setInterval(() => {
      if (i < thinkingProcess.length) {
        setRlvrSteps(prev => [...prev, thinkingProcess[i]]);
        i++;
      } else {
        if (rlvrIntervalRef.current) clearInterval(rlvrIntervalRef.current);
      }
    }, 800);
  };

  useEffect(() => {
    initUnsupervised();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold border border-indigo-500/20 tracking-widest uppercase">AI Pedagogy</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            AI 学习范式游乐场
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-lg text-right">
          从"填鸭式"的监督学习，到"自我探索"的强化学习，再到 DeepSeek 探索的"可验证推理"。亲手触发任务，观察模型是如何进化的。
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {(Object.keys(PARADIGMS) as Paradigm[]).map(p => (
          <button
            key={p}
            onClick={() => setActiveTab(p)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all
              ${activeTab === p 
                ? `bg-slate-800 border-white/20 shadow-lg scale-[1.02] ring-1 ring-white/10` 
                : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
          >
            <div className={`mb-2 ${PARADIGMS[p].color}`}>{PARADIGMS[p].icon}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{PARADIGMS[p].title.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Playground Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[26px]">
            <div className="bg-slate-950 rounded-[24px] border border-white/10 overflow-hidden min-h-[400px] relative">
              
              {/* Dynamic Content based on Tab */}
              
              {/* 1. Unsupervised */}
              {activeTab === 'unsupervised' && (
                <div className="p-8 h-full flex flex-col items-center justify-center space-y-8">
                  <div className="relative w-full max-w-md aspect-square bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
                    {uPoints.map((p, i) => (
                      <div 
                        key={i}
                        className={`absolute w-3 h-3 rounded-full transition-all duration-1000 ${
                          uStep === 0 ? 'bg-slate-500' : 
                          p.group === 1 ? 'bg-red-500' : 
                          p.group === 2 ? 'bg-blue-500' : 
                          p.group === 3 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      />
                    ))}
                    <div className="absolute inset-0 border border-dashed border-white/10 pointer-events-none" />
                    <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-white/10 pointer-events-none" />
                    <div className="absolute left-1/2 top-0 h-full w-px border-l border-dashed border-white/10 pointer-events-none" />
                  </div>
                  <div className="flex gap-4">
                     <button onClick={initUnsupervised} className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700"><RotateCcw className="w-4 h-4" /></button>
                     <button onClick={stepUnsupervised} className="px-6 py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2">
                       <Shuffle className="w-4 h-4" /> 执行 K-Means 聚类
                     </button>
                  </div>
                </div>
              )}

              {/* 2. Supervised */}
              {activeTab === 'supervised' && (
                <div className="p-8 h-full flex flex-col md:flex-row gap-8 items-center justify-center">
                   <div className="space-y-4 w-full max-w-xs">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                         <span>Training Epoch</span>
                         <span>{sEpoch} / 20</span>
                      </div>
                      <div className="h-48 flex items-end gap-1 pb-2 border-b border-white/10">
                         {Array.from({length: 20}).map((_, i) => (
                           <div 
                             key={i} 
                             className={`flex-1 rounded-t transition-all ${i < sEpoch ? 'bg-emerald-500' : 'bg-slate-800'}`}
                             style={{ height: i < sEpoch ? `${100 - (100 * Math.pow(0.85, i))}%` : '4px' }}
                           />
                         ))}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-400 font-bold">Accuracy: {sAccuracy.toFixed(1)}%</span>
                        <span className="text-rose-400 font-bold">Loss: {sLoss.toFixed(3)}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-center gap-6">
                      <div className="p-6 bg-slate-900 rounded-2xl border border-white/10 text-center space-y-2">
                        <div className="text-4xl">🐱</div>
                        <div className="text-xs text-slate-500 font-mono">Input: Image_01.jpg</div>
                        <div className="text-xs font-bold text-emerald-400">Label: "Cat"</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-600 rotate-90 md:rotate-0" />
                      <button 
                        onClick={runSupervised}
                        disabled={sEpoch > 0 && sEpoch < 20}
                        className="px-8 py-3 bg-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" /> 开始训练
                      </button>
                   </div>
                </div>
              )}

              {/* 3. RL (Grid World) */}
              {activeTab === 'rl' && (
                <div className="p-8 h-full flex flex-col items-center justify-center space-y-6">
                   <div className="grid grid-cols-4 gap-2 p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl">
                      {Array.from({length: 16}).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-lg transition-all duration-300
                            ${i === rlAgentPos ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] scale-110 z-10' : 
                              rlPath.includes(i) ? 'bg-orange-500/20' : 'bg-slate-800'}
                            ${i === 15 ? 'border-2 border-emerald-500' : ''}
                          `}
                        >
                          {i === rlAgentPos ? '🤖' : (i === 15 ? '🏁' : '')}
                        </div>
                      ))}
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-center">
                         <div className="text-[10px] text-slate-500 uppercase font-bold">Current Reward</div>
                         <div className="text-2xl font-mono text-orange-400">{rlScore}</div>
                      </div>
                      <button onClick={runRL} className="px-6 py-2 bg-orange-600 rounded-lg text-xs font-bold hover:bg-orange-700 flex items-center gap-2">
                        <Play className="w-4 h-4" /> 探索环境
                      </button>
                   </div>
                </div>
              )}

              {/* 4. RLHF */}
              {activeTab === 'rlhf' && (
                <div className="p-8 h-full flex flex-col space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <MessageSquare className="w-4 h-4 text-purple-400" />
                       <span className="text-xs font-bold text-slate-300">Prompt: "写一首关于夏天的短诗"</span>
                     </div>
                     <div className="text-[10px] text-slate-500 font-bold uppercase">RM Accuracy: {rewardModelAccuracy}%</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div 
                       onClick={() => { setRlhfStep(s => s+1); setRewardModelAccuracy(acc => Math.min(95, acc + 5)); }}
                       className="p-4 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all group"
                     >
                        <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase">Response A</div>
                        <p className="text-xs text-slate-300 leading-relaxed group-hover:text-purple-200">
                          夏天很热，太阳很大，<br/>我想吃西瓜，还想去游泳。<br/>知了在树上叫个不停。
                        </p>
                        <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <ThumbsUp className="w-5 h-5 text-purple-400" />
                        </div>
                     </div>
                     <div 
                       onClick={() => { setRlhfStep(s => s+1); setRewardModelAccuracy(acc => Math.min(95, acc + 5)); }}
                       className="p-4 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all group"
                     >
                        <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase">Response B</div>
                        <p className="text-xs text-slate-300 leading-relaxed group-hover:text-purple-200">
                          烈日炎炎似火烧，绿荫深处蝉鸣噪。<br/>冰镇瓜果解烦忧，清凉池水洗尘劳。
                        </p>
                        <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <ThumbsUp className="w-5 h-5 text-purple-400" />
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center">
                    <p className="text-xs text-purple-300 font-medium">
                      {rlhfStep === 0 ? "请点击您认为写得更好的诗句 (标注偏好)" : `已收集 ${rlhfStep} 组人类反馈数据，奖励模型正在迭代...`}
                    </p>
                  </div>
                </div>
              )}

              {/* 5. RLVR */}
              {activeTab === 'rlvr' && (
                <div className="p-8 h-full flex flex-col space-y-6">
                   <div className="flex items-center justify-between">
                     <button onClick={runRLVR} className="px-4 py-2 bg-rose-600 rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center gap-2">
                       <Calculator className="w-4 h-4" /> 下发数学任务
                     </button>
                     {rlvrProblem && <span className="text-xs font-mono text-slate-300 bg-white/5 px-3 py-1 rounded">Target: {rlvrProblem.a}</span>}
                   </div>

                   <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                     {!rlvrProblem && (
                       <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                         <Sparkles className="w-8 h-8 mb-2" />
                         <p>等待任务输入...</p>
                       </div>
                     )}
                     {rlvrSteps.map((step, i) => {
                       if (!step) return null;
                       return (
                         <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-4">
                            <div className="flex flex-col items-center">
                               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10
                                 ${step.status === 'thinking' ? 'bg-slate-700 text-slate-400' : 
                                   step.status === 'verified' ? 'bg-rose-500 text-white' : 'bg-red-500 text-white'}`}>
                                 {step.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : (i+1)}
                               </div>
                               {i < rlvrSteps.length - 1 && <div className="w-px h-full bg-slate-800 -my-2" />}
                            </div>
                            <div className={`flex-1 p-3 rounded-xl border mb-2 text-xs font-mono
                              ${step.status === 'verified' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-slate-900 border-white/5 text-slate-400'}`}>
                               {step.thought}
                            </div>
                         </div>
                       );
                     })}
                   </div>

                   {rlvrSteps.some(s => s && s.status === 'verified') && (
                     <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl flex items-center gap-3 animate-in zoom-in">
                        <Scale className="w-5 h-5 text-rose-400" />
                        <div>
                           <div className="text-[10px] font-bold text-rose-400 uppercase">System Reward Triggered</div>
                           <div className="text-xs text-rose-200">检测到最终答案与 Ground Truth 一致。给予模型正向奖励 (+1.0)。</div>
                        </div>
                     </div>
                   )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right: Explanation Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 shadow-2xl h-full flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 text-2xl">
              {PARADIGMS[activeTab].icon}
            </div>
            
            <h3 className={`text-xl font-bold mb-2 ${PARADIGMS[activeTab].color}`}>
              {PARADIGMS[activeTab].title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {PARADIGMS[activeTab].desc}
            </p>

            <div className="flex-1 space-y-4">
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">核心差异 (Key Difference)</h4>
                 <ul className="space-y-2">
                   {activeTab === 'rlvr' ? (
                     <>
                       <li className="flex gap-2 text-xs text-slate-300">
                         <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                         <span><b>客观验证：</b> 不需要人类打分，依靠编译器或数学引擎验证。</span>
                       </li>
                       <li className="flex gap-2 text-xs text-slate-300">
                         <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                         <span><b>过程监督：</b> 不仅看结果，还能验证推理步骤的逻辑一致性。</span>
                       </li>
                     </>
                   ) : activeTab === 'rlhf' ? (
                     <>
                        <li className="flex gap-2 text-xs text-slate-300">
                         <AlertTriangle className="w-4 h-4 text-purple-500 shrink-0" />
                         <span><b>主观依赖：</b> 高度依赖人类标注员的质量和价值观。</span>
                       </li>
                       <li className="flex gap-2 text-xs text-slate-300">
                         <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                         <span><b>风格对齐：</b> 适合文学创作、聊天助手等开放性任务。</span>
                       </li>
                     </>
                   ) : (
                     <li className="text-xs text-slate-400 italic">
                       该范式是现代 AI 的基础。点击左侧 Play 按钮体验交互。
                     </li>
                   )}
                 </ul>
               </div>

               {activeTab === 'rlvr' && (
                 <div className="p-4 bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-xl border border-rose-500/20">
                    <div className="text-[10px] font-bold text-rose-400 uppercase mb-1">DeepSeek R1 启示</div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      DeepSeek 通过大规模的 RLVR（强化学习+规则验证）让模型学会了自我反思。当推理步骤错误时，模型能收到负反馈并尝试新路径，从而涌现出强大的逻辑能力。
                    </p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningParadigmsSim;
