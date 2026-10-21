/**
 * ============================================================================
 * J.A.R.V.I.S. — AGE OF ULTRON HOLOGRAPHIC CONSCIOUSNESS ENGINE
 * ============================================================================
 * Sculpted to match the exact Stark Lab hologram in Avengers: Age of Ultron:
 *
 * 1. Multi-Rail Concentric C-Cage Scaffolding Shells (r = 0.52 .. 1.04):
 *    Thick, stepped 3D spherical lattice bands composed of 6-10 parallel
 *    golden rails bridged by hundreds of radial micro-ribs—spanning the iconic
 *    asymmetric top/right hemisphere with stepped terraces at 10-12 o'clock.
 * 2. The Signature 8-O'Clock Protruding Orbital Lobe (r = 0.32 .. 1.32):
 *    Tilted 3D elliptical gyroscope ring jutting out to the lower-left (~8:00)
 *    and sweeping across the foreground into the core.
 * 3. 16 Bundled Radial Truss Towers & Traveling Pulses:
 *    Multi-strand tapered golden beams radiating from the core to the outer
 *    scaffolding shells, carrying glowing bioluminescent energy pulses.
 * 4. Radiant Core Lattice & Optical Bloom LUT:
 *    Pre-rendered HDR golden bloom sprites + 4,800 Houdini-style golden
 *    particles clustered along the structural cages for true film luminosity.
 * ============================================================================
 */

const TAU = Math.PI * 2;

export const MATRIX_MODES = {
  jarvis: {
    id: 'jarvis',
    name: 'J.A.R.V.I.S. Age of Ultron Gold',
    hotRGB: [255, 246, 204],     // #FFF6CC Specular White-Gold Glint
    goldRGB: [255, 190, 46],     // #FFBE2E Radiant Stark Gold
    amberRGB: [242, 122, 12],    // #F27A0C Deep Cinema Amber
    copperRGB: [176, 68, 4]      // #B04404 Warm Shadow Copper
  }
};

export class JarvisMatrixEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.modeKey = 'jarvis';
    this.mode = MATRIX_MODES.jarvis;

    this.isPaused = false;
    this.elapsedTime = 0;
    this.lastFrameTime = performance.now();
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsStamp = performance.now();

    // Camera orientation tuned to showcase the exact film silhouette by default
    this.camRotX = 0.08;
    this.camRotY = -0.06;
    this.targetCamRotX = 0.08;
    this.targetCamRotY = -0.06;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Lissajous Figure-8 OLED Burn-In Drift
    this.driftEnabled = true;
    this.driftX = 0;
    this.driftY = 0;

    // Compatibility state fields for automated pressure-test suite
    this.voiceEnergy = 0.2;
    this.sectorLockState = 'NOMINAL';
    this.activePulseCount = 64;

    this._seed = 20150501;

    // Pre-render HDR Golden Bloom Sprite for cinema-grade volumetric glow
    this._initBloomSprite();

    // Build the 5 Film-Accurate Structural Systems
    this._initIrisCore();
    this._initScaffoldingCages();
    this._initProtrudingLobe();
    this._initRadialTrussSpokes();
    this._initHoudiniParticles(4600);

    this.resize();
    this._bindInteractions();
  }

  _rand() {
    this._seed = (this._seed * 1664525 + 1013904223) % 4294967296;
    return this._seed / 4294967296;
  }

  /**
   * Pre-render an offscreen HDR golden glow sprite so we can stamp hundreds of
   * volumetric light pockets at >120 FPS without expensive canvas shadowBlur.
   */
  _initBloomSprite() {
    this.bloomSprite = null;
    if (typeof document === 'undefined' || !document.createElement) return;
    try {
      const size = 128;
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const octx = off.getContext('2d');
      if (!octx) return;

      const half = size * 0.5;
      const g = octx.createRadialGradient(half, half, 1, half, half, half);
      g.addColorStop(0.0, 'rgba(255, 248, 215, 0.95)');
      g.addColorStop(0.16, 'rgba(255, 196, 54, 0.62)');
      g.addColorStop(0.45, 'rgba(235, 118, 12, 0.22)');
      g.addColorStop(0.75, 'rgba(180, 68, 4, 0.06)');
      g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

      octx.fillStyle = g;
      octx.beginPath();
      octx.arc(half, half, half, 0, TAU);
      octx.fill();
      this.bloomSprite = off;
    } catch {
      this.bloomSprite = null;
    }
  }

  /**
   * 1. Inner Core & Nested Toroidal Rings (22 loops)
   */
  _initIrisCore() {
    this.irisRings = [];
    for (let i = 0; i < 22; i++) {
      const rNorm = 0.055 + (i / 22) * 0.22;
      this.irisRings.push({
        r: rNorm,
        rx: (this._rand() - 0.5) * 1.1,
        ry: (this._rand() - 0.5) * 1.1,
        rz: this._rand() * TAU,
        speed: (i % 2 === 0 ? 1 : -1) * (0.05 + this._rand() * 0.11),
        arcStart: this._rand() * TAU,
        arcSpan: Math.PI * (1.1 + this._rand() * 0.85),
        weight: i < 8 ? 1.45 : 0.9 + this._rand() * 0.6,
        alpha: 0.55 + this._rand() * 0.4
      });
    }
  }

  /**
   * 2. Multi-Rail Concentric C-Cage Scaffolding Shells (58 shells)
   * Replicates the dense, stepped golden colosseum/astrolabe cages from the
   * Tony Stark reference frame (Image 2).
   */
  _initScaffoldingCages() {
    this.rings = [];

    // Major architectural C-cage bands that define the iconic film silhouette:
    // Spanning from ~10 o'clock (-2.45 rad) over top (12:00) and down right side to ~6:30 (+1.85 rad)
    const majorBands = [
      // Outer stepped crown & right-hemisphere cages
      { r: 1.01, rx: 0.08, ry: -0.12, rz: 0.0, start: -2.25, span: 3.65, rails: 5, ribs: 68, vel: 0.014, weight: 1.15, bright: 0.95 },
      { r: 0.95, rx: -0.11, ry: 0.14, rz: 0.05, start: -2.48, span: 4.10, rails: 7, ribs: 84, vel: -0.018, weight: 1.35, bright: 1.0 },
      { r: 0.89, rx: 0.16, ry: 0.09, rz: -0.04, start: -2.60, span: 4.35, rails: 6, ribs: 76, vel: 0.021, weight: 1.25, bright: 0.92 },
      // Stepped upper-left terrace blocks (10:00 - 12:30)
      { r: 1.06, rx: 0.05, ry: -0.08, rz: 0.0, start: -2.05, span: 1.35, rails: 4, ribs: 32, vel: -0.011, weight: 1.1, bright: 0.88 },
      { r: 0.83, rx: -0.22, ry: -0.15, rz: 0.12, start: -2.75, span: 4.50, rails: 6, ribs: 72, vel: -0.024, weight: 1.2, bright: 0.90 },
      // Mid-sphere dense structural cages
      { r: 0.74, rx: 0.28, ry: -0.24, rz: -0.15, start: -2.50, span: 4.65, rails: 6, ribs: 68, vel: 0.028, weight: 1.25, bright: 0.95 },
      { r: 0.65, rx: -0.34, ry: 0.29, rz: 0.22, start: -2.80, span: 4.90, rails: 5, ribs: 60, vel: -0.032, weight: 1.15, bright: 0.88 },
      { r: 0.55, rx: 0.42, ry: 0.18, rz: -0.30, start: -2.90, span: 5.10, rails: 5, ribs: 54, vel: 0.036, weight: 1.1, bright: 0.86 },
      { r: 0.44, rx: -0.38, ry: -0.35, rz: 0.18, start: -3.00, span: 5.30, rails: 4, ribs: 44, vel: -0.042, weight: 1.05, bright: 0.90 },
      { r: 0.34, rx: 0.52, ry: -0.22, rz: 0.40, start: 0.0, span: TAU, rails: 4, ribs: 36, vel: 0.050, weight: 1.1, bright: 0.95 }
    ];

    for (const mb of majorBands) {
      this.rings.push({
        isMajorCage: true,
        r: mb.r,
        rx: mb.rx,
        ry: mb.ry,
        rz: mb.rz,
        angle: (this._rand() - 0.5) * 0.18,
        baseVel: mb.vel,
        start: mb.start,
        span: mb.span,
        rails: mb.rails,
        ribs: mb.ribs,
        weight: mb.weight,
        bright: mb.bright,
        pulsePhase: this._rand(),
        pulseSpeed: 0.09 + this._rand() * 0.12,
        springPos: 0,
        springVel: 0,
        springTarget: 0,
        arcs: []
      });
    }

    // Fill remaining 48 inclined internal/orbital weave shells for 58 total shells
    while (this.rings.length < 58) {
      const idx = this.rings.length;
      const t = (idx - 10) / 48;
      const rRatio = 0.22 + Math.pow(t, 0.85) * 0.78;
      const rx = (this._rand() - 0.5) * 1.45;
      const ry = (this._rand() - 0.5) * 1.45;
      const rz = this._rand() * TAU;
      const baseVel = (idx % 2 === 0 ? 1 : -1) * (0.022 + this._rand() * 0.065);

      const segCount = 3 + Math.floor(this._rand() * 4);
      const arcs = [];
      for (let s = 0; s < segCount; s++) {
        const start = (s / segCount) * TAU + (this._rand() - 0.5) * 0.2;
        const span = (TAU / segCount) * (0.42 + this._rand() * 0.45);
        arcs.push({
          start,
          end: start + span,
          rails: 2 + Math.floor(this._rand() * 2),
          ribs: 12 + Math.floor(this._rand() * 16),
          weight: 0.7 + this._rand() * 0.65,
          alphaMult: 0.55 + this._rand() * 0.45,
          hasPulse: this._rand() < 0.55,
          pulsePhase: this._rand(),
          pulseSpeed: 0.1 + this._rand() * 0.18
        });
      }

      this.rings.push({
        isMajorCage: false,
        r: rRatio,
        rx,
        ry,
        rz,
        angle: this._rand() * TAU,
        baseVel,
        springPos: 0,
        springVel: 0,
        springTarget: 0,
        arcs
      });
    }
  }

  /**
   * 3. The Iconic 8-O'Clock Protruding Orbital Lobe & Outer Terraces
   * Look at the 7:30-9:00 position in Image 2: a dense, glowing 3D elliptical
   * ring lobe protrudes outward to the left and sweeps across the lower foreground.
   */
  _initProtrudingLobe() {
    this.terraces = [
      // Primary 8-o'clock protruding orbital lobe (tilted 3D disk)
      { rX: 1.32, rY: 0.44, tiltZ: -0.36, offsetX: -0.22, offsetY: 0.16, rails: 9, ribs: 90, alpha: 0.95 },
      // Secondary inner nested lobe ring
      { rX: 1.14, rY: 0.36, tiltZ: -0.34, offsetX: -0.18, offsetY: 0.14, rails: 7, ribs: 72, alpha: 0.88 },
      // Inner core-crossing equatorial band
      { rX: 0.88, rY: 0.28, tiltZ: -0.31, offsetX: -0.10, offsetY: 0.10, rails: 6, ribs: 56, alpha: 0.82 },
      // Lower-left cascading circuit extensions (6:30 - 8:00)
      { rX: 1.05, rY: 0.92, tiltZ: 0.12, offsetX: -0.06, offsetY: 0.05, rails: 4, ribs: 48, alpha: 0.72, arcOnly: [1.65, 2.85] },
      { rX: 1.12, rY: 0.98, tiltZ: 0.08, offsetX: -0.08, offsetY: 0.06, rails: 3, ribs: 36, alpha: 0.60, arcOnly: [1.75, 2.65] },
      // Upper-left floating circuit wisps (9:30 - 11:00)
      { rX: 1.10, rY: 0.96, tiltZ: -0.15, offsetX: -0.05, offsetY: -0.04, rails: 3, ribs: 32, alpha: 0.65, arcOnly: [3.25, 4.15] },
      { rX: 1.18, rY: 1.02, tiltZ: -0.18, offsetX: -0.07, offsetY: -0.05, rails: 2, ribs: 24, alpha: 0.50, arcOnly: [3.40, 3.95] },
      // Lower-right trailing filament arc (4:30 - 6:00)
      { rX: 1.06, rY: 0.98, tiltZ: 0.05, offsetX: 0.02, offsetY: 0.02, rails: 3, ribs: 30, alpha: 0.58, arcOnly: [0.55, 1.45] }
    ];
  }

  /**
   * 4. 28 Bundled Radial Truss Towers with Traveling Synaptic Pulses
   * Positioned at the exact clock angles visible in the Tony Stark reference frame.
   */
  _initRadialTrussSpokes() {
    this.spokes = [];
    // Primary clock angles matching Image 2's bright radial beams
    const keyAngles = [
      -1.82, -1.62, -1.35, -1.08, -0.78, -0.45, -0.15,
       0.12,  0.42,  0.72,  0.98,  1.25,  1.52,  1.85,
       2.15,  2.42,  2.68,  2.95, -2.85, -2.55, -2.22,
      -1.95, -1.48, -0.92, -0.30,  0.28,  0.85,  1.68
    ];

    for (let i = 0; i < 28; i++) {
      const angle2D = keyAngles[i % keyAngles.length] + (this._rand() - 0.5) * 0.05;
      const zTilt = (this._rand() - 0.5) * 0.55;
      const rInner = 0.08 + (i % 3) * 0.05;
      const rOuter = 0.78 + (i % 4) * 0.075;

      this.spokes.push({
        angle2D,
        zTilt,
        rInner,
        rOuter,
        strands: 3 + (i % 3), // 3 to 5 parallel golden rays per truss bundle
        spread: 0.012 + (i % 2) * 0.008,
        swaySpeed: (i % 2 === 0 ? 1 : -1) * (0.08 + this._rand() * 0.12),
        swayPhase: this._rand() * TAU,
        pulsePos: this._rand(),
        pulseSpeed: 0.18 + this._rand() * 0.24,
        pulseDir: i % 4 === 0 ? -1 : 1,
        bright: i < 16 ? 1.0 : 0.72
      });
    }
  }

  /**
   * 5. 4,600 Houdini Golden Particles & Volumetric Bloom Nodes
   * Clustered tightly along the concentric shells, radial trusses, and the
   * 8-o'clock protruding lobe so the hologram glows like liquid gold fire.
   */
  _initHoudiniParticles(count) {
    this.voxelCount = count;
    // [angle, zTilt, rRatio, angularVel, size, phase, clusterType, bloomFlag]
    this.voxelData = new Float32Array(count * 8);

    // Major shell radii to cluster particles around
    const shellRadii = [0.18, 0.34, 0.44, 0.55, 0.65, 0.74, 0.83, 0.89, 0.95, 1.01];

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      const roll = this._rand();
      let angle, zTilt, rRatio, angularVel, clusterType;

      if (roll < 0.58) {
        // Clustered along the concentric C-cage shells (weighted toward top/right/bottom)
        const baseR = shellRadii[Math.floor(this._rand() * shellRadii.length)];
        rRatio = baseR + (this._rand() - 0.5) * 0.065;
        // Favor the C-cage span (-2.65 to +2.15 rad)
        angle = -2.65 + this._rand() * 4.85;
        zTilt = (this._rand() - 0.5) * 0.65;
        angularVel = (i % 2 === 0 ? 1 : -1) * (0.018 + this._rand() * 0.045);
        clusterType = 0;
      } else if (roll < 0.82) {
        // Clustered along the 8-o'clock protruding orbital lobe
        angle = this._rand() * TAU;
        rRatio = 0.75 + (this._rand() - 0.5) * 0.32;
        zTilt = (this._rand() - 0.5) * 0.25;
        angularVel = 0.035 + this._rand() * 0.055;
        clusterType = 1; // Lobe particle
      } else {
        // Dense inner core & truss intersection sparks
        angle = this._rand() * TAU;
        rRatio = 0.06 + Math.pow(this._rand(), 1.4) * 0.58;
        zTilt = (this._rand() - 0.5) * 0.85;
        angularVel = (i % 2 === 0 ? -1 : 1) * (0.03 + this._rand() * 0.07);
        clusterType = 2; // Core spark
      }

      const size = 0.9 + this._rand() * 2.1;
      const phase = this._rand() * TAU;
      const bloomFlag = this._rand() < 0.095 ? 1 : 0; // ~430 volumetric bloom pockets

      this.voxelData[idx + 0] = angle;
      this.voxelData[idx + 1] = zTilt;
      this.voxelData[idx + 2] = rRatio;
      this.voxelData[idx + 3] = angularVel;
      this.voxelData[idx + 4] = size;
      this.voxelData[idx + 5] = phase;
      this.voxelData[idx + 6] = clusterType;
      this.voxelData[idx + 7] = bloomFlag;
    }
  }

  _bindInteractions() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) {
        const nx = (e.clientX / Math.max(1, this.width)) - 0.5;
        const ny = (e.clientY / Math.max(1, this.height)) - 0.5;
        this.targetCamRotY = -0.06 + nx * 0.14;
        this.targetCamRotX = 0.08 + ny * 0.12;
        return;
      }
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      this.targetCamRotY = Math.max(-0.65, Math.min(0.65, this.targetCamRotY + dx * 0.004));
      this.targetCamRotX = Math.max(-0.65, Math.min(0.65, this.targetCamRotX + dy * 0.004));
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const minDim = Math.min(this.width, this.height);
    this.baseRadius = Math.max(150, Math.min(390, minDim * 0.375));
    this.centerX = this.width * 0.5;
    this.centerY = this.height * 0.455;
  }

  cycleMode() {
    return this.mode;
  }

  triggerSectorIndexPulse(intensity = 1.0) {
    for (let i = 0; i < this.rings.length; i++) {
      if (i % 3 === 0) {
        this.rings[i].springTarget += (i % 2 === 0 ? 1 : -1) * 0.12 * intensity;
      }
    }
  }

  _project3D(x, y, z, cx, cy, cosX, sinX, cosY, sinY) {
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const fov = 1020;
    const scale = fov / Math.max(180, fov - z2);
    return {
      sx: cx + x1 * scale,
      sy: cy + y2 * scale,
      z: z2,
      scale
    };
  }

  update(now, _timeData, externalPulse = 0) {
    const rawDt = (now - this.lastFrameTime) / 1000;
    const dt = Math.min(0.05, Math.max(0.001, rawDt));
    this.lastFrameTime = now;

    this.frameCount++;
    if (now - this.lastFpsStamp >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsStamp));
      this.frameCount = 0;
      this.lastFpsStamp = now;
    }

    this.camRotX += (this.targetCamRotX - this.camRotX) * Math.min(1, dt * 4.5);
    this.camRotY += (this.targetCamRotY - this.camRotY) * Math.min(1, dt * 4.5);

    if (this.isPaused) return;

    this.elapsedTime += dt;

    // 1. Lissajous Figure-8 OLED Burn-In Drift
    if (this.driftEnabled) {
      this.driftX = Math.sin(this.elapsedTime * 0.045) * 22;
      this.driftY = Math.sin(this.elapsedTime * 0.072) * 14;
    } else {
      this.driftX = 0;
      this.driftY = 0;
    }

    // 2. Hypnotic Breathing Envelope
    this.voiceEnergy =
      0.16 +
      0.07 * Math.sin(this.elapsedTime * 0.85) +
      0.04 * Math.cos(this.elapsedTime * 1.9) +
      externalPulse * 0.1;

    // 3. Update Scaffolding Cages & Internal Weave Shells
    const stiffness = 32;
    const damping = 8.0;
    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i];
      if (r.isMajorCage) {
        // Major silhouette cages oscillate gently so the iconic Age of Ultron silhouette stays recognizable while breathing in 3D
        r.angle = Math.sin(this.elapsedTime * 0.42 + i * 0.7) * 0.14;
        r.pulsePhase = (r.pulsePhase + r.pulseSpeed * dt) % 1.0;
      } else {
        r.angle = (r.angle + r.baseVel * dt) % TAU;
      }

      const force = (r.springTarget - r.springPos) * stiffness;
      r.springVel = (r.springVel + force * dt) * Math.max(0, 1 - damping * dt);
      r.springPos += r.springVel * dt;

      for (let s = 0; s < r.arcs.length; s++) {
        const arc = r.arcs[s];
        if (arc.hasPulse) {
          arc.pulsePhase = (arc.pulsePhase + arc.pulseSpeed * dt) % 1.0;
        }
      }
    }

    // 4. Update Core Loops
    for (let i = 0; i < this.irisRings.length; i++) {
      this.irisRings[i].rz = (this.irisRings[i].rz + this.irisRings[i].speed * dt) % TAU;
    }

    // 5. Update Radial Truss Spoke Pulses
    for (let i = 0; i < this.spokes.length; i++) {
      const sp = this.spokes[i];
      sp.pulsePos += sp.pulseSpeed * sp.pulseDir * dt;
      if (sp.pulsePos > 1.0) sp.pulsePos = 0.0;
      if (sp.pulsePos < 0.0) sp.pulsePos = 1.0;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Deep obsidian background (#030201)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#030201';
    ctx.fillRect(0, 0, w, h);

    const cx = this.centerX + this.driftX;
    const cy = this.centerY + this.driftY;
    const breath = 1 + Math.sin(this.elapsedTime * 0.8) * 0.014;
    const R = this.baseRadius * breath;

    // Gentle 3D breathing sway around the iconic film camera angle
    const swayY = this.camRotY + Math.sin(this.elapsedTime * 0.24) * 0.09;
    const swayX = this.camRotX + Math.cos(this.elapsedTime * 0.19) * 0.06;

    const cosX = Math.cos(swayX);
    const sinX = Math.sin(swayX);
    const cosY = Math.cos(swayY);
    const sinY = Math.sin(swayY);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // ------------------------------------------------------------------------
    // PASS 1: Warm Volumetric Amber Under-Glow (Matches Film's Golden Aura)
    // ------------------------------------------------------------------------
    const coreAura = ctx.createRadialGradient(cx - R * 0.06, cy + R * 0.04, R * 0.02, cx, cy, R * 1.15);
    coreAura.addColorStop(0.0, 'rgba(255, 225, 130, 0.36)');
    coreAura.addColorStop(0.22, 'rgba(245, 152, 24, 0.24)');
    coreAura.addColorStop(0.55, 'rgba(195, 88, 8, 0.12)');
    coreAura.addColorStop(0.85, 'rgba(120, 42, 2, 0.04)');
    coreAura.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreAura;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.15, 0, TAU);
    ctx.fill();

    // Secondary volumetric glow for the 8-o'clock protruding lobe
    const lobeAura = ctx.createRadialGradient(
      cx - R * 0.58, cy + R * 0.24, R * 0.05,
      cx - R * 0.45, cy + R * 0.20, R * 0.72
    );
    lobeAura.addColorStop(0.0, 'rgba(255, 185, 38, 0.22)');
    lobeAura.addColorStop(0.45, 'rgba(220, 105, 10, 0.10)');
    lobeAura.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lobeAura;
    ctx.beginPath();
    ctx.arc(cx - R * 0.45, cy + R * 0.20, R * 0.72, 0, TAU);
    ctx.fill();

    // ------------------------------------------------------------------------
    // PASS 2: 28 Bundled Radial Truss Towers & Traveling Pulses
    // ------------------------------------------------------------------------
    this._renderRadialTrussSpokes(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // ------------------------------------------------------------------------
    // PASS 3: Multi-Rail Concentric C-Cage Scaffolding Shells (58 shells)
    // ------------------------------------------------------------------------
    this._renderScaffoldingCages(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // ------------------------------------------------------------------------
    // PASS 4: The Iconic 8-O'Clock Protruding Orbital Lobe & Outer Terraces
    // ------------------------------------------------------------------------
    this._renderProtrudingLobe(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // ------------------------------------------------------------------------
    // PASS 5: 4,600 Houdini Golden Particles & Optical Bloom Pockets
    // ------------------------------------------------------------------------
    this._renderHoudiniParticles(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // ------------------------------------------------------------------------
    // PASS 6: Radiant Inner Core & Toroidal Filament Cage
    // ------------------------------------------------------------------------
    this._renderRadiantCore(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    ctx.restore();
  }

  /**
   * Render Pass 2: 28 Bundled Radial Truss Towers with Traveling Pulses
   */
  _renderRadialTrussSpokes(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    for (let i = 0; i < this.spokes.length; i++) {
      const sp = this.spokes[i];
      const sway = Math.sin(this.elapsedTime * sp.swaySpeed + sp.swayPhase) * 0.025;
      const baseA = sp.angle2D + sway;
      const cz = Math.cos(sp.zTilt);
      const sz = Math.sin(sp.zTilt);

      // Render multi-strand tapered truss bundle (3-5 closely spaced golden rays)
      ctx.beginPath();
      for (let s = 0; s < sp.strands; s++) {
        const offset = (s - (sp.strands - 1) * 0.5) * sp.spread;
        const aIn = baseA + offset * 1.35;
        const aOut = baseA + offset * 0.45;

        const xIn = Math.cos(aIn) * R * sp.rInner * cz;
        const yIn = Math.sin(aIn) * R * sp.rInner * cz;
        const zIn = R * sp.rInner * sz;

        const xOut = Math.cos(aOut) * R * sp.rOuter * cz;
        const yOut = Math.sin(aOut) * R * sp.rOuter * cz;
        const zOut = R * sp.rOuter * sz;

        const pIn = this._project3D(xIn, yIn, zIn, cx, cy, cosX, sinX, cosY, sinY);
        const pOut = this._project3D(xOut, yOut, zOut, cx, cy, cosX, sinX, cosY, sinY);

        ctx.moveTo(pIn.sx, pIn.sy);
        ctx.lineTo(pOut.sx, pOut.sy);
      }
      ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${0.34 * sp.bright})`;
      ctx.lineWidth = 0.95;
      ctx.stroke();

      // Bright central core spine of the truss
      const ux = Math.cos(baseA) * cz;
      const uy = Math.sin(baseA) * cz;
      const uz = sz;

      const pCenterIn = this._project3D(ux * R * sp.rInner, uy * R * sp.rInner, uz * R * sp.rInner, cx, cy, cosX, sinX, cosY, sinY);
      const pCenterOut = this._project3D(ux * R * sp.rOuter, uy * R * sp.rOuter, uz * R * sp.rOuter, cx, cy, cosX, sinX, cosY, sinY);

      ctx.beginPath();
      ctx.moveTo(pCenterIn.sx, pCenterIn.sy);
      ctx.lineTo(pCenterOut.sx, pCenterOut.sy);
      ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${0.42 * sp.bright})`;
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // Stamp subtle golden bloom at truss-shell intersection nodes
      if (this.bloomSprite && i < 16) {
        const nodeR = R * (sp.rOuter * 0.96);
        const pNode = this._project3D(ux * nodeR, uy * nodeR, uz * nodeR, cx, cy, cosX, sinX, cosY, sinY);
        const bSize = 26 * pNode.scale;
        ctx.globalAlpha = 0.45 * sp.bright;
        ctx.drawImage(this.bloomSprite, pNode.sx - bSize * 0.5, pNode.sy - bSize * 0.5, bSize, bSize);
        ctx.globalAlpha = 1.0;
      }

      // Traveling bioluminescent pulse along the truss beam
      const pulseR = R * (sp.rInner + (sp.rOuter - sp.rInner) * sp.pulsePos);
      const tailR = R * (sp.rInner + (sp.rOuter - sp.rInner) * Math.max(0, Math.min(1, sp.pulsePos - 0.16 * sp.pulseDir)));
      const pHead = this._project3D(ux * pulseR, uy * pulseR, uz * pulseR, cx, cy, cosX, sinX, cosY, sinY);
      const pTail = this._project3D(ux * tailR, uy * tailR, uz * tailR, cx, cy, cosX, sinX, cosY, sinY);

      const env = Math.sin(sp.pulsePos * Math.PI);
      if (env > 0.05) {
        ctx.beginPath();
        ctx.moveTo(pTail.sx, pTail.sy);
        ctx.lineTo(pHead.sx, pHead.sy);
        ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${env * 0.88})`;
        ctx.lineWidth = 2.1;
        ctx.stroke();

        if (this.bloomSprite) {
          const pSize = 22 * env;
          ctx.globalAlpha = env * 0.65;
          ctx.drawImage(this.bloomSprite, pHead.sx - pSize * 0.5, pHead.sy - pSize * 0.5, pSize, pSize);
          ctx.globalAlpha = 1.0;
        }
      }
    }
  }

  /**
   * Render Pass 3: Multi-Rail Concentric C-Cage Scaffolding Shells (Image 2 Silhouette)
   */
  _renderScaffoldingCages(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      const baseRad = R * ring.r;
      const rz = ring.rz + ring.angle + ring.springPos;
      const cRx = Math.cos(ring.rx), sRx = Math.sin(ring.rx);
      const cRy = Math.cos(ring.ry), sRy = Math.sin(ring.ry);

      const projectPt = (theta, rad = baseRad, zOff = 0) => {
        const a = theta + rz;
        const lx = Math.cos(a) * rad;
        const ly = Math.sin(a) * rad;
        const x1 = lx * cRy + zOff * sRy;
        const y1 = ly * cRx - zOff * sRx;
        const z1 = -lx * sRy + ly * sRx + zOff * cRx;
        return this._project3D(x1, y1, z1, cx, cy, cosX, sinX, cosY, sinY);
      };

      if (ring.isMajorCage) {
        const steps = ring.ribs;
        const railSpread = R * 0.032;

        // 1. Draw parallel golden scaffolding rails (6-10 concentric tracks per band)
        for (let rl = 0; rl < ring.rails; rl++) {
          const rFrac = (rl / (ring.rails - 1)) - 0.5;
          const railRad = baseRad + rFrac * railSpread;
          const zOff = rFrac * R * 0.025;
          const isEdgeRail = rl === 0 || rl === ring.rails - 1;

          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            // Create natural architectural gaps along inner rails
            if (!isEdgeRail && (k + rl * 3) % 9 === 0) {
              const theta = ring.start + (ring.span * k) / steps;
              const pt = projectPt(theta, railRad, zOff);
              ctx.moveTo(pt.sx, pt.sy);
              continue;
            }
            const theta = ring.start + (ring.span * k) / steps;
            const pt = projectPt(theta, railRad, zOff);
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }

          ctx.strokeStyle = isEdgeRail
            ? `rgba(${gr}, ${gg}, ${gb}, ${0.58 * ring.bright})`
            : `rgba(${ar}, ${ag}, ${ab}, ${0.34 * ring.bright})`;
          ctx.lineWidth = isEdgeRail ? ring.weight * 1.15 : ring.weight * 0.65;
          ctx.stroke();
        }

        // 2. Draw perpendicular radial cross-ribs / scaffolding rungs connecting the rails
        ctx.beginPath();
        const innerRailR = baseRad - railSpread * 0.55;
        const outerRailR = baseRad + railSpread * 0.55;
        for (let k = 0; k <= steps; k++) {
          if (k % 5 === 0) continue; // Grouped circuit block rhythm
          const theta = ring.start + (ring.span * k) / steps;
          const ext = (k % 8 === 0) ? R * 0.016 : 0;
          const pIn = projectPt(theta, innerRailR - ext, -R * 0.012);
          const pOut = projectPt(theta, outerRailR + ext, R * 0.012);
          ctx.moveTo(pIn.sx, pIn.sy);
          ctx.lineTo(pOut.sx, pOut.sy);
        }
        ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${0.38 * ring.bright})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // 3. Draw glowing golden pulse sweeping along the major cage band
        const pCenter = ring.start + ring.span * ring.pulsePhase;
        const pSpan = ring.span * 0.12;
        ctx.beginPath();
        for (let k = 0; k <= 10; k++) {
          const theta = pCenter + ((k / 10) - 0.5) * pSpan;
          const pt = projectPt(theta, baseRad, 0);
          if (k === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        const env = Math.sin(ring.pulsePhase * Math.PI);
        ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${env * 0.75})`;
        ctx.lineWidth = 1.9;
        ctx.stroke();
        continue;
      }

      // Render internal 3D woven ribbon shells
      for (let s = 0; s < ring.arcs.length; s++) {
        const arc = ring.arcs[s];
        const midPt = projectPt((arc.start + arc.end) * 0.5);
        const zNorm = (midPt.z + R) / (2 * R);
        const depthAlpha = Math.max(0.10, Math.min(0.72, (0.16 + zNorm * 0.52) * arc.alphaMult));

        const steps = arc.ribs;
        for (let rl = 0; rl < arc.rails; rl++) {
          const railRad = baseRad + (rl - 0.5) * R * 0.014;
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const theta = arc.start + ((arc.end - arc.start) * k) / steps;
            const pt = projectPt(theta, railRad);
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          ctx.strokeStyle = rl === 0
            ? `rgba(${gr}, ${gg}, ${gb}, ${depthAlpha * 0.68})`
            : `rgba(${ar}, ${ag}, ${ab}, ${depthAlpha * 0.45})`;
          ctx.lineWidth = arc.weight * 0.8;
          ctx.stroke();
        }

        // Cross-ticks along internal ribbon
        ctx.beginPath();
        for (let k = 0; k <= steps; k += 2) {
          const theta = arc.start + ((arc.end - arc.start) * k) / steps;
          const p1 = projectPt(theta, baseRad - R * 0.009);
          const p2 = projectPt(theta, baseRad + R * 0.009);
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
        }
        ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${depthAlpha * 0.42})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  /**
   * Render Pass 4: The Signature 8-O'Clock Protruding Orbital Lobe & Outer Terraces
   */
  _renderProtrudingLobe(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    for (let i = 0; i < this.terraces.length; i++) {
      const lb = this.terraces[i];
      const cosT = Math.cos(lb.tiltZ);
      const sinT = Math.sin(lb.tiltZ);
      const startA = lb.arcOnly ? lb.arcOnly[0] : 0;
      const endA = lb.arcOnly ? lb.arcOnly[1] : TAU;
      const spanA = endA - startA;
      const steps = lb.ribs;

      const projectLobePt = (theta, scaleMod = 1.0, zMod = 0) => {
        const a = theta + this.elapsedTime * (i % 2 === 0 ? 0.035 : -0.028);
        const ex = (Math.cos(a) * lb.rX * scaleMod + lb.offsetX) * R;
        const ey = (Math.sin(a) * lb.rY * scaleMod + lb.offsetY) * R;
        const ez = (Math.sin(a * 2) * 0.08 + zMod) * R;

        // Rotate by 2D tiltZ in screen/object plane
        const rx = ex * cosT - ey * sinT;
        const ry = ex * sinT + ey * cosT;
        return this._project3D(rx, ry, ez, cx, cy, cosX, sinX, cosY, sinY);
      };

      // Draw nested elliptical rails of the protruding lobe
      for (let rl = 0; rl < lb.rails; rl++) {
        const sMod = 1.0 + ((rl / Math.max(1, lb.rails - 1)) - 0.5) * 0.09;
        const isMain = rl === 0 || rl === lb.rails - 1;

        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const theta = startA + (spanA * k) / steps;
          const pt = projectLobePt(theta, sMod, (rl - 2) * 0.008);
          if (k === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.strokeStyle = isMain
          ? `rgba(${gr}, ${gg}, ${gb}, ${0.55 * lb.alpha})`
          : `rgba(${ar}, ${ag}, ${ab}, ${0.32 * lb.alpha})`;
        ctx.lineWidth = isMain ? 1.25 : 0.7;
        ctx.stroke();
      }

      // Draw radial cross-ribs around the protruding lobe rim
      ctx.beginPath();
      for (let k = 0; k <= steps; k++) {
        if (k % 4 === 0) continue;
        const theta = startA + (spanA * k) / steps;
        const pIn = projectLobePt(theta, 0.945, -0.01);
        const pOut = projectLobePt(theta, 1.055, 0.01);
        ctx.moveTo(pIn.sx, pIn.sy);
        ctx.lineTo(pOut.sx, pOut.sy);
      }
      ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${0.35 * lb.alpha})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }

  /**
   * Render Pass 5: 4,600 Houdini Golden Particles & Optical Bloom Pockets
   */
  _renderHoudiniParticles(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    const data = this.voxelData;
    const count = this.voxelCount;
    const t = this.elapsedTime;
    const cosLobe = Math.cos(-0.35);
    const sinLobe = Math.sin(-0.35);

    const pulseWave = (t * 0.22) % 1.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      const angle = data[idx + 0] + t * data[idx + 3];
      const zTilt = data[idx + 1];
      const rRatio = data[idx + 2];
      const size = data[idx + 4];
      const phase = data[idx + 5];
      const clusterType = data[idx + 6];
      const bloomFlag = data[idx + 7];

      let x, y, z;
      if (clusterType === 1) {
        // 8-o'clock protruding orbital lobe particle coordinates
        const ex = (Math.cos(angle) * 1.24 * rRatio - 0.20) * R;
        const ey = (Math.sin(angle) * 0.40 * rRatio + 0.15) * R;
        x = ex * cosLobe - ey * sinLobe;
        y = ex * sinLobe + ey * cosLobe;
        z = zTilt * R * 0.45;
      } else {
        const rad = R * rRatio;
        const cz = Math.cos(zTilt);
        x = Math.cos(angle) * rad * cz;
        y = Math.sin(angle) * rad * cz;
        z = rad * Math.sin(zTilt);
      }

      const proj = this._project3D(x, y, z, cx, cy, cosX, sinX, cosY, sinY);
      const zNorm = (proj.z + R) / (2 * R);
      if (zNorm < 0.04) continue;

      const shimmer = 0.6 + 0.4 * Math.sin(t * 2.6 + phase);
      const waveDist = Math.abs(rRatio - pulseWave);
      const waveBoost = waveDist < 0.14 ? (1.0 - waveDist / 0.14) * 0.4 : 0;
      const alpha = Math.min(0.96, (0.22 + zNorm * 0.65) * shimmer + waveBoost);

      // Stamp pre-rendered HDR golden bloom sprite on designated cluster hotspots
      if (bloomFlag && this.bloomSprite) {
        const bRadius = (14 + size * 8) * proj.scale;
        ctx.globalAlpha = alpha * 0.34;
        ctx.drawImage(this.bloomSprite, proj.sx - bRadius * 0.5, proj.sy - bRadius * 0.5, bRadius, bRadius);
        ctx.globalAlpha = 1.0;
      }

      if (waveBoost > 0.18 || clusterType === 2) {
        ctx.fillStyle = `rgba(${hr}, ${hg}, ${hb}, ${alpha})`;
      } else if (i % 2 === 0) {
        ctx.fillStyle = `rgba(${gr}, ${gg}, ${gb}, ${alpha * 0.92})`;
      } else {
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha * 0.85})`;
      }

      const ptW = Math.max(1.0, size * proj.scale * (i % 3 === 0 ? 1.8 : 1.0));
      const ptH = Math.max(1.0, size * proj.scale);
      ctx.fillRect(proj.sx - ptW * 0.5, proj.sy - ptH * 0.5, ptW, ptH);
    }
  }

  /**
   * Render Pass 6: Radiant Inner Core & Toroidal Filament Cage
   */
  _renderRadiantCore(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    // 1. Warm luminous golden heart (matches the glowing core intersection in Image 2)
    const coreX = cx - R * 0.08;
    const coreY = cy + R * 0.06;
    const heartGrad = ctx.createRadialGradient(coreX, coreY, R * 0.01, coreX, coreY, R * 0.34);
    heartGrad.addColorStop(0.0, `rgba(${hr}, ${hg}, ${hb}, 0.72)`);
    heartGrad.addColorStop(0.24, `rgba(${gr}, ${gg}, ${gb}, 0.42)`);
    heartGrad.addColorStop(0.58, `rgba(${ar}, ${ag}, ${ab}, 0.16)`);
    heartGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = heartGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY, R * 0.34, 0, TAU);
    ctx.fill();

    // 2. 22 Nested 3D Golden Core Rings
    for (let i = 0; i < this.irisRings.length; i++) {
      const ir = this.irisRings[i];
      const rad = R * ir.r;
      const cRx = Math.cos(ir.rx), sRx = Math.sin(ir.rx);
      const cRy = Math.cos(ir.ry), sRy = Math.sin(ir.ry);

      const steps = 36;
      ctx.beginPath();
      for (let k = 0; k <= steps; k++) {
        const theta = ir.arcStart + (ir.arcSpan * k) / steps + ir.rz;
        const lx = Math.cos(theta) * rad;
        const ly = Math.sin(theta) * rad;
        const x1 = lx * cRy;
        const y1 = ly * cRx;
        const z1 = -lx * sRy + ly * sRx;
        const pt = this._project3D(x1, y1, z1, coreX, coreY, cosX, sinX, cosY, sinY);
        if (k === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      }

      const color = i < 7 ? [hr, hg, hb] : i < 15 ? [gr, gg, gb] : [ar, ag, ab];
      ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${ir.alpha * 0.78})`;
      ctx.lineWidth = ir.weight;
      ctx.stroke();
    }
  }
}
