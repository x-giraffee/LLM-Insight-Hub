import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Code, Terminal, Zap, MessageSquare, 
  Settings2, Copy, Play, RotateCcw, Cpu, 
  Database, Braces, Globe, Layers, CheckCircle2,
  Clock, ArrowRight
} from 'lucide-react';

type PromptTechnique = 'zero-shot' | 'few-shot' | 'cot' | 'json-mode';

const TECHNIQUES: Record<PromptTechnique, { name: string; desc: string; system: string; user: string }> = {
  'zero-shot': {
    name: 'Zero-shot (直接提问)',
    desc: '最基础的调用方式，直接向模型下达指令，不提供任何参考示例。',
    system: '你是一个专业的翻译专家。',
    user: '将“人工智能正在重塑金融业”翻译成英文。'
  },
  'few-shot': {
    name: 'Few-shot (少样本)',
    desc: '通过提供 2-3 个示例，让模型模仿特定的输出风格或格式。',
    system: '你是一个语气幽默的客服助手。',
    user: '输入：我想退货。\n输出：噢亲爱的！看来我们要暂时告别了？没问题，这就为你办理！\n\n输入：物流太慢了。\n输出：它可能在路上看风景入迷了，我这就去催催这只小蜗牛！\n\n输入：我不想要了。'
  },
  'cot': {
    name: 'CoT (思维链)',
    desc: '强制模型在给出答案前进行逻辑推演（Let\'s think step by step），大幅提升逻辑任务准确度。',
    system: '你是一个精通数学的逻辑学家。',
    user: '一个篮子里有3个苹果，小明拿走了2个，又放回了1个，现在篮子里几个苹果？请一步步思考。'
  },
  'json-mode': {
    name: 'JSON Mode (结构化)',
    desc: '强制模型返回符合特定模式的 JSON 格式，方便后端程序直接解析。',
    system: '请以 JSON 格式输出结果，包含 "sentiment" 和 "reason" 两个字段。',
    user: '评价一下：这家餐厅的牛排很好吃，但是服务员态度太差了。'
  }
};

const OpenAPISim: React.FC = () => {
  const [technique, setTechnique] = useState<PromptTechnique>('zero-shot');
  const [systemMsg, setSystemMsg] = useState(TECHNIQUES['zero-shot'].system);
  const [userMsg, setUserMsg] = useState(TECHNIQUES['zero-shot'].user);
  const [temperature, setTemperature] = useState(0.7);
  const [isStreaming, setIsStreaming] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseTokens, setResponseTokens] = useState<string[]>([]);
  const [showJson, setShowJson] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responseTokens]);

  const handleTechniqueChange = (t: PromptTechnique) => {
    setTechnique(t);
    setSystemMsg(TECHNIQUES[t].system);
    setUserMsg(TECHNIQUES[t].user);
    setResponseTokens([]);
  };

  const simulateCall = async () => {
    setIsProcessing(true);
    setResponseTokens([]);
    
    // Simulate initial delay
    await new Promise(r => setTimeout(r, 600));
    
    const mockFullResponse = technique === 'json-mode' 
      ? '{\n  "sentiment": "mixed",\n  "reason": "positive on food, negative on service"\n}'
      : "这是一个模拟的回复。在实际调用中，OpenAI 的 API 会根据你的 System 和 User 消息返回最匹配的逻辑输出。流式输出能显著提升用户的感知速度。";
    
    const tokenList = mockFullResponse.split('');
    
    for (let i = 0; i < tokenList.length; i++) {
      setResponseTokens(prev => [...prev, tokenList[i]]);
      await new Promise(r => setTimeout(r, isStreaming ? 30 : 5));
    }
    
    setIsProcessing(false);
  };

  const requestPayload = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemMsg },
      { role: "user", content: userMsg }
    ],
    temperature,
    stream: isStreaming,
    max_tokens: 1024
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[9px] font-bold border border-green-500/20 tracking-widest uppercase">Protocol Standard</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            OpenAPI 调用实验室
          </h2>
        </div>
        <div className="flex items-center gap-3">
           <Globe className="w-4 h-4 text-slate-600" />
           <span className="text-xs font-mono text-slate-500">https://api.openai.com/v1/chat/completions</span>
        </div>
      </div>

      {/* Main UI */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Request Builder */}
        <div className="xl:col-span-5 space-y-6">
          <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Settings2 className="w-4 h-4 text-emerald-500" /> 请求参数配置
               </h4>
            </div>

            {/* Technique Selector */}
            <div className="space-y-3">
               <label className="text-[10px] text-slate-500 font-bold uppercase">常用 Prompt 技术预设</label>
               <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TECHNIQUES) as PromptTechnique[]).map(t => (
                    <button
                      key={t}
                      onClick={() => handleTechniqueChange(t)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all text-left
                        ${technique === t ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                    >
                      {TECHNIQUES[t].name}
                    </button>
                  ))}
               </div>
               <p className="text-[10px] text-slate-600 italic px-1">{TECHNIQUES[technique].desc}</p>
            </div>

            {/* Message Inputs */}
            <div className="space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">System (角色设定)</label>
                    <span className="text-[9px] text-slate-700 font-mono">Role: system</span>
                  </div>
                  <textarea 
                    value={systemMsg}
                    onChange={(e) => setSystemMsg(e.target.value)}
                    className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">User (提问指令)</label>
                    <span className="text-[9px] text-slate-700 font-mono">Role: user</span>
                  </div>
                  <textarea 
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    className="w-full h-28 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  />
               </div>
            </div>

            {/* Params Slider */}
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
               <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Temperature</label>
                    <span className="text-xs font-mono text-emerald-400">{temperature}</span>
                  </div>
                  <input 
                    type="range" min="0" max="2" step="0.1" value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-emerald-500"
                  />
               </div>
               <div className="flex items-center gap-2 pt-4 sm:pt-0">
                  <input 
                    type="checkbox" id="stream" checked={isStreaming}
                    onChange={(e) => setIsStreaming(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-black/40 checked:bg-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="stream" className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer">Stream Output</label>
               </div>
            </div>

            <button 
              onClick={simulateCall}
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isProcessing ? '正在发送 HTTP POST 请求...' : '调用 API 接口'}
            </button>
          </div>
        </div>

        {/* Right Column: Console & Protocol Inspector */}
        <div className="xl:col-span-7 flex flex-col gap-6 h-full min-h-[600px]">
          
          {/* Header Tabs for Console */}
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5 w-fit">
            <button 
              onClick={() => setShowJson(false)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 ${!showJson ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Terminal className="w-3 h-3" /> 实时终端 (Response)
            </button>
            <button 
              onClick={() => setShowJson(true)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 ${showJson ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Braces className="w-3 h-3" /> 请求报文 (JSON)
            </button>
          </div>

          <div className="flex-1 bg-slate-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
             {showJson ? (
               <div className="flex-1 p-6 font-mono text-xs text-indigo-300 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                     <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">HTTP POST RAW PAYLOAD</span>
                     <button className="text-slate-600 hover:text-white transition-all"><Copy className="w-3 h-3" /></button>
                  </div>
                  <pre className="whitespace-pre-wrap animate-in fade-in duration-300">
                    {JSON.stringify(requestPayload, null, 2)}
                  </pre>
               </div>
             ) : (
               <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Output Stream</span>
                     </div>
                     <div className="flex gap-4">
                        <div className="text-center">
                           <div className="text-[9px] text-slate-700 font-bold uppercase">Status</div>
                           <div className="text-[10px] text-emerald-500 font-mono">200 OK</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[9px] text-slate-700 font-bold uppercase">Latency</div>
                           <div className="text-[10px] text-slate-400 font-mono">142ms</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 font-sans text-sm leading-relaxed text-slate-300 overflow-y-auto custom-scrollbar">
                     {responseTokens.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-slate-800 italic">
                          <MessageSquare className="w-10 h-10 mb-4 opacity-5" />
                          <p>等待 API 响应...</p>
                       </div>
                     ) : (
                       <div className="animate-in fade-in duration-300">
                          {responseTokens.join('')}
                          {isProcessing && <span className="inline-block w-1.5 h-4 bg-emerald-500 ml-1 animate-pulse" />}
                       </div>
                     )}
                     <div ref={terminalEndRef} />
                  </div>

                  {/* Metadata Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                     <div className="space-y-1">
                        <span className="text-[9px] text-slate-600 uppercase font-bold">Completion Tokens</span>
                        <div className="text-xs font-mono text-white">{responseTokens.length}</div>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[9px] text-slate-600 uppercase font-bold">Prompt Tokens</span>
                        <div className="text-xs font-mono text-white">{(systemMsg.length + userMsg.length) / 2 | 0}</div>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[9px] text-slate-600 uppercase font-bold">Finish Reason</span>
                        <div className="text-xs font-mono text-emerald-400 font-bold">{isProcessing ? '--' : 'stop'}</div>
                     </div>
                  </div>
               </div>
             )}
          </div>
          
          {/* Quick Explanation Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-start gap-3">
              <Layers className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
              <div className="space-y-1">
                 <h5 className="text-[10px] font-bold text-blue-300 uppercase">什么是 Stateless (无状态)?</h5>
                 <p className="text-[9px] text-slate-500 leading-relaxed">
                   API 本身不记得之前的对话。开发者必须手动将历史消息重新发送给模型，这就涉及到了上下文管理。
                 </p>
              </div>
            </div>
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <div className="space-y-1">
                 <h5 className="text-[10px] font-bold text-amber-300 uppercase">SSE 流式传输原理</h5>
                 <p className="text-[9px] text-slate-500 leading-relaxed">
                   API 通过持续保持连接并推送数据块（data: chunks）实现打字机效果，避免了长等待时间导致的连接超时。
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAPISim;