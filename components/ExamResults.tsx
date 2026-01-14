import React, { useEffect, useState } from 'react';

interface ExamResultsProps {
    listeningScore: number;
    maxListening: number;
    readingScore: number;
    maxReading: number;
    writingScore: number | null; // null if not graded
    writingFeedback: string | null;
    onHome: () => void;
}

interface HistoryItem {
    date: string;
    listening: string;
    reading: string;
    writing: string;
}

const ExamResults: React.FC<ExamResultsProps> = ({
    listeningScore,
    maxListening,
    readingScore,
    maxReading,
    writingScore,
    writingFeedback,
    onHome
}) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        // Save current result
        const newEntry: HistoryItem = {
            date: new Date().toLocaleDateString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            listening: `${listeningScore}/${maxListening}`,
            reading: `${readingScore}/${maxReading}`,
            writing: writingScore !== null ? `${writingScore}/10` : 'N/A'
        };

        const saved = localStorage.getItem('exam_history');
        let parsedHistory: HistoryItem[] = saved ? JSON.parse(saved) : [];

        // Add new entry to top
        parsedHistory = [newEntry, ...parsedHistory].slice(0, 10); // Keep last 10

        localStorage.setItem('exam_history', JSON.stringify(parsedHistory));
        setHistory(parsedHistory);
    }, []); // Run once on mount

    const getEmoji = (score: number, max: number) => {
        const p = score / max;
        if (p >= 0.9) return '🏆';
        if (p >= 0.7) return '🌟';
        if (p >= 0.5) return '👍';
        return '🌱';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-4xl w-full border-4 border-white animate-in zoom-in duration-500">

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full shadow-lg mb-4 text-4xl">
                        🎓
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 mb-2">Prüfung Beendet!</h1>
                    <p className="text-slate-500 font-medium">Hier sind deine Ergebnisse.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Listening */}
                    <div className="bg-blue-50 rounded-3xl p-6 text-center border border-blue-100 transform transition hover:scale-105">
                        <div className="text-blue-500 text-3xl mb-3"><i className="fa-solid fa-headphones"></i></div>
                        <h3 className="text-blue-900 font-bold uppercase tracking-widest text-sm mb-1">Hören</h3>
                        <div className="text-4xl font-black text-blue-600 mb-2">
                            {listeningScore} <span className="text-xl text-blue-300">/ {maxListening}</span>
                        </div>
                        <div className="text-2xl">{getEmoji(listeningScore, maxListening)}</div>
                    </div>

                    {/* Reading */}
                    <div className="bg-emerald-50 rounded-3xl p-6 text-center border border-emerald-100 transform transition hover:scale-105">
                        <div className="text-emerald-500 text-3xl mb-3"><i className="fa-solid fa-book-open"></i></div>
                        <h3 className="text-emerald-900 font-bold uppercase tracking-widest text-sm mb-1">Lesen</h3>
                        <div className="text-4xl font-black text-emerald-600 mb-2">
                            {readingScore} <span className="text-xl text-emerald-300">/ {maxReading}</span>
                        </div>
                        <div className="text-2xl">{getEmoji(readingScore, maxReading)}</div>
                    </div>

                    {/* Writing */}
                    <div className="bg-purple-50 rounded-3xl p-6 text-center border border-purple-100 transform transition hover:scale-105">
                        <div className="text-purple-500 text-3xl mb-3"><i className="fa-solid fa-pen-nib"></i></div>
                        <h3 className="text-purple-900 font-bold uppercase tracking-widest text-sm mb-1">Schreiben</h3>
                        {writingScore !== null ? (
                            <>
                                <div className="text-4xl font-black text-purple-600 mb-2">
                                    {writingScore} <span className="text-xl text-purple-300">/ 10</span>
                                </div>
                                <div className="text-2xl">{getEmoji(writingScore, 10)}</div>
                            </>
                        ) : (
                            <div className="text-slate-400 italic py-4">Nicht bewertet</div>
                        )}
                    </div>
                </div>

                {writingFeedback && (
                    <div className="mb-10 bg-purple-50 p-6 rounded-3xl border border-purple-100">
                        <h4 className="text-purple-900 font-bold mb-2 flex items-center gap-2">
                            <i className="fa-solid fa-robot"></i> AI Feedback (Schreiben)
                        </h4>
                        <p className="text-purple-800 leading-relaxed italic">"{writingFeedback}"</p>
                    </div>
                )}

                {/* History Table */}
                <div className="bg-slate-50 rounded-3xl p-6 mb-8">
                    <h3 className="text-slate-700 font-bold uppercase tracking-widest text-xs mb-4 pl-2">Verlauf (Letzte 10)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-200">
                                    <th className="pb-2 pl-2">Datum</th>
                                    <th className="pb-2">Hören</th>
                                    <th className="pb-2">Lesen</th>
                                    <th className="pb-2">Schreiben</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 font-medium">
                                {history.map((h, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50 transition-colors">
                                        <td className="py-3 pl-2">{h.date}</td>
                                        <td className="py-3">{h.listening}</td>
                                        <td className="py-3">{h.reading}</td>
                                        <td className="py-3">{h.writing}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button onClick={onHome} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                    <i className="fa-solid fa-rotate-right"></i>
                    <span>Neue Prüfung starten</span>
                </button>

            </div>
        </div>
    );
};

export default ExamResults;
