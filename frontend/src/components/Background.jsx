import { useEffect, useRef } from 'react';

// Inline styles instead of CSS file for portability
const styles = `
  .bg-canvas-wrap {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .bg-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  /* Ultra-fine grain overlay for depth */
  .bg-grain {
    position: absolute;
    inset: -50%;
    width: 200%;
    height: 200%;
    opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    animation: grainDrift 12s linear infinite;
    pointer-events: none;
  }
  @keyframes grainDrift {
    0% { transform: translate(0, 0); }
    20% { transform: translate(-2%, -3%); }
    40% { transform: translate(2%, -1%); }
    60% { transform: translate(-1%, 2%); }
    80% { transform: translate(3%, -2%); }
    100% { transform: translate(0, 0); }
  }
  /* Corner brackets */
  .corner {
    position: fixed;
    z-index: 5;
    pointer-events: none;
    opacity: 0;
    animation: cornerFadeIn 3s ease forwards;
  }
  .corner-tl { top: 20px; left: 20px; animation-delay: 0.5s; }
  .corner-tr { top: 20px; right: 20px; animation-delay: 0.8s; }
  .corner-bl { bottom: 20px; left: 20px; animation-delay: 1.1s; }
  .corner-br { bottom: 20px; right: 20px; animation-delay: 1.4s; }
  @keyframes cornerFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  /* Breathing glow at corners */
  .corner svg {
    animation: cornerBreath 6s ease-in-out infinite;
  }
  .corner-tr svg { animation-delay: 1.5s; }
  .corner-bl svg { animation-delay: 3s; }
  .corner-br svg { animation-delay: 4.5s; }
  @keyframes cornerBreath {
    0%, 100% { opacity: 0.25; }
    50% { opacity: 0.55; }
  }
`;

export default function Background() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // ─── ORBS (large slow-moving nebula blobs) ───────────────────────────────
    // These are the backbone — deep, breathing, gorgeous
    const orbs = [
      { x: W * 0.15, y: H * 0.25, r: H * 0.55, color: '#003366', phase: 0,    speedX: 0.00008, speedY: 0.00005 },
      { x: W * 0.80, y: H * 0.60, r: H * 0.50, color: '#001a3d', phase: 1.2,  speedX: -0.00007, speedY: 0.00009 },
      { x: W * 0.50, y: H * 0.85, r: H * 0.45, color: '#06002a', phase: 2.4,  speedX: 0.00006, speedY: -0.00004 },
      { x: W * 0.70, y: H * 0.15, r: H * 0.40, color: '#001430', phase: 3.6,  speedX: -0.00005, speedY: 0.00007 },
      { x: W * 0.30, y: H * 0.70, r: H * 0.35, color: '#00102a', phase: 4.8,  speedX: 0.00009, speedY: -0.00006 },
    ];

    // ─── LUMINOUS FILAMENTS (thin drifting light threads) ────────────────────
    class Filament {
      constructor(initial = false) { this.init(initial); }
      init(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : H + 20;
        this.length = Math.random() * 80 + 40;
        this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
        this.speed = Math.random() * 0.12 + 0.04;
        this.drift = (Math.random() - 0.5) * 0.06;
        this.life = 0;
        this.maxLife = Math.random() * 600 + 300;
        this.alpha = 0;
        this.targetAlpha = Math.random() * 0.18 + 0.04;
        // Restrict palette: deep teals, soft violets, cold blues — NO yellows/pinks
        const hues = [
          'rgba(100,220,255,',   // icy blue
          'rgba(80,180,240,',    // sky blue
          'rgba(140,100,255,',   // soft violet
          'rgba(60,200,220,',    // teal
          'rgba(180,140,255,',   // lavender
          'rgba(40,160,200,',    // deep teal
        ];
        this.color = hues[Math.floor(Math.random() * hues.length)];
        this.width = Math.random() * 1.2 + 0.3;
      }
      update() {
        this.y += this.speed * Math.sin(this.angle + Math.PI / 2);
        this.x += this.drift;
        this.life++;
        const p = this.life / this.maxLife;
        if (p < 0.12) this.alpha = (p / 0.12) * this.targetAlpha;
        else if (p > 0.75) this.alpha = ((1 - p) / 0.25) * this.targetAlpha;
        else this.alpha = this.targetAlpha;
        if (this.life >= this.maxLife || this.y < -this.length) this.init();
      }
      draw() {
        const ex = this.x + Math.cos(this.angle) * this.length;
        const ey = this.y + Math.sin(this.angle) * this.length;
        const grad = ctx.createLinearGradient(this.x, this.y, ex, ey);
        grad.addColorStop(0, this.color + '0)');
        grad.addColorStop(0.4, this.color + this.alpha.toFixed(2) + ')');
        grad.addColorStop(1, this.color + '0)');
        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.shadowColor = this.color + '0.3)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.restore();
      }
    }

    // ─── MICRO PARTICLES (subtle floating motes) ─────────────────────────────
    class Mote {
      constructor(initial = false) { this.init(initial); }
      init(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : H + 5;
        this.r = Math.random() * 1.2 + 0.2;
        this.speedY = -(Math.random() * 0.18 + 0.04);
        this.speedX = (Math.random() - 0.5) * 0.08;
        this.life = 0;
        this.maxLife = Math.random() * 700 + 400;
        this.alpha = 0;
        this.targetAlpha = Math.random() * 0.45 + 0.08;
        this.breathPhase = Math.random() * Math.PI * 2;
        this.breathSpeed = Math.random() * 0.008 + 0.003;
        const palette = ['#7edfff', '#a5b8ff', '#c0a0ff', '#6ecfff', '#90d4ff'];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.breathPhase += this.breathSpeed;
        this.life++;
        const p = this.life / this.maxLife;
        const breath = 0.85 + 0.15 * Math.sin(this.breathPhase);
        if (p < 0.08) this.alpha = (p / 0.08) * this.targetAlpha * breath;
        else if (p > 0.82) this.alpha = ((1 - p) / 0.18) * this.targetAlpha * breath;
        else this.alpha = this.targetAlpha * breath;
        if (this.life >= this.maxLife || this.y < -10) this.init();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const filaments = Array.from({ length: 60 }, (_, i) => new Filament(true));
    const motes = Array.from({ length: 90 }, () => new Mote(true));

    // ─── AURORA CURTAINS ─────────────────────────────────────────────────────
    // Slow, sinuous horizontal bands — no blinking
    const curtains = [
      {
        baseY: 0.30, amp: 0.08, freq: 0.0004, phase: 0,
        color1: [0, 180, 255], color2: [80, 60, 200], opacity: 0.028
      },
      {
        baseY: 0.55, amp: 0.06, freq: 0.0003, phase: 2.1,
        color1: [60, 80, 200], color2: [0, 160, 220], opacity: 0.022
      },
      {
        baseY: 0.72, amp: 0.05, freq: 0.00025, phase: 4.2,
        color1: [100, 40, 180], color2: [0, 140, 200], opacity: 0.018
      },
    ];

    function drawCurtain(c, t) {
      const cy = H * (c.baseY + Math.sin(t * c.freq + c.phase) * c.amp);
      const bandH = H * 0.22;
      const grad = ctx.createLinearGradient(0, cy - bandH, 0, cy + bandH);
      grad.addColorStop(0, `rgba(${c.color1},0)`);
      grad.addColorStop(0.35, `rgba(${c.color1},${c.opacity})`);
      grad.addColorStop(0.65, `rgba(${c.color2},${c.opacity * 0.7})`);
      grad.addColorStop(1, `rgba(${c.color2},0)`);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      // Wavy path for curtain
      ctx.beginPath();
      const segs = 24;
      for (let i = 0; i <= segs; i++) {
        const px = (i / segs) * W;
        const py = cy + Math.sin(i * 0.6 + t * 0.00035 + c.phase) * H * 0.03
                      + Math.sin(i * 1.1 + t * 0.00020 + c.phase * 1.5) * H * 0.015;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.lineTo(W, cy + bandH * 1.5);
      ctx.lineTo(0, cy + bandH * 1.5);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // ─── DEPTH VIGNETTE ───────────────────────────────────────────────────────
    function drawVignette() {
      const grad = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.1, W * 0.5, H * 0.5, H * 0.9);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.6, 'rgba(0,2,8,0.25)');
      grad.addColorStop(1, 'rgba(0,1,6,0.92)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // ─── MAIN ANIMATE LOOP ────────────────────────────────────────────────────
    function animate(t) {
      ctx.clearRect(0, 0, W, H);

      // 1. Deep background gradient
      const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
      bg.addColorStop(0, '#000a18');
      bg.addColorStop(0.5, '#00050f');
      bg.addColorStop(1, '#010008');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 2. Orbs — large, slow, blurred nebula
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const orb of orbs) {
        const ox = orb.x + Math.sin(t * orb.speedX + orb.phase) * W * 0.06;
        const oy = orb.y + Math.cos(t * orb.speedY + orb.phase) * H * 0.05;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        // Parse hex color to RGB for gradient
        grad.addColorStop(0, orb.color + 'cc'); // center slightly visible
        grad.addColorStop(1, orb.color + '00'); // edge transparent
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Aurora curtains
      curtains.forEach(c => drawCurtain(c, t));

      // 4. Filaments
      filaments.forEach(f => { f.update(); f.draw(); });

      // 5. Motes
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      motes.forEach(m => { m.update(); m.draw(); });
      ctx.restore();

      // 6. Vignette (last — frames everything)
      drawVignette();

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      // Reposition orbs proportionally
      orbs[0].x = W * 0.15; orbs[0].y = H * 0.25; orbs[0].r = H * 0.55;
      orbs[1].x = W * 0.80; orbs[1].y = H * 0.60; orbs[1].r = H * 0.50;
      orbs[2].x = W * 0.50; orbs[2].y = H * 0.85; orbs[2].r = H * 0.45;
      orbs[3].x = W * 0.70; orbs[3].y = H * 0.15; orbs[3].r = H * 0.40;
      orbs[4].x = W * 0.30; orbs[4].y = H * 0.70; orbs[4].r = H * 0.35;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="bg-canvas-wrap">
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="bg-grain" />

      {/* Refined corner brackets */}
      <div className="corner corner-tl">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M0 36 L0 0 L36 0" stroke="rgba(80,180,255,0.35)" strokeWidth="1" fill="none"/>
          <path d="M4 32 L4 4 L32 4" stroke="rgba(80,180,255,0.10)" strokeWidth="0.5" fill="none"/>
          <circle cx="0" cy="0" r="2" fill="rgba(100,200,255,0.5)"/>
        </svg>
      </div>
      <div className="corner corner-tr">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{transform:'scaleX(-1)'}}>
          <path d="M0 36 L0 0 L36 0" stroke="rgba(80,180,255,0.35)" strokeWidth="1" fill="none"/>
          <path d="M4 32 L4 4 L32 4" stroke="rgba(80,180,255,0.10)" strokeWidth="0.5" fill="none"/>
          <circle cx="0" cy="0" r="2" fill="rgba(100,200,255,0.5)"/>
        </svg>
      </div>
      <div className="corner corner-bl">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{transform:'scaleY(-1)'}}>
          <path d="M0 36 L0 0 L36 0" stroke="rgba(80,180,255,0.35)" strokeWidth="1" fill="none"/>
          <path d="M4 32 L4 4 L32 4" stroke="rgba(80,180,255,0.10)" strokeWidth="0.5" fill="none"/>
          <circle cx="0" cy="0" r="2" fill="rgba(100,200,255,0.5)"/>
        </svg>
      </div>
      <div className="corner corner-br">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{transform:'scale(-1)'}}>
          <path d="M0 36 L0 0 L36 0" stroke="rgba(80,180,255,0.35)" strokeWidth="1" fill="none"/>
          <path d="M4 32 L4 4 L32 4" stroke="rgba(80,180,255,0.10)" strokeWidth="0.5" fill="none"/>
          <circle cx="0" cy="0" r="2" fill="rgba(100,200,255,0.5)"/>
        </svg>
      </div>
    </div>
  );
}