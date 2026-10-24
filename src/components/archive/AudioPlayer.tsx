'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { copy } from '@/i18n/archive';
import type {
  AudioType,
  Locale,
  RecordingAudio,
} from '@/modules/archive/types';
import { createVinylRoom } from '@/modules/archive/vinyl-room';
import { switchedPosition } from '@/modules/archive/audio-timeline';

const time = (seconds: number) => {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  return `${Math.floor(safe / 60)}:${Math.floor(safe % 60)
    .toString()
    .padStart(2, '0')}`;
};

export function AudioPlayer(props: {
  assets: RecordingAudio[];
  locale: Locale;
}) {
  return (
    <AudioTransport
      key={props.assets.map(a => `${a.type}:${a.url}`).join('|')}
      {...props}
    />
  );
}

function AudioTransport({
  assets,
  locale,
}: {
  assets: RecordingAudio[];
  locale: Locale;
}) {
  const players = useRef<Partial<Record<AudioType, HTMLAudioElement>>>({});
  const initialType = assets.some(a => a.type === 'DIGITAL')
    ? 'DIGITAL'
    : 'VINYLIZED';
  const activeType = useRef<AudioType>(initialType);
  const [type, setType] = useState<AudioType>(initialType);
  const room = useRef<ReturnType<typeof createVinylRoom> | null>(null);
  const intendedPlayback = useRef(false);
  const position = useRef(0);
  const playRequest = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [failed, setFailed] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    const elements = players.current;
    const requests = playRequest;
    return () => {
      intendedPlayback.current = false;
      requests.current++;
      Object.values(elements).forEach(player => player.pause());
      room.current?.dispose();
    };
  }, []);

  const play = async (value: AudioType) => {
    const player = players.current[value];
    if (!player) return;
    const request = ++playRequest.current;
    setFailed(false);
    try {
      if (value === 'VINYLIZED') {
        room.current ??= createVinylRoom(player);
        room.current.setAudible(true);
        await room.current.resume();
      }
      if (
        !intendedPlayback.current ||
        activeType.current !== value ||
        request !== playRequest.current
      )
        return;
      await player.play();
      if (!intendedPlayback.current || activeType.current !== value)
        player.pause();
    } catch {
      if (activeType.current === value && request === playRequest.current) {
        intendedPlayback.current = false;
        setPlaying(false);
        setFailed(true);
      }
    }
  };

  const choose = (value: AudioType) => {
    if (value === activeType.current) return;
    const previous = players.current[activeType.current];
    position.current = switchedPosition(
      previous && previous.readyState >= 1
        ? previous.currentTime
        : position.current,
      assets.find(asset => asset.type === activeType.current),
      assets.find(asset => asset.type === value)
    );
    setCurrent(position.current);
    // Guard the outgoing pause event before changing the source.
    activeType.current = value;
    playRequest.current++;
    previous?.pause();
    room.current?.setAudible(false);
    setType(value);
    setFailed(false);
    setPlaying(false);
    const next = players.current[value];
    if (next && next.readyState >= 1) {
      next.currentTime = Math.min(
        position.current,
        Number.isFinite(next.duration) ? next.duration : position.current
      );
      setDuration(Number.isFinite(next.duration) ? next.duration : 0);
    }
    if (intendedPlayback.current) void play(value);
  };

  if (!assets.some(a => a.url))
    return (
      <p className='rounded-xl bg-white/10 p-4 text-sm text-white/70'>
        {t.audioUnavailable}
      </p>
    );

  return (
    <div className='space-y-4 rounded-2xl bg-[#241711] p-4 text-white md:p-6'>
      <div className='grid gap-2 sm:grid-cols-2'>
        {(['DIGITAL', 'VINYLIZED'] as const).map(value => (
          <button
            key={value}
            type='button'
            disabled={!assets.some(a => a.type === value && a.url)}
            aria-pressed={type === value}
            onClick={() => choose(value)}
            className={`rounded-xl border p-3 text-left ${type === value ? 'border-[#E4722C] bg-[#E4722C]/20' : 'border-white/20'} disabled:opacity-35`}
          >
            <b>{value === 'DIGITAL' ? t.digital : t.vinylized}</b>
            <span className='mt-1 block text-xs text-white/70'>
              {value === 'DIGITAL' ? t.digitalHelp : t.vinylizedHelp}
            </span>
          </button>
        ))}
      </div>
      {assets
        .filter(a => a.url)
        .map(asset => (
          <audio
            key={asset.type}
            ref={element => {
              if (element) players.current[asset.type] = element;
            }}
            src={asset.url}
            crossOrigin={asset.type === 'VINYLIZED' ? 'anonymous' : undefined}
            preload='metadata'
            onLoadedMetadata={event => {
              const player = event.currentTarget;
              player.volume = volume;
              if (activeType.current !== asset.type) return;
              player.currentTime = Math.min(
                position.current,
                Number.isFinite(player.duration)
                  ? player.duration
                  : position.current
              );
              setDuration(
                Number.isFinite(player.duration) ? player.duration : 0
              );
            }}
            onTimeUpdate={event => {
              if (activeType.current !== asset.type) return;
              position.current = event.currentTarget.currentTime;
              setCurrent(position.current);
            }}
            onPlay={() => {
              if (activeType.current === asset.type) setPlaying(true);
            }}
            onPause={() => {
              if (activeType.current === asset.type) setPlaying(false);
            }}
            onEnded={() => {
              if (activeType.current !== asset.type) return;
              intendedPlayback.current = false;
              setPlaying(false);
              room.current?.setAudible(false);
            }}
            onError={() => {
              if (activeType.current === asset.type) {
                intendedPlayback.current = false;
                setPlaying(false);
                setFailed(true);
              }
            }}
          />
        ))}
      <div className='flex items-center gap-3'>
        <button
          type='button'
          aria-label={playing ? t.pause : t.play}
          onClick={() => {
            const player = players.current[type];
            if (!player) return;
            if (intendedPlayback.current) {
              intendedPlayback.current = false;
              playRequest.current++;
              player.pause();
              room.current?.setAudible(false);
              setPlaying(false);
            } else {
              intendedPlayback.current = true;
              void play(type);
            }
          }}
          className='grid size-11 shrink-0 place-items-center rounded-full bg-[#E4722C]'
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <span className='w-11 text-xs'>{time(current)}</span>
        <input
          aria-label={t.seek}
          className='min-w-0 flex-1 accent-[#E4722C]'
          type='range'
          min='0'
          max={duration || 0}
          value={Math.min(current, duration || 0)}
          step='.1'
          onChange={event => {
            position.current = Number(event.target.value);
            setCurrent(position.current);
            const player = players.current[type];
            if (player && player.readyState >= 1)
              player.currentTime = position.current;
          }}
        />
        <span className='w-11 text-xs'>{time(duration)}</span>
        <Volume2 className='hidden sm:block' />
        <input
          aria-label={t.volume}
          className='hidden w-20 accent-[#E4722C] sm:block'
          type='range'
          min='0'
          max='1'
          step='.05'
          value={volume}
          onChange={event => {
            const next = Number(event.target.value);
            setVolume(next);
            Object.values(players.current).forEach(player => {
              player.volume = next;
            });
          }}
        />
      </div>
      {failed && (
        <p role='alert' className='text-sm text-white/70'>
          {t.audioPlaybackError}
        </p>
      )}
    </div>
  );
}
