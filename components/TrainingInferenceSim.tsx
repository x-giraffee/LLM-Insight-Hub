
import React, { useState, useEffect } from 'react';
import { 
  Brain, Zap, Lock, RefreshCw, ArrowRight, 
  CheckCircle2, XCircle, GraduationCap, PenTool, 
  Eraser, Save, Layers, Play, Settings
} from 'lucide-react';

const TrainingInferenceSim: React.FC = () => {
  const [mode, setMode] = useState<'training' | 'inference'>('training');
  const [step, setStep] = useState(0); // 0: Idle, 1: Forward, 2: Loss/Output, 3: Backward/Done
  // Weights for the 4 connections: [In1->H1, In2->H1, H1->Out1, H1->Out2]
  const [weights, setWeights] = useState<number[]>([0.15, -0.23, 0.45, 0.12]); 
  const [output, setOutput] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  // Reset simulation when switching modes
  useEffect(() => {
    setStep(0);
    setLogs([]);
    setOutput('');
    if (mode === 'inference') {
      // Set "Trained" optimal weights for inference demo
      setWeights([0.89, 0.05, -0.67, 0.92]);
    } else {
      // Reset to random/initial weak weights for training demo
      setWeights([0.10, 0.10, 0.10, 0.10]);
    }
  }, [mode]);

  const runSimulation = () => {
    if (step !== 0) return;

    if (mode === 'training') {
      // TRAINING SEQUENCE
      setStep(1);
      setLogs(prev => [...prev, '⚡ 前向传播 (Forward): 输入数据 → 计算预测']);
      
      setTimeout(() => {
        setStep(2);
        setOutput('0.4 (错误, 目标 1.0)');
        setLogs(prev => [...prev, '❌ 计算误差 (Loss): 预测偏离目标，准备修正']);
        
        setTimeout(() => {
          setStep(3);
          // Update weights simulation: Add gradients
          setWeights(prev => prev.map(w => {
             // Simulate gradient update: add some value and keep 2 decimals
             const delta = (Math.random() * 0.3); 
             return parseFloat((w + delta).toFixed(2));
          }));
          setLogs(prev => [...prev, '🔄 反向传播 (Backward): 梯度下降 → 更新参数权重']);
          
          setTimeout(() => {
             setStep(0);
             setOutput('');
             setLogs(prev => [...prev, '✅ 参数已更新 (Weights Updated)']);
          }, 1500);
        }, 1500);
      }, 1500);
    } else {
      // INFERENCE SEQUENCE
      setStep(1);
      setLogs(prev => [...prev, '⚡ 前向传播 (Forward): 输入数据 → 计算结果']);

      setTimeout(() => {
        setStep(2);
        setOutput('0.98 (猫)');
        setLogs(prev => [...prev, '✅ 输出结果: 这是一个“猫”']);

        setTimeout(() => {
           setStep(0);
           setLogs(prev => [...prev, '🔒 结束: 参数保持冻结，未发生任何改变']);
        }, 1500);
      }, 1500);
    }
  };

  const VisualNode = ({ label, active }: { label: string, active: boolean }) => (
    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xs z-10 transition-all duration-300
      ${active ? 'bg-indigo-500 border-indigo-300 text-white scale-110 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
      {label}
    </div>
  );

  const Connection = ({ x1, y1, x2, y2, weight, isActive }: { x1: string, y1: string, x2: string, y2: string, weight: number, isActive: boolean }) => {
    const isUpdating = mode === 'training' && step === 3;
    const strokeWidth = Math.max(1, Math.min(6, Math.abs(weight) * 4)); // Visual thickness based on weight magnitude
    
    // Calculate label position (midpoint)
    const mx = (parseFloat(x1) + parseFloat(x2)) / 2;
    const my = (parseFloat(y1) + parseFloat(y2)) / 2;

    return (
      <g>
        <line 
          x1={x1} y1={y1} x2={x2} y2={y2} 
          stroke={isUpdating ? '#f43f5e' : (isActive ? '#6366f1' : '#475569')} 
          strokeWidth={strokeWidth} 
          strokeDasharray={step === 1 ? "4" : "0"} 
          className="transition-all duration-1000" 
        >
           {step === 1 && <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />}
        </line>
        
        {/* Weight Label Background for readability */}
        <rect 
          x={`${mx - 3}%`} y={`${my - 2.5}%`} 
          width="6%" height="5%" 
          rx="4" 
          fill="#020617" 
          className="opacity-90"
        />
        
        {/* Weight Label Text */}
        <text 
          x={`${mx}%`} y={`${my}%`} 
          fill={isUpdating ? '#f43f5e' : '#94a3b8'} 
          fontSize="10" 
          fontWeight="bold"
          textAnchor="middle" 
          dominantBaseline="middle"
          className={`font-mono transition-all duration-300 ${isUpdating ? 'scale-125' : ''}`}
        >
          {weight.toFixed(2)}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-2">
           <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-[9px] font-bold border border-purple-500/20 tracking-widest uppercase">
             Core Concept
           </span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          训练 vs. 推理：模型是如何思考的？
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          为什么我们说“训练”是在造大脑，而“推理”只是在用大脑？观察下方参数权重的变化。
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1 rounded-xl border border-white/10 flex gap-2">
          <button
            onClick={() => setMode('training')}
            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
              ${mode === 'training' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <GraduationCap className="w-4 h-4" /> 训练模式 (Training)
          </button>
          <button
            onClick={() => setMode('inference')}
            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
              ${mode === 'inference' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Play className="w-4 h-4" /> 推理模式 (Inference)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Interactive Neural Net */}
        <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 relative overflow-hidden min-h-[400px] flex flex-col">
          <div className="absolute top-4 left-4 flex gap-2">
             <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border
               ${mode === 'training' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
               {mode === 'training' ? 'Parameters Unlocked' : 'Parameters Frozen'}
             </div>
             {mode === 'inference' && <Lock className="w-4 h-4 text-emerald-500" />}
          </div>

          {/* Neural Network Visualization */}
          <div className="flex-1 flex items-center justify-between px-8 relative">
             {/* Input Layer */}
             <div className="flex flex-col gap-8">
                <VisualNode label="In 1" active={step >= 1} />
                <VisualNode label="In 2" active={step >= 1} />
             </div>

             {/* Weights (SVG Lines) */}
             <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                   {/* Connections from In to Hidden */}
                   <Connection x1="20%" y1="35%" x2="50%" y2="50%" weight={weights[0]} isActive={step >= 1} />
                   <Connection x1="20%" y1="65%" x2="50%" y2="50%" weight={weights[1]} isActive={step >= 1} />
                   
                   {/* Connections from Hidden to Out */}
                   <Connection x1="50%" y1="50%" x2="80%" y2="35%" weight={weights[2]} isActive={step >= 1} />
                   <Connection x1="50%" y1="50%" x2="80%" y2="65%" weight={weights[3]} isActive={step >= 1} />
                </svg>
             </div>

             {/* Hidden Layer */}
             <div className="flex flex-col gap-8 z-10">
                <VisualNode label="H 1" active={step >= 1} />
             </div>

             {/* Output Layer */}
             <div className="flex flex-col gap-8 z-10">
                <VisualNode label="Out 1" active={step >= 2} />
                <VisualNode label="Out 2" active={step >= 2} />
             </div>
          </div>

          <div className="mt-8 flex items-center justify-between z-10">
             <div className="font-mono text-xs">
                <span className="text-slate-500 uppercase font-bold mr-2">Status:</span>
                <span className={step === 0 ? 'text-slate-400' : 'text-white'}>
                   {step === 0 ? 'Ready' : step === 1 ? 'Forward Pass...' : step === 2 ? 'Calculating...' : mode === 'training' ? 'Updating Weights...' : 'Finished'}
                </span>
             </div>
             <button 
               onClick={runSimulation}
               disabled={step !== 0}
               className={`px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg
                 ${step !== 0 ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400' : 
                   mode === 'training' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
             >
               {step !== 0 ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
               {mode === 'training' ? '执行训练步 (Step)' : '执行推理 (Generate)'}
             </button>
          </div>
        </div>

        {/* Right: Explainer */}
        <div className="space-y-6">
           {/* Analogy Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 ${mode === 'training' ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
              <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-lg ${mode === 'training' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                   {mode === 'training' ? <Settings className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-200">
                     {mode === 'training' ? '直观比喻：复习备考' : '直观比喻：上场考试'}
                   </h3>
                   <div className="text-[10px] text-slate-500 uppercase font-bold">
                     {mode === 'training' ? 'Building the Brain' : 'Using the Brain'}
                   </div>
                 </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                 {mode === 'training' 
                   ? '学生（模型）做题，老师（Loss）批改。学生根据错题修改脑子里的神经连接（参数更新）。这是一个为了“修正自己”的过程，有标准答案。' 
                   : '学生（模型）在考场上，根据脑子里已有的知识（固定参数）写答案。无论写了多少字，脑子里的知识结构在考试期间是不会变的。'}
              </p>
              
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 font-mono text-[10px] space-y-1">
                 <div className="flex justify-between">
                    <span className="text-slate-500">参数状态:</span>
                    <span className={mode === 'training' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                       {mode === 'training' ? 'Active / Updating' : 'Frozen / Locked'}
                    </span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">反向传播:</span>
                    <span className={mode === 'training' ? 'text-indigo-400 font-bold' : 'text-slate-600'}>
                       {mode === 'training' ? 'Enabled (Gradient Calc)' : 'Disabled'}
                    </span>
                 </div>
              </div>
           </div>

           {/* Log Terminal */}
           <div className="h-48 bg-slate-900 rounded-3xl border border-white/10 p-4 flex flex-col">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                 <Zap className="w-3 h-3" /> System Operations
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px]">
                 {logs.length === 0 && <span className="text-slate-700 italic">等待操作...</span>}
                 {logs.map((log, i) => (
                    <div key={i} className="animate-in slide-in-from-left-2 text-slate-300">
                       {log}
                    </div>
                 ))}
                 {step === 3 && mode === 'training' && (
                    <div className="text-rose-400 animate-pulse font-bold">» Updating Weights [W1, W2, W3, W4]...</div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Misconception Section: Context vs Parameters */}
      <div className="mt-12 pt-8 border-t border-white/5">
         <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-rose-400" />
            核心误区澄清：记忆 (Context) vs. 参数 (Parameters)
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400"><Layers className="w-5 h-5" /></div>
                  <div>
                     <h4 className="font-bold text-sm">短期记忆 (Context / KV Cache)</h4>
                     <p className="text-[10px] text-slate-500 uppercase">临时草稿纸</p>
                  </div>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  这是你在对话框里输入的内容。它作为<b>临时输入</b>喂给模型。
                  就像考试时的草稿纸，考完（关闭窗口）就扔了。它<b>不会</b>修改模型的大脑结构。
               </p>
               <div className="p-3 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono text-blue-300">
                  User: "我叫小明"<br/>
                  AI: "你好小明"<br/>
                  <span className="text-slate-600">// 关闭窗口后，AI 不会记得世界上有个小明</span>
               </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-400"><Save className="w-5 h-5" /></div>
                  <div>
                     <h4 className="font-bold text-sm">长期记忆 (Parameters / Weights)</h4>
                     <p className="text-[10px] text-slate-500 uppercase">大脑神经元</p>
                  </div>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  这是模型训练时固化下来的知识（比如 1+1=2，地球是圆的）。
                  要改变它，必须重新<b>训练</b>或<b>微调 (Fine-tuning)</b>，这需要巨大的算力和专门的过程。
               </p>
               <div className="p-3 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono text-rose-300">
                  System: [Weights File: 140GB]<br/>
                  Status: Read-Only (只读)<br/>
                  <span className="text-slate-600">// 无论你聊什么，这个文件的一个比特都不会变</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TrainingInferenceSim;
