'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ERouteTable } from '@/constants/route';

const AI_BOT_ICON = '/images/ai/vinyl-bot.png';

export function AiFloatingButton() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    router.push(ERouteTable.ASK_AI);
  };

  return (
    <>
      <style>{`
        .ai-fab-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .ai-fab-tooltip {
          background: linear-gradient(135deg, #E4722C, #C45E1F);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 16px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(228, 114, 44, 0.35);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
          letter-spacing: 0.3px;
        }

        .ai-fab-tooltip.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ai-fab-btn {
          width: 52px;
          height: 52px;
        }

        @media (min-width: 1024px) {
          .ai-fab-btn {
            width: 64px;
            height: 64px;
          }
        }

        .ai-fab-btn {
          border-radius: 50%;
          background: #FDF6F1;
          border: 2px solid rgba(228, 114, 44, 0.25);
          cursor: pointer;
          display: block;
          box-shadow:
            0 6px 20px rgba(228, 114, 44, 0.22),
            0 2px 6px rgba(0, 0, 0, 0.08),
            0 0 0 0 rgba(228, 114, 44, 0.35);
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s ease;
          padding: 0;
          overflow: hidden;
          position: relative;
          isolation: isolate;
          animation:
            ai-fab-float 3.2s ease-in-out infinite,
            ai-fab-glow 2.8s ease-in-out infinite;
        }

        .ai-fab-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(228, 114, 44, 0.12), rgba(196, 94, 31, 0.12));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .ai-fab-btn:hover::before {
          opacity: 1;
        }

        .ai-fab-btn:hover {
          animation-play-state: paused;
          transform: scale(1.1) translateY(-3px);
          box-shadow:
            0 16px 40px rgba(228, 114, 44, 0.32),
            0 4px 12px rgba(0, 0, 0, 0.1),
            0 0 0 8px rgba(228, 114, 44, 0.1);
        }

        .ai-fab-btn:active {
          animation-play-state: paused;
          transform: scale(0.96);
          box-shadow:
            0 4px 12px rgba(228, 114, 44, 0.2),
            0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .ai-fab-icon {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          object-fit: cover;
          object-position: center;
          animation: ai-fab-breathe 2.6s ease-in-out infinite;
          transform-origin: center center;
        }

        .ai-fab-btn:hover .ai-fab-icon {
          animation-play-state: paused;
        }

        .ai-fab-pulse {
          z-index: -1;
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: transparent;
          border: 2px solid rgba(228, 114, 44, 0.35);
          animation: ai-fab-pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes ai-fab-pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }

        @keyframes ai-fab-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes ai-fab-glow {
          0%, 100% {
            box-shadow:
              0 8px 32px rgba(228, 114, 44, 0.22),
              0 2px 8px rgba(0, 0, 0, 0.08),
              0 0 0 0 rgba(228, 114, 44, 0.2);
          }
          50% {
            box-shadow:
              0 10px 36px rgba(228, 114, 44, 0.32),
              0 4px 12px rgba(0, 0, 0, 0.1),
              0 0 0 6px rgba(228, 114, 44, 0.12);
          }
        }

        @keyframes ai-fab-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.045); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-fab-btn,
          .ai-fab-icon,
          .ai-fab-pulse {
            animation: none !important;
          }
        }
      `}</style>

      <div className='ai-fab-wrapper'>
        <span className={`ai-fab-tooltip${isHovered ? ' visible' : ''}`}>
          Hỏi AI Ngay
        </span>

        <button
          type='button'
          className='ai-fab-btn'
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label='Mở trợ lý AI'
          title='Hỏi AI về đĩa nhạc và di sản âm nhạc'
        >
          <span className='ai-fab-pulse' />
          <Image
            src={AI_BOT_ICON}
            alt='Trợ lý AI Vinyl Heritage'
            fill
            sizes='(max-width: 1023px) 52px, 64px'
            className='ai-fab-icon'
            priority
          />
        </button>
      </div>
    </>
  );
}
