
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

const TIME_LIMITS: Record<string, number> = {
  [ExamSection.HOEREN]: 1200, // 20 mins
  [ExamSection.LESEN]: 1500, // 25 mins
  [ExamSection.SCHREIBEN]: 1200, // 20 mins
  [ExamSection.SPRECHEN]: 900,  // 15 mins
  [ExamSection.HOME]: 0,
  [ExamSection.SUMMARY]: 0,
  [ExamSection.RESULTS]: 0
};

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

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (exam.section !== ExamSection.HOME && exam.section !== ExamSection.RESULTS && exam.section !== ExamSection.SUMMARY) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (exam.mode === ExamMode.STRICT) {
            if (prev <= 1) {
              // Time's up! Force move to next section
              clearInterval(interval);
              nextSection();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [exam.section, exam.mode]); // Added exam.mode dependency

  const startExam = async (selectedMode: ExamMode) => {
    setIsPreparing(true);
    try {
      // Select a random topic for Part 2 to ensure consistent cards
      const availableTopics = Array.from(new Set(SPEAKING_WORD_CARDS.map(c => c.topic).filter(Boolean)));
      const selectedTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
      const selectedWords = SPEAKING_WORD_CARDS.filter(c => c.topic === selectedTopic);

      const selectedPictures = pickRandom(SPEAKING_PICTURE_CARDS, 6);
      const speakingPool = [...selectedWords, ...selectedPictures];

      const cardsWithImages = speakingPool.map(card => ({
        ...card,
        imageUrl: card.type === 'picture' ? `/cards/${card.id}.png` : undefined
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

      // Initialize Timer based on Mode
      const initialTime = selectedMode === ExamMode.STRICT ? TIME_LIMITS[ExamSection.HOEREN] : 0;
      setTimer(initialTime);

      setExam({
        ...exam,
        section: ExamSection.HOEREN,
        mode: selectedMode,
        startTime: Date.now(),
        answers: {}
      });
    } finally {
      setIsPreparing(false);
    }
  };

  const nextSection = () => {
    const order = [ExamSection.HOEREN, ExamSection.LESEN, ExamSection.SCHREIBEN, ExamSection.SPRECHEN, ExamSection.SUMMARY, ExamSection.RESULTS];
    const currentIndex = order.indexOf(exam.section);
    if (currentIndex < order.length - 1) {
      handleNavigate(order[currentIndex + 1]);
    }
  };

  const handleNavigate = (section: ExamSection) => {
    setExam(prev => ({ ...prev, section }));
    // Reset Timer on Navigation
    if (exam.mode === ExamMode.STRICT) {
      setTimer(TIME_LIMITS[section] || 0);
    } else {
      setTimer(0);
    }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              {/* Standard Mode Card */}
              <button onClick={() => startExam(ExamMode.FULL)} className="group relative bg-white hover:bg-blue-50 p-8 rounded-3xl shadow-xl transition-all border-2 border-transparent hover:border-blue-500 hover:-translate-y-2 text-left">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Standard Modus</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Üben Sie ohne Zeitdruck. Hinweise und Übersetzungen sind verfügbar.</p>
              </button>

              {/* Strict Mode Card */}
              <button onClick={() => startExam(ExamMode.STRICT)} className="group relative bg-slate-900 hover:bg-slate-800 p-8 rounded-3xl shadow-xl transition-all border-2 border-transparent hover:border-red-500 hover:-translate-y-2 text-left">
                <div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500 text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-stopwatch"></i>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Prüfungs Modus</h3>
                <p className="text-slate-400 font-medium leading-relaxed">Realistische Simulation. Strenge Zeitlimits. Keine Hilfen.</p>
                <div className="absolute top-6 right-6 px-3 py-1 bg-red-600 text-white text-xs font-black rounded-full uppercase tracking-widest">
                  Hardcore
                </div>
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
            {sessionContent.lesen.map((q, index) => (
              <div key={q.id} className="bg-transparent mb-12">
                {q.part === 1 ? (
                  <div className={`relative p-8 shadow-xl max-w-2xl mx-auto transform transition-transform hover:scale-[1.01] ${q.context.includes('Liebe') || q.context.includes('Hallo') ? 'bg-[#fefce8] -rotate-1 rounded-sm' : 'bg-white rounded-lg border border-slate-200'}`}>
                    {(q.context.includes('Liebe') || q.context.includes('Hallo')) && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/50 backdrop-blur-sm rotate-2 shadow-sm"></div>
                    )}

                    <div className={`${q.context.includes('Liebe') || q.context.includes('Hallo') ? "font-['Patrick_Hand'] text-2xl text-slate-800 leading-normal" : "font-['Merriweather'] text-lg text-slate-700 leading-relaxed"}`}>
                      {q.context.split('\n').map((line, i) => (
                        <p key={i} className="mb-4">{line}</p>
                      ))}
                    </div>
                  </div>
                ) : q.part === 2 ? (
                  <div className={`max-w-xl mx-auto p-6 ${index % 2 === 0 ? 'bg-stone-100 border-2 border-dashed border-slate-400 font-[\'Merriweather\']' : 'bg-white border-4 border-orange-500 font-sans'}`}>
                    <div className="flex justify-between items-start mb-4 border-b border-slate-300 pb-2">
                      <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Anzeige {index + 120}</span>
                      <span className="text-xs font-serif italic text-slate-400">Wochenblatt</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{q.prompt.includes('Wohnung') ? 'Immobilienmarkt' : q.prompt.includes('Arbeit') ? 'Stellenmarkt' : 'Kleinanzeigen'}</h3>
                    <div className="text-lg leading-snug text-slate-800 mb-4">
                      {q.context}
                    </div>
                    <div className="text-right text-sm font-bold text-slate-600 mt-2">
                      Tel: 0{(q.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 7) % 900 + 100} - {(q.id.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 90000, 0)) + 10000}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center my-8">
                    <div className={`relative px-8 py-10 min-w-[300px] text-center bg-white shadow-2xl ${q.context.toLowerCase().includes('verboten') || q.context.toLowerCase().includes('nicht') ? 'border-8 border-red-600 rounded-xl' : 'border-8 border-blue-600 rounded-xl'}`}>
                      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-400"></div>
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-400"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-400"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-400"></div>

                      <div className="mb-4">
                        {q.context.toLowerCase().includes('verboten') || q.context.toLowerCase().includes('nicht') ?
                          <i className="fa-solid fa-ban text-6xl text-red-600"></i> :
                          <i className="fa-solid fa-circle-info text-6xl text-blue-600"></i>
                        }
                      </div>
                      <div className="uppercase font-black text-slate-900 text-xl tracking-tight leading-tight">
                        {q.context}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-2xl mx-auto">
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-lg font-bold text-slate-800">{q.prompt}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {q.options?.map(opt => (
                      <button key={opt} onClick={() => handleAnswer(q.id, opt)} className={`flex-1 py-3 px-5 rounded-xl border-2 font-bold transition-all text-sm ${exam.answers[q.id] === opt ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'}`}>{opt}</button>
                    ))}
                  </div>

                  {exam.guidanceEnabled && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl animate-in slide-in-from-top-2">
                      <div className="flex items-start gap-3">
                        <i className="fa-solid fa-lightbulb text-yellow-500 mt-1"></i>
                        <div>
                          <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">LÖSUNGSHILFE</p>
                          <p className="text-slate-700 font-medium">
                            Die richtige Antwort ist: <span className="font-bold text-blue-600">{q.answer}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1 italic">
                            {q.part === 1 ? 'Achten Sie auf Sender und Empfänger.' : q.part === 2 ? 'Suchen Sie nach Schlüsselwörtern wie Datum, Zeit oder Ort.' : 'Achten Sie auf Verbote (rot) und Informationen (blau).'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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

            {/* Aufgabe 1: Formular (Official Bureaucracy Style) */}
            <div className="bg-[#fffbf0] rounded-sm shadow-xl border border-stone-300 max-w-3xl mx-auto overflow-hidden relative">
              {/* Paper Holes */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-100 shadow-inner border border-stone-200"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-100 shadow-inner border border-stone-200"></div>

              {/* Official Header */}
              <div className="bg-orange-100 border-b-2 border-orange-300 p-6 flex justify-between items-end">
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-2xl text-stone-800 uppercase tracking-widest">Formular</h3>
                  <p className="text-xs font-bold text-orange-800 mt-1 uppercase">Bitte in Blockschrift ausfüllen</p>
                </div>
                <div className="border-2 border-stone-800 px-3 py-1 font-mono text-xl font-bold rotate-[-2deg] opacity-70">
                  A1
                </div>
              </div>

              <div className="p-8 md:p-12">
                <p className="bg-white p-4 mb-8 border-l-4 border-blue-500 text-slate-700 italic text-sm shadow-sm font-medium">
                  <strong className="block text-blue-600 not-italic mb-1 uppercase text-xs tracking-wider">Situation:</strong>
                  {sessionContent.schreibenForm.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-['Merriweather']">
                  {sessionContent.schreibenForm.fields.map((field: string, idx: number) => (
                    <div key={field} className="relative group">
                      <div className="flex items-end gap-3">
                        <div className="bg-orange-200 text-orange-900 font-bold text-sm px-2 py-0.5 rounded-sm shadow-sm h-fit self-center">
                          {11 + idx}
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">{field}</label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full bg-white/50 border-b-2 border-stone-400 focus:border-blue-600 focus:bg-white outline-none px-2 py-1 text-2xl text-blue-900 font-['Patrick_Hand'] transition-colors h-10"
                              placeholder="..."
                              onChange={(e) => handleAnswer(`form_${field}`, e.target.value)}
                            />
                            {/* Handwriting guide lines (visual flourish) */}
                            <div className="absolute bottom-1 left-0 right-0 h-px bg-blue-100 pointer-events-none opacity-0 group-focus-within:opacity-50"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {exam.guidanceEnabled && (
                  <div className="mt-8 pt-6 border-t border-stone-200">
                    <div className="bg-yellow-50/80 p-4 border-l-4 border-yellow-400 rounded-r-lg">
                      <h4 className="text-xs font-black text-yellow-700 uppercase tracking-widest mb-3 flex items-center gap-2"><i className="fa-solid fa-key"></i> Lösungsschlüssel</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {sessionContent.schreibenForm.solutions.map((sol: string, i: number) => (
                          <div key={i} className="text-sm">
                            <span className="font-bold text-stone-500 mr-2">{11 + i}:</span>
                            <span className="font-['Patrick_Hand'] text-blue-600 text-lg">{sol}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-stone-100 p-2 text-center text-[10px] text-stone-400 font-mono border-t border-stone-200 uppercase">
                Seite 1 von 1 • Goethe-Zertifikat A1 Modellsatz
              </div>
            </div>

            {/* Aufgabe 2: E-Mail */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mt-12">
              <h3 className="font-bold text-lg mb-4 text-blue-600 uppercase tracking-wider flex items-center gap-2"><i className="fa-solid fa-envelope"></i>Aufgabe 2: E-Mail</h3>
              <p className="text-xl font-bold text-slate-800 leading-snug mb-8">{sessionContent.schreibenLetter.prompt}</p>

              {exam.guidanceEnabled && (
                <div className="mb-6 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Redemittel (Writing Template)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
                    <div>
                      <strong className="block text-blue-800 mb-1">Anrede</strong>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Liebe Martina...</li>
                        <li>Lieber Hans...</li>
                        <li>Sehr geehrte Damen und Herren...</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="block text-blue-800 mb-1">Inhalt</strong>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ich möchte...</li>
                        <li>Können wir...</li>
                        <li>Ich komme am...</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="block text-blue-800 mb-1">Schluss</strong>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Viele Grüße</li>
                        <li>Bis bald</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <textarea rows={12} className="w-full px-8 py-6 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none resize-none text-xl leading-relaxed mb-6 font-['Patrick_Hand'] text-slate-700" onChange={(e) => handleAnswer('email_text', e.target.value)} placeholder="Schreiben Sie hier Ihre E-Mail..." value={exam.answers['email_text'] || ''} />
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
