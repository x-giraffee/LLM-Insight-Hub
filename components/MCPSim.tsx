
import React from 'react';
import { Server, Share2, Database, Tool, ArrowRightLeft } from 'lucide-react';

const MCPSim: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Model Context Protocol (MCP)
        </h3>
        <p className="text-slate-400">
          一个开放标准，解决了 AI 模型无法直接安全访问用户本地文件、数据库和专有工具的问题。
        </p>
      </div>

      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 py-10">
        <div className="flex flex-col items-center gap-4 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl w-full lg:w-48 text-center">
          <Server className="w-10 h-10 text-blue-400" />
          <span className="font-bold">AI Model (Client)</span>
          <span className="text-[10px] text-slate-500">Claude / Gemini / GPT</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ArrowRightLeft className="w-8 h-8 text-slate-600 hidden lg:block" />
          <div className="px-4 py-2 bg-slate-800 rounded-full text-[10px] font-mono font-bold text-slate-400 border border-white/10 uppercase">
            Standardized API
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl w-full lg:w-48 text-center">
          <Share2 className="w-10 h-10 text-indigo-400" />
          <span className="font-bold">MCP Server</span>
          <span className="text-[10px] text-slate-500">Logic Bridge</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ArrowRightLeft className="w-8 h-8 text-slate-600 hidden lg:block" />
          <div className="px-4 py-2 bg-slate-800 rounded-full text-[10px] font-mono font-bold text-slate-400 border border-white/10 uppercase">
            Local Access
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center gap-2">
            <Database className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold">SQL DB</span>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center gap-2">
            <Database className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold">Local Files</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
          <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-xs">传统方式的局限</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            以前开发者必须为每个模型编写特定的 Tool Calling 逻辑。一旦更换模型（比如从 Claude 换到 GPT），所有工具集成代码都要重写。
          </p>
        </div>
        <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 space-y-4">
          <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-xs">MCP 的优势</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            通过 MCP，只需编写一次工具代码（MCP Server），任何支持该协议的 AI 客户端都能即插即用。它像 USB 协议一样统一了 AI 与外部数据的接口。
          </p>
        </div>
      </div>
    </div>
  );
};

export default MCPSim;
