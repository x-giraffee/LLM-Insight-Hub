
import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, Share2, Database, Wrench, ArrowRightLeft, 
  Terminal, Play, RotateCcw, Cpu, FileText, 
  Code, Info, ShieldCheck, Zap, MessageSquare,
  Lock, Network, Workflow
} from 'lucide-react';

interface ProtocolMessage {
  from: 'Client' | 'Server';
  method: string;
  data: any;
  timestamp: string;
}

const MCPSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'concept'>('simulation');
  const [step, setStep] = useState(0); // 0: Idle, 1: Handshake, 2: Discovery, 3: Tool Call, 4: Result
  const [logs, setLogs] = useState<ProtocolMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (from: 'Client' | 'Server', method: string, data: any) => {
    const newMessage: ProtocolMessage = {
      from,
      method,
      data,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [...prev, newMessage]);
  };

  const runSimulation = async () => {
    setIsProcessing(true);
    setLogs([]);
    setStep(1);

    // Stage 1: Handshake
    addLog('Client', 'initialize', { protocolVersion: '2024-11-05', capabilities: { roots: { listChanged: true } } });
    await new Promise(r => setTimeout(r, 1000));
    addLog('Server', 'initialized', { serverInfo: { name: 'Local-Data-Bridge', version: '1.0.0' }, capabilities: { tools: {}, resources: {} } });
    
    // Stage 2: Discovery
    setStep(2);
    await new Promise(r => setTimeout(r, 800));
    addLog('Client', 'tools/list', {});
    await new Promise(r => setTimeout(r, 600));
    addLog('Server', 'tools/list response', { 
      tools: [
        { name: 'read_file', description: '读取本地文件内容', inputSchema: { type: 'object', properties: { path: { type: 'string' } } } },
        { name: 'query_db', description: '执行安全 SQL 查询', inputSchema: { type: 'object', properties: { sql: { type: 'string' } } } }
      ] 
    });

    // Stage 3: User Request & Tool Call
    setStep(3);
    await new Promise(r => setTimeout(r, 1000));
    addLog('Client', 'tools/call (read_file)', { arguments: { path: '~/notes/ideas.txt' } });
    await new Promise(r => setTimeout(r, 1200));
    addLog('Server', 'tools/call result', { content: [{ type: 'text', text: '这是来自本地文件的私密笔记内容：大模型将改变世界。' }] });

    // Stage 4: Synthesis
    setStep(4);
    setIsProcessing(false);
  };

  const reset = () => {
    setStep(0);
    setLogs([]);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold border border-indigo-500/20 tracking-widest uppercase">Ecosystem Standard</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            MCP 协议交互仿真
          </h2>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'simulation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            协议模拟
          </button>
          <button 
            onClick={() => setActiveTab('concept')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'concept' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            核心架构
          </button>
        </div>
      </div>

      {activeTab === 'simulation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interaction Visualizer */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative p-8 bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden min-h-[440px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                {/* AI Client */}
                <div className={`relative p-6 rounded-2xl border transition-all duration-500 text-center w-40 ${step >= 1 ? 'bg-blue-500/10 border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/10'}`}>
                  <Cpu className={`w-10 h-10 mx-auto mb-3 ${step >= 1 ? 'text-blue-400 animate-pulse' : 'text-slate-600'}`} />
                  <div className="text-xs font-bold text-white uppercase tracking-tighter">AI Client</div>
                  <div className="text-[9px] text-slate-500 mt-1 font-mono">(Claude/Desktop)</div>
                  {step === 3 && <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-bounce"><ArrowRightLeft className="w-5 h-5" /></div>}
                </div>

                {/* Connection Bridge */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-px w-24 md:w-32 transition-all duration-1000 ${step >= 1 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`} />
                  <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border transition-all ${step >= 1 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-white/5 text-slate-700'}`}>
                    JSON-RPC OVER STDIO/HTTP
                  </div>
                </div>

                {/* MCP Server */}
                <div className={`relative p-6 rounded-2xl border transition-all duration-500 text-center w-40 ${step >= 1 ? 'bg-indigo-500/10 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/10'}`}>
                  <Share2 className={`w-10 h-10 mx-auto mb-3 ${step >= 1 ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <div className="text-xs font-bold text-white uppercase tracking-tighter">MCP Server</div>
                  <div className="text-[9px] text-slate-500 mt-1 font-mono">(Local Bridge)</div>
                  
                  {/* Floating Tools */}
                  {step >= 2 && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 animate-in slide-in-from-bottom-2">
                       <div className="p-2 bg-slate-800 border border-white/10 rounded-lg shadow-xl" title="File System"><FileText className="w-4 h-4 text-emerald-400" /></div>
                       <div className="p-2 bg-slate-800 border border-white/10 rounded-lg shadow-xl" title="SQL Database"><Database className="w-4 h-4 text-blue-400" /></div>
                       <div className="p-2 bg-slate-800 border border-white/10 rounded-lg shadow-xl" title="Internal Tool"><Wrench className="w-4 h-4 text-amber-400" /></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Display */}
              <div className="relative z-10 mt-12 p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol State</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${step > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-600'}`}>
                      {step === 0 ? 'Not Connected' : step === 1 ? 'Handshaking...' : step === 2 ? 'Capabilities Exchanged' : step === 3 ? 'Executing Tool...' : 'Session Active'}
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 1, label: '握手' },
                      { id: 2, label: '发现' },
                      { id: 3, label: '调用' },
                      { id: 4, label: '响应' }
                    ].map(s => (
                      <div key={s.id} className={`h-1 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`} />
                    ))}
                 </div>

                 <div className="pt-2">
                   {step === 0 ? (
                     <div className="text-center py-4">
                       <button 
                        onClick={runSimulation}
                        disabled={isProcessing}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xl flex items-center gap-2 mx-auto"
                       >
                         <Play className="w-4 h-4 fill-current" /> 发起 MCP 建立请求
                       </button>
                     </div>
                   ) : (
                     <div className="flex justify-between items-center px-2">
                       <div className="flex items-center gap-3">
                          <Zap className={`w-4 h-4 ${isProcessing ? 'text-amber-500 animate-pulse' : 'text-slate-600'}`} />
                          <span className="text-xs text-slate-300">
                             {step === 1 && "正在进行版本同步与能力声明..."}
                             {step === 2 && "Server 返回可用工具列表：read_file, query_db"}
                             {step === 3 && "Client 请求：调用 read_file 工具读取本地笔记"}
                             {step === 4 && "交互完成：AI 已获取到本地私有数据！"}
                          </span>
                       </div>
                       <button onClick={reset} className="p-2 hover:bg-white/5 rounded-lg text-slate-500"><RotateCcw className="w-4 h-4" /></button>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            {/* System Instruction View */}
            <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> MCP 系统注入指令 (Prompt Injection)
               </h4>
               <div className="p-4 bg-black/40 rounded-xl font-mono text-[11px] text-slate-400 leading-relaxed border border-white/5 relative group">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Code className="w-4 h-4 text-slate-600" />
                  </div>
                  "You are an AI assistant with access to local tools through the Model Context Protocol. 
                  Currently available tools: <br/>
                  - <span className="text-indigo-400">read_file</span>: Access local files securely. <br/>
                  - <span className="text-indigo-400">query_db</span>: Query your local database. <br/>
                  When user asks about local data, use these tools to provide grounded answers."
               </div>
               <p className="text-[10px] text-slate-500 italic">
                 * 当握手成功后，这些工具定义会动态注入到大模型的上下文窗中，使其“学会”使用本地工具。
               </p>
            </div>
          </div>

          {/* Right: Protocol Inspector (Terminal) */}
          <div className="lg:col-span-5 flex flex-col h-[650px] bg-slate-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
             <div className="px-5 py-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Terminal className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Inspector</span>
                </div>
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[rgba(3,7,18,0.8)]">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-800">
                    <Network className="w-12 h-12 mb-3 opacity-10" />
                    <p className="text-[11px] font-mono italic">Listening for protocol messages...</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={`space-y-1.5 animate-in slide-in-from-bottom-2 duration-300`}>
                       <div className="flex items-center gap-2 text-[9px] font-bold font-mono">
                          <span className={log.from === 'Client' ? 'text-blue-400' : 'text-indigo-400'}>{log.from}</span>
                          <span className="text-slate-700">→</span>
                          <span className="text-slate-500">{log.method}</span>
                          <span className="ml-auto text-slate-800">{log.timestamp}</span>
                       </div>
                       <div className={`p-3 rounded-xl border font-mono text-[10px] leading-tight overflow-x-auto ${log.from === 'Client' ? 'bg-blue-500/5 border-blue-500/10 text-blue-300/80' : 'bg-indigo-500/5 border-indigo-500/10 text-indigo-300/80'}`}>
                          <pre className="whitespace-pre-wrap">{JSON.stringify(log.data, null, 2)}</pre>
                       </div>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
             </div>

             <div className="p-4 bg-slate-900/50 border-t border-white/10">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-mono text-slate-500">MCP Standard Transport Active</span>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Workflow className="w-5 h-5" /></div>
                 <h4 className="font-bold text-sm">统一接口规范</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   MCP 解决了“N 模型 × M 工具”的集成爆炸问题。开发者只需实现一次 MCP Server，即可让 Claude、IDE、桌面助手等所有兼容客户端访问。
                 </p>
              </div>
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Lock className="w-5 h-5" /></div>
                 <h4 className="font-bold text-sm">本地数据主权</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   通过 MCP，敏感数据（如企业代码库、私人笔记）保留在本地。AI 仅在需要时发起受控的 JSON-RPC 请求，无需将整个库上传至云端。
                 </p>
              </div>
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400"><MessageSquare className="w-5 h-5" /></div>
                 <h4 className="font-bold text-sm">情境实时注入</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   MCP 允许 Server 动态提供“Resources”（静态数据）和“Prompts”（预设指令），让 AI 能够感知用户当前在编辑器或系统中的实时上下文。
                 </p>
              </div>
           </div>

           <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex flex-col md:flex-row gap-8 items-center">
              <div className="shrink-0 flex -space-x-4">
                 <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-indigo-500 flex items-center justify-center"><Server className="w-8 h-8 text-indigo-400" /></div>
                 <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-blue-500 flex items-center justify-center"><MessageSquare className="w-8 h-8 text-blue-400" /></div>
              </div>
              <div className="space-y-2 text-center md:text-left">
                 <h4 className="text-xl font-bold text-white">正在开启 AI 交互的新篇章</h4>
                 <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                   MCP 不仅仅是一个协议，它是 AI 从“只会聊天的孤岛”转变为“能够操作电脑、理解私有数据的操作系统”的关键进化。它统一了人类数字化生存的上下文接口。
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MCPSim;
