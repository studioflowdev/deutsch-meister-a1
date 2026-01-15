import React from 'react';
import { Question, ExamMode } from '../types';
import AudioPlayer from './AudioPlayer';

interface ListeningPartProps {
  questions: Question[];
  onAnswer: (id: string, val: any) => void;
  answers: Record<string, any>;
  guidanceEnabled: boolean;
  mode: ExamMode;
}

const ListeningPart: React.FC<ListeningPartProps> = ({ questions, onAnswer, answers, guidanceEnabled, mode }) => {
  const parts = [1, 2, 3];

  return (
    <div className="space-y-12">
      {parts.map(partNum => (
        <section key={partNum} className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-2">
            <span className="text-blue-600 font-black text-xl">Teil {partNum}</span>
            <p className="text-slate-500 font-medium">
              {partNum === 1 ? 'Kurze Gespräche' : partNum === 2 ? 'Durchsagen' : 'Informationen'}
            </p>
            {guidanceEnabled && (
              <span className="text-xs text-slate-400 italic">
                ({partNum === 1 ? 'Short Conversations' : partNum === 2 ? 'Announcements' : 'Information'})
              </span>
            )}
            <div className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-auto">
              {partNum === 2 ? '1x Hören' : '2x Hören'}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {/* Note: In a real app we might want to sort these within the part */}
            {questions.filter(q => q.part === partNum).map(q => (
              <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">

                {/* Audio Player */}
                <div className="mb-6 flex justify-center">
                  <AudioPlayer
                    src={`/audio/${q.id}.wav`}
                    mode={mode === ExamMode.STRICT ? 'strict' : 'full'}
                    part={q.part}
                  />
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1 w-full">
                    <h3 className="text-lg font-bold text-slate-800 leading-snug">{q.prompt}</h3>
                    {guidanceEnabled && q.translation && (
                      <p className="text-slate-400 text-sm italic">Translation: {q.translation}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {q.options?.map(opt => (
                    <button
                      key={opt}
                      onClick={() => onAnswer(q.id, opt)}
                      className={`px-4 py-3 rounded-xl border text-center font-semibold transition-all ${answers[q.id] === opt ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {guidanceEnabled && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start space-x-3 text-emerald-700 text-sm">
                    <i className="fa-solid fa-lightbulb mt-1"></i>
                    <span><strong>Hint:</strong> {q.hint}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ListeningPart;
