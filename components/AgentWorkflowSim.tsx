
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, GitMerge, Workflow, Zap, Brain, User, 
  Terminal, ArrowRight, Play, RotateCcw,
  CheckCircle2, AlertCircle, Settings, Wrench,
  Database, ListChecks, MessageSquare, ShieldAlert,
  CreditCard, ShieldCheck, Smartphone, Landmark,
  UserPlus, Search, Wallet, Bell
} from 'lucide-react';

const AgentWorkflowSim: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [logs, setLogs] = useState<{agent: string, action: string, type: 'thought' | 'action' | 'done'}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const runSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setIsRunning(true);
    setLogs([]);
    setActiveStep(1);

    const steps = [
      { agent: '智能助手', type: 'thought', action: '接收到语音指令：“给张三转账 5000 元，顺便帮我查一下这笔钱转完还剩多少。”' },
      { agent: '智能助手', type: 'action', action: '调用工具：SearchContact -> 确认“张三”账号；计算余额变动。' },
      { agent: '核心执行', type: 'thought', action: '检查账户余额... 当前余额 12,450 元，余额充足。' },
      { agent: '核心执行', type: 'action', action: '准备交易报文：转账金额 5000.00，目标账户：6222...0981。' },
      { agent: '风控审计', type: 'thought', action: '评估风险等级... 目标账户为常用联系人，金额未超每日限额。' },
      { agent: '风控审计', type: 'action', action: '调用风控 API：触发人脸识别验证（模拟）。' },
      { agent: '核心执行', type: 'thought', action: '人脸识别通过。正在写入账本记录并通知网关...' },
      { agent: '核心执行', type: 'done', action: '转账成功！流水号：TXN_882910。' },
      { agent: '风控审计', type: 'done', action: '安全记录已存入审计日志。' },
      { agent: '智能助手', type: 'done', action: '反馈用户：“转账已完成，剩余可用余额 7,450 元，已同步添加至电子回单。”' }
    ];

    let i = 0;
    intervalRef.current = window.setInterval(() => {
      if (i < steps.length) {
        const currentStep = steps[i];
        if (currentStep) {
          setLogs(prev => [...prev, currentStep as any]);
          if (i <= 1) setActiveStep(1);
          else if (i <= 3) setActiveStep(2);
          else if (i <= 5) setActiveStep(3);
          else setActiveStep(4);
        }
        i++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
      }
    }, 1200);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLogs([]);
    setActiveStep(0);
    setIsRunning(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-[9px] font-bold border border-blue-500/20 tracking-widest">FINANCIAL AGENT CASE</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-500 bg-clip-text text-transparent">
          金融级 Agent 协作与编排
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          在银行转账等严谨场景中，单个 Agent 难以兼顾“语义理解”、“账务执行”与“安全风控”。
          通过多 Agent 协作模型，我们可以实现既流畅又安全的金融交互。
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center text-slate-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold">传统脚本流程 (Rule-based)</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Static & Rigid</p>
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>输入金额</span> <ArrowRight className="w-3 h-3" /> <span>点击转账</span> <ArrowRight className="w-3 h-3" /> <span>弹出报错</span>
            </div>
            <div className="p-2 border-l-2 border-slate-500/30 bg-slate-500/5 text-[11px] text-slate-400 italic">
              "只能按照预设按钮操作，无法理解复杂的人类意图。"
            </div>
          </div>
        </div>

        <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold">智能银行 Agent</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Agentic & Conversational</p>
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">自然语言请求</span> <ArrowRight className="w-3 h-3" /> <span>Agent 动态调优</span> <ArrowRight className="w-3 h-3" /> <span>自动化交付</span>
            </div>
            <div className="p-2 border-l-2 border-emerald-500/30 bg-emerald-500/5 text-[11px] text-emerald-300 italic">
              "帮我把最近那笔 100 块的饭钱转给老婆。" (自动识别联系人与金额)
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Agent Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left: Interactive Stage */}
        <div className="lg:col-span-2 p-8 bg-slate-900 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
          
          <div className="relative z-10 space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-emerald-400" /> 金融转账 Agent 协作链路
                </h3>
                <div className="flex gap-2">
                   <button 
                    onClick={runSimulation}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                  >
                    <Play className="w-3 h-3 fill-current" /> 模拟转账
                  </button>
                  <button 
                    onClick={reset}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
             </div>

             {/* Visual Graph */}
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                {/* Intent Agent */}
                <div className={`relative p-4 rounded-2xl border transition-all duration-500 ${activeStep === 1 ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 opacity-40'}`}>
                  <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-tighter">Intent Parser</div>
                    <div className="text-xs font-bold text-white">智能助手</div>
                  </div>
                  {activeStep === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />}
                </div>

                <div className="hidden md:block">
                  <ArrowRight className={`w-6 h-6 transition-colors ${activeStep >= 1 ? 'text-blue-500' : 'text-slate-800'}`} />
                </div>

                {/* Executor Agent */}
                <div className={`relative p-4 rounded-2xl border transition-all duration-500 ${activeStep === 2 ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 opacity-40'}`}>
                  <Wallet className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-tighter">Core Banking</div>
                    <div className="text-xs font-bold text-white">核心执行</div>
                  </div>
                  {activeStep === 2 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />}
                </div>

                <div className="hidden md:block">
                  <ArrowRight className={`w-6 h-6 transition-colors ${activeStep >= 2 ? 'text-emerald-500' : 'text-slate-800'}`} />
                </div>

                {/* Risk Agent */}
                <div className={`relative p-4 rounded-2xl border transition-all duration-500 ${activeStep === 3 ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/10 opacity-40'}`}>
                  <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-tighter">Fraud Guard</div>
                    <div className="text-xs font-bold text-white">风控审计</div>
                  </div>
                  {activeStep === 3 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />}
                </div>
             </div>

             {/* Shared Memory Box */}
             <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex gap-4 items-center">
                <Database className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <div className="text-[9px] font-bold uppercase text-slate-500 mb-1">交易上下文 (Shared Transaction State)</div>
                  <div className="flex gap-2">
                    {activeStep >= 1 && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[9px] border border-blue-500/20 animate-in fade-in">Contact: 张三</span>}
                    {activeStep >= 2 && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] border border-emerald-500/20 animate-in fade-in">Amount: 5000.00</span>}
                    {activeStep >= 3 && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[9px] border border-amber-500/20 animate-in fade-in">Risk: Low (Safe)</span>}
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Runtime Log */}
        <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl flex flex-col h-[480px]">
           <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Agent 交易决策日志</span>
           </div>
           
           <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 text-[11px] font-mono leading-relaxed">
             {logs.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50">
                  <Bell className="w-8 h-8 mb-2 animate-bounce" />
                  <p className="italic">等待语音/文字指令下达...</p>
               </div>
             )}
             {logs.map((log, i) => (
               <div key={i} className={`p-3 rounded-xl border animate-in slide-in-from-left-2 ${
                 log && log.type === 'thought' ? 'bg-white/5 border-white/5 text-slate-400' : 
                 log && log.type === 'action' ? 'bg-blue-500/5 border-blue-500/20 text-blue-300' : 
                 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
               }`}>
                 <span className="uppercase text-[9px] opacity-60 mr-2">[{log?.agent || 'Unknown'}]</span>
                 {log?.action}
               </div>
             ))}
           </div>

           <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-3">
              <ListChecks className="w-4 h-4 text-slate-500" />
              <p className="text-[10px] text-slate-500 leading-tight">
                全链路追踪：每一个决策均经过<b>合规性</b>与<b>安全性</b>多重校验。
              </p>
           </div>
        </div>
      </div>

      {/* Deep Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
          <h5 className="font-bold text-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-400" /> 意图解构 (Parsing)
          </h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            不同于关键词匹配，Agent 可以理解“顺便查查余额”是后续任务，并自动在转账后触发查账 API。
          </p>
        </div>
        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
          <h5 className="font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 原子化工具 (Tools)
          </h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            核心 Agent 只被授予极其有限的权限，通过调用银行<b>原子化接口</b>（如 `createTransfer`）来保证操作的幂等性。
          </p>
        </div>
        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
          <h5 className="font-bold text-sm flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" /> 反馈循环 (Closed-Loop)
          </h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            如果风控 Agent 认为金额可疑，它可以中断执行并主动要求“智能助手”引导用户进行二次身份确认。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkflowSim;
