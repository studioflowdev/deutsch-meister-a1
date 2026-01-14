
import React, { useState } from 'react';
import { Question } from '../types';

interface ListeningPartProps {
  questions: Question[];
  onAnswer: (id: string, val: any) => void;
  answers: Record<string, any>;
  guidanceEnabled: boolean;
}

const ListeningPart: React.FC<ListeningPartProps> = ({ questions, onAnswer, answers, guidanceEnabled }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const playAudio = (q: Question) => {
    if (playingId === q.id && audioObj) {
      audioObj.pause();
      setPlayingId(null);
      setAudioObj(null);
      return;
    }

    if (audioObj) {
      audioObj.pause();
    }

    setLoadingId(q.id);
    setErrorId(null);

    const audio = new Audio(`/audio/${q.id}.wav`);

    audio.oncanplaythrough = () => {
      setLoadingId(null);
      audio.play().catch(e => {
        console.error("Playback error:", e);
        setErrorId(q.id);
      });
      setPlayingId(q.id);
      setAudioObj(audio);
    };

    audio.onerror = () => {
      console.error("Audio load error");
      setLoadingId(null);
      setErrorId(q.id);
    };

    audio.onended = () => {
      setPlayingId(null);
      setAudioObj(null);
    };

    // Fallback if canplaythrough doesn't fire quickly (sometimes happens with small local files)
    setTimeout(() => {
      if (audio.readyState >= 3) { // HAVE_FUTURE_DATA
        setLoadingId(null);
        audio.play().catch(() => { });
        setPlayingId(q.id);
        setAudioObj(audio);
      }
    }, 500);
  };

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
          </div>
          <div className="grid grid-cols-1 gap-6">
            {questions.filter(q => q.part === partNum).map(q => (
              <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-800">{q.prompt}</h3>
                    {guidanceEnabled && q.translation && (
                      <p className="text-slate-400 text-sm italic">Translation: {q.translation}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => playAudio(q)}
                      disabled={loadingId !== null && loadingId !== q.id}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${playingId === q.id ? 'bg-red-100 text-red-600' :
                        errorId === q.id ? 'bg-orange-100 text-orange-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105'
                        } disabled:opacity-50`}
                    >
                      {loadingId === q.id ? <i className="fa-solid fa-spinner fa-spin"></i> : playingId === q.id ? <i className="fa-solid fa-square"></i> : errorId === q.id ? <i className="fa-solid fa-triangle-exclamation"></i> : <i className="fa-solid fa-play ml-1"></i>}
                    </button>
                    {errorId === q.id && <span className="text-[10px] text-orange-600 font-bold mt-1">Fehler</span>}
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
