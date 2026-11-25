"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface ShowroomAmbienceToggleProps {
  accentHex?: string;
  bgHex?: string;
  textHex?: string;
  borderHex?: string;
}

const LOUNGE_CHORDS: number[][] = [
  [174.61, 220.0, 261.63, 329.63, 392.0],
  [164.81, 196.0, 246.94, 293.66, 392.0],
  [146.83, 174.61, 220.0, 261.63, 329.63],
  [130.81, 164.81, 196.0, 246.94, 293.66],
];

export default function ShowroomAmbienceToggle({
  accentHex = '#B5893A',
  bgHex = '#FAF8F4',
  textHex = '#261E19',
  borderHex = '#E4DCCF',
}: ShowroomAmbienceToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEmbeddedInParent, setIsEmbeddedInParent] = useState(false);
  const isPlayingRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const chordIdxRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      setIsEmbeddedInParent(true);
      const onMsg = (ev: MessageEvent) => {
        if (ev.data && ev.data.type === 'LIMOON_MUSIC_STATE') {
          isPlayingRef.current = !!ev.data.playing;
          setIsPlaying(!!ev.data.playing);
        }
      };
      window.addEventListener('message', onMsg);
      window.parent.postMessage({ type: 'LIMOON_MUSIC_QUERY' }, '*');
      return () => window.removeEventListener('message', onMsg);
    }
  }, []);

  const playWarmLoungeChord = () => {
    if (!isPlayingRef.current) return;
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const notes = LOUNGE_CHORDS[chordIdxRef.current % LOUNGE_CHORDS.length];
    chordIdxRef.current += 1;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(780, now);
    filter.connect(master);

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      const startOffset = idx * 0.14;
      osc.frequency.setValueAtTime(freq, now + startOffset);
      noteGain.gain.setValueAtTime(0.0001, now + startOffset);
      noteGain.gain.linearRampToValueAtTime(0.026 / (1 + idx * 0.18), now + startOffset + 0.45);
      noteGain.gain.exponentialRampToValueAtTime(0.0008, now + startOffset + 4.0);
      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + 4.1);
    });
  };

  const startLocalMusic = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (ctxRef.current) {
        try { await ctxRef.current.close(); } catch {}
      }
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.45, ctx.currentTime);
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterGainRef.current = master;
      if (ctx.state === 'suspended') await ctx.resume();
      isPlayingRef.current = true;
      setIsPlaying(true);
      playWarmLoungeChord();
      timerRef.current = window.setInterval(playWarmLoungeChord, 4200);
    } catch {}
  };

  const stopLocalMusic = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (ctxRef.current) {
      const oldCtx = ctxRef.current;
      ctxRef.current = null;
      masterGainRef.current = null;
      oldCtx.close().catch(() => {});
    }
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    // When embedded inside WordPress (limoonhome.com), delegate to the single parent WordPress music engine so two tracks NEVER play at once!
    if (isEmbeddedInParent && typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage({ type: 'LIMOON_MUSIC_TOGGLE' }, '*');
      return;
    }
    if (isPlayingRef.current) {
      stopLocalMusic();
    } else {
      startLocalMusic();
    }
  };

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  return (
    <button
      type="button"
      data-ambience-toggle
      onClick={toggleMusic}
      className="px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 justify-center transition-all cursor-pointer border"
      style={
        isPlaying
          ? { backgroundColor: accentHex, color: '#FFFFFF', borderColor: accentHex }
          : { backgroundColor: bgHex, color: textHex, borderColor: borderHex }
      }
      title={isPlaying ? 'Mağaza Müziğini Kapat' : 'Mağaza Müziğini Aç'}
    >
      {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
      <span className="hidden sm:inline">{isPlaying ? 'Müzik Açık' : 'Müzik'}</span>
    </button>
  );
}
