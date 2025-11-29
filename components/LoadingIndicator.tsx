import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-1 w-full animate-fade-in">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">
        <span>Processing</span>
      </div>
      <div className="p-4 rounded-sm border border-slate-800 bg-slate-900/50 text-slate-500 font-mono flex items-center gap-2">
        <span className="w-2 h-4 bg-terminal-green animate-cursor-blink block"></span>
        <span className="animate-pulse">Thinking...</span>
      </div>
    </div>
  );
};