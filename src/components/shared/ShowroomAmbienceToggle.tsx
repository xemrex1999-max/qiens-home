"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface ShowroomAmbienceToggleProps {
  accentHex?: string;
  bgHex?: string;
  textHex?: string;
  borderHex?: string;
  autoStartOnFirstClick?: boolean;
}

// Luxury İnegöl Furniture Showroom Acoustic Lounge / Rhodes Piano Ambience Engine (0 MB external dependency, copyright-free)
const LOUNGE_CHORDS: number[][] = [
  [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9 (warm opening chord)
  [164.81, 196.0, 246.94, 293.66, 392.0], // Em7(11)
  [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9
  [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9
];

export default function ShowroomAmbienceToggle({
  accentHex = '#B5893A',
  bgHex = '#FAF8F4',
  textHex = '#261E19',
  borderHex = '#E4DCCF',
  autoStartOnFirstClick = true,
}: ShowroomAmbienceToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const chordIdxRef = useRef<number>(0);
  const autoArmedRef = useRef<boolean>(false);

  const playWarmLoungeChord = () => {
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const notes = LOUNGE_CHORDS[chordIdxRef.current % LOUNGE_CHORDS.length];
    chordIdxRef.current += 1;

    // Warm low-pass filter for velvet showroom speakers feel
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(780, now);
    filter.connect(master);

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      subOsc.type = 'triangle';

      // Gentle harp/piano arpeggio stagger
      const startOffset = idx * 0.14;
      osc.frequency.setValueAtTime(freq, now + startOffset);
      subOsc.frequency.setValueAtTime(freq * 2, now + startOffset);

      noteGain.gain.setValueAtTime(0.0001, now + startOffset);
      noteGain.gain.linearRampToValueAtTime(0.032 / (1 + idx * 0.18), now + startOffset + 0.45);
      noteGain.gain.exponentialRampToValueAtTime(0.0008, now + startOffset + 4.2);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.14, now + startOffset);

      osc.connect(noteGain);
      subOsc.connect(overtoneGain);
      overtoneGain.connect(noteGain);
      noteGain.connect(filter);

      osc.start(now + startOffset);
      subOsc.start(now + startOffset);
      osc.stop(now + startOffset + 4.3);
      subOsc.stop(now + startOffset + 4.3);
    });
  };

  const startMusic = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!ctxRef.current) {
        const ctx = new AudioCtx();
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.48, ctx.currentTime);
        master.connect(ctx.destination);
        ctxRef.current = ctx;
        masterGainRef.current = master;
      }
      if (ctxRef.current.state === 'suspended') {
        await ctxRef.current.resume();
      }
      setIsPlaying(true);
      playWarmLoungeChord();
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(playWarmLoungeChord, 4200);
    } catch {}
  };

  const stopMusic = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (ctxRef.current && ctxRef.current.state === 'running') {
      ctxRef.current.suspend().catch(() => {});
    }
  };

  const toggleMusic = () => {
    autoArmedRef.current = true;
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  useEffect(() => {
    if (!autoStartOnFirstClick) return;
    const handleFirstInteraction = (e: Event) => {
      if (autoArmedRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest && target.closest('[data-ambience-toggle]')) return;
      autoArmedRef.current = true;
      startMusic();
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      data-ambience-toggle
      onClick={toggleMusic}
      className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border"
      style={
        isPlaying
          ? { backgroundColor: accentHex, color: '#FFFFFF', borderColor: accentHex }
          : { backgroundColor: bgHex, color: textHex, borderColor: borderHex }
      }
      title={isPlaying ? 'Mağaza Ambiyans Müziğini Kapat' : 'Mağaza Ambiyans Müziğini Aç'}
    >
      {isPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
      <span>{isPlaying ? 'Mağaza Müziği: Açık' : 'Mağaza Müziği'}</span>
    </button>
  );
}
