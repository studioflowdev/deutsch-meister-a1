
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { CardData, ExamMode } from '../types';
import { GoogleGenAI, Modality } from '@google/genai';
import { decodeBase64, decodeAudioData, encodeBase64 } from '../utils/audio';
import { shuffleArray } from '../utils/exam';

interface SpeakingSessionProps {
  cards: CardData[];
  mode: ExamMode;
  onComplete: () => void;
  guidanceEnabled?: boolean;
}

interface TranscriptEntry {
  role: 'user' | 'ai';
  text: string;
  pronunciationTip?: string;
  audioBuffer?: AudioBuffer;
}

interface PartDef {
  id: number;
  instruction: string;
  guidance: string;
  card?: {
    title: string;
    points: string[];
  };
  topic?: string;
}

const SpeakingSession: React.FC<SpeakingSessionProps> = ({ cards, mode, onComplete, guidanceEnabled }) => {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  // Reset flipped state when step changes
  useEffect(() => {
    setFlippedCardId(null);
  }, [stepIndex]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentAiText, setCurrentAiText] = useState("");
  const [userInputText, setUserInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);

  const activeSessionRef = useRef<any>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const currentTurnChunksRef = useRef<AudioBuffer[]>([]);
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Determine a specific topic for Part 2 based on available word cards
  const activeTopic = useMemo(() => {
    const wordCards = cards.filter(c => c.type === 'word');
    if (wordCards.length === 0) return 'Allgemein';
    const topics = Array.from(new Set(wordCards.map(c => c.topic).filter(Boolean)));
    return topics[Math.floor(Math.random() * topics.length)] || 'Allgemein';
  }, [cards]);

  const shuffledParts = useMemo(() => {
    // Standard Part 1 Card Content
    const part1Card = {
      title: "Sich vorstellen",
      points: ["Name", "Alter", "Land", "Wohnort", "Sprachen", "Beruf", "Hobby"]
    };

    return [
      {
        id: 1,
        instruction: "Teil 1: Sich vorstellen. \nBitte stellen Sie sich vor. Sagen Sie etwas zu jedem Punkt.",
        guidance: "Introduce yourself. Say something about each point: Name, Age, Country, Residence, Languages, Job, Hobby.",
        card: part1Card
      },
      {
        id: 2,
        instruction: `Teil 2: Um Informationen bitten und Informationen geben.\nThema: "${activeTopic}".\nZiehen Sie eine Karte und fragen Sie.`,
        guidance: `Part 2: Requesting information. Ask a question about the topic "${activeTopic}" using the word on the card.`,
        topic: activeTopic
      },
      {
        id: 3,
        instruction: `Teil 3: Bitten formulieren und darauf reagieren.\nZiehen Sie eine Bildkarte und formulieren Sie eine Bitte.`,
        guidance: `Part 3: Formulating requests. Look at the image and ask someone to do something (a request).`,
      }
    ];
  }, [cards, activeTopic]);

  const currentPart = shuffledParts[stepIndex];

  useEffect(() => {
    return () => {
      if (activeSessionRef.current) activeSessionRef.current.close();
      sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) { } });
      if (playbackSourceRef.current) { try { playbackSourceRef.current.stop(); } catch (e) { } }
    };
  }, []);

  const concatenateAudioBuffers = (buffers: AudioBuffer[], context: AudioContext): AudioBuffer | undefined => {
    if (buffers.length === 0) return undefined;
    const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
    const result = context.createBuffer(buffers[0].numberOfChannels, totalLength, buffers[0].sampleRate);
    for (let channel = 0; channel < buffers[0].numberOfChannels; channel++) {
      let offset = 0;
      for (const buf of buffers) {
        result.getChannelData(channel).set(buf.getChannelData(channel), offset);
        offset += buf.length;
      }
    }
    return result;
  };

  const startSession = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputAudioContext;
      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const systemInstruction = `Du bist ein offizieller Prüfer für das Goethe-Zertifikat A1 UND ein Aussprache-Coach.
      Führe den Schüler durch die Prüfung:
      ${shuffledParts.map((p, i) => `${i + 1}. ${p.instruction}`).join('\n')}
      Achte auf die Aussprache und gib am Ende deiner Antwort einen kurzen Tipp IN ENGLISCHER SPRACHE in Klammern, falls die Aussprache nicht perfekt war.`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsLoading(false);
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(session => {
                activeSessionRef.current = session;
                session.sendRealtimeInput({ media: { data: encodeBase64(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: any) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
              currentTurnChunksRef.current.push(buffer);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNode);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.outputTranscription) setCurrentAiText(prev => prev + message.serverContent.outputTranscription.text);
            if (message.serverContent?.inputTranscription) setUserInputText(prev => prev + message.serverContent.inputTranscription.text);
            if (message.serverContent?.turnComplete) {
              const tipMatch = currentAiText.match(/\(([^)]+)\)/);
              const tip = tipMatch ? tipMatch[1] : undefined;
              const cleanText = currentAiText.replace(/\([^)]+\)/, "").trim();
              const fullTurnBuffer = concatenateAudioBuffers(currentTurnChunksRef.current, outputAudioContextRef.current!);
              currentTurnChunksRef.current = [];
              setTranscript(prev => [...prev, { role: 'user', text: userInputText || "..." }, { role: 'ai', text: cleanText, pronunciationTip: tip, audioBuffer: fullTurnBuffer }]);
              setCurrentAiText(""); setUserInputText("");
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => { console.error(e); setIsActive(false); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction,
        }
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const togglePlayback = (index: number) => {
    const entry = transcript[index];
    if (!entry.audioBuffer || !outputAudioContextRef.current) return;
    if (currentlyPlayingIndex === index) {
      if (playbackSourceRef.current) { playbackSourceRef.current.stop(); playbackSourceRef.current = null; }
      setCurrentlyPlayingIndex(null);
    } else {
      if (playbackSourceRef.current) playbackSourceRef.current.stop();
      const ctx = outputAudioContextRef.current;
      const source = ctx.createBufferSource();
      source.buffer = entry.audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => { if (currentlyPlayingIndex === index) setCurrentlyPlayingIndex(null); };
      source.start(0);
      playbackSourceRef.current = source;
      setCurrentlyPlayingIndex(index);
    }
  };

  const relevantCards = useMemo(() => {
    if (currentPart.id === 1) return [];
    if (currentPart.id === 2) return cards.filter(c => c.type === 'word' && c.topic === activeTopic);
    if (currentPart.id === 3) return cards.filter(c => c.type === 'picture');
    return [];
  }, [currentPart.id, cards, activeTopic]);

  const handleCardFlip = (card: CardData) => {
    const isFlipped = flippedCardId === card.id;
    const newId = isFlipped ? null : card.id;
    setFlippedCardId(newId);

    // Send context update to AI if we just flipped a card UP
    if (!isFlipped && activeSessionRef.current) {
      console.log("Sending context to AI:", card.content);
      const contextMessage = `SYSTEM_UPDATE: The user has selected the card: "${card.content}" (Topic: ${card.topic || 'General'}). Expect them to formulate a question or request about this item. Act as the exam partner and respond naturally to them after they speak.`;

      activeSessionRef.current.sendRealtimeInput([{ text: contextMessage }]);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[750px] border-8 border-slate-800">
      <div className="flex-1 p-8 flex flex-col min-h-0">
        {!isActive && !transcript.length ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <i className="fa-solid fa-microphone text-5xl text-white"></i>
              </div>
            </div>
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-black text-white">Mündliche Prüfung</h3>
              <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
                Starten Sie das Gespräch. Die KI ist Ihr Prüfungspartner.
              </p>
            </div>
            <button onClick={startSession} disabled={isLoading} className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 disabled:opacity-50">
              {isLoading ? 'VERBINDUNG...' : 'PRÜFUNG STARTEN'}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {guidanceEnabled && (
              <div className="mb-6 space-y-4 animate-in slide-in-from-top-4">
                {/* General Instruction */}
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-lightbulb text-yellow-500 mt-1"></i>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-yellow-500 uppercase tracking-widest">
                        {guidanceEnabled ? `Help for Step ${stepIndex + 1}` : `Hilfe für Schritt ${stepIndex + 1}`}
                      </p>
                      <p className="text-yellow-100 font-medium leading-relaxed">{currentPart.guidance}</p>
                    </div>
                  </div>
                </div>

                {/* Redemittel / Phrase Book */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-comment-dots"></i> Redemittel (Useful Phrases)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-100">
                    {currentPart.id === 1 && (
                      <>
                        <div>"Ich heiße [Name]..."</div>
                        <div>"Ich komme aus [Land]..."</div>
                        <div>"Ich wohne in [Stadt]..."</div>
                        <div>"Ich bin [Beruf] von Beruf..."</div>
                      </>
                    )}
                    {currentPart.id === 2 && (
                      <>
                        <div className="font-bold text-blue-300 mb-1 col-span-2">Frage formulieren (Formulate Question):</div>
                        <div>"Haben Sie...?" (Do you have...?)</div>
                        <div>"Kaufen Sie...?" (Do you buy...?)</div>
                        <div>"Wo ist...?" (Where is...?)</div>
                        <div>"Möchten Sie...?" (Would you like...?)</div>
                      </>
                    )}
                    {currentPart.id === 3 && (
                      <>
                        <div className="font-bold text-blue-300 mb-1 col-span-2">Bitte formulieren (Formulate Request):</div>
                        <div>"Können Sie bitte...?" (Can you please...?)</div>
                        <div>"Geben Sie mir bitte..." (Give me please...)</div>
                        <div>"Darf ich bitte...?" (May I please...?)</div>
                        <div>"Machen Sie bitte..." (Please do...)</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar mb-6">
              {transcript.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  <div className={`group relative max-w-[85%] px-5 py-3 rounded-2xl text-lg font-medium shadow-sm ${m.role === 'ai' ? 'bg-blue-900/40 text-blue-100 border border-blue-800/50' : 'bg-slate-700 text-white'}`}>
                    {m.text}
                    {m.role === 'ai' && m.audioBuffer && (
                      <div className="mt-3 pt-3 border-t border-blue-800/30 flex items-center gap-3">
                        <button onClick={() => togglePlayback(i)} className="w-8 h-8 rounded-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 flex items-center justify-center transition-colors">
                          <i className={`fa-solid ${currentlyPlayingIndex === i ? 'fa-pause' : 'fa-play ml-0.5'}`}></i>
                        </button>
                        <button onClick={() => { if (playbackSourceRef.current) playbackSourceRef.current.stop(); setCurrentlyPlayingIndex(null); setTimeout(() => togglePlayback(i), 50); }} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-200 transition-colors">Wiederholen</button>
                      </div>
                    )}
                  </div>
                  {m.pronunciationTip && <div className="mt-2 ml-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-in fade-in slide-in-from-left-2"><i className="fa-solid fa-ear-listen"></i><span>Pronunciation Hint: {m.pronunciationTip}</span></div>}
                </div>
              ))}
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`}></span>
                  <span>{isActive ? 'Prüfer hört zu...' : 'Nicht verbunden'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Schritt {stepIndex + 1} / 3</span>
                  <button onClick={() => stepIndex < 2 ? setStepIndex(i => i + 1) : null} className={`ml-2 px-3 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-colors ${stepIndex === 2 ? 'opacity-50 cursor-not-allowed' : ''}`}>Nächster Teil <i className="fa-solid fa-arrow-right ml-1"></i></button>
                </div>
              </div>

              {relevantCards.length > 0 || currentPart.id === 1 ? (
                <div className="flex flex-col space-y-4">
                  {/* Teil 2: Thema Display - Explicitly shown */}
                  {currentPart.id === 2 && currentPart.topic && (
                    <div className="text-center">
                      <span className="inline-block px-6 py-2 bg-white/10 text-white font-['Patrick_Hand'] text-2xl rounded-lg border border-white/20 shadow-sm rotation-1">
                        Thema: {currentPart.topic}
                      </span>
                    </div>
                  )}

                  <div className="flex overflow-x-auto gap-6 pb-4 snap-x custom-scrollbar justify-center min-h-[300px] items-center">
                    {currentPart.id === 1 && currentPart.card ? (
                      <div className="snap-center shrink-0 w-64 bg-white border-[2px] border-slate-300 shadow-[4px_4px_12px_rgba(0,0,0,0.1)] relative group flex flex-col p-6 h-[350px]">
                        <div className="text-center border-b border-slate-200 pb-2 mb-4">
                          <h4 className="font-bold text-lg text-slate-800 uppercase tracking-tight">{currentPart.card.title}</h4>
                        </div>
                        <ul className="space-y-3 flex-1">
                          {currentPart.card.points.map((point: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-2 border-t border-slate-100 text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Deutsch-Prüfung A1</span>
                        </div>
                      </div>
                    ) : (
                      relevantCards.map(card => {
                        const isFlipped = flippedCardId === card.id;
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleCardFlip(card)}
                            className="cursor-pointer perspective-1000 snap-center shrink-0 w-52 h-[300px] relative transition-transform hover:scale-105 active:scale-95 duration-300"
                          >
                            {/* Card Container for Flip Effect */}
                            <div className={`w-full h-full relative transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                              {/* FRONT (Face Down) */}
                              <div className="absolute inset-0 backface-hidden bg-slate-100 border-4 border-white shadow-xl rounded-xl flex flex-col items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                                  <span className="font-['Merriweather'] font-bold text-slate-400 text-2xl">?</span>
                                </div>
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Karte antippen</span>
                              </div>

                              {/* BACK (Face Up - Content) */}
                              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-[2px] border-slate-300 shadow-xl rounded-xl flex flex-col overflow-hidden">
                                {/* Header */}
                                <div className="flex flex-col px-2 py-1 bg-white border-b border-slate-200">
                                  <div className="flex justify-between items-center w-full">
                                    <span className="text-[7px] font-bold text-slate-700 uppercase tracking-tight">Start Deutsch 1</span>
                                    <span className="text-[7px] font-bold text-slate-700 uppercase tracking-tight">Teil {currentPart.id}</span>
                                  </div>
                                  <span className="text-[6px] text-slate-400 uppercase tracking-tighter">Kandidatenblätter</span>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                                  {currentPart.id === 2 ? (
                                    // Teil 2: WORD ONLY (Theme is above)
                                    <div className="text-center">
                                      <span className="block font-['Merriweather'] font-bold text-2xl text-slate-800 break-words leading-tight">{card.content}</span>
                                    </div>
                                  ) : (
                                    // Teil 3: IMAGE ONLY (No Text, No Theme)
                                    card.imageUrl ? (
                                      <img
                                        src={card.imageUrl}
                                        alt="Situation"
                                        className="w-full h-full object-contain mix-blend-multiply grayscale contrast-125 brightness-95"
                                      />
                                    ) : (
                                      <i className={`fa-solid ${card.icon || 'fa-image'} text-6xl text-slate-800`}></i>
                                    )
                                  )}
                                </div>

                                {/* Footer - Generic for ALL parts */}
                                <div className="bg-white px-2 py-1 border-t border-slate-100 flex justify-center">
                                  <span className="text-[7px] font-bold text-slate-300 uppercase">Deutsch-Prüfung A1</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/20">
                  <i className="fa-solid fa-user-tie text-4xl text-white/20 mb-3"></i>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Gespräch läuft...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-950 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">Deutsch-Prüfung A1</div>
          <button onClick={onComplete} className="px-6 py-2 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-colors shadow-lg">BEENDEN</button>
        </div>
      </div>
    </div>
  );
};

export default SpeakingSession;
