"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import { Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { track } from "@/lib/analytics";
import styles from "./InternshipTrailer.module.css";

const poster = "/images/courses/internship-trailer-poster.jpg";
const speeds = [1, 1.25, 1.5, 2, 0.75];
const IDLE_MS = 2600;

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Shows the trailer thumbnail; the video only loads once the visitor clicks it. */
export function InternshipTrailer({ src }: { src: string }) {
  const [started, setStarted] = useState(false);
  return <div className={styles.player}>
    {started
      ? <TrailerPlayer src={src} />
      : <button type="button" className={styles.cover} aria-label="Play the 6-week drone internship trailer (5 min 12 s)" onClick={() => { track("trailer_played", { program: "drone-technology-internship" }); setStarted(true); }}>
        <Image src={poster} alt="Aerocadmy 6-week online drone internship: Build. Code. Fly." width={1920} height={1080} priority sizes="(max-width: 900px) 100vw, 350px" />
        <span className={styles.play} aria-hidden="true"><Play size={22} fill="currentColor" strokeWidth={0} /></span>
      </button>}
  </div>;
}

function TrailerPlayer({ src }: { src: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [paused, setPaused] = useState(true);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);

  const wake = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    if (videoRef.current && !videoRef.current.paused) idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS);
  }, []);

  useEffect(() => {
    videoRef.current?.play().catch(() => setPaused(true));
    const onFs = () => setFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => { document.removeEventListener("fullscreenchange", onFs); clearTimeout(idleTimer.current); };
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.ended) v.currentTime = 0;
    if (v.paused) v.play().catch(() => undefined); else v.pause();
    wake();
  }, [wake]);

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
  };

  const toggleMute = () => { const v = videoRef.current; if (v) v.muted = !v.muted; };

  const cycleRate = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = speeds[(speeds.indexOf(v.playbackRate) + 1) % speeds.length];
    v.playbackRate = next;
    setRate(next);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const key = e.key.toLowerCase();
    if (key === " " || key === "k") toggle();
    else if (key === "arrowright") seekBy(5);
    else if (key === "arrowleft") seekBy(-5);
    else if (key === "m") toggleMute();
    else if (key === "f") toggleFullscreen();
    else return;
    e.preventDefault();
    wake();
  };

  const syncBuffered = () => {
    const v = videoRef.current;
    if (!v || !v.buffered.length) return;
    setBuffered(v.buffered.end(v.buffered.length - 1));
  };

  const played = duration ? (time / duration) * 100 : 0;
  const loaded = duration ? Math.max((buffered / duration) * 100, played) : 0;
  const showCenter = (paused || ended) && !waiting;

  return <div
    ref={stageRef}
    className={`${styles.stage} ${idle && !paused ? styles.idle : ""} ${fullscreen ? styles.full : ""}`}
    tabIndex={0}
    role="group"
    aria-label="Drone internship trailer video player. Space plays or pauses, arrow keys seek, M mutes, F toggles fullscreen."
    onKeyDown={onKeyDown}
    onPointerMove={wake}
    onPointerLeave={() => { if (videoRef.current && !videoRef.current.paused) setIdle(true); }}
  >
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      playsInline
      preload="auto"
      onClick={toggle}
      onDoubleClick={toggleFullscreen}
      onPlay={() => { setPaused(false); setEnded(false); wake(); }}
      onPause={() => { setPaused(true); setIdle(false); }}
      onEnded={() => { setEnded(true); setPaused(true); setIdle(false); }}
      onWaiting={() => setWaiting(true)}
      onCanPlay={() => setWaiting(false)}
      onPlaying={() => setWaiting(false)}
      onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
      onTimeUpdate={e => { setTime(e.currentTarget.currentTime); syncBuffered(); }}
      onProgress={syncBuffered}
      onVolumeChange={e => setMuted(e.currentTarget.muted)}
    />

    {waiting && <span className={styles.spinner} role="status" aria-label="Loading video" />}
    {showCenter && <span className={styles.center} aria-hidden="true">{ended ? <RotateCcw size={26} strokeWidth={2.2} /> : <Play size={26} fill="currentColor" strokeWidth={0} />}</span>}

    <div className={styles.controls}>
      <input
        className={styles.seek}
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(time, duration || 0)}
        aria-label="Seek"
        aria-valuetext={`${clock(time)} of ${clock(duration)}`}
        style={{ "--p": `${played}%`, "--b": `${loaded}%` } as CSSProperties}
        onChange={e => { const v = videoRef.current; if (v) { v.currentTime = Number(e.target.value); setTime(v.currentTime); } }}
      />
      <div className={styles.row}>
        <button type="button" onClick={toggle} aria-label={ended ? "Replay" : paused ? "Play" : "Pause"}>
          {ended ? <RotateCcw size={18} /> : paused ? <Play size={18} fill="currentColor" strokeWidth={0} /> : <Pause size={18} fill="currentColor" strokeWidth={0} />}
        </button>
        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <span className={styles.time}>{clock(time)} <i>/</i> {clock(duration)}</span>
        <span className={styles.spacer} />
        <button type="button" className={styles.rate} onClick={cycleRate} aria-label={`Playback speed ${rate}x, change`}>{rate}×</button>
        <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
          {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  </div>;
}
