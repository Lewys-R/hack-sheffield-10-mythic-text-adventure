import React from 'react';
import { EntityKey } from '../types';
import { Map, MessageCircle, Info } from 'lucide-react';

interface StatusSidebarProps {
  currentEntity: EntityKey;
}

export const StatusSidebar: React.FC<StatusSidebarProps> = ({ currentEntity }) => {
  
  const entities = [
    { id: 'goblin', name: 'Emily', desc: 'Cheeky Goblin' },
    { id: 'wizard', name: 'The Wizard', desc: 'Insane Caster' },
    { id: 'mercenary', name: 'Gwalchmai', desc: 'Retired Fighter' },
    { id: 'mage', name: 'Ffion', desc: 'Mage of potions' },
    { id: 'witch', name: 'Seren', desc: 'Deceptive Witch' },
    { id: 'troll', name: 'Gruffudd', desc: 'Territorial Troll' },
    { id: 'meatball', name: 'Meatball man', desc: 'Meatball man' },
  ];

  return (
    <div className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto">
      
      {/* Current State */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Map size={14} /> Current Status
        </h3>
        <div className={`p-3 rounded border ${currentEntity ? 'border-terminal-purple bg-terminal-purple/10 text-terminal-purple' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}>
           {currentEntity ? (
             <div className="flex flex-col">
               <span className="text-xs opacity-70">Talking to...</span>
               <span className="font-bold text-lg capitalize">{currentEntity}</span>
             </div>
           ) : (
             <div className="flex flex-col">
               <span className="text-xs opacity-70">Mode</span>
               <span className="font-bold text-lg">Exploring Scene</span>
             </div>
           )}
        </div>
      </div>

      {/* Known Entities */}
      <div>
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MessageCircle size={14} /> Known Entities
        </h3>
        <div className="space-y-2">
          {entities.map(ent => (
            <div 
              key={ent.id} 
              className={`p-2 rounded text-sm border transition-all duration-300
                ${currentEntity === ent.id 
                  ? 'border-terminal-green bg-terminal-green/10 text-terminal-green pl-3' 
                  : 'border-transparent text-slate-500 opacity-60'
                }`}
            >
              <div className="font-bold">{ent.name}</div>
              <div className="text-xs opacity-70">{ent.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Info size={14} /> Instructions
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Type clearly to talk to characters. Describe actions to move. 
          <br/><br/>
          <span className="text-slate-500">Commands:</span><br/>
          <span className="text-terminal-red">leave, bye</span> - End conversation
        </p>
      </div>
    </div>
  );
};