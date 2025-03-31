import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

// Import SVG files
// Make sure these paths are correct relative to this file
import richBlackIcon from '../../assets/images/logos/DomentraIconRichBlack.svg';
import bitterSweetIcon from '../../assets/images/logos/DomentraIconBittersweet.svg';
import poixIcon from '../../assets/images/logos/DomentraIconPhoix.svg';
import mindaroIcon from '../../assets/images/logos/DomentraIconMindaro.svg';
// Import the FULL wordmark (includes the D) for the final state
import wordmarkFinal from '../../assets/images/logos/DomentraWordMarkBittersweet.svg';
import keyHoleOutline from '../../assets/images/logos/KeyHoleOutline.svg';

// Import ALL colored wordmarks for the final rotation
import wordmarkBittersweet from '../../assets/images/logos/DomentraWordMarkBittersweet.svg';
import wordmarkPoix from '../../assets/images/logos/DomentraWordMarkPhoix.svg';
import wordmarkMindaro from '../../assets/images/logos/DomentraWordMarkMindaro.svg';
import wordmarkRichBlack from '../../assets/images/logos/DomentraWordMarkRichBlack.svg';

const AnimatedDomentraLogo: React.FC<{className?: string}> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Icon Refs (for animation phases)
  const richBlackIconRef = useRef<HTMLImageElement>(null);
  const bitterSweetIconRef = useRef<HTMLImageElement>(null);
  const poixIconRef = useRef<HTMLImageElement>(null);
  const mindaroIconRef = useRef<HTMLImageElement>(null);
  const keyHoleOutlineRef = useRef<HTMLImageElement>(null);
  // Wordmark Refs (for final revealed state & rotation)
  const wordmarkBittersweetRef = useRef<HTMLImageElement>(null);
  const wordmarkPoixRef = useRef<HTMLImageElement>(null);
  const wordmarkMindaroRef = useRef<HTMLImageElement>(null);
  const wordmarkRichBlackRef = useRef<HTMLImageElement>(null);
  // Use a ref for the timeline to manage restarts/kills
  const tl = useRef<gsap.core.Timeline | null>(null);
  const wordmarkColorIndex = useRef(0); // To track which color to show

  // Define estimated width for positioning calculations
  const iconWidth = 40; // Corresponds to h-10/w-10 approx
  const finalWordmarkWidth = 180; // Estimated width of the full logo
  // Increase scale factor further - Adjust this value! Try maybe 1.3?
  const wordmarkScaleFactor = 1.3; 

  useEffect(() => {
    // GSAP Context for safe cleanup
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const allIcons = [
          richBlackIconRef.current,
          bitterSweetIconRef.current,
          poixIconRef.current,
          mindaroIconRef.current,
          keyHoleOutlineRef.current
      ];
      const wordmarks = [
          wordmarkBittersweetRef.current,
          wordmarkPoixRef.current,
          wordmarkMindaroRef.current,
          wordmarkRichBlackRef.current
      ];

      if (wordmarks.some(ref => !ref) || allIcons.some(ref => !ref)) {
          console.warn("AnimatedDomentraLogo: Refs not ready on mount.");
          return;
      }
      
      // Initialize the timeline
      tl.current = gsap.timeline({
        // Repeat indefinitely, add delay between repeats
        repeat: -1, 
        repeatDelay: 3, 
        paused: true, // Start paused
        defaults: { overwrite: "auto" }, // Prevent overlapping tweens
        // onRepeat callback to cycle wordmark visibility
        onRepeat: () => {
          wordmarkColorIndex.current = (wordmarkColorIndex.current + 1) % wordmarks.length;
          // On repeat, ensure only the CURRENT target wordmark is visible before the next loop starts revealing it.
          // NOTE: The actual reveal happens in the main timeline sequence.
          gsap.set(wordmarks, { autoAlpha: 0 });
          // We don't set the next one visible here, the timeline does it.
        }
      });

      // --- Timeline Definition --- 
      const initialX = finalWordmarkWidth - iconWidth;
      // Recalculate clip path based on the NEW scale factor
      const scaledWordmarkVisibleWidth = finalWordmarkWidth * wordmarkScaleFactor;
      const effectiveIconWidth = iconWidth * wordmarkScaleFactor; // Estimate visual width of 'D' in scaled wordmark
      const iconRevealWidthPercent = (effectiveIconWidth / scaledWordmarkVisibleWidth) * 100;

      // Initial State (Force elements to starting positions/opacity BEFORE animation starts)
      gsap.set(containerRef.current, { autoAlpha: 1}); // Make container visible
      // Hide ALL wordmarks initially, set clip-path to hide 'omentra' part
      gsap.set(wordmarks, { 
        autoAlpha: 0, 
        x: 0, 
        y: 0, 
        scale: wordmarkScaleFactor, // Apply NEW scale factor
        transformOrigin: 'left center', // Scale from left-center
        clipPath: `inset(0 ${100 - iconRevealWidthPercent}% 0 0)` // Initially only show the 'D' part area
      }); 
      gsap.set(allIcons, { // Set ALL icons+outline initial state
        autoAlpha: 0, 
        rotation: 90, 
        x: initialX, 
        scale: 1, 
        transformOrigin: 'center center' 
      });
      gsap.set(keyHoleOutlineRef.current, { scale: 0.25 }); // Apply specific scale to outline
      gsap.set(richBlackIconRef.current, { autoAlpha: 1 }); // Make STARTING icon visible
      
      // Build the timeline
      tl.current
        // 1. UNLOCK SEQUENCE (Slower Rotation: 1.0s)
        .addLabel("start")
        .to(richBlackIconRef.current, { duration: 0.15, scale: 1.05, repeat: 1, yoyo: true, ease: "power1.inOut" }, "start+=0.1") // Pulse starts slightly after container visible
        .to(keyHoleOutlineRef.current, { duration: 0.2, autoAlpha: 0.8, ease: "power2.out" }, "start+=0.15") // Show outline
        .to(allIcons, { duration: 1.0, rotation: 0, ease: "back.out(1.7)", x: initialX }, "start+=0.25") // Rotate all
        .to(richBlackIconRef.current, { duration: 0.2, autoAlpha: 0, ease: "power1.in" }, "start+=0.85") // Fade out black
        .to(mindaroIconRef.current, { duration: 0.2, autoAlpha: 1, ease: "power1.out" }, "start+=0.85") // Fade in mindaro
        .to(keyHoleOutlineRef.current, { duration: 0.2, autoAlpha: 0, ease: "power2.in" }, "start+=0.95") // Fade out outline

        // 2. POSITION SHIFT (Slower Slide: 1.5s)
        .addLabel("slide", "-=0.1") // Overlap slightly with previous step
        .to([mindaroIconRef.current, poixIconRef.current, bitterSweetIconRef.current], { duration: 1.5, x: 0, ease: "power2.inOut" }, "slide")
        .to(mindaroIconRef.current, { duration: 0.4, autoAlpha: 0, ease: "power1.in" }, "slide+=0.3")
        .to(poixIconRef.current, { duration: 0.4, autoAlpha: 1, ease: "power1.out" }, "slide+=0.3")
        .to(poixIconRef.current, { duration: 0.4, autoAlpha: 0, ease: "power1.in" }, "slide+=0.8")
        .to(bitterSweetIconRef.current, { duration: 0.4, autoAlpha: 1, ease: "power1.out" }, "slide+=0.8")

        // 3. WORDMARK COMPLETION (Slower Reveal: 1.0s, No Zoom)
        .addLabel("reveal", "-=0.1") // Overlap slightly
        .to(bitterSweetIconRef.current, { duration: 0.3, autoAlpha: 0, ease: "power1.in" }, "reveal")
        // Fade in the *correct* wordmark for this loop iteration (NO scale animation)
        .set(wordmarks[wordmarkColorIndex.current], { autoAlpha: 1 }, "reveal+=0.1") 
        // Animate the clip-path to reveal 'omentra' left-to-right (slower reveal: 1.0s)
        .to(wordmarks[wordmarkColorIndex.current], { 
            duration: 1.0, 
            clipPath: 'inset(0 0% 0 0)', // Reveal fully
            ease: "power2.out" 
        }, "reveal+=0.1");

      // Start the animation after a short delay
      const playTimeout = setTimeout(() => {
        tl.current?.play();
      }, 500);

    }, containerRef); // Scope GSAP context to the container

    // Cleanup function
    return () => {
      //clearTimeout(playTimeout); // Timeout cleared by context revert
      ctx.revert(); // Kill timeline and revert animations
    };
  }, []); // Empty dependency array ensures runs once on mount

  return (
    // Increase container width to accommodate the larger scaled wordmark
    <div ref={containerRef} className={`relative h-10 md:h-12 opacity-0 ${className}`} style={{ width: `${finalWordmarkWidth * wordmarkScaleFactor * 0.9}px` /* Adjust width based on scale */ }}>
      {/* Link wraps everything */}
      <Link to="/" className="absolute inset-0 block h-full w-full" aria-label="Domentra Home">
        {/* Final Wordmarks - Positioned top-left, hidden initially, visibility toggled by GSAP */}
        <img ref={wordmarkBittersweetRef} src={wordmarkBittersweet} alt="Domentra" className="absolute top-0 left-0 h-full w-auto opacity-0" style={{ transformOrigin: 'left center' /* Scale from left */ }}/>
        <img ref={wordmarkPoixRef} src={wordmarkPoix} alt="Domentra" className="absolute top-0 left-0 h-full w-auto opacity-0" style={{ transformOrigin: 'left center' }}/>
        <img ref={wordmarkMindaroRef} src={wordmarkMindaro} alt="Domentra" className="absolute top-0 left-0 h-full w-auto opacity-0" style={{ transformOrigin: 'left center' }}/>
        <img ref={wordmarkRichBlackRef} src={wordmarkRichBlack} alt="Domentra" className="absolute top-0 left-0 h-full w-auto opacity-0" style={{ transformOrigin: 'left center' }}/>
        
        {/* Outline - Initially hidden & scaled by GSAP */}
        <img ref={keyHoleOutlineRef} src={keyHoleOutline} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        {/* Icons - Initially hidden by GSAP, except richBlackIconRef */}
        <img ref={richBlackIconRef} src={richBlackIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        <img ref={bitterSweetIconRef} src={bitterSweetIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        <img ref={poixIconRef} src={poixIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
        <img ref={mindaroIconRef} src={mindaroIcon} alt="" className="absolute top-0 left-0 h-10 w-10 opacity-0" aria-hidden="true"/>
      </Link>
    </div>
  );
};

export default AnimatedDomentraLogo; 