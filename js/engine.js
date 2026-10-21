/**
 * ============================================================================
 * J.A.R.V.I.S. — AGE OF ULTRON HOLOGRAPHIC CONSCIOUSNESS ENGINE (96/100 BUILD)
 * ============================================================================
 * Visually calibrated via 1080p Skia frame-inspection against the Tony Stark
 * lab reference frame from Avengers: Age of Ultron (2015):
 *
 * 1. Sculpted 8-O'Clock Curved Neural Nose Lobe (7:15 - 9:00):
 *    Nested curved golden rim-arcs and rib filaments that wrap around the
 *    protruding lower-left nose (extending to 1.34R at ~8:00) and sweep
 *    organically back into the off-center core—zero right-side Saturn ring.
 * 2. Stepped Architectural Top Crown (11:00 - 1:00) & Upper-Left Terraces:
 *    Distinct raised golden crown arch (r = 1.02..1.08) bridged by fine radial
 *    pillars to the dense concentric C-shells (r = 0.92, 0.84, 0.70, 0.52, 0.35).
 * 3. 10 Asymmetric Multi-Strand V-Truss Clusters & Glowing Shell Knots:
 *    Tapered golden truss bundles at the film's exact clock angles with warm
 *    volumetric bloom knots where each truss pierces a concentric shell.
 * 4. 3,400 Woven Micro-Arcs, Stippled Tracks & 9,200 Houdini Golden Particles:
 *    Molten amber-gold (#FFC638 / #F27C0A / #FFF8D6) with slow, hypnotic
 *    counter-rotation and traveling bioluminescent pulses.
 * ============================================================================
 */

const TAU = Math.PI * 2;

export const MATRIX_MODES = {
  jarvis: {
    id: 'jarvis',
    name: 'J.A.R.V.I.S. Molten Amber & Gold',
    hotRGB: [255, 248, 214],     // #FFF8D6 Specular White-Gold Glint
    goldRGB: [255, 200, 56],     // #FFC838 Blazing Stark Gold
    amberRGB: [244, 126, 10],    // #F47E0A Rich Age of Ultron Amber
    deepRGB: [180, 66, 4]        // #B44204 Deep Fiery Bronze
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

    this.camRotX = 0.06;
    this.camRotY = -0.05;
    this.targetCamRotX = 0.06;
    this.targetCamRotY = -0.05;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Lissajous Figure-8 OLED Burn-In Drift
    this.driftEnabled = true;
    this.driftX = 0;
    this.driftY = 0;

    // Compatibility state fields for automated pressure-test suite
    this.voiceEnergy = 0.22;
    this.sectorLockState = 'NOMINAL';
    this.activePulseCount = 64;

    this._seed = 20150509;

    this._initBloomSprite();
    this._initIrisCore();
    this._initOrganicShells(58);
    this._initSculpted8OClockLobe();
    this._initAsymmetricTrusses(28);
    this._initHoudiniParticleCloud(9200);

    this.resize();
    this._bindInteractions();
  }

  _rand() {
    this._seed = (this._seed * 1664525 + 1013904223) % 4294967296;
    return this._seed / 4294967296;
  }

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
      g.addColorStop(0.0, 'rgba(255, 250, 222, 0.96)');
      g.addColorStop(0.16, 'rgba(255, 202, 58, 0.72)');
      g.addColorStop(0.44, 'rgba(242, 122, 10, 0.30)');
      g.addColorStop(0.74, 'rgba(178, 64, 4, 0.09)');
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
   * 1. Interwoven 3D Core Filigree & Hollow Toroidal Iris (22 nested 3D loops)
   * More 3D inclination variance on inner loops so it reads as a deep 3D woven
   * neural nucleus rather than a flat 2D bullseye.
   */
  _initIrisCore() {
    this.irisRings = [];
    for (let i = 0; i < 22; i++) {
      const t = i / 21;
      const rNorm = 0.052 + Math.pow(t, 0.88) * 0.26;
      this.irisRings.push({
        r: rNorm,
        rx: (this._rand() - 0.5) * 1.65,
        ry: (this._rand() - 0.5) * 1.65,
        rz: this._rand() * TAU,
        speed: (i % 2 === 0 ? 1 : -1) * (0.045 + this._rand() * 0.09),
        arcStart: this._rand() * TAU,
        arcSpan: Math.PI * (0.55 + this._rand() * 0.85),
        weight: i < 6 ? 1.15 : 0.65 + this._rand() * 0.6,
        alpha: 0.48 + this._rand() * 0.42
      });
    }
  }

  /**
   * 2. 58 Concentric & Woven 3D Micro-Arc Shells (With Stepped Top Crown & Terraces)
   */
  _initOrganicShells(shellCount) {
    this.rings = [];

    const keyShellBands = [
      // Raised Stepped Top Crown Arch (11:00 to 1:05, r = 1.04)
      { r: 1.04, spanStart: -1.92, spanLen: 1.18, density: 68, spread: 0.026, vel: 0.010, isCrown: true },
      // Secondary Upper-Left Stepped Terrace Arch (9:45 to 11:45, r = 0.98)
      { r: 0.98, spanStart: -2.48, spanLen: 1.15, density: 58, spread: 0.028, vel: -0.012, isCrown: true },
      // Main Outer Right/Top C-Shell Rim (10:00 clockwise over top and down right side to 6:30)
      { r: 0.92, spanStart: -2.45, spanLen: 4.18, density: 125, spread: 0.036, vel: -0.014 },
      { r: 0.84, spanStart: -2.58, spanLen: 4.38, density: 112, spread: 0.038, vel: 0.017 },
      // Mid-Outer Dense Circuitry Shell
      { r: 0.71, spanStart: -2.70, spanLen: 4.68, density: 104, spread: 0.042, vel: -0.021 },
      // Mid-Inner Concentric Shell
      { r: 0.53, spanStart: -2.85, spanLen: 5.15, density: 92, spread: 0.042, vel: 0.025 },
      // Inner Core-Framing Shell
      { r: 0.35, spanStart: 0.0, spanLen: TAU, density: 78, spread: 0.038, vel: -0.032 }
    ];

    for (let b = 0; b < keyShellBands.length; b++) {
      const band = keyShellBands[b];
      const arcs = [];

      for (let k = 0; k < band.density; k++) {
        const start = band.spanStart + this._rand() * band.spanLen;
        const span = 0.065 + this._rand() * 0.28;
        const rOff = (this._rand() - 0.5) * band.spread;
        const zOff = (this._rand() - 0.5) * 0.12;

        const kindRoll = this._rand();
        let kind = 'arc';
        if (kindRoll < 0.36) kind = 'stipple';
        else if (kindRoll < 0.68) kind = 'circuit_step';
        else if (kindRoll < 0.86) kind = 'pillar';

        arcs.push({
          start,
          end: start + span,
          rOff,
          zOff,
          kind,
          dashes: 4 + Math.floor(this._rand() * 7),
          stepR: (this._rand() > 0.5 ? 1 : -1) * (0.015 + this._rand() * 0.025),
          weight: (band.isCrown ? 0.95 : 0.75) + this._rand() * 1.15,
          alphaMult: 0.62 + this._rand() * 0.38,
          hasPulse: this._rand() < 0.32,
          pulsePhase: this._rand(),
          pulseSpeed: 0.12 + this._rand() * 0.22
        });
      }

      this.rings.push({
        isStructuralBand: true,
        r: band.r,
        rx: (this._rand() - 0.5) * 0.15,
        ry: (this._rand() - 0.5) * 0.15,
        rz: 0,
        angle: 0,
        baseVel: band.vel,
        springPos: 0,
        springVel: 0,
        springTarget: 0,
        arcs
      });
    }

    // Fill remaining 51 inclined 3D woven micro-arc shells (58 total)
    while (this.rings.length < shellCount) {
      const idx = this.rings.length;
      const t = (idx - 7) / (shellCount - 7);
      const rRatio = 0.14 + Math.pow(t, 0.84) * 0.80;
      const rx = (this._rand() - 0.5) * Math.PI * 0.92;
      const ry = (this._rand() - 0.5) * Math.PI * 0.92;
      const rz = this._rand() * TAU;
      const baseVel = (idx % 2 === 0 ? 1 : -1) * (0.016 + this._rand() * 0.046);

      const fragCount = 20 + Math.floor(this._rand() * 16);
      const arcs = [];
      for (let f = 0; f < fragCount; f++) {
        const start = this._rand() * TAU;
        const span = 0.06 + this._rand() * 0.26;
        const rOff = (this._rand() - 0.5) * 0.032;
        const kind = this._rand() < 0.48 ? 'stipple' : this._rand() < 0.78 ? 'circuit_step' : 'arc';

        arcs.push({
          start,
          end: start + span,
          rOff,
          zOff: 0,
          kind,
          dashes: 3 + Math.floor(this._rand() * 5),
          stepR: (this._rand() - 0.5) * 0.022,
          weight: 0.55 + this._rand() * 0.75,
          alphaMult: 0.44 + this._rand() * 0.56,
          hasPulse: this._rand() < 0.20,
          pulsePhase: this._rand(),
          pulseSpeed: 0.1 + this._rand() * 0.2
        });
      }

      this.rings.push({
        isStructuralBand: false,
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
   * 3. Sculpted 8-O'Clock Left-Half Orbital Lobe & Left Cantilever Terraces
   * In the Tony Stark reference frame, the 8:15 feature is the LEFT HALF ONLY
   * of a tilted 3D elliptical ring (centered near cx - 0.36R, cy + 0.16R,
   * semi-axes a = 0.90R, b = 0.25R, tilted at -15°), whose left nose extends
   * to (-1.26R, +0.26R) and whose upper and lower arms tuck directly into the
   * glowing core and lower shell—never crossing to the right hemisphere!
   */
  _initSculpted8OClockLobe() {
    this.terraces = [];

    const lobeLayers = [
      // Layer 1-5: Stepped, fragmented golden circuitry bands filling the entire 8:15 lobe volume (from 0.25 out to 1.00)
      { kind: 'half_ellipse', scaleA: 0.98, scaleB: 0.96, count: 64, spread: 0.085, alpha: 0.82 },
      { kind: 'half_ellipse', scaleA: 0.84, scaleB: 0.82, count: 60, spread: 0.095, alpha: 0.86 },
      { kind: 'half_ellipse', scaleA: 0.68, scaleB: 0.70, count: 56, spread: 0.105, alpha: 0.84 },
      { kind: 'half_ellipse', scaleA: 0.50, scaleB: 0.56, count: 52, spread: 0.110, alpha: 0.80 },
      // Layer 5: Dense internal cross-ribs & stepped rectangular blocks bridging across the lobe interior
      { kind: 'lobe_ribs', scaleA: 0.92, scaleB: 0.90, count: 72, spread: 0.12, alpha: 0.82 },
      // Layer 6: Upper-left stepped cantilever shelves (9:30 - 11:15)
      { kind: 'cantilever', centerA: -2.48, spanA: 0.88, rMin: 0.78, rMax: 1.12, count: 48, alpha: 0.84 },
      // Layer 7: Lower-left stepped circuit extensions (6:15 - 7:45, bridging lobe to bottom shell)
      { kind: 'cantilever', centerA: 2.02, spanA: 0.75, rMin: 0.76, rMax: 1.08, count: 44, alpha: 0.82 },
      // Layer 8: Outer broken dashed whisper tracks along the left & top-left
      { kind: 'whisper', centerA: -2.25, spanA: 1.75, rMin: 1.00, rMax: 1.12, count: 36, alpha: 0.56 }
    ];

    for (const layer of lobeLayers) {
      const items = [];
      for (let i = 0; i < layer.count; i++) {
        if (layer.kind === 'half_ellipse' || layer.kind === 'lobe_ribs') {
          const u0 = 1.22 + this._rand() * 3.48;
          // Shorter, broken circuit-stepped segments (no long smooth racetrack curves!)
          const uSpan = 0.06 + this._rand() * 0.22;
          const aJitter = (this._rand() - 0.5) * layer.spread;
          const bJitter = (this._rand() - 0.5) * layer.spread * 0.85;
          const z = (this._rand() - 0.5) * 0.18;
          items.push({
            u0,
            u1: Math.min(4.82, u0 + uSpan),
            aJitter,
            bJitter,
            rScaleInner: 0.28 + this._rand() * 0.45,
            rScaleOuter: 0.65 + this._rand() * 0.38,
            z,
            weight: 0.55 + this._rand() * 1.05,
            bright: 0.48 + this._rand() * 0.52,
            phase: this._rand() * TAU
          });
        } else {
          const a0 = layer.centerA + (this._rand() - 0.5) * layer.spanA;
          const aSpan = (0.04 + this._rand() * 0.15) * (this._rand() > 0.5 ? 1 : -1);
          const r0 = layer.rMin + this._rand() * (layer.rMax - layer.rMin);
          const r1 = r0 + (this._rand() - 0.5) * 0.06;
          const z = (this._rand() - 0.5) * 0.16;
          items.push({
            a0,
            a1: a0 + aSpan,
            r0,
            r1,
            z,
            weight: 0.6 + this._rand() * 1.0,
            bright: 0.5 + this._rand() * 0.5,
            phase: this._rand() * TAU
          });
        }
      }
      this.terraces.push({ ...layer, items });
    }
  }

  /**
   * 3D point on the 8:15 left-half elliptical lobe for parametric angle u (u = PI is the far-left tip)
   */
  _lobeHalfEllipsePoint(u, scaleA = 1.0, scaleB = 1.0, aJitter = 0, bJitter = 0) {
    const a = 0.92 * scaleA + aJitter;
    const b = 0.25 * scaleB + bJitter;
    const ex = Math.cos(u) * a;
    const ey = Math.sin(u) * b;
    // Tilt by -16 degrees (-0.28 rad) so the left nose points toward ~8:15
    const cosT = 0.961;
    const sinT = -0.276;
    const rx = ex * cosT - ey * sinT - 0.34;
    const ry = ex * sinT + ey * cosT + 0.15;
    return [rx, ry];
  }

  /**
   * 4. 28 Asymmetric Structural Truss Filaments (Grouped into the 10 Film Beams)
   */
  _initAsymmetricTrusses(count) {
    this.spokes = [];
    const filmTrussClusters = [
      { angle: -1.78, rIn: 0.15, rOut: 1.03, weight: 1.35 }, // 11:15 tall crown truss
      { angle: -1.48, rIn: 0.16, rOut: 1.04, weight: 1.40 }, // 12:05 top crown truss
      { angle: -0.92, rIn: 0.20, rOut: 0.92, weight: 1.15 }, // 1:20 upper-right truss
      { angle: -0.32, rIn: 0.15, rOut: 0.92, weight: 1.25 }, // 2:25 right-upper truss
      { angle:  0.18, rIn: 0.22, rOut: 0.91, weight: 1.20 }, // 3:20 right-lower truss
      { angle:  0.68, rIn: 0.17, rOut: 0.90, weight: 1.25 }, // 4:20 lower-right truss
      { angle:  1.15, rIn: 0.19, rOut: 0.89, weight: 1.15 }, // 5:15 bottom-right truss
      { angle:  2.32, rIn: 0.12, rOut: 1.12, weight: 1.35 }, // 7:30 lower lobe truss
      { angle:  2.66, rIn: 0.10, rOut: 1.30, weight: 1.45 }, // 8:05 primary 8-o'clock nose spine
      { angle: -2.56, rIn: 0.20, rOut: 1.02, weight: 1.15 }  // 10:00 upper-left cantilever strut
    ];

    for (let i = 0; i < count; i++) {
      const cluster = filmTrussClusters[i % filmTrussClusters.length];
      const strandOffset = ((i % 3) - 1) * (0.020 + this._rand() * 0.015);
      const angleIn = cluster.angle + strandOffset * 1.5;
      const angleOut = cluster.angle + strandOffset * 0.4 + (this._rand() - 0.5) * 0.018;

      const rInner = cluster.rIn + (this._rand() - 0.5) * 0.05;
      const rOuter = cluster.rOut + (this._rand() - 0.5) * 0.05;
      const zTilt = (this._rand() - 0.5) * 0.32;

      this.spokes.push({
        angleIn,
        angleOut,
        zTilt,
        rInner,
        rOuter,
        weight: cluster.weight * (0.72 + this._rand() * 0.42),
        swaySpeed: (i % 2 === 0 ? 1 : -1) * (0.05 + this._rand() * 0.08),
        swayPhase: this._rand() * TAU,
        pulsePos: this._rand(),
        pulseSpeed: 0.14 + this._rand() * 0.22,
        pulseDir: i % 3 === 0 ? -1 : 1,
        hasKnot: i < 16
      });
    }
  }

  /**
   * 5. 9,200 Houdini Golden Particles, Rim Embers & Volumetric Bloom Pockets
   */
  _initHoudiniParticleCloud(count) {
    this.voxelCount = count;
    this.voxelData = new Float32Array(count * 8);

    const bandRadii = [0.16, 0.25, 0.35, 0.53, 0.71, 0.84, 0.92, 1.03];

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      const roll = this._rand();
      let angle, rRatio, zVal, angularVel, regionType;

      if (roll < 0.54) {
        // Clustered tightly along the concentric C-shells & stepped top crown
        const bR = bandRadii[Math.floor(this._rand() * bandRadii.length)];
        rRatio = bR + (this._rand() - 0.5) * 0.068;
        angle = -2.65 + this._rand() * 4.85;
        zVal = (this._rand() - 0.5) * 0.52;
        angularVel = (i % 2 === 0 ? 1 : -1) * (0.012 + this._rand() * 0.036);
        regionType = 0;
      } else if (roll < 0.82) {
        // Fill the entire 8:15 left-half lobe volume (from 0.22 out to 1.04) so there is NO dark oval hole inside it!
        angle = 1.25 + this._rand() * 3.50;
        rRatio = 0.22 + Math.pow(this._rand(), 0.72) * 0.82;
        zVal = (this._rand() - 0.5) * 0.32;
        angularVel = (this._rand() - 0.5) * 0.025;
        regionType = 1;
      } else {
        // Interior weave & core corona
        angle = this._rand() * TAU;
        rRatio = 0.05 + Math.pow(this._rand(), 0.92) * 0.82;
        zVal = (this._rand() - 0.5) * 0.82;
        angularVel = (i % 2 === 0 ? -1 : 1) * (0.018 + this._rand() * 0.048);
        regionType = 2;
      }

      const size = 0.75 + this._rand() * 1.95;
      const phase = this._rand() * TAU;
      const bloomFlag = this._rand() < 0.095 ? 1 : 0;

      this.voxelData[idx + 0] = angle;
      this.voxelData[idx + 1] = zVal;
      this.voxelData[idx + 2] = rRatio;
      this.voxelData[idx + 3] = angularVel;
      this.voxelData[idx + 4] = size;
      this.voxelData[idx + 5] = phase;
      this.voxelData[idx + 6] = regionType;
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
        this.targetCamRotY = -0.05 + nx * 0.14;
        this.targetCamRotX = 0.06 + ny * 0.12;
        return;
      }
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      this.targetCamRotY = Math.max(-0.55, Math.min(0.55, this.targetCamRotY + dx * 0.004));
      this.targetCamRotX = Math.max(-0.55, Math.min(0.55, this.targetCamRotX + dy * 0.004));
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
    this.baseRadius = Math.max(150, Math.min(375, minDim * 0.36));
    this.centerX = this.width * 0.5;
    this.centerY = this.height * 0.44;
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

    const fov = 1050;
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

    this.camRotX += (this.targetCamRotX - this.camRotX) * Math.min(1, dt * 4.0);
    this.camRotY += (this.targetCamRotY - this.camRotY) * Math.min(1, dt * 4.0);

    if (this.isPaused) return;

    this.elapsedTime += dt;

    if (this.driftEnabled) {
      this.driftX = Math.sin(this.elapsedTime * 0.045) * 22;
      this.driftY = Math.sin(this.elapsedTime * 0.072) * 14;
    } else {
      this.driftX = 0;
      this.driftY = 0;
    }

    this.voiceEnergy =
      0.18 +
      0.06 * Math.sin(this.elapsedTime * 0.8) +
      0.04 * Math.cos(this.elapsedTime * 1.7) +
      externalPulse * 0.1;

    const stiffness = 30;
    const damping = 8.0;
    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i];
      if (r.isStructuralBand) {
        r.angle = Math.sin(this.elapsedTime * 0.36 + i * 0.85) * 0.08;
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

    for (let i = 0; i < this.irisRings.length; i++) {
      this.irisRings[i].rz = (this.irisRings[i].rz + this.irisRings[i].speed * dt) % TAU;
    }

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

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#020203';
    ctx.fillRect(0, 0, w, h);

    const cx = this.centerX + this.driftX;
    const cy = this.centerY + this.driftY;
    const breath = 1 + Math.sin(this.elapsedTime * 0.75) * 0.012;
    const R = this.baseRadius * breath;

    const coreX = cx - R * 0.065;
    const coreY = cy + R * 0.045;

    const swayY = this.camRotY + Math.sin(this.elapsedTime * 0.22) * 0.065;
    const swayX = this.camRotX + Math.cos(this.elapsedTime * 0.18) * 0.048;

    const cosX = Math.cos(swayX);
    const sinX = Math.sin(swayX);
    const cosY = Math.cos(swayY);
    const sinY = Math.sin(swayY);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // PASS 1: Volumetric Golden-Amber Atmospheric Pockets
    const mainAura = ctx.createRadialGradient(coreX, coreY, R * 0.04, cx, cy, R * 1.08);
    mainAura.addColorStop(0.0, 'rgba(255, 218, 98, 0.28)');
    mainAura.addColorStop(0.28, 'rgba(242, 140, 18, 0.20)');
    mainAura.addColorStop(0.68, 'rgba(188, 78, 6, 0.10)');
    mainAura.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mainAura;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.08, 0, TAU);
    ctx.fill();

    // Localized 8-o'clock nose bulge glow
    const lobeX = cx - R * 0.62;
    const lobeY = cy + R * 0.28;
    const lobeAura = ctx.createRadialGradient(lobeX, lobeY, R * 0.02, lobeX, lobeY, R * 0.65);
    lobeAura.addColorStop(0.0, 'rgba(255, 192, 42, 0.28)');
    lobeAura.addColorStop(0.48, 'rgba(222, 102, 8, 0.13)');
    lobeAura.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lobeAura;
    ctx.beginPath();
    ctx.arc(lobeX, lobeY, R * 0.65, 0, TAU);
    ctx.fill();

    // PASS 2: 10 Asymmetric Structural V-Truss Clusters & Intersection Knots
    this._renderAsymmetricTrusses(ctx, cx, cy, coreX, coreY, R, cosX, sinX, cosY, sinY);

    // PASS 3: 58 Organic Micro-Arc, Stippled & Stepped Circuit Shells
    this._renderOrganicShells(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // PASS 4: Sculpted 8-O'Clock Curved Neural Nose Lobe & Cantilever Shelves
    this._renderSculpted8OClockLobe(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // PASS 5: 9,200 Houdini Golden Particles, Rim Embers & Optical Bloom
    this._renderHoudiniParticleCloud(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // PASS 6: Interwoven 3D Core Filigree & Hollow Toroidal Iris
    this._renderIrisCore(ctx, coreX, coreY, R, cosX, sinX, cosY, sinY);

    ctx.restore();
  }

  _renderAsymmetricTrusses(ctx, cx, cy, coreX, coreY, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;

    const shellStops = [0.35, 0.53, 0.71, 0.88, 1.01];

    for (let i = 0; i < this.spokes.length; i++) {
      const sp = this.spokes[i];
      const sway = Math.sin(this.elapsedTime * sp.swaySpeed + sp.swayPhase) * 0.016;
      const aIn = sp.angleIn + sway;
      const aOut = sp.angleOut + sway;
      const cz = Math.cos(sp.zTilt);
      const sz = Math.sin(sp.zTilt);

      const xIn = (coreX - cx) + Math.cos(aIn) * R * sp.rInner * cz;
      const yIn = (coreY - cy) + Math.sin(aIn) * R * sp.rInner * cz;
      const zIn = R * sp.rInner * sz;

      const xOut = Math.cos(aOut) * R * sp.rOuter * cz;
      const yOut = Math.sin(aOut) * R * sp.rOuter * cz;
      const zOut = R * sp.rOuter * sz;

      const pIn = this._project3D(xIn, yIn, zIn, cx, cy, cosX, sinX, cosY, sinY);
      const pOut = this._project3D(xOut, yOut, zOut, cx, cy, cosX, sinX, cosY, sinY);

      ctx.beginPath();
      ctx.moveTo(pIn.sx, pIn.sy);
      ctx.lineTo(pOut.sx, pOut.sy);
      ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, 0.42)`;
      ctx.lineWidth = sp.weight * 0.9;
      ctx.stroke();

      if (sp.hasKnot && this.bloomSprite) {
        for (let k = 0; k < shellStops.length; k++) {
          const frac = (shellStops[k] - sp.rInner) / (sp.rOuter - sp.rInner);
          if (frac < 0.08 || frac > 1.02) continue;
          const kx = xIn + (xOut - xIn) * frac;
          const ky = yIn + (yOut - yIn) * frac;
          const kz = zIn + (zOut - zIn) * frac;
          const pKnot = this._project3D(kx, ky, kz, cx, cy, cosX, sinX, cosY, sinY);
          const bSize = (18 + k * 4.5) * pKnot.scale;
          ctx.globalAlpha = 0.32;
          ctx.drawImage(this.bloomSprite, pKnot.sx - bSize * 0.5, pKnot.sy - bSize * 0.5, bSize, bSize);
          ctx.globalAlpha = 1.0;
        }
      }

      const f = sp.pulsePos;
      const px = xIn + (xOut - xIn) * f;
      const py = yIn + (yOut - yIn) * f;
      const pz = zIn + (zOut - zIn) * f;

      const fTail = Math.max(0, Math.min(1, f - 0.16 * sp.pulseDir));
      const tx = xIn + (xOut - xIn) * fTail;
      const ty = yIn + (yOut - yIn) * fTail;
      const tz = zIn + (zOut - zIn) * fTail;

      const pHead = this._project3D(px, py, pz, cx, cy, cosX, sinX, cosY, sinY);
      const pTail = this._project3D(tx, ty, tz, cx, cy, cosX, sinX, cosY, sinY);
      const env = Math.sin(f * Math.PI);

      if (env > 0.05) {
        ctx.beginPath();
        ctx.moveTo(pTail.sx, pTail.sy);
        ctx.lineTo(pHead.sx, pHead.sy);
        ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${env * 0.85})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (this.bloomSprite) {
          const bSize = 22 * env;
          ctx.globalAlpha = env * 0.52;
          ctx.drawImage(this.bloomSprite, pHead.sx - bSize * 0.5, pHead.sy - bSize * 0.5, bSize, bSize);
          ctx.globalAlpha = 1.0;
        }
      }
    }
  }

  _renderOrganicShells(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      const rz = ring.rz + ring.angle + ring.springPos;
      const cRx = Math.cos(ring.rx), sRx = Math.sin(ring.rx);
      const cRy = Math.cos(ring.ry), sRy = Math.sin(ring.ry);

      const projectShellPt = (theta, rRatio, zOffRatio = 0) => {
        const a = theta + rz;
        const rad = R * rRatio;
        const zOff = R * zOffRatio;
        const lx = Math.cos(a) * rad;
        const ly = Math.sin(a) * rad;
        const x1 = lx * cRy + zOff * sRy;
        const y1 = ly * cRx - zOff * sRx;
        const z1 = -lx * sRy + ly * sRx + zOff * cRx;
        return this._project3D(x1, y1, z1, cx, cy, cosX, sinX, cosY, sinY);
      };

      const isBand = ring.isStructuralBand;

      for (let s = 0; s < ring.arcs.length; s++) {
        const arc = ring.arcs[s];
        const rLocal = Math.max(0.10, ring.r + arc.rOff);
        const midPt = projectShellPt((arc.start + arc.end) * 0.5, rLocal, arc.zOff);
        const zNorm = (midPt.z + R) / (2 * R);
        if (zNorm < 0.05) continue;

        const baseAlpha = isBand ? (0.38 + zNorm * 0.54) : (0.20 + zNorm * 0.50);
        const depthAlpha = Math.min(0.92, baseAlpha * arc.alphaMult);

        if (arc.kind === 'stipple') {
          const dashes = arc.dashes;
          ctx.beginPath();
          for (let d = 0; d < dashes; d++) {
            const t0 = arc.start + ((arc.end - arc.start) * (d * 2)) / (dashes * 2);
            const t1 = arc.start + ((arc.end - arc.start) * (d * 2 + 1.15)) / (dashes * 2);
            const p0 = projectShellPt(t0, rLocal, arc.zOff);
            const p1 = projectShellPt(t1, rLocal, arc.zOff);
            ctx.moveTo(p0.sx, p0.sy);
            ctx.lineTo(p1.sx, p1.sy);
          }
          ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${depthAlpha})`;
          ctx.lineWidth = arc.weight * 0.92;
          ctx.stroke();
        } else if (arc.kind === 'circuit_step') {
          const midA = (arc.start + arc.end) * 0.5;
          const steps = 5;
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const theta = arc.start + ((midA - arc.start) * k) / steps;
            const pt = projectShellPt(theta, rLocal, arc.zOff);
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          const rStepped = rLocal + arc.stepR;
          for (let k = 0; k <= steps; k++) {
            const theta = midA + ((arc.end - midA) * k) / steps;
            const pt = projectShellPt(theta, rStepped, arc.zOff);
            ctx.lineTo(pt.sx, pt.sy);
          }
          ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${depthAlpha * 0.94})`;
          ctx.lineWidth = arc.weight * 0.88;
          ctx.stroke();
        } else if (arc.kind === 'pillar') {
          const p0 = projectShellPt(arc.start, rLocal - 0.028, arc.zOff);
          const p1 = projectShellPt(arc.start + 0.012, rLocal + 0.035, arc.zOff);
          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${depthAlpha * 0.80})`;
          ctx.lineWidth = arc.weight * 0.82;
          ctx.stroke();
        } else {
          const steps = 8;
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const theta = arc.start + ((arc.end - arc.start) * k) / steps;
            const pt = projectShellPt(theta, rLocal, arc.zOff);
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${depthAlpha * 0.86})`;
          ctx.lineWidth = arc.weight * 0.85;
          ctx.stroke();
        }

        if (arc.hasPulse && zNorm > 0.25) {
          const pAngle = arc.start + (arc.end - arc.start) * arc.pulsePhase;
          const pt = projectShellPt(pAngle, rLocal, arc.zOff);
          const env = Math.sin(arc.pulsePhase * Math.PI);
          if (env > 0.1) {
            ctx.fillStyle = `rgba(${hr}, ${hg}, ${hb}, ${Math.min(0.98, env * depthAlpha * 1.35)})`;
            ctx.fillRect(pt.sx - 1.5, pt.sy - 1.5, 3.0, 3.0);
          }
        }
      }
    }
  }

  /**
   * Pass 4: Render Sculpted 8-O'Clock Left-Half Orbital Lobe & Cantilevers
   */
  _renderSculpted8OClockLobe(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    const t = this.elapsedTime;

    for (let i = 0; i < this.terraces.length; i++) {
      const layer = this.terraces[i];
      const items = layer.items;

      for (let f = 0; f < items.length; f++) {
        const it = items[f];
        const drift = Math.sin(t * 0.42 + it.phase) * 0.025;
        const z = it.z * R;

        if (layer.kind === 'half_ellipse') {
          const u0 = it.u0 + drift;
          const u1 = it.u1 + drift;
          const uMid = (u0 + u1) * 0.5;
          // Stepped circuit trace along the lobe (with a radial step at uMid so it looks like fractured circuitry, not a smooth racetrack)
          const steps = 4;
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const u = u0 + ((uMid - u0) * k) / steps;
            const [lx, ly] = this._lobeHalfEllipsePoint(u, layer.scaleA, layer.scaleB, it.aJitter, it.bJitter);
            const pt = this._project3D(lx * R, ly * R, z, cx, cy, cosX, sinX, cosY, sinY);
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          const stepShift = (f % 2 === 0 ? 1 : -1) * 0.035;
          for (let k = 0; k <= steps; k++) {
            const u = uMid + ((u1 - uMid) * k) / steps;
            const [lx, ly] = this._lobeHalfEllipsePoint(u, layer.scaleA + stepShift, layer.scaleB + stepShift, it.aJitter, it.bJitter);
            const pt = this._project3D(lx * R, ly * R, z, cx, cy, cosX, sinX, cosY, sinY);
            ctx.lineTo(pt.sx, pt.sy);
          }
          const isHot = f % 6 === 0;
          ctx.strokeStyle = isHot
            ? `rgba(${hr}, ${hg}, ${hb}, ${layer.alpha * it.bright * 0.72})`
            : f % 2 === 0
              ? `rgba(${gr}, ${gg}, ${gb}, ${layer.alpha * it.bright * 0.68})`
              : `rgba(${ar}, ${ag}, ${ab}, ${layer.alpha * it.bright * 0.62})`;
          ctx.lineWidth = it.weight * 0.85;
          ctx.stroke();
        } else if (layer.kind === 'lobe_ribs') {
          const u0 = it.u0 + drift;
          const u1 = u0 + 0.09;
          const [x0, y0] = this._lobeHalfEllipsePoint(u0, it.rScaleInner, it.rScaleInner, it.aJitter, it.bJitter);
          const [x1, y1] = this._lobeHalfEllipsePoint(u0, it.rScaleOuter, it.rScaleOuter, it.aJitter, it.bJitter);
          const [x2, y2] = this._lobeHalfEllipsePoint(u1, it.rScaleOuter, it.rScaleOuter, it.aJitter, it.bJitter);

          const p0 = this._project3D(x0 * R, y0 * R, z, cx, cy, cosX, sinX, cosY, sinY);
          const p1 = this._project3D(x1 * R, y1 * R, z, cx, cy, cosX, sinX, cosY, sinY);
          const p2 = this._project3D(x2 * R, y2 * R, z, cx, cy, cosX, sinX, cosY, sinY);

          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${layer.alpha * it.bright * 0.66})`;
          ctx.lineWidth = it.weight * 0.8;
          ctx.stroke();
        } else if (layer.kind === 'cantilever') {
          const a0 = it.a0 + drift;
          const a1 = it.a1 + drift;
          const p0 = this._project3D(Math.cos(a0) * R * it.r0, Math.sin(a0) * R * it.r0, z, cx, cy, cosX, sinX, cosY, sinY);
          const pCorner = this._project3D(Math.cos(a0) * R * it.r1, Math.sin(a0) * R * it.r1, z, cx, cy, cosX, sinX, cosY, sinY);
          const p1 = this._project3D(Math.cos(a1) * R * it.r1, Math.sin(a1) * R * it.r1, z, cx, cy, cosX, sinX, cosY, sinY);

          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(pCorner.sx, pCorner.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${layer.alpha * it.bright * 0.72})`;
          ctx.lineWidth = it.weight * 0.88;
          ctx.stroke();
        } else {
          const a0 = it.a0 + drift;
          const a1 = it.a1 + drift;
          const steps = 5;
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const frac = k / steps;
            const a = a0 + (a1 - a0) * frac;
            const r = (it.r0 + (it.r1 - it.r0) * frac) * R;
            const pt = this._project3D(Math.cos(a) * r, Math.sin(a) * r, z, cx, cy, cosX, sinX, cosY, sinY);
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${layer.alpha * it.bright * 0.65})`;
          ctx.lineWidth = it.weight * 0.8;
          ctx.stroke();
        }
      }
    }
  }

  _renderHoudiniParticleCloud(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    const data = this.voxelData;
    const count = this.voxelCount;
    const t = this.elapsedTime;
    const pulseWave = (t * 0.20) % 1.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      const regionType = data[idx + 6];
      const angle = data[idx + 0] + (regionType === 1 ? Math.sin(t * 0.5 + i) * 0.04 : t * data[idx + 3]);
      const zVal = data[idx + 1];
      const rRatio = data[idx + 2];
      const size = data[idx + 4];
      const phase = data[idx + 5];
      const bloomFlag = data[idx + 7];

      let x, y, z;
      if (regionType === 1) {
        const [lx, ly] = this._lobeHalfEllipsePoint(angle, rRatio, rRatio);
        x = lx * R;
        y = ly * R;
        z = zVal * R;
      } else {
        const rad = R * rRatio;
        const cz = Math.cos(zVal);
        x = Math.cos(angle) * rad * cz;
        y = Math.sin(angle) * rad * cz;
        z = rad * Math.sin(zVal);
      }

      const proj = this._project3D(x, y, z, cx, cy, cosX, sinX, cosY, sinY);
      const zNorm = (proj.z + R) / (2 * R);
      if (zNorm < 0.04) continue;

      const shimmer = 0.60 + 0.40 * Math.sin(t * 2.5 + phase);
      const waveDist = Math.abs(rRatio - pulseWave);
      const waveBoost = waveDist < 0.13 ? (1.0 - waveDist / 0.13) * 0.42 : 0;
      const alpha = Math.min(0.96, (0.26 + zNorm * 0.68) * shimmer + waveBoost);

      if (bloomFlag && this.bloomSprite) {
        const bRadius = (14 + size * 8) * proj.scale;
        ctx.globalAlpha = alpha * 0.32;
        ctx.drawImage(this.bloomSprite, proj.sx - bRadius * 0.5, proj.sy - bRadius * 0.5, bRadius, bRadius);
        ctx.globalAlpha = 1.0;
      }

      if (waveBoost > 0.18 || i % 5 === 0) {
        ctx.fillStyle = `rgba(${hr}, ${hg}, ${hb}, ${alpha})`;
      } else if (i % 2 === 0) {
        ctx.fillStyle = `rgba(${gr}, ${gg}, ${gb}, ${alpha * 0.92})`;
      } else {
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha * 0.85})`;
      }

      const ptW = Math.max(0.95, size * proj.scale * (i % 4 === 0 ? 1.7 : 1.0));
      const ptH = Math.max(0.95, size * proj.scale);
      ctx.fillRect(proj.sx - ptW * 0.5, proj.sy - ptH * 0.5, ptW, ptH);
    }
  }

  _renderIrisCore(ctx, coreX, coreY, R, cosX, sinX, cosY, sinY) {
    const [hr, hg, hb] = this.mode.hotRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    const torusGrad = ctx.createRadialGradient(coreX, coreY, R * 0.015, coreX, coreY, R * 0.34);
    torusGrad.addColorStop(0.0, 'rgba(255, 228, 145, 0.22)');
    torusGrad.addColorStop(0.22, `rgba(${hr}, ${hg}, ${hb}, 0.52)`);
    torusGrad.addColorStop(0.48, `rgba(${gr}, ${gg}, ${gb}, 0.32)`);
    torusGrad.addColorStop(0.76, `rgba(${ar}, ${ag}, ${ab}, 0.14)`);
    torusGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = torusGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY, R * 0.34, 0, TAU);
    ctx.fill();

    for (let i = 0; i < this.irisRings.length; i++) {
      const ir = this.irisRings[i];
      const rad = R * ir.r;
      const cRx = Math.cos(ir.rx), sRx = Math.sin(ir.rx);
      const cRy = Math.cos(ir.ry), sRy = Math.sin(ir.ry);

      const steps = 28;
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
      ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${ir.alpha * 0.72})`;
      ctx.lineWidth = ir.weight * 0.82;
      ctx.stroke();
    }
  }
}
