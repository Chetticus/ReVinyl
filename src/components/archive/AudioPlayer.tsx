'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { copy } from '@/i18n/archive';
import { Locale, RecordingAudio } from '@/modules/archive/types';
const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`;
export function AudioPlayer({
  assets,
  locale,
}: {
  assets: RecordingAudio[];
  locale: Locale;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [type, setType] = useState<'DIGITAL' | 'VINYLIZED'>(
    assets.some(a => a.type === 'DIGITAL') ? 'DIGITAL' : 'VINYLIZED'
  );
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const active = assets.find(a => a.type === type);
  const t = copy[locale];
  useEffect(() => {
    if (audio.current) {
      const position = audio.current.currentTime;
      const wasPlaying = !audio.current.paused;
      audio.current.load();
      audio.current.currentTime = Math.min(
        position,
        audio.current.duration || position
      );
      if (wasPlaying) void audio.current.play();
    }
  }, [active?.url]);
  if (!active)
    return (
      <p className='rounded-xl bg-white/10 p-4 text-sm text-white/70'>
        {t.audioUnavailable}
      </p>
    );
  return (
    <div className='space-y-4 rounded-2xl bg-[#241711] p-4 text-white md:p-6'>
      <div className='grid gap-2 sm:grid-cols-2'>
        {(['DIGITAL', 'VINYLIZED'] as const).map(value => {
          const enabled = assets.some(a => a.type === value);
          return (
            <button
              key={value}
              disabled={!enabled}
              onClick={() => setType(value)}
              className={`rounded-xl border p-3 text-left ${type === value ? 'border-[#E4722C] bg-[#E4722C]/20' : 'border-white/20'} disabled:opacity-35`}
            >
              <b>{value === 'DIGITAL' ? t.digital : t.vinylized}</b>
              <span className='mt-1 block text-xs text-white/70'>
                {value === 'DIGITAL' ? t.digitalHelp : t.vinylizedHelp}
              </span>
            </button>
          );
        })}
      </div>
      <audio
        ref={audio}
        src={active.url}
        onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        preload='metadata'
      />
      <div className='flex items-center gap-3'>
        <button
          aria-label={playing ? t.pause : t.play}
          onClick={() => {
            if (!audio.current) return;
            if (playing) audio.current.pause();
            else void audio.current.play();
            setPlaying(!playing);
          }}
          className='grid size-11 place-items-center rounded-full bg-[#E4722C]'
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
          value={current}
          onChange={e => {
            if (audio.current)
              audio.current.currentTime = Number(e.target.value);
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
          defaultValue='1'
          onChange={e => {
            if (audio.current) audio.current.volume = Number(e.target.value);
          }}
        />
      </div>
      <p className='text-xs text-white/60'>
        {active.originalFilename}
        {active.sourceNote ? ` · ${active.sourceNote}` : ''}
        {active.rightsNote ? ` · ${active.rightsNote}` : ''}
      </p>
    </div>
  );
}
