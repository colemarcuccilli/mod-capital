import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

// Import ICON SVG files
import richBlackIcon from '../../assets/images/logos/DomentraIconRichBlack.svg';
import bitterSweetIcon from '../../assets/images/logos/DomentraIconBittersweet.svg';
import poixIcon from '../../assets/images/logos/DomentraIconPhoix.svg';
import mindaroIcon from '../../assets/images/logos/DomentraIconMindaro.svg';
import keyHoleOutline from '../../assets/images/logos/KeyHoleOutline.svg';

// Import the OMENTRA part SVG
import omentraWordmark from '../../assets/images/logos/DomentraWordMarkLogoNoD.svg';

// Remove imports for full wordmarks if not needed elsewhere
// import wordmarkBittersweet from '../../assets/images/logos/DomentraWordMarkBittersweet.svg';
// import wordmarkPoix from '../../assets/images/logos/DomentraWordMarkPhoix.svg';
// import wordmarkMindaro from '../../assets/images/logos/DomentraWordMarkMindaro.svg';
// import wordmarkRichBlack from '../../assets/images/logos/DomentraWordMarkRichBlack.svg';

const AnimatedDomentraLogo: React.FC<{className?: string}> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Icon Refs
  const richBlackIconRef = useRef<HTMLImageElement>(null);
  const bitterSweetIconRef = useRef<HTMLImageElement>(null);
  const poixIconRef = useRef<HTMLImageElement>(null);
  const mindaroIconRef = useRef<HTMLImageElement>(null);
  const keyHoleOutlineRef = useRef<HTMLImageElement>(null);
  // Omentra Ref
  const omentraRef = useRef<HTMLImageElement>(null);
  
  const tl = useRef<gsap.core.Timeline | null>(null);
  // Index for cycling ICON color
  const iconColorIndex = useRef(0); 

  const iconWidth = 40;
  const omentraWidth = 140; // Estimated width of the "omentra" part
  const finalLogoWidth = iconWidth + omentraWidth; // Total approx width
  // Removed wordmarkScaleFactor

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const allIcons = [
          richBlackIconRef.current, bitterSweetIconRef.current,
          poixIconRef.current, mindaroIconRef.current, keyHoleOutlineRef.current
      ];
      const omentraEl = omentraRef.current;
      // List of actual icon refs for color cycling
      const coloredIcons = [
          bitterSweetIconRef.current, poixIconRef.current, 
          mindaroIconRef.current, richBlackIconRef.current 
      ]; 

      if (!omentraEl || allIcons.some(ref => !ref)) {
          console.warn("AnimatedDomentraLogo: Refs not ready."); return;
      }
      
      tl.current = gsap.timeline({
        repeat: -1, 
        repeatDelay: 3, 
        paused: true,
        defaults: { overwrite: "auto" },
        onRepeat: () => {
          // Cycle icon color index
          iconColorIndex.current = (iconColorIndex.current + 1) % coloredIcons.length;
           // On repeat, reset icon visibility - timeline will handle correct one
           gsap.set(coloredIcons, { autoAlpha: 0 }); 
           // Omentra visibility is handled by the timeline reset below
        }
      });

      const initialIconX = finalLogoWidth - iconWidth; // Start icon on far right
      // const initialOmentraX = iconWidth; // No longer needed for x

      // Initial State 
      gsap.set(containerRef.current, { autoAlpha: 1});
      // Position omentra at final spot (x:0, y:2), hidden and clipped
      gsap.set(omentraEl, { 
          autoAlpha: 0, x: 0, y: 2, // Match final icon y offset
          clipPath: 'inset(0 100% 0 0)', // Start fully clipped
          transformOrigin: 'left center'
      }); 
      // Position/hide all icons/outline
      gsap.set(allIcons, { 
          autoAlpha: 0, rotation: 90, x: initialIconX, y: 2, // Keep y offset
          scale: 1, transformOrigin: 'center center' 
      });
      gsap.set(keyHoleOutlineRef.current, { scale: 0.25 }); // Keep outline small
      gsap.set(richBlackIconRef.current, { autoAlpha: 1 }); // Show starting icon
      
      // Build the timeline
      tl.current
        // 1. UNLOCK SEQUENCE (Rotation: 1.0s)
        .addLabel("start")
        .to(richBlackIconRef.current, { duration: 0.15, scale: 1.05, repeat: 1, yoyo: true, ease: "power1.inOut" }, "start+=0.1")
        .to(keyHoleOutlineRef.current, { duration: 0.2, autoAlpha: 0.8, ease: "power2.out" }, "start+=0.15")
        .to(allIcons, { duration: 1.0, rotation: 0, ease: "back.out(1.7)", x: initialIconX }, "start+=0.25") 
        .to(richBlackIconRef.current, { duration: 0.2, autoAlpha: 0, ease: "power1.in" }, "start+=0.85")
        .to(mindaroIconRef.current, { duration: 0.2, autoAlpha: 1, ease: "power1.out" }, "start+=0.85")
        .to(keyHoleOutlineRef.current, { duration: 0.2, autoAlpha: 0, ease: "power2.in" }, "start+=0.95")

        // 2. POSITION SHIFT (Slide: 1.5s) - Target x: -13 for icons
        .addLabel("slide", "-=0.1") 
        .to([mindaroIconRef.current, poixIconRef.current, bitterSweetIconRef.current], { 
            duration: 1.5, 
            x: -13, // <-- CHANGE: Target -13px for final position
            ease: "power2.inOut" 
        }, "slide") 
        // Fades still happen relative to the slide duration
        .to(mindaroIconRef.current, { duration: 0.4, autoAlpha: 0, ease: "power1.in" }, "slide+=0.3")
        .to(poixIconRef.current, { duration: 0.4, autoAlpha: 1, ease: "power1.out" }, "slide+=0.3")
        .to(poixIconRef.current, { duration: 0.4, autoAlpha: 0, ease: "power1.in" }, "slide+=0.8")
        .to(bitterSweetIconRef.current, { duration: 0.4, autoAlpha: 1, ease: "power1.out" }, "slide+=0.8")

        // 3. OMENTRA REVEAL 
        .addLabel("reveal", "-=0.1") 
        // Keep icon visible at its new x:-13 position
        .set(coloredIcons[iconColorIndex.current], { autoAlpha: 1 }, "reveal+=0.1") 
        // Reveal omentra starting from x:0
        .set(omentraEl, { autoAlpha: 1 }, "reveal+=0.1") 
        .to(omentraEl, { 
            duration: 1.0, 
            clipPath: 'inset(0 0% 0 0)', 
            ease: "power2.out" 
        }, "reveal+=0.1"); 
        
      const playTimeout = setTimeout(() => {
        tl.current?.play();
      }, 500); 

    }, containerRef); 

    return () => {
      ctx.revert();
    };
  }, []); 

  return (
    // Container width
    <div ref={containerRef} className={`relative h-10 md:h-12 opacity-0 ${className}`} style={{ width: `${finalLogoWidth}px` }}> 
      <Link to="/" className="absolute inset-0 block h-full w-full" aria-label="Domentra Home">
        {/* Omentra part - positioned top-left, hidden/clipped initially */}
        <img 
            ref={omentraRef} 
            src={omentraWordmark} 
            alt="omentra" 
            className="absolute top-0 left-0 h-full w-auto opacity-0" // Position at 0,0 rely on SVG content for spacing
            style={{ transformOrigin: 'left center' }}
        />

        {/* Outline - positioned top-left, hidden/scaled initially */}
        <img ref={keyHoleOutlineRef} src={keyHoleOutline} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        {/* Icons - positioned top-left, hidden initially */} 
        <img ref={richBlackIconRef} src={richBlackIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        <img ref={bitterSweetIconRef} src={bitterSweetIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        <img ref={poixIconRef} src={poixIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        <img ref={mindaroIconRef} src={mindaroIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
      </Link>
    </div>
  );
};

export default AnimatedDomentraLogo; 