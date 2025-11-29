import React, { useState, useEffect, useRef } from 'react';
import { GameState, Message } from './types';
import { handleTurn } from './services/gameLogic';
import { TerminalMessage } from './components/TerminalMessage';
import { StatusSidebar } from './components/StatusSidebar';
import { LoadingIndicator } from './components/LoadingIndicator';
import { BookOpen, Send } from 'lucide-react';

const INITIAL_MESSAGE: Message = {
  id: 'intro',
  role: 'system',
  text: "Welcome to the Mythic Text Adventure.\nAlong your adventure, you'll meet quirky characters. If you want to talk to someone, address them clearly. Otherwise, describe what you do to move the scene forward.",
  timestamp: Date.now()
};

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    currentEntity: null,
    history: [INITIAL_MESSAGE],
    isLoading: false,
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [gameState.history, gameState.isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || gameState.isLoading) return;

    const userText = input.trim();
    setInput('');

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      history: [...prev.history, userMsg],
      isLoading: true
    }));

    try {
      // Process logic via Gemini (simulating the Python backend)
      const response = await handleTurn(userText, gameState.currentEntity, gameState.history);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.text,
        entity: response.newEntity || undefined,
        timestamp: Date.now()
      };

      setGameState(prev => ({
        ...prev,
        currentEntity: response.newEntity,
        history: [...prev.history, aiMsg],
        isLoading: false
      }));

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: "The mystic forces are clouded (API Error). Please try again.",
        timestamp: Date.now()
      };
      setGameState(prev => ({
        ...prev,
        history: [...prev.history, errorMsg],
        isLoading: false
      }));
    }
  };

  return (
    <div className="flex h-screen w-full bg-terminal-bg text-terminal-text font-mono overflow-hidden selection:bg-terminal-green selection:text-terminal-bg">
      
      {/* Sidebar - Desktop only */}
      <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-[#0d1117] relative z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-terminal-green" />
            <span>MYTHIC</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">AI Text Adventure v1.0</p>
        </div>
        <StatusSidebar currentEntity={gameState.currentEntity} />
      </div>

      {/* Main Terminal Area */}
      <div className="flex-1 flex flex-col relative max-w-5xl mx-auto w-full">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-terminal-bg/95 backdrop-blur sticky top-0 z-20">
             <h1 className="text-lg font-bold text-white">MYTHIC</h1>
             <span className={`text-xs px-2 py-1 rounded border ${gameState.currentEntity ? 'border-terminal-purple text-terminal-purple' : 'border-slate-700 text-slate-500'}`}>
                {gameState.currentEntity ? gameState.currentEntity.toUpperCase() : 'EXPLORING'}
             </span>
        </div>

        {/* Chat Output */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {gameState.history.map((msg) => (
            <TerminalMessage key={msg.id} message={msg} />
          ))}
          
          {gameState.isLoading && <LoadingIndicator />}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-slate-800 bg-terminal-bg/95 backdrop-blur w-full">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 relative max-w-4xl mx-auto"
          >
            <div className="text-terminal-green animate-pulse hidden md:block">{'>'}</div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={gameState.currentEntity ? `Speak to ${gameState.currentEntity}...` : "What do you do next?"}
              className="flex-1 bg-transparent border-b-2 border-slate-700 focus:border-terminal-green outline-none py-3 px-2 text-lg text-white placeholder-slate-600 transition-colors"
              autoComplete="off"
            />
            <button 
              type="submit"
              disabled={!input.trim() || gameState.isLoading}
              className="md:hidden p-2 bg-slate-800 rounded-full text-terminal-green disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-slate-600 hidden md:block">
            Press Enter to submit • Type 'quit' to reset
          </div>
        </div>
      </div>
    </div>
  );
}