'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useQuizStore } from '@/stores/lesson.slice';
import { submitLessonAPI } from '@/modules/courses/infrastructure/course.api';
import { useQueryClient } from '@tanstack/react-query';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  slug?: string;
  data?: any;
}

const VideoPlayer = ({
  src,
  poster,
  className = '',
  slug,
  data,
}: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setQuizStarted = useQuizStore(state => state.setQuizStarted);
  const queryClient = useQueryClient();

  // Extract YouTube video ID and validate URL
  const getValidYouTubeUrl = (url: string): string => {
    if (!url) return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    // YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/watch?v=${match[1]}`;
      }
    }

    // If it's not a valid YouTube URL, return fallback
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  };

  const videoUrl = getValidYouTubeUrl(src);

  useEffect(() => {
    setQuizStarted(false);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Check if URL is YouTube

  const handleReady = () => {
    console.log('✅ Video is ready');
    setIsReady(true);
    setError(null);
  };

  const handleError = (error: any) => {
    console.error('❌ ReactPlayer error:', error);
    console.error('❌ Error details:', {
      message: error?.message,
      type: error?.type,
      data: error?.data,
    });

    // Handle specific YouTube errors
    if (error?.message?.includes('Invalid video id')) {
      setError('Invalid YouTube video ID. Please check the URL.');
    } else {
      setError(`Failed to load video: ${error?.message || 'Unknown error'}`);
    }
    setIsReady(false);
  };

  const handleStart = () => {
    console.log('▶️ Video started playing');
  };

  const handlePlay = () => {
    console.log('▶️ Video play event');
    setIsPlaying(true);
  };

  const handlePause = () => {
    console.log('⏸️ Video pause event');
    setIsPlaying(false);
  };

  const handleBuffer = () => {
    console.log('🔄 Video buffering');
  };

  const handleBufferEnd = () => {
    console.log('✅ Video buffer ended');
  };

  const handleDoneCourse = () => {
    submitLessonAPI(data.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['courses detail', slug] });
    });
  };

  return (
    <div className={`relative w-full aspect-video bg-black ${className}`}>
      <div className='flex justify-between pt-2 mb-2'>
        <h1 className='text-2xl font-bold'>{data?.title}</h1>
        <div
          role='presentation'
          onClick={handleDoneCourse}
          className='p-2 mr-4 text-sm rounded-xl flex items-center h-10 text-[#212b36] bg-white flex-shrink-0 cursor-pointer'
        >
          Hoàn thành Chuyên đề
        </div>
      </div>
      {/* ReactPlayer */}
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={isPlaying}
        width='100%'
        height='100%'
        onReady={handleReady}
        onError={handleError}
        onStart={handleStart}
        onPlay={handlePlay}
        onPause={handlePause}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        onEnded={() => setIsPlaying(false)}
        config={{
          youtube: {
            playerVars: {
              controls: 1, // Enable YouTube controls for testing
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              origin:
                typeof window !== 'undefined' ? window.location.origin : '',
            },
          },
          file: {
            attributes: {
              poster: poster,
            },
          },
        }}
      />

      {/* Loading state */}
      {!isReady && !error && (
        <div className='absolute inset-0 flex items-center justify-center bg-black'>
          <div className='text-white'>Loading video...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='absolute inset-0 flex items-center justify-center bg-black'>
          <div className='text-red-400 text-center'>
            <div>Error loading video</div>
            <div className='text-sm mt-2'>{error}</div>
            <div className='text-xs mt-2 text-gray-400'>
              Original URL: {src}
            </div>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* Simple play button */}
      {isReady && !isPlaying && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <button onClick={togglePlay}></button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
