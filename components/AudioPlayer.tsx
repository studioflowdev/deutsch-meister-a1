import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
    src: string;
    mode: 'full' | 'strict'; // 'strict' means limited controls
    part: number; // 1, 2, or 3
    onPlayStart?: () => void;
    onPlayEnd?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, mode, part, onPlayStart, onPlayEnd }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playCount, setPlayCount] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Rules for play limits based on Goethe-Zertifikat A1
    // Teil 1: 2 times
    // Teil 2: 1 time
    // Teil 3: 2 times
    const MAX_PLAYS = part === 2 ? 1 : 2;
    const canPlay = mode === 'full' || playCount < MAX_PLAYS;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
                setDuration(audio.duration);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setPlayCount(c => c + 1);
            setProgress(100);
            if (onPlayEnd) onPlayEnd();
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', updateProgress);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', updateProgress);
        };
    }, [onPlayEnd]);

    useEffect(() => {
        // Reset state if source changes
        setIsPlaying(false);
        setProgress(0);
        setPlayCount(0);
    }, [src]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            if (!canPlay && progress === 100) return; // Prevent replay if limit reached

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        if (onPlayStart) onPlayStart();
                    })
                    .catch(err => console.error("Playback failed:", err));
            }
        }
    };

    const preventSeek = (e: React.MouseEvent) => {
        if (mode === 'strict') {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (mode === 'strict' || !audioRef.current) return;
        const newTime = (Number(e.target.value) / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(Number(e.target.value));
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`
      bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 w-full max-w-md shadow-sm select-none
      ${!canPlay && progress === 100 ? 'opacity-50 grayscale' : ''}
    `}>
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                disabled={!canPlay && progress === 100}
                className={`
          w-10 h-10 flex items-center justify-center rounded-full transition-all shrink-0
          ${isPlaying
                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                        : canPlay
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105 active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }
        `}
            >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : mode === 'strict' && playCount >= MAX_PLAYS ? 'fa-check' : 'fa-play ml-1'}`}></i>
            </button>

            {/* Progress Bar & Time */}
            <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <span>{isPlaying ? 'Playing' : playCount >= MAX_PLAYS ? 'Fertig' : 'Audio'}</span>
                    {mode === 'full' && (
                        <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration || 0)}</span>
                    )}
                    {mode === 'strict' && (
                        <span className={playCount >= MAX_PLAYS ? 'text-green-500' : 'text-blue-500'}>
                            {MAX_PLAYS - playCount} plays left
                        </span>
                    )}
                </div>

                <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden" onMouseDownCapture={preventSeek}>
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                    {mode === 'full' && (
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    )}
                </div>
            </div>

            {/* Replay Button (Only in Full Mode) */}
            {mode === 'full' && (
                <button
                    onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play();
                            setIsPlaying(true);
                        }
                    }}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
                    title="Replay"
                >
                    <i className="fa-solid fa-rotate-left"></i>
                </button>
            )}
        </div>
    );
};

export default AudioPlayer;
