
import React, { useState, useEffect } from 'react';
import { 
  Database, FileText, Search, LayoutGrid, Brain, MessageSquare, 
  ArrowRight, ShieldCheck, Zap, Layers, RefreshCw, GitBranch,
  Crosshair, Filter, Terminal, Info, AlertCircle,
  // Fix: Added Network import to resolve "Cannot find name 'Network'" error
  Network
} from 'lucide-react';

const RAG_STEPS = [
  { id: 'ingestion', name: '数据摄入', icon: <FileText />, color: 'text-blue-400', desc: '提取企业私有文档、数据库信息' },
  { id: 'processing', name: '清洗分片', icon: <LayoutGrid />, color: 'text-cyan-400', desc: '长文本切割为 Semantic Chunks' },
  { id: 'embedding', name: '向量化', icon: <Layers />, color: 'text-indigo-400', desc: '将文本转为高维数值向量' },
  { id: 'storage', name: '向量入库', icon: <Database />, color: 'text-emerald-400', desc: '存储至 Milvus/Pinecone 等库' },
  { id: 'retrieval', name: '语义检索', icon: <Search />, color: 'text-amber-400', desc: '根据问题寻找最相似的 Top-K 块' },
  { id: 'rerank', name: '精排重测', icon: <Filter />, color: 'text-orange-400', desc: '二次校验相关性，减少噪音' },
  { id: 'generation', name: '增强生成', icon: <Brain />, color: 'text-purple-400', desc: '注入上下文，生成准确答案' },
];

const MOCK_KNOWLEDGE = [
  { id: 1, text: "大模型推理性能中，TTFT 指的是首字时间。", category: "性能" },
  { id: 2, text: "RAG 技术能有效解决模型的幻觉问题。", category: "架构" },
  { id: 3, text: "向量数据库的核心是近似最近邻搜索 (ANN)。", category: "技术" },
  { id: 4, text: "Agent 智能体可以通过 MCP 协议访问外部工具。", category: "生态" },
  { id: 5, text: "分词（Tokenization）是模型理解文本的第一步。", category: "基础" },
];

const RAGWorkflowSim: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [demoStep, setDemoStep] = useState(0); // 0: Idle, 1: Rewriting, 2: Searching, 3: Reranking, 4: Result
  const [retrievedChunks, setRetrievedChunks] = useState<typeof MOCK_KNOWLEDGE>([]);

  const runDemo = () => {
    if (!query) return;
    setDemoStep(1);
    
    // Simulate process
    setTimeout(() => setDemoStep(2), 800);
    setTimeout(() => {
      // Simple keyword match simulation
      const found = MOCK_KNOWLEDGE.filter(k => 
        query.toLowerCase().split(' ').some(word => k.text.toLowerCase().includes(word))
      );
      setRetrievedChunks(found.length > 0 ? found : [MOCK_KNOWLEDGE[0], MOCK_KNOWLEDGE[2]]);
      setDemoStep(3);
    }, 1600);
    setTimeout(() => setDemoStep(4), 2400);
  };

  const resetDemo = () => {
    setDemoStep(0);
    setQuery("");
    setRetrievedChunks([]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 顶部标题 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-[9px] font-bold border border-blue-500/20 tracking-widest">ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            RAG 技术全景
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-sm italic">
          "检索增强生成 (RAG) 是让大模型访问实时、私有知识库的最优工程路径。"
        </p>
      </div>

      {/* RAG 流程大图 */}
      <div className="relative p-8 bg-slate-900/40 rounded-3xl border border-white/10 shadow-inner overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
          {RAG_STEPS.map((step, idx) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center group cursor-pointer transition-all duration-300
                ${activeStage === step.id ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
              onMouseEnter={() => setActiveStage(step.id)}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all
                ${activeStage === step.id ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)] text-black' : 'bg-slate-800 border border-white/5 ' + step.color}`}>
                {step.icon}
              </div>
              <h4 className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${activeStage === step.id ? 'text-white' : 'text-slate-500'}`}>
                {step.name}
              </h4>
              <div className="w-1 h-1 rounded-full bg-slate-700 mt-1" />
              
              {idx < RAG_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 translate-x-[60px] opacity-20">
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 悬停详情卡片 */}
        <div className="mt-8 h-20 flex items-center justify-center">
          {activeStage ? (
            <div className="text-center space-y-2 animate-in slide-in-from-top-2">
              <p className="text-sm text-slate-200 font-medium">
                {RAG_STEPS.find(s => s.id === activeStage)?.desc}
              </p>
              <div className="flex justify-center gap-4">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> 物理隔离
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> 实时生效
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic">将鼠标悬停在流程节点查看详情</p>
          )}
        </div>
      </div>

      {/* 交互演示 Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入与执行 */}
        <div className="p-8 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
              <Terminal className="w-4 h-4 text-blue-500" /> RAG 工作流实机演示
            </h3>
            {demoStep > 0 && (
              <button onClick={resetDemo} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> 重置
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="例如：RAG 如何解决幻觉？"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={demoStep > 0}
              />
              <button 
                onClick={runDemo}
                disabled={!query || demoStep > 0}
                className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 rounded-xl text-xs font-bold transition-all"
              >
                运行链路
              </button>
            </div>

            {/* 步骤指示器 */}
            <div className="space-y-3 pt-4">
              {[
                { id: 1, label: '问题改写 (Query Rewrite)', icon: <RefreshCw className="w-3 h-3" />, step: 1 },
                { id: 2, label: '向量空间搜索 (Vector Search)', icon: <Search className="w-3 h-3" />, step: 2 },
                { id: 3, label: '重排序 (Re-Rank)', icon: <Filter className="w-3 h-3" />, step: 3 },
                { id: 4, label: '生成最终答案 (Generation)', icon: <Brain className="w-3 h-3" />, step: 4 },
              ].map(s => (
                <div key={s.id} className={`flex items-center gap-4 transition-opacity duration-300 ${demoStep >= s.step ? 'opacity-100' : 'opacity-20'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${demoStep === s.step ? 'bg-blue-500 text-white animate-pulse' : (demoStep > s.step ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-600')}`}>
                    {demoStep > s.step ? <ShieldCheck className="w-3 h-3" /> : s.id}
                  </div>
                  <span className={`text-[11px] font-bold tracking-tight ${demoStep === s.step ? 'text-blue-400' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：实时反馈视窗 */}
        <div className="p-8 bg-slate-900/60 rounded-3xl border border-white/10 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">知识回溯反馈</span>
          </div>

          <div className="flex-1 space-y-4">
            {demoStep === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4">
                 <GitBranch className="w-12 h-12 opacity-10" />
                 <p className="text-xs italic">等待输入启动工作流流程线</p>
              </div>
            )}

            {demoStep >= 1 && (
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 animate-in fade-in slide-in-from-left-2">
                <div className="text-[9px] text-blue-500 font-bold uppercase mb-2">优化后的检索词 (Expanded Query)</div>
                <p className="text-xs text-blue-200 font-mono italic">"{query} 解决方案 幻觉问题 技术原理"</p>
              </div>
            )}

            {demoStep >= 2 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4">
                <div className="text-[9px] text-emerald-500 font-bold uppercase">检索到的知识片段 (Chunks)</div>
                {retrievedChunks.map((chunk, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex gap-3 items-start group">
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-300">{chunk.text}</p>
                      <span className="text-[9px] text-slate-600 font-mono">ID: REF_{chunk.id} | Score: 0.89</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {demoStep >= 4 && (
              <div className="p-5 bg-purple-500/10 rounded-2xl border border-purple-500/20 space-y-3 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                  <div className="text-[9px] text-purple-400 font-bold uppercase">大模型回复 (Grounded Response)</div>
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {retrievedChunks.some(c => c.text.includes('幻觉')) 
                    ? "根据知识库内容，RAG 通过将外部事实注入提示词（Prompt），显著减少了模型生成虚假信息的风险。检索结果显示，它是解决幻觉问题的核心工程路径。" 
                    : "正在基于您提供的关键词从检索到的 Chunks 中提取核心事实进行综合回答..."}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
             <AlertCircle className="w-4 h-4 text-amber-500/60" />
             <p className="text-[10px] text-slate-500">
                <b>防止幻觉:</b> 最终生成的答案每一个论点都可以溯源至上面的 Chunks。
             </p>
          </div>
        </div>
      </div>

      {/* 补充知识图谱概念 */}
      <div className="p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl border border-white/5">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-32 h-32">
               <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse" />
               <Network className="w-full h-full text-indigo-400 relative z-10" />
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h4 className="text-lg font-bold text-indigo-300">为什么 RAG 需要结合“知识图谱”？</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              传统的向量检索（Vector Search）是基于“关键词模糊匹配”。如果用户问“深信服的小李的前女友是谁？”，向量检索可能会因为找不到完整段落而失败。
              而 <b>GraphRAG</b> 可以通过实体关系（小李 -> 就职 -> 深信服，小李 -> 前女友 -> 小明）进行逻辑推理，精准定位碎片化知识。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGWorkflowSim;
