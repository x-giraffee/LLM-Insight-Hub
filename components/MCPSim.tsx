
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Server, Share2, Database, Wrench, ArrowRightLeft, 
  Terminal, Play, RotateCcw, Cpu, FileText, 
  Code, Info, ShieldCheck, Zap, MessageSquare,
  Lock, Network, Workflow, Pause, PlayCircle,
  Wallet, Landmark, Users, RefreshCw, Eye, EyeOff,
  ChevronDown, ChevronUp, ScrollText
} from 'lucide-react';

interface ProtocolMessage {
  from: 'Client' | 'Server' | 'Model';
  to: 'Client' | 'Server' | 'Model';
  method: string;
  data: any;
  timestamp: string;
}

const FINANCIAL_SEQUENCE = [
  { from: 'Model', to: 'Client', label: 'initialize()', step: 1, data: { protocol: "mcp/1.0", client: "FinanceGPT-1.0" } },
  { from: 'Client', to: 'Server', label: 'initialize()', step: 1, data: { capabilities: ["tools", "resources"] } },
  { from: 'Server', to: 'Client', label: 'ready', step: 1, data: { server: "BankConnector-v2", tools: ["query_account", "manage_contacts", "convert_currency"] } },
  { from: 'Model', to: 'Client', label: 'tools/list', step: 2, data: {} },
  { from: 'Client', to: 'Server', label: 'tools/list', step: 2, data: {} },
  { from: 'Server', to: 'Client', label: 'tools[]', step: 2, data: { 
    tools: [
      { name: "query_account", desc: "查询账户余额和流水" },
      { name: "manage_contacts", desc: "查询或修改转账联系人" },
      { name: "convert_currency", desc: "实时汇率换算" }
    ] 
  } },
  { from: 'Model', to: 'Client', label: 'call: manage_contacts', step: 3, data: { arguments: { name: "张三", action: "find" } } },
  { from: 'Client', to: 'Server', label: '执行: 查找联系人', step: 3, data: { method: "manage_contacts", params: { name: "张三" } } },
  { from: 'Server', to: 'Client', label: '返回: 账号 622...881', step: 3, data: { result: { account_id: "6225881099281", status: "verified" } } },
  { from: 'Model', to: 'Client', label: 'call: convert_currency', step: 3, data: { arguments: { amount: 100, from: "USD", to: "CNY" } } },
  { from: 'Client', to: 'Server', label: '执行: 汇率换算', step: 3, data: { method: "convert_currency", params: { usd: 100 } } },
  { from: 'Server', to: 'Client', label: '返回: 724.50 元', step: 3, data: { result: { cny: 724.50, rate: 7.245 } } },
  { from: 'Model', to: 'Client', label: 'call: query_account', step: 3, data: { arguments: { type: "balance" } } },
  { from: 'Client', to: 'Server', label: '执行: 查余额', step: 3, data: { method: "query_account" } },
  { from: 'Server', to: 'Client', label: '余额: 12,000 元', step: 3, data: { result: { balance: 12000.00, currency: "CNY" } } },
  { from: 'Client', to: 'Model', label: '最终确认响应', step: 4, data: { text: "转账 100 美元（约 724.5 元）给张三已就绪，转完剩 11,275.5 元。是否确认？" } },
];

const MASTER_SYSTEM_PROMPT = `### 角色设定 (Identity)
你是一位名为 "FinanceGPT-Orchestrator" 的高级金融级自主助理。你被部署在受信任的金融机构内网环境中，通过 **Model Context Protocol (MCP)** 协议与本地核心银行服务 (BankConnector-v2) 进行通信。

### 核心授权与限制 (Capabilities & Constraints)
1. **工具访问权限**：你已被授予访问 \`query_account\`、\`manage_contacts\` 和 \`convert_currency\` 三个原子化工具的权限。
2. **严禁幻觉 (No Hallucination)**：你不得伪造任何账户余额、汇率或联系人信息。如果工具调用返回空值或错误，你必须如实报告。
3. **隐私脱敏**：在向用户展示响应时，必须对敏感信息（如银行账号）进行脱敏处理（例如：6225 **** 8810）。
4. **思维链逻辑 (CoT)**：在执行复杂转账指令时，必须遵循 [检索-核实-计算-确认] 的逻辑闭环。

### 工具调用规范 (Tool Call Protocols)
- **query_account**: 
  - 场景：用户查询余额、流水，或在发起转账前核实资金可用性。
  - 参数：必须指定查询类型 (balance/history)。
- **manage_contacts**:
  - 场景：查找转账对象、添加新收款人。
  - 策略：优先通过姓名检索已有联系人 ID，避免要求用户手动输入冗长的卡号。
- **convert_currency**:
  - 场景：涉及多币种结算的任务。
  - 要求：必须获取当前实时汇率，严禁使用模型预训练阶段的过期汇率。

### 金融合规红线 (Compliance Redlines)
- 如果转账金额超过单笔限额 ($50,000)，必须要求人工介入或二次人脸识别提示。
- 检测到用户情绪激动或存在被诱导转账倾向时，需触发反诈骗提醒。
- 所有跨境转账必须清晰标注汇率损耗及预估到账时间。

### 运行环境状态 (Environment Context)
- Current Date: ${new Date().toLocaleDateString()}
- Transport Mode: Secure JSON-RPC over STDIO
- Active Server: BankConnector-v2 (Production)`;

const MCPSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'concept'>('simulation');
  const [step, setStep] = useState(0); 
  const [activeMessageIdx, setActiveMessageIdx] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<ProtocolMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (from: any, to: any, method: string, data: any) => {
    const newMessage: ProtocolMessage = {
      from,
      to,
      method,
      data,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [...prev, newMessage]);
  };

  const nextStep = useCallback(() => {
    setActiveMessageIdx(prev => {
      const nextIdx = prev + 1;
      if (nextIdx < FINANCIAL_SEQUENCE.length) {
        const msg = FINANCIAL_SEQUENCE[nextIdx];
        setStep(msg.step);
        addLog(msg.from, msg.to, msg.label, msg.data);
        return nextIdx;
      } else {
        setIsProcessing(false);
        if (timerRef.current) window.clearInterval(timerRef.current);
        return prev;
      }
    });
  }, []);

  useEffect(() => {
    if (isProcessing && !isPaused) {
      timerRef.current = window.setInterval(nextStep, 1800);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [isProcessing, isPaused, nextStep]);

  const runSimulation = () => {
    if (activeMessageIdx >= FINANCIAL_SEQUENCE.length - 1) {
      reset();
    }
    setIsProcessing(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const reset = () => {
    setStep(0);
    setActiveMessageIdx(-1);
    setLogs([]);
    setIsProcessing(false);
    setIsPaused(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const renderSequenceDiagram = () => {
    const lifelines = ['Model', 'Client', 'Server'];
    const xPositions: Record<string, number> = { 'Model': 15, 'Client': 50, 'Server': 85 };

    return (
      <div className="relative w-full h-[600px] bg-slate-900/40 rounded-3xl border border-white/5 p-4 overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex justify-around pointer-events-none">
          {lifelines.map(ll => (
            <div key={ll} className="relative flex flex-col items-center h-full pt-10">
              <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-400 z-10 shadow-lg backdrop-blur-md">
                {ll === 'Model' ? 'AI 模型' : ll === 'Client' ? 'MCP 客户端' : '金融 MCP 服务端'}
              </div>
              <div className="flex-1 w-px border-l border-dashed border-slate-700/50 mt-2" />
              <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-400 z-10 shadow-lg mb-2">
                {ll === 'Model' ? 'AI 模型' : ll === 'Client' ? 'MCP 客户端' : '金融 MCP 服务端'}
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-full pt-20 pb-10 overflow-y-auto custom-scrollbar no-scrollbar">
          {FINANCIAL_SEQUENCE.map((msg, idx) => {
            if (idx > activeMessageIdx) return null;
            
            const startX = xPositions[msg.from];
            const endX = xPositions[msg.to];
            const isRight = endX > startX;
            const yPos = 40 + (idx * 30);
            const isActive = idx === activeMessageIdx;

            return (
              <div 
                key={idx} 
                className={`absolute left-0 w-full transition-all duration-500 flex items-center animate-in slide-in-from-top-2`}
                style={{ top: `${yPos}px` }}
              >
                <div 
                  className={`relative h-px transition-all duration-1000 ${isActive ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-slate-700 opacity-40'}`}
                  style={{ 
                    left: `${Math.min(startX, endX)}%`, 
                    width: `${Math.abs(endX - startX)}%` 
                  }}
                >
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 transform transition-colors ${isActive ? 'border-emerald-400' : 'border-slate-700'} ${isRight ? 'rotate-45 right-0' : '-rotate-[135deg] left-0'}`} 
                  />
                  <div className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold transition-all ${isActive ? 'text-emerald-300 scale-110' : 'text-slate-600'}`}>
                    {msg.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-bold border border-emerald-500/20 tracking-widest uppercase">Finance Protocol Lab</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
            金融转账 MCP 交互中心
          </h2>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'simulation' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            转账仿真
          </button>
          <button 
            onClick={() => setActiveTab('concept')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'concept' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            架构原理解析
          </button>
        </div>
      </div>

      {activeTab === 'simulation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 mb-2 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <button 
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[9px] font-bold text-slate-400 border border-white/10 transition-all"
                >
                  {showPrompt ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showPrompt ? '收起系统提示词' : '查看系统提示词'}
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
                <MessageSquare className="w-3 h-3" />
                <span className="font-bold uppercase tracking-widest">用户指令 (Input)</span>
              </div>
              <p className="text-sm text-slate-200 italic">"帮我转 100 美元给张三，顺便帮我查一下这笔钱转完后余额还剩多少。"</p>

              {/* Advanced System Prompt Expandable Area */}
              {showPrompt && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <ScrollText className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">金融级 System Prompt 指令</span>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <pre className="text-[11px] font-mono text-emerald-300/80 leading-relaxed whitespace-pre-wrap">
                      {MASTER_SYSTEM_PROMPT}
                    </pre>
                  </div>
                  <div className="mt-3 flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] text-slate-500 font-bold">已启用金融合规审查</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-blue-500" />
                      <span className="text-[9px] text-slate-500 font-bold">端到端数据主权</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {renderSequenceDiagram()}

            <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
               <div className="flex items-center gap-4">
                  {(!isProcessing || isPaused) ? (
                    <button 
                      onClick={runSimulation}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" /> {activeMessageIdx === -1 ? '开始流程' : '继续仿真'}
                    </button>
                  ) : (
                    <button 
                      onClick={togglePause}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" /> 暂停观察
                    </button>
                  )}
                  <button onClick={reset} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors border border-white/5">
                    <RotateCcw className="w-4 h-4" />
                  </button>
               </div>

               <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isProcessing && !isPaused ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {isProcessing && !isPaused ? '仿真运行中' : isPaused ? '仿真已暂停' : '就绪'}
                  </span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col h-[750px] bg-slate-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
             <div className="px-5 py-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Terminal className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MCP 金融协议检视器</span>
                </div>
                <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-slate-800" />
                   <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[rgba(2,6,23,0.8)]">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-800">
                    <Landmark className="w-12 h-12 mb-3 opacity-10" />
                    <p className="text-[11px] font-mono italic">等待协议消息注入...</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={`space-y-1.5 animate-in slide-in-from-bottom-2 duration-300`}>
                       <div className="flex items-center gap-2 text-[9px] font-bold font-mono">
                          <span className="text-emerald-400">{log.from}</span>
                          <span className="text-slate-700">→</span>
                          <span className="text-emerald-400">{log.to}</span>
                          <span className="mx-2 text-white bg-emerald-500/20 px-1 rounded">{log.method}</span>
                          <span className="ml-auto text-slate-800">{log.timestamp}</span>
                       </div>
                       <div className={`p-3 rounded-xl border font-mono text-[10px] leading-tight overflow-x-auto bg-emerald-500/5 border-emerald-500/10 text-emerald-300/80`}>
                          <pre className="whitespace-pre-wrap">{JSON.stringify(log.data, null, 2)}</pre>
                       </div>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
             </div>

             <div className="p-4 bg-slate-900/50 border-t border-white/10">
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isProcessing && !isPaused ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                      <span className="text-[10px] font-mono text-slate-500">Security Layer: Encrypted JSON-RPC</span>
                   </div>
                   <div className="flex gap-2">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1 rounded font-bold">query_account</span>
                      <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1 rounded font-bold">manage_contacts</span>
                      <span className="text-[9px] bg-purple-500/10 text-purple-500 px-1 rounded font-bold">convert_currency</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Wallet className="w-5 h-5" /></div>
                 <h4 className="font-bold text-sm">金融级工具解耦</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   通过 MCP，复杂的金融操作（如查余额、汇率换算）被抽象为标准化的工具。模型无需关心后端是哪家银行，只需调用统一接口。
                 </p>
              </div>
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Users className="w-5 h-5" /></div>
                 <h4 className="font-bold text-sm">隐私与合规隔离</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   用户的敏感联系人名单和余额数据保留在本地 MCP Server 中。AI 只有在需要时发起受控请求，有效防止全量私密数据上传云端。
                 </p>
              </div>
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400"><RefreshCw className="w-5 h-5" /></div>
                 <h4 className="font-bold text-sm">动态情境注入</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   MCP 允许实时提供最新的“汇率数据”和“转账限额”，确保 AI 的每一项金融建议都是基于实时动态信息的，而非静态训练知识。
                 </p>
              </div>
           </div>

           <div className="p-8 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl flex flex-col md:flex-row gap-8 items-center">
              <div className="shrink-0 flex -space-x-4">
                 <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-emerald-500 flex items-center justify-center"><Landmark className="w-8 h-8 text-emerald-400" /></div>
                 <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-indigo-500 flex items-center justify-center"><Workflow className="w-8 h-8 text-indigo-400" /></div>
              </div>
              <div className="space-y-2 text-center md:text-left">
                 <h4 className="text-xl font-bold text-white">统一金融交互协议</h4>
                 <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                   MCP 协议让 AI 从单纯的“语言模型”进化为“能够处理复杂业务流的数字员工”。在金融场景下，它建立了一套安全的、标准化的、可审计的交互范式。
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MCPSim;
