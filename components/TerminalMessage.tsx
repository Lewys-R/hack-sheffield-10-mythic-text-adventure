import React from 'react';
import { Message } from '../types';
import { Bot, User, Skull, Wand2, Sword, FlaskConical, Cat, Hammer, CookingPot } from 'lucide-react';

interface TerminalMessageProps {
  message: Message;
}

const EntityIcon: React.FC<{ entity?: string }> = ({ entity }) => {
  if (!entity) return <Bot size={18} />;
  
  switch(entity) {
    case 'goblin': return <Skull size={18} className="text-terminal-green" />;
    case 'wizard': return <Wand2 size={18} className="text-terminal-purple" />;
    case 'mercenary': return <Sword size={18} className="text-slate-400" />;
    case 'mage': return <FlaskConical size={18} className="text-terminal-blue" />;
    case 'witch': return <Cat size={18} className="text-terminal-red" />;
    case 'troll': return <Hammer size={18} className="text-terminal-yellow" />;
    case 'meatball': return <CookingPot size={18} className="text-terminal-red" />
    default: return <Bot size={18} />;
  }
};

const getRoleColor = (message: Message) => {
  if (message.role === 'user') return 'text-slate-400 border-slate-700';
  if (message.role === 'system') return 'text-terminal-yellow border-terminal-yellow/30 bg-terminal-yellow/5';
  
  // Assistant colors based on entity
  switch(message.entity) {
      case "mercenary":
          break;
      case 'goblin': return 'text-terminal-green border-terminal-green/30 bg-terminal-green/5';
    case 'wizard': return 'text-terminal-purple border-terminal-purple/30 bg-terminal-purple/5';
    case 'witch': return 'text-terminal-red border-terminal-red/30 bg-terminal-red/5';
    case 'mage': return 'text-terminal-blue border-terminal-blue/30 bg-terminal-blue/5';
    case 'troll': return 'text-terminal-yellow border-terminal-yellow/30 bg-terminal-yellow/5';
    case 'meatball': return 'text-terminal-yellow border-terminal-yellow/30 bg-terminal-yellow/5';
    default: return 'text-terminal-text border-slate-700';
  }
};

export const TerminalMessage: React.FC<TerminalMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const borderColor = getRoleColor(message);

  return (
    <div className={`flex flex-col gap-1 w-full animate-fade-in ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 ${isUser ? 'flex-row-reverse text-slate-500' : 'text-slate-400'}`}>
        {isUser ? <User size={14} /> : <EntityIcon entity={message.entity} />}
        <span>{isUser ? 'You' : (message.entity || 'Narrator')}</span>
      </div>
      
      <div className={`
        relative p-4 rounded-sm border max-w-[90%] md:max-w-[80%] leading-relaxed whitespace-pre-wrap font-mono shadow-sm
        ${borderColor}
        ${isUser ? 'bg-slate-800/50' : ''}
      `}>
        {message.text}
      </div>
    </div>
  );
};