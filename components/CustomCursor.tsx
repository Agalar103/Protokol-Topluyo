
import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button';
      
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseleave', () => setIsVisible(false));
    window.addEventListener('mouseenter', () => setIsVisible(true));

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed pointer-events-none z-[9999] mix-blend-screen transition-transform duration-100 ease-out"
        style={{ 
          left: position.x, 
          top: position.y, 
          // İmlecin (arrow) ucuna tam gelmemesi, etrafını sarması için hafif bir offset
          transform: `translate(-10px, -10px) scale(${isHovering ? 1.2 : 1})` 
        }}
      >
        {/* Punk Glitch Scanner - İmlecin etrafında dönen dijital kareler */}
        <div className="relative w-10 h-10">
           {/* Cyan Scanner Line */}
           <div className="absolute inset-0 border border-[#00ffff]/40 animate-[glitch-scan_1.5s_infinite] opacity-50" />
           
           {/* Magenta Crosshair Corners */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff00ff] animate-pulse" />
           <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff00ff] animate-pulse delay-75" />
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff00ff] animate-pulse delay-150" />
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff00ff] animate-pulse delay-225" />

           {/* Central Glitch Jitter */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-1 h-1 bg-white animate-[glitch-jitter_0.2s_infinite]" />
              <div className="absolute inset-0 bg-[#ff00ff] animate-[glitch-jitter_0.3s_infinite_reverse] blur-[1px]" />
           </div>
        </div>

        {/* Floating Data Tag (Only on hover) */}
        {isHovering && (
          <div className="absolute top-12 left-6 bg-black/80 border border-[#00ffff]/40 px-2 py-0.5 whitespace-nowrap">
             <span className="text-[7px] font-[1000] text-[#00ffff] uppercase tracking-[0.3em] animate-pulse">
               LINK_ESTABLISHED_42
             </span>
             <div className="h-[1px] w-full bg-[#00ffff] animate-[data-stream_1s_linear_infinite]" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes glitch-scan {
          0% { transform: scale(0.8); opacity: 0; border-radius: 0; }
          50% { transform: scale(1.2); opacity: 0.5; border-radius: 50%; }
          100% { transform: scale(1.5); opacity: 0; border-radius: 0; }
        }

        @keyframes glitch-jitter {
          0% { transform: translate(0, 0) skew(0deg); }
          20% { transform: translate(-2px, 1px) skew(5deg); }
          40% { transform: translate(2px, -1px) skew(-5deg); }
          60% { transform: translate(-1px, 2px) skew(2deg); }
          100% { transform: translate(0, 0) skew(0deg); }
        }

        @keyframes data-stream {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
