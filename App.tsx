
import React, { useState, useEffect } from 'react';
import { ExamSection, ExamMode, ExamState, Question, CardData } from './types';
import ExamHeader from './components/ExamHeader';
import SpeakingSession from './components/SpeakingSession';
import ListeningPart from './components/ListeningPart';
import ExamResults from './components/ExamResults';
import {
  HOEREN_POOL,
  LESEN_POOL,
  SCHREIBEN_FORM_POOL,
  SCHREIBEN_LETTER_POOL,
  SPEAKING_WORD_CARDS,
  SPEAKING_PICTURE_CARDS
} from './constants';
import { gemini } from './services/gemini';
import { pickRandom, shuffleArray } from './utils/exam';

interface SessionContent {
  hoeren: Question[];
  lesen: Question[];
  schreibenForm: any;
  schreibenLetter: any;
  speakingCards: CardData[];
}

const App: React.FC = () => {
  const [exam, setExam] = useState<ExamState>({
    section: ExamSection.HOME,
    mode: ExamMode.FULL,
    guidanceEnabled: false,
    answers: {},
    startTime: null,
    endTime: null,
  });

  const [sessionContent, setSessionContent] = useState<SessionContent | null>(null);
  const [timer, setTimer] = useState(0);
  const [gradingResult, setGradingResult] = useState<{ score: number, feedback: string } | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (exam.section !== ExamSection.HOME && exam.section !== ExamSection.RESULTS && exam.section !== ExamSection.SUMMARY) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [exam.section]);

  const startExam = async () => {
    setIsPreparing(true);
    try {
      const selectedWords = pickRandom(SPEAKING_WORD_CARDS, 6);
      const selectedPictures = pickRandom(SPEAKING_PICTURE_CARDS, 6);
      const speakingPool = [...selectedWords, ...selectedPictures];

      const cardsWithImages = speakingPool.map(card => ({
        ...card,
        imageUrl: `/cards/${card.id}.png`
      }));

      const generated: SessionContent = {
        hoeren: [
          ...pickRandom(HOEREN_POOL.filter(q => q.part === 1), 6),
          ...pickRandom(HOEREN_POOL.filter(q => q.part === 2), 4),
          ...pickRandom(HOEREN_POOL.filter(q => q.part === 3), 5),
        ],
        lesen: [
          ...pickRandom(LESEN_POOL.filter(q => q.part === 1), 3),
          ...pickRandom(LESEN_POOL.filter(q => q.part === 2), 4),
          ...pickRandom(LESEN_POOL.filter(q => q.part === 3), 4),
        ],
        schreibenForm: pickRandom(SCHREIBEN_FORM_POOL, 1)[0],
        schreibenLetter: pickRandom(SCHREIBEN_LETTER_POOL, 1)[0],
        speakingCards: cardsWithImages
      };

      setSessionContent(generated);
      setExam({ ...exam, section: ExamSection.HOEREN, startTime: Date.now(), answers: {} });
      setTimer(0);
    } finally {
      setIsPreparing(false);
    }
  };

  const nextSection = () => {
    const order = [ExamSection.HOEREN, ExamSection.LESEN, ExamSection.SCHREIBEN, ExamSection.SPRECHEN, ExamSection.SUMMARY, ExamSection.RESULTS];
    const currentIndex = order.indexOf(exam.section);
    if (currentIndex < order.length - 1) handleNavigate(order[currentIndex + 1]);
  };

  const handleNavigate = (section: ExamSection) => {
    setExam(prev => ({ ...prev, section }));
    window.scrollTo(0, 0);
  };

  const handleAnswer = (id: string, val: any) => {
    setExam({ ...exam, answers: { ...exam.answers, [id]: val } });
  };

  const handleGradeWriting = async () => {
    const text = exam.answers['email_text'];
    if (!text || text.length < 5) {
      setGradingError("Bitte schreiben Sie zuerst Ihre E-Mail (mind. 5 Zeichen).");
      return;
    }
    setIsGrading(true);
    setGradingError(null);
    try {
      const result = await gemini.gradeWriting(sessionContent?.schreibenLetter.prompt || "", text);
      setGradingResult(result);
      const analysis = await gemini.getWritingAnalysis(sessionContent?.schreibenLetter.prompt || "", text, sessionContent?.schreibenLetter.exampleEmail || "");
      setDetailedAnalysis(analysis);
    } catch (err: any) {
      setGradingError(err.message);
    } finally {
      setIsGrading(false);
    }
  };

  const calculateScore = (pool: Question[]) => pool.reduce((acc, q) => acc + (exam.answers[q.id] === q.correctAnswer ? 1 : 0), 0);

  if (exam.section === ExamSection.HOME) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        {isPreparing ? (
          <div className="flex flex-col items-center space-y-6 animate-pulse">
            <div className="w-24 h-24 border-8 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Materialien werden vorbereitet</h2>
              <p className="text-slate-500 font-medium">Prüfung wird geladen...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-12 relative animate-bounce duration-1000">
              <div className="german-flag-gradient w-40 h-24 rounded-2xl shadow-2xl relative z-10 border-4 border-white"></div>
              <div className="absolute -bottom-3 -right-3 w-40 h-24 bg-slate-200 rounded-2xl"></div>
            </div>
            <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Deutsch-Meister A1</h1>
            <p className="text-slate-500 max-w-xl mb-12 text-xl font-medium leading-relaxed">Die umfassende Goethe-Zertifikat A1 Simulation.<br />Authentische visuelle Materialien, die für jede Sitzung neu generiert werden.</p>
            <div className="w-full max-w-sm">
              <button onClick={startExam} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-black rounded-3xl shadow-2xl shadow-blue-200 transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center space-x-4">
                <i className="fa-solid fa-play"></i>
                <span>Prüfung starten</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!sessionContent) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <ExamHeader currentSection={exam.section} guidanceEnabled={exam.guidanceEnabled} onToggleGuidance={() => setExam(e => ({ ...e, guidanceEnabled: !e.guidanceEnabled }))} onExit={() => setExam({ ...exam, section: ExamSection.HOME })} onNavigate={handleNavigate} timer={timer} />
      <main className="max-w-5xl mx-auto px-4 py-12 pb-32">
        {exam.section === ExamSection.HOEREN && <ListeningPart questions={sessionContent.hoeren} answers={exam.answers} onAnswer={handleAnswer} guidanceEnabled={exam.guidanceEnabled} />}
        {exam.section === ExamSection.LESEN && (
          <div className="space-y-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900">Teil 2: Lesen</h2>
              <p className="text-slate-500 font-medium italic">
                {exam.guidanceEnabled ? 'Part 2: Reading - Read the texts and answer the questions.' : 'Lesen Sie die Texte und beantworten Sie die Fragen.'}
              </p>
            </div>
            {sessionContent.lesen.map(q => (
              <div key={q.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                <div className="bg-slate-50 p-8 border-b border-slate-100 italic text-lg leading-relaxed text-slate-700">{q.context}</div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <p className="text-xl font-bold text-slate-800">{q.prompt}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {q.options?.map(opt => (
                      <button key={opt} onClick={() => handleAnswer(q.id, opt)} className={`flex-1 py-4 px-6 rounded-2xl border-2 font-bold transition-all ${exam.answers[q.id] === opt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {exam.section === ExamSection.SCHREIBEN && (
          <div className="space-y-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900">Teil 3: Schreiben</h2>
              <p className="text-slate-500 font-medium italic">
                {exam.guidanceEnabled ? 'Part 3: Writing - Fill out the form and write a short message.' : 'Füllen Sie das Formular aus und schreiben Sie eine kurze Nachricht.'}
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-blue-600 uppercase tracking-wider flex items-center gap-2"><i className="fa-solid fa-list-check"></i>Aufgabe 1: Formular</h3>
              <p className="bg-blue-50 p-6 rounded-2xl text-blue-900 mb-8 leading-relaxed font-medium border border-blue-100">{sessionContent.schreibenForm.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sessionContent.schreibenForm.fields.map((field: string) => (
                  <div key={field}>
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">{field}</label>
                    <input type="text" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium" placeholder={`${field}...`} onChange={(e) => handleAnswer(`form_${field}`, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-blue-600 uppercase tracking-wider flex items-center gap-2"><i className="fa-solid fa-envelope"></i>Aufgabe 2: E-Mail</h3>
              <p className="text-xl font-bold text-slate-800 leading-snug mb-8">{sessionContent.schreibenLetter.prompt}</p>
              <textarea rows={12} className="w-full px-8 py-6 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none resize-none text-xl leading-relaxed mb-6" onChange={(e) => handleAnswer('email_text', e.target.value)} placeholder="Schreiben Sie hier Ihre E-Mail..." value={exam.answers['email_text'] || ''} />
              <button onClick={handleGradeWriting} disabled={isGrading} className="w-full md:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50">{isGrading ? 'Prüfer bewertet...' : 'Abgeben & Bewerten'}</button>
              {gradingResult && (
                <div className="mt-8 p-8 bg-blue-50 border border-blue-200 rounded-3xl shadow-sm">
                  <div className="flex items-center justify-between mb-4"><h4 className="text-blue-900 font-black uppercase tracking-tighter">Ergebnis</h4><div className="bg-blue-600 text-white px-4 py-1 rounded-full font-black text-xl">{gradingResult.score} / 10</div></div>
                  <p className="text-blue-800 italic leading-relaxed whitespace-pre-line font-medium">{gradingResult.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {exam.section === ExamSection.SPRECHEN && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Teil 4: Sprechen</h2>
                <p className="text-slate-500 font-medium italic">
                  {exam.guidanceEnabled ? 'Part 4: Speaking - Interact with the virtual examiner.' : 'Interagieren Sie mit dem virtuellen Prüfer.'}
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full font-black text-xs animate-pulse border border-emerald-100">LIVE KI SITZUNG</div>
            </div>
            <SpeakingSession cards={sessionContent.speakingCards} mode={exam.mode} onComplete={nextSection} guidanceEnabled={exam.guidanceEnabled} />
          </div>
        )}
        {exam.section === ExamSection.RESULTS && sessionContent && (
          <ExamResults
            listeningScore={calculateScore(sessionContent.hoeren)}
            maxListening={sessionContent.hoeren.length}
            readingScore={calculateScore(sessionContent.lesen)}
            maxReading={sessionContent.lesen.length}
            writingScore={gradingResult?.score ?? null}
            writingFeedback={gradingResult?.feedback ?? null}
            onHome={() => setExam({ ...exam, section: ExamSection.HOME, answers: {} })}
          />
        )}
        {exam.section !== ExamSection.RESULTS && exam.section !== ExamSection.SUMMARY && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50">
            <button onClick={nextSection} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-[2rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)]">Nächster Teil</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
