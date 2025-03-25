import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiFileText, FiCheckSquare, FiLifeBuoy, FiDollarSign } from 'react-icons/fi';
import IconWrapper from '../atoms/IconWrapper';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Declare emitParticleBurst globally
declare global {
  interface Window {
    emitParticleBurst?: (x: number, y: number, count: number, color: string) => void;
  }
}

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const MoneyMolecule: React.FC = () => {
  // Main refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moleculeRef = useRef<SVGGElement>(null);
  const pathsRef = useRef<SVGGElement>(null);
  const nodesRef = useRef<SVGGElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // State for responsive handling
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // Reset refs
  stepRefs.current = [];
  
  // Add to refs helper
  const addToStepRefs = (el: HTMLDivElement | null) => {
    if (el && !stepRefs.current.includes(el)) {
      stepRefs.current.push(el);
    }
  };
  
  // Step data
  const steps: Step[] = [
    {
      icon: <IconWrapper name="FiFileText" size={24} className="text-white" />,
      title: "Request Funding",
      description: "Submit your funding request through our simple online form to get started quickly"
    },
    {
      icon: <IconWrapper name="FiCheckSquare" size={24} className="text-white" />,
      title: "Funding Terms",
      description: "Receive clear funding terms and agreements tailored to your specific needs"
    },
    {
      icon: <IconWrapper name="FiLifeBuoy" size={24} className="text-white" />,
      title: "Funding Review",
      description: "Our expert team reviews and validates your funding requirements with care"
    },
    {
      icon: <IconWrapper name="FiDollarSign" size={24} className="text-white" />,
      title: "Fast Funding",
      description: "Get your funds within 48 hours or less, directly to your preferred account"
    }
  ];

  // Calculate dimensions and check device type
  const updateDimensions = () => {
    if (!sectionRef.current) return;
    
    const width = sectionRef.current.offsetWidth;
    const height = sectionRef.current.offsetHeight;
    const isMobileView = window.innerWidth < 768;
    
    setDimensions({ width, height });
    setIsMobile(isMobileView);
  };
  
  // Check for reduced motion preference
  const checkReducedMotion = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReducedMotion);
  };
  
  // Create molecule structure
  const createMolecule = () => {
    if (!moleculeRef.current) return;
    
    // Clear previous content
    moleculeRef.current.innerHTML = '';
    
    // Create main nodes (larger circles)
    const centerX = isMobile ? dimensions.width / 2 : dimensions.width * 0.15;
    const centerY = isMobile ? 120 : dimensions.height * 0.5;
    const numberOfMainNodes = 6;
    const mainNodes: SVGCircleElement[] = [];
    
    for (let i = 0; i < numberOfMainNodes; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      
      // Position nodes in a circular pattern
      const angle = (i / numberOfMainNodes) * Math.PI * 2;
      const radius = 40;
      const cx = centerX + Math.cos(angle) * radius;
      const cy = centerY + Math.sin(angle) * radius;
      
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', '12');
      circle.setAttribute('fill', 'url(#moleculeGradient)');
      circle.setAttribute('class', 'molecule-node main-node');
      circle.setAttribute('filter', 'url(#glow)');
      
      moleculeRef.current.appendChild(circle);
      mainNodes.push(circle);
    }
    
    // Create connector nodes (smaller circles)
    const numberOfConnectors = 12;
    const connectorNodes: SVGCircleElement[] = [];
    
    for (let i = 0; i < numberOfConnectors; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      
      // Position between main nodes, with slight variation
      const angle = ((i / numberOfConnectors) * Math.PI * 2) + (Math.PI / numberOfMainNodes);
      const radius = 30 + Math.random() * 15;
      const cx = centerX + Math.cos(angle) * radius;
      const cy = centerY + Math.sin(angle) * radius;
      
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', 'url(#connectorGradient)');
      circle.setAttribute('class', 'molecule-node connector-node');
      
      moleculeRef.current.appendChild(circle);
      connectorNodes.push(circle);
    }
    
    // Create inner detail nodes
    const numberOfDetailNodes = 8;
    
    for (let i = 0; i < numberOfDetailNodes; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      
      // Position within the main structure
      const angle = ((i / numberOfDetailNodes) * Math.PI * 2);
      const radius = 18 + Math.random() * 10;
      const cx = centerX + Math.cos(angle) * radius;
      const cy = centerY + Math.sin(angle) * radius;
      
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', 'rgba(255, 255, 255, 0.5)');
      circle.setAttribute('class', 'molecule-node detail-node');
      
      moleculeRef.current.appendChild(circle);
    }
    
    // Create connecting lines between main nodes
    for (let i = 0; i < mainNodes.length; i++) {
      for (let j = i + 1; j < mainNodes.length; j++) {
        // Connect main nodes with each other
        if (Math.random() > 0.3) continue; // Skip some connections
        
        const node1 = mainNodes[i];
        const node2 = mainNodes[j];
        
        const x1 = parseFloat(node1.getAttribute('cx') || '0');
        const y1 = parseFloat(node1.getAttribute('cy') || '0');
        const x2 = parseFloat(node2.getAttribute('cx') || '0');
        const y2 = parseFloat(node2.getAttribute('cy') || '0');
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1.toString());
        line.setAttribute('y1', y1.toString());
        line.setAttribute('x2', x2.toString());
        line.setAttribute('y2', y2.toString());
        line.setAttribute('stroke', 'url(#pathGradient)');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-opacity', '0.6');
        line.setAttribute('class', 'molecule-connection main-connection');
        
        if (moleculeRef.current) {
          moleculeRef.current.insertBefore(line, moleculeRef.current.firstChild);
        }
      }
    }
    
    // Connect main nodes to nearby connector nodes
    mainNodes.forEach(mainNode => {
      connectorNodes.forEach(connectorNode => {
        const x1 = parseFloat(mainNode.getAttribute('cx') || '0');
        const y1 = parseFloat(mainNode.getAttribute('cy') || '0');
        const x2 = parseFloat(connectorNode.getAttribute('cx') || '0');
        const y2 = parseFloat(connectorNode.getAttribute('cy') || '0');
        
        // Calculate distance
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Connect if close and randomly (for variety)
        if (distance < 40 && Math.random() > 0.3) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x1.toString());
          line.setAttribute('y1', y1.toString());
          line.setAttribute('x2', x2.toString());
          line.setAttribute('y2', y2.toString());
          line.setAttribute('stroke', 'url(#pathGradient)');
          line.setAttribute('stroke-width', '1.5');
          line.setAttribute('stroke-opacity', '0.4');
          line.setAttribute('class', 'molecule-connection connector-connection');
          
          if (moleculeRef.current) {
            moleculeRef.current.insertBefore(line, moleculeRef.current.firstChild);
          }
        }
      });
    });
    
    // Add central pulsing core
    const centralCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centralCore.setAttribute('cx', centerX.toString());
    centralCore.setAttribute('cy', centerY.toString());
    centralCore.setAttribute('r', '15');
    centralCore.setAttribute('fill', 'url(#coreGradient)');
    centralCore.setAttribute('class', 'molecule-core');
    centralCore.setAttribute('filter', 'url(#coreGlow)');
    
    if (moleculeRef.current) {
      moleculeRef.current.appendChild(centralCore);
    }
    
    // Create energy strands (curved paths)
    const numberOfStrands = 6;
    
    for (let i = 0; i < numberOfStrands; i++) {
      const strand = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      const angle = (i / numberOfStrands) * Math.PI * 2;
      const endX = centerX + Math.cos(angle) * 25;
      const endY = centerY + Math.sin(angle) * 25;
      
      // Control points for bezier curve
      const cp1x = centerX + Math.cos(angle + 0.2) * 10;
      const cp1y = centerY + Math.sin(angle + 0.2) * 10;
      const cp2x = endX - Math.cos(angle) * 5;
      const cp2y = endY - Math.sin(angle) * 5;
      
      const pathData = `M ${centerX},${centerY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
      
      strand.setAttribute('d', pathData);
      strand.setAttribute('fill', 'none');
      strand.setAttribute('stroke', 'url(#energyGradient)');
      strand.setAttribute('stroke-width', '1.5');
      strand.setAttribute('class', 'energy-strand');
      
      if (moleculeRef.current) {
        moleculeRef.current.appendChild(strand);
      }
    }
  };
  
  // Create step nodes and connecting paths
  const createPathsAndNodes = () => {
    if (!pathsRef.current || !nodesRef.current) return;
    
    // Clear previous content
    pathsRef.current.innerHTML = '';
    nodesRef.current.innerHTML = '';
    
    // Calculate positions
    const centerX = isMobile ? dimensions.width / 2 : dimensions.width * 0.15;
    const centerY = isMobile ? 120 : dimensions.height * 0.5;
    
    // Calculate step positions
    const stepPositions = steps.map((_, index) => {
      if (isMobile) {
        // Vertical layout
        return {
          x: dimensions.width / 2,
          y: 200 + (index * 150)
        };
      } else {
        // Horizontal layout
        const startX = dimensions.width * 0.3;
        const stepWidth = (dimensions.width * 0.6) / 4;
        return {
          x: startX + (index * stepWidth),
          y: dimensions.height * 0.5
        };
      }
    });
    
    // Create paths connecting central molecule to steps
    steps.forEach((_, index) => {
      let startX, startY, endX, endY;
      
      if (index === 0) {
        // First step connects from molecule
        startX = centerX;
        startY = centerY;
      } else {
        // Other steps connect from previous step
        startX = stepPositions[index - 1].x;
        startY = stepPositions[index - 1].y;
      }
      
      endX = stepPositions[index].x;
      endY = stepPositions[index].y;
      
      // Create path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Calculate control points for curve
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const curveAmplitude = 30 + (index * 10);
      
      // Create path with curves
      const pathData = `
        M ${startX} ${startY}
        C ${startX + curveAmplitude} ${startY - curveAmplitude},
          ${midX - curveAmplitude} ${midY + curveAmplitude},
          ${midX} ${midY}
        S ${endX - curveAmplitude} ${endY + curveAmplitude},
          ${endX} ${endY}
      `;
      
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'url(#pathGradient)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('class', `step-path path-${index}`);
      
      // Safe append with null check
      if (pathsRef.current) {
        pathsRef.current.appendChild(path);
      }
      
      // Create node at end of path
      const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.setAttribute('cx', endX.toString());
      node.setAttribute('cy', endY.toString());
      node.setAttribute('r', '20');
      node.setAttribute('fill', 'url(#nodeGradient)');
      node.setAttribute('class', `step-node node-${index}`);
      
      // Safe append with null check
      if (nodesRef.current) {
        nodesRef.current.appendChild(node);
      }
    });
  };
  
  // Setup particle system on canvas
  const setupParticleSystem = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Particle system configuration
    const particles: any[] = [];
    const backgroundParticles: any[] = [];
    const particleCount = isMobile ? 30 : 50;
    const backgroundParticleCount = isMobile ? 15 : 30;
    
    // Create main particles (red molecular particles)
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: `rgba(${155 + Math.floor(Math.random() * 100)}, 0, 0, ${0.1 + Math.random() * 0.2})`,
        type: 'molecular',
        life: 1,
        maxLife: 1
      });
    }
    
    // Create financial data particles (tiny squares and circles)
    for (let i = 0; i < backgroundParticleCount; i++) {
      const isSquare = Math.random() > 0.5;
      backgroundParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: `rgba(220, 220, 220, ${0.1 + Math.random() * 0.1})`,
        type: isSquare ? 'square' : 'circle',
        life: 1,
        maxLife: 1,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        rotation: Math.random() * Math.PI * 2
      });
    }
    
    // Create market chart patterns in the background
    const chartLines: any[] = [];
    const numChartLines = 4;
    
    for (let i = 0; i < numChartLines; i++) {
      const startX = Math.random() * canvas.width;
      const startY = 100 + Math.random() * (canvas.height - 200);
      const points: Array<{x: number, y: number}> = [];
      const numPoints = 10 + Math.floor(Math.random() * 10);
      const lineWidth = 0.5 + Math.random() * 0.5;
      const opacity = 0.03 + Math.random() * 0.05;
      
      // Generate a chart-like line
      for (let j = 0; j < numPoints; j++) {
        const x = startX + (j / numPoints) * 300;
        // Create a random but chart-like movement
        const y = startY + Math.sin(j * 0.5) * 20 + (Math.random() - 0.5) * 30;
        points.push({ x, y });
      }
      
      chartLines.push({ 
        points, 
        lineWidth, 
        color: `rgba(200, 200, 200, ${opacity})`,
        dashOffset: 0,
        speed: 0.2 + Math.random() * 0.3
      });
    }
    
    // Animation loop for particles
    const animateParticles = () => {
      if (isReducedMotion) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle grid pattern
      ctx.beginPath();
      ctx.strokeStyle = "rgba(200, 200, 200, 0.05)";
      ctx.lineWidth = 0.5;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      
      ctx.stroke();
      
      // Draw chart lines
      chartLines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.lineWidth;
        
        if (line.points.length > 0) {
          ctx.moveTo(line.points[0].x, line.points[0].y);
          
          for (let i = 1; i < line.points.length; i++) {
            ctx.lineTo(line.points[i].x, line.points[i].y);
          }
        }
        
        // Animate the dash offset for a subtle flow effect
        ctx.setLineDash([4, 2]);
        line.dashOffset += line.speed;
        ctx.lineDashOffset = line.dashOffset;
        
        ctx.stroke();
      });
      
      // Update and draw main particles
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Create occasional clusters of particles
        if (Math.random() < 0.01) {
          p.speedX = p.speedX * 0.8 + (Math.random() - 0.5) * 1;
          p.speedY = p.speedY * 0.8 + (Math.random() - 0.5) * 1;
        }
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Occasionally create energy trail
        if (Math.random() < 0.03 && p.size > 2) {
          const trail = {
            x: p.x,
            y: p.y,
            size: p.size * 0.5,
            speedX: p.speedX * 0.2,
            speedY: p.speedY * 0.2,
            color: p.color,
            type: 'trail',
            life: 1,
            maxLife: 1
          };
          particles.push(trail);
        }
      }
      
      // Update and draw background particles (financial data)
      for (const p of backgroundParticles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle based on type
        ctx.fillStyle = p.color;
        
        if (p.type === 'square') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Occasionally change direction to simulate financial data flow
        if (Math.random() < 0.01) {
          p.speedX = (Math.random() - 0.5) * 1;
          p.speedY = (Math.random() - 0.5) * 1;
        }
      }
      
      // Remove trail particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].type === 'trail') {
          particles[i].life -= 0.05;
          particles[i].size *= 0.95;
          
          if (particles[i].life <= 0) {
            particles.splice(i, 1);
          }
        }
      }
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    
    // Function to emit particle bursts
    const emitParticleBurst = (x: number, y: number, count: number, color: string) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;
        const size = 1 + Math.random() * 3;
        
        particles.push({
          x,
          y,
          size,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          color,
          type: 'burst',
          life: 1,
          maxLife: 1
        });
      }
    };
    
    // Expose particle burst function to window for use from GSAP callbacks
    (window as any).emitParticleBurst = emitParticleBurst;
  };
  
  // Initialize and handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const ctx = gsap.context(() => {
      // Fade-in for the title with text reveal effect
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%"
          }
        }
      );
      
      // Staggered entrance for the steps with cleaner animation
      gsap.fromTo(stepRefs.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 70%"
          }
        }
      );
      
      // Line connector animation
      gsap.fromTo('.connector',
        { width: 0 },
        { 
          width: '100%', 
          duration: 1.2, 
          delay: 0.3,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 70%"
          }
        }
      );
    }, sectionRef);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 relative z-10">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-20"
        >
          How <span className="text-accent bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Funding</span> Works
        </h2>
        
        <div 
          ref={stepsRef}
          className={`relative ${isMobile ? 'flex flex-col space-y-12' : 'flex flex-row justify-between items-start'}`}
        >
          {!isMobile && (
            <div className="absolute top-24 left-0 right-0 h-[2px] bg-gray-200 z-0">
              <div className="connector h-full bg-gradient-to-r from-accent to-primary"></div>
            </div>
          )}
          
          {steps.map((step, index) => (
            <div
              key={index}
              ref={addToStepRefs}
              className={`relative z-10 transition-all duration-300 ${
                isMobile ? 'w-full' : 'w-1/4 px-5'
              }`}
            >
              {isMobile && index > 0 && (
                <div className="absolute top-0 left-8 w-[2px] h-12 -mt-12 bg-gradient-to-b from-accent to-primary"></div>
              )}
              
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full border-t-4 border-accent">
                <div className="step-number absolute -top-8 left-6 text-accent font-bold text-3xl">
                  {index + 1}.
                </div>
                
                <div className="flex flex-col h-full">
                  <div className="step-icon w-16 h-16 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center mb-5 shadow-md transform transition-transform duration-300 hover:scale-105">
                    {step.icon}
                  </div>
                  
                  <div className="step-content flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="#request-funding" 
            className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-accent to-primary text-white font-semibold transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
          >
            Request Funding Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default MoneyMolecule; 