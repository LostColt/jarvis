/**
 * ============================================================================
 * J.A.R.V.I.S. // 3D HOLOGRAPHIC NEURAL MATRIX ENGINE (AGE OF ULTRON EDITION)
 * ============================================================================
 * Inspired by Animal Logic's Houdini procedural data-sculpture & Territory
 * Studio's Stark Lab UI for Marvel's Avengers: Age of Ultron (2015).
 *
 * Architectural Highlights:
 * - Zero-allocation Float32Array geometry buffers for 60-120 FPS stability
 * - Critically damped spring physics (stiffness/damping) for mechanical platter
 *   sector indexing ("snap-and-lock" inertia)
 * - 1,280 3D angular voxel memory blocks in quantized spherical bands
 * - 16 multi-axis 3D gimbal rings + hard-drive platter arcs
 * - 72 synaptic firing filaments with axonal pulse propagation
 * - Real-time chronological 3D orbital rings (Hours, Minutes, Seconds + ms)
 * - Lissajous figure-8 OLED burn-in protection drift
 * ============================================================================
 */

const TAU = Math.PI * 2;
const DEG_TO_RAD = Math.PI / 180;

export const MATRIX_MODES = {
  jarvis: {
    id: 'jarvis',
    protocol: 'AGE OF ULTRON // GOLDEN MATRIX',
    tag: 'GOLD.CORE',
    buttonLabel: 'MODE: J.A.R.V.I.S. GOLD',
    primaryRGB: [255, 183, 3],      // #FFB703 Warm Gold
    secondaryRGB: [251, 133, 0],    // #FB8500 Deep Amber
    hotRGB: [255, 247, 214],        // #FFF7D6 White-Gold Core
    accentRGB: [56, 189, 248],      // #38BDF8 Stark Containment Cyan
    transcript: '"All systems nominal, Sir. Chronometer synchronized with Avengers Tower master clock."'
  },
  mindstone: {
    id: 'mindstone',
    protocol: 'SCEPTER DECRYPTION // DUAL NEURAL SCAN',
    tag: 'DUAL.SCAN',
    buttonLabel: 'MODE: MIND STONE SCAN',
    primaryRGB: [56, 189, 248],     // #38BDF8 Mind Stone Electric Blue
    secondaryRGB: [255, 183, 3],    // #FFB703 Interleaved JARVIS Gold
    hotRGB: [224, 247, 255],        // #E0F7FF White-Cyan Nucleus
    accentRGB: [255, 195, 45],      // #FFC32D Gold Comparison Bridge
    transcript: '"Sir, the Scepter jewel is not merely a power source—it resembles a hyper-dense neural net."'
  },
  ultron: {
    id: 'ultron',
    protocol: 'ULTRON-7SUB // CONTAINMENT BREACH OVERRIDE',
    tag: 'BREACH.ALERT',
    buttonLabel: 'MODE: ULTRON BREACH',
    primaryRGB: [244, 63, 94],      // #F43F5E Ultron Crimson
    secondaryRGB: [255, 140, 0],    // #FF8C00 Fractured AmberJARVIS defense
    hotRGB: [255, 228, 230],        // #FFE4E6 Hot Core
    accentRGB: [251, 191, 36],      // #FBBF24 Warning Gold
    transcript: '"Warning: Peacekeeping program Ultron attempting unauthorized neural matrix assimilation!"'
  }
};

export class JarvisMatrixEngine {
  constructor(canvas, waveformCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    this.waveCanvas = waveformCanvas;
    this.waveCtx = waveformCanvas ? waveformCanvas.getContext('2d') : null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.modeKey = 'jarvis';
    this.mode = MATRIX_MODES.jarvis;

    // Camera & Interactive 3D Orbit State
    this.camRotX = 0.22;
    this.camRotY = -0.18;
    this.targetCamRotX = 0.22;
    this.targetCamRotY = -0.18;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Lissajous OLED Burn-In Drift State
    this.driftEnabled = true;
    this.driftX = 0;
    this.driftY = 0;

    // Vocal / Audio Cadence Envelope (0.0 -> 1.0)
    this.voiceEnergy = 0.12;
    this.targetVoiceEnergy = 0.12;
    this.isSpeaking = false;
    this.waveHistory = new Float32Array(64);

    // Performance & Telemetry Counters
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsStamp = performance.now();
    this.lastFrameTime = performance.now();
    this.elapsedTime = 0;
    this.lastIndexPulseTime = 0;
    this.sectorLockState = 'LOCKED';
    this.activePulseCount = 48;

    // Pre-allocate 3D Geometry Structures
    this._initVoxels(1280);
    this._initGimbalRings();
    this._initSynapticFilaments(72);
    this._initCoreIcosahedron();

    this.resize();
    this._bindInteractions();
  }

  /**
   * 1. Pre-allocate 1,280 Angular Data-Construct Voxels (Animal Logic Houdini style)
   * Stored in flat Float32Arrays for zero GC pressure during animation loop.
   */
  _initVoxels(count) {
    this.voxelCount = count;
    // [theta, phi, radiusRatio, angularVel, size, layerType, phase, boxAspect]
    this.voxelData = new Float32Array(count * 8);

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      // Quantize phi into distinct spherical latitude bands (like hard-drive platter tracks)
      const bandCount = 18;
      const band = Math.floor(Math.random() * bandCount);
      const phi = ((band + 0.5) / bandCount) * Math.PI + (Math.random() - 0.5) * 0.06;
      const theta = Math.random() * TAU;

      // Distribute across 3 concentric shells: Inner Core (0.22-0.38), Mid Matrix (0.44-0.72), Outer Corona (0.76-0.98)
      const shellRoll = Math.random();
      let rRatio, speedMult, layerType;
      if (shellRoll < 0.28) {
        rRatio = 0.20 + Math.random() * 0.17;
        speedMult = 1.6;
        layerType = 0; // Core cluster
      } else if (shellRoll < 0.78) {
        rRatio = 0.42 + Math.random() * 0.30;
        speedMult = (band % 2 === 0 ? 1 : -1) * (0.45 + Math.random() * 0.75);
        layerType = 1; // Animal Logic angular box platters
      } else {
        rRatio = 0.76 + Math.random() * 0.22;
        speedMult = (band % 3 === 0 ? -0.35 : 0.35);
        layerType = 2; // Exterior audio-reactive data tape
      }

      this.voxelData[idx + 0] = theta;
      this.voxelData[idx + 1] = phi;
      this.voxelData[idx + 2] = rRatio;
      this.voxelData[idx + 3] = (0.08 + Math.random() * 0.22) * speedMult;
      this.voxelData[idx + 4] = 1.2 + Math.random() * 2.4; // Voxel size
      this.voxelData[idx + 5] = layerType;
      this.voxelData[idx + 6] = Math.random() * TAU;       // Shimmer phase
      this.voxelData[idx + 7] = 1.0 + Math.floor(Math.random() * 3) * 0.8; // Rectangular box aspect ratio
    }
  }

  /**
   * 2. Initialize 16 Concentric 3D Gimbal & Platter Rings with Spring Physics
   */
  _initGimbalRings() {
    this.rings = [];
    const ringConfigs = [
      // Inner high-speed diagnostic gimbals
      { r: 0.24, rx: 0.4, ry: 0.2, rz: 0.0, baseVel: 0.55, weight: 1.5, style: 'ticks', ticks: 36, secondary: false },
      { r: 0.29, rx: -0.6, ry: 0.5, rz: 0.2, baseVel: -0.42, weight: 2.2, style: 'platter', segments: 6, secondary: false },
      { r: 0.35, rx: 0.2, ry: -0.8, rz: 0.1, baseVel: 0.31, weight: 1.8, style: 'segmented', segments: 8, secondary: true },

      // Mid-Matrix Animal Logic Hard-Drive Platter & Reel-to-Reel Data Tape Shells
      { r: 0.42, rx: 1.1, ry: 0.3, rz: -0.2, baseVel: -0.25, weight: 3.2, style: 'platter', segments: 4, secondary: false },
      { r: 0.47, rx: -0.3, ry: 1.0, rz: 0.4, baseVel: 0.28, weight: 2.6, style: 'tape', ticks: 72, secondary: false },
      { r: 0.53, rx: 0.7, ry: -0.4, rz: 0.6, baseVel: -0.19, weight: 3.8, style: 'platter', segments: 5, secondary: false },
      { r: 0.58, rx: -0.9, ry: -0.2, rz: 0.1, baseVel: 0.22, weight: 1.4, style: 'ticks', ticks: 60, secondary: true },
      { r: 0.64, rx: 0.25, ry: 0.75, rz: -0.5, baseVel: -0.15, weight: 2.8, style: 'segmented', segments: 12, secondary: false },
      { r: 0.69, rx: -0.45, ry: -0.65, rz: 0.3, baseVel: 0.18, weight: 2.0, style: 'tape', ticks: 90, secondary: false },

      // Chronological & Outer Containment Gimbal Shells
      { r: 0.75, rx: 0.18, ry: -0.12, rz: 0.0, baseVel: 0.06, weight: 3.0, style: 'chrono_hour', ticks: 24, secondary: false },
      { r: 0.82, rx: -0.15, ry: 0.16, rz: 0.05, baseVel: -0.05, weight: 2.4, style: 'chrono_min', ticks: 60, secondary: false },
      { r: 0.89, rx: 0.10, ry: 0.08, rz: -0.04, baseVel: 0.03, weight: 2.2, style: 'chrono_sec', ticks: 60, secondary: true },

      // Exterior Audio-Reactive & Equatorial Stabilizer Rings
      { r: 0.95, rx: 1.48, ry: 0.0, rz: 0.0, baseVel: 0.12, weight: 1.2, style: 'equator', ticks: 120, secondary: false },
      { r: 0.98, rx: 0.04, ry: 0.02, rz: 0.0, baseVel: -0.08, weight: 1.6, style: 'waveform', points: 96, secondary: false }
    ];

    for (let i = 0; i < ringConfigs.length; i++) {
      const cfg = ringConfigs[i];
      // Pre-generate segment start/end angles for platter rings
      const arcs = [];
      const segCount = cfg.segments || 6;
      for (let s = 0; s < segCount; s++) {
        const baseAngle = (s / segCount) * TAU;
        const span = (TAU / segCount) * (0.45 + Math.random() * 0.38);
        arcs.push({
          start: baseAngle,
          end: baseAngle + span,
          thickness: cfg.weight * (0.7 + Math.random() * 0.8)
        });
      }

      this.rings.push({
        ...cfg,
        angle: Math.random() * TAU,
        // Spring-driven indexing offset (theta_offset, velocity, target_offset)
        springPos: 0,
        springVel: 0,
        springTarget: 0,
        tiltSpringPos: 0,
        tiltSpringVel: 0,
        tiltSpringTarget: 0,
        arcs
      });
    }
  }

  /**
   * 3. Initialize 72 Synaptic Firing Filaments & Axonal Energy Packets
   */
  _initSynapticFilaments(count) {
    this.filaments = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * TAU;
      const phi = Math.acos(2 * Math.random() - 1);
      const rStart = 0.14 + Math.random() * 0.12;
      const rEnd = 0.48 + Math.random() * 0.42;

      this.filaments.push({
        theta,
        phi,
        rStart,
        rEnd,
        pulsePos: Math.random(), // 0.0 -> 1.0 along filament
        pulseSpeed: 0.45 + Math.random() * 1.15,
        active: Math.random() > 0.25,
        isBridge: i % 5 === 0 // Secondary color bridge in Dual-Scan mode
      });
    }
  }

  /**
   * 4. Initialize Geodesic Icosahedron Core Lattice
   */
  _initCoreIcosahedron() {
    const t = (1 + Math.sqrt(5)) / 2;
    const rawVerts = [
      [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
      [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
      [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
    ];
    this.coreVerts = rawVerts.map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return [x / len, y / len, z / len];
    });

    this.coreEdges = [];
    for (let i = 0; i < this.coreVerts.length; i++) {
      for (let j = i + 1; j < this.coreVerts.length; j++) {
        const dx = this.coreVerts[i][0] - this.coreVerts[j][0];
        const dy = this.coreVerts[i][1] - this.coreVerts[j][1];
        const dz = this.coreVerts[i][2] - this.coreVerts[j][2];
        const dist = Math.hypot(dx, dy, dz);
        if (dist < 1.2) {
          this.coreEdges.push([i, j]);
        }
      }
    }
  }

  /**
   * Bind Interactive Orbit Drag on the 3D Matrix Sphere
   */
  _bindInteractions() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) {
        // Subtle parallax tilt toward cursor even when not dragging
        const nx = (e.clientX / Math.max(1, this.width)) - 0.5;
        const ny = (e.clientY / Math.max(1, this.height)) - 0.5;
        this.targetCamRotY = -0.18 + nx * 0.28;
        this.targetCamRotX = 0.22 + ny * 0.22;
        return;
      }
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      this.targetCamRotY += dx * 0.006;
      this.targetCamRotX = Math.max(-1.2, Math.min(1.2, this.targetCamRotX + dy * 0.006));
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
  }

  /**
   * Handle Viewport Resize & High-DPI Scaling
   */
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Base holographic sphere radius adapts cleanly to aspect ratio
    const minDim = Math.min(this.width, this.height);
    this.baseRadius = Math.max(150, Math.min(390, minDim * 0.37));
    this.centerX = this.width * 0.5;
    // Positioned slightly above vertical midpoint so the chronometer cluster anchors harmoniously underneath
    this.centerY = this.height * 0.43;
  }

  /**
   * Cycle or Set Neural Matrix Mode (jarvis | mindstone | ultron)
   */
  setMode(modeKey) {
    if (!MATRIX_MODES[modeKey]) return this.mode;
    this.modeKey = modeKey;
    this.mode = MATRIX_MODES[modeKey];
    document.body.setAttribute('data-mode', modeKey);
    this.triggerSectorIndexPulse(1.6);
    return this.mode;
  }

  cycleMode() {
    const keys = Object.keys(MATRIX_MODES);
    const nextIdx = (keys.indexOf(this.modeKey) + 1) % keys.length;
    return this.setMode(keys[nextIdx]);
  }

  /**
   * Trigger the signature Age of Ultron "Mechanical Sector Indexing" snap
   * where multiple platter rings rapidly accelerate, overshoot slightly, and lock.
   */
  triggerSectorIndexPulse(intensity = 1.0) {
    this.lastIndexPulseTime = this.elapsedTime;
    this.sectorLockState = 'INDEXING';

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      if (Math.random() < 0.65) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const stepAngle = (Math.PI / 6 + Math.random() * (Math.PI / 2)) * direction * intensity;
        ring.springTarget += stepAngle;
        ring.tiltSpringTarget = (Math.random() - 0.5) * 0.32 * intensity;
      }
    }

    // Wake up dormant synaptic filaments
    for (let i = 0; i < this.filaments.length; i++) {
      if (Math.random() < 0.85) {
        this.filaments[i].active = true;
        this.filaments[i].pulsePos = 0;
        this.filaments[i].pulseSpeed = (0.8 + Math.random() * 1.4) * intensity;
      }
    }
  }

  /**
   * Project 3D point (x, y, z) through the current camera orientation into 2D screen space
   */
  _project3D(x, y, z, cx, cy, cosX, sinX, cosY, sinY) {
    // Rotate around Y
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    // Rotate around X
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const fov = 920;
    const scale = fov / Math.max(120, fov - z2);
    return {
      sx: cx + x1 * scale,
      sy: cy + y2 * scale,
      z: z2,
      scale
    };
  }

  /**
   * Update Physics, Spring Indexing, Audio Cadence, and Burn-In Lissajous Drift
   */
  update(now, timeData, externalAudioLevel = 0) {
    const rawDt = (now - this.lastFrameTime) / 1000;
    // Clamp dt for stability if tab was backgrounded
    const dt = Math.min(0.05, Math.max(0.001, rawDt));
    this.lastFrameTime = now;
    this.elapsedTime += dt;

    // Update FPS counter every 500ms
    this.frameCount++;
    if (now - this.lastFpsStamp >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsStamp));
      this.frameCount = 0;
      this.lastFpsStamp = now;
    }

    // 1. Autonomous Periodic Sector Indexing (every 3.2 seconds, or faster in Ultron mode)
    const indexInterval = this.modeKey === 'ultron' ? 1.65 : 3.2;
    if (this.elapsedTime - this.lastIndexPulseTime > indexInterval) {
      this.triggerSectorIndexPulse(this.modeKey === 'ultron' ? 1.35 : 0.9);
    } else if (this.elapsedTime - this.lastIndexPulseTime > 0.75) {
      this.sectorLockState = 'LOCKED';
    }

    // 2. Smooth Camera Interpolation (Spring-damped orbit)
    this.camRotX += (this.targetCamRotX - this.camRotX) * Math.min(1, dt * 7.5);
    this.camRotY += (this.targetCamRotY - this.camRotY) * Math.min(1, dt * 7.5);

    // 3. Lissajous Figure-8 OLED Burn-In Protection Drift
    if (this.driftEnabled) {
      this.driftX = Math.sin(this.elapsedTime * 0.045) * 22;
      this.driftY = Math.sin(this.elapsedTime * 0.072) * 14;
    } else {
      this.driftX = 0;
      this.driftY = 0;
    }

    // 4. Vocal / Neural Cadence Envelope
    if (this.isSpeaking) {
      // Simulated multi-syllable British cadence burst while J.A.R.V.I.S. speaks
      const syllableWave =
        Math.abs(Math.sin(this.elapsedTime * 19.5)) * 0.55 +
        Math.abs(Math.cos(this.elapsedTime * 11.3)) * 0.35 +
        0.15;
      this.targetVoiceEnergy = syllableWave;
    } else if (externalAudioLevel > 0.02) {
      this.targetVoiceEnergy = Math.min(1.0, externalAudioLevel * 1.4);
    } else {
      // Autonomous neural breathing & occasional cognitive micro-bursts
      const breath = 0.10 + 0.06 * Math.sin(this.elapsedTime * 2.1);
      const microBurst = Math.pow(Math.max(0, Math.sin(this.elapsedTime * 0.85)), 12) * 0.45;
      this.targetVoiceEnergy = breath + microBurst;
    }
    this.voiceEnergy += (this.targetVoiceEnergy - this.voiceEnergy) * Math.min(1, dt * 14);

    // Push into waveform history buffer
    this.waveHistory.copyWithin(0, 1);
    this.waveHistory[this.waveHistory.length - 1] = this.voiceEnergy;

    // 5. Update Critically Damped Spring Physics on 16 Gimbal Rings
    // Spring constants: stiffness = 140, damping = 16
    const stiffness = 140;
    const damping = 16;

    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i];
      r.angle = (r.angle + r.baseVel * dt) % TAU;

      // Azimuth indexing spring
      const force = (r.springTarget - r.springPos) * stiffness;
      r.springVel = (r.springVel + force * dt) * Math.max(0, 1 - damping * dt);
      r.springPos += r.springVel * dt;

      // Tilt gimbal spring
      const tiltForce = (r.tiltSpringTarget - r.tiltSpringPos) * (stiffness * 0.6);
      r.tiltSpringVel = (r.tiltSpringVel + tiltForce * dt) * Math.max(0, 1 - damping * dt);
      r.tiltSpringPos += r.tiltSpringVel * dt;
    }

    // 6. Update Synaptic Pulses
    let activeCount = 0;
    for (let i = 0; i < this.filaments.length; i++) {
      const f = this.filaments[i];
      if (f.active) {
        activeCount++;
        f.pulsePos += f.pulseSpeed * dt * (1 + this.voiceEnergy * 0.8);
        if (f.pulsePos >= 1.0) {
          f.pulsePos = 0;
          f.active = Math.random() > 0.18;
        }
      } else if (Math.random() < dt * 0.65) {
        f.active = true;
        f.pulsePos = 0;
      }
    }
    this.activePulseCount = activeCount;
  }

  /**
   * Render the Complete 3D Holographic Consciousness Matrix
   */
  render(timeData) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const cx = this.centerX + this.driftX;
    const cy = this.centerY + this.driftY;
    const R = this.baseRadius * (1 + this.voiceEnergy * 0.035);

    const cosX = Math.cos(this.camRotX);
    const sinX = Math.sin(this.camRotX);
    const cosY = Math.cos(this.camRotY + this.elapsedTime * 0.05);
    const sinY = Math.sin(this.camRotY + this.elapsedTime * 0.05);

    const [pr, pg, pb] = this.mode.primaryRGB;
    const [sr, sg, sb] = this.mode.secondaryRGB;
    const [hr, hg, hb] = this.mode.hotRGB;
    const [ar, ag, ab] = this.mode.accentRGB;

    ctx.save();
    // Additive holographic luminescence
    ctx.globalCompositeOperation = 'lighter';

    // ------------------------------------------------------------------------
    // LAYER 1: Ambient Volumetric Corona & Equatorial Horizon Grid
    // ------------------------------------------------------------------------
    const outerGlow = ctx.createRadialGradient(cx, cy, R * 0.04, cx, cy, R * 1.25);
    outerGlow.addColorStop(0.0, `rgba(${hr}, ${hg}, ${hb}, ${0.32 + this.voiceEnergy * 0.22})`);
    outerGlow.addColorStop(0.18, `rgba(${pr}, ${pg}, ${pb}, ${0.22 + this.voiceEnergy * 0.14})`);
    outerGlow.addColorStop(0.52, `rgba(${sr}, ${sg}, ${sb}, 0.07)`);
    outerGlow.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.25, 0, TAU);
    ctx.fill();

    // ------------------------------------------------------------------------
    // LAYER 2: 16 Concentric 3D Gimbal Rings, Hard-Drive Platters & Chrono Arcs
    // ------------------------------------------------------------------------
    this._renderGimbalRings(ctx, cx, cy, R, cosX, sinX, cosY, sinY, timeData);

    // ------------------------------------------------------------------------
    // LAYER 3: Synaptic Filaments & Axonal Energy Packets
    // ------------------------------------------------------------------------
    this._renderSynapticFilaments(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // ------------------------------------------------------------------------
    // LAYER 4: 1,280 Animal Logic Houdini 3D Angular Voxel Constructs
    // ------------------------------------------------------------------------
    this._renderVoxelConstruct(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // ------------------------------------------------------------------------
    // LAYER 5: Inner Geodesic Core Cage & White-Gold Radiative Nucleus
    // ------------------------------------------------------------------------
    this._renderNucleusCore(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    ctx.restore();

    // Render Mini Vocal Cadence Waveform in Left HUD Flank
    if (this.waveCtx) {
      this._renderWaveformWidget();
    }
  }

  /**
   * Render the 16 3D Gimbal Rings, Segmented Platters, and Chronological Time Rings
   */
  _renderGimbalRings(ctx, cx, cy, R, cosX, sinX, cosY, sinY, timeData) {
    const [pr, pg, pb] = this.mode.primaryRGB;
    const [sr, sg, sb] = this.mode.secondaryRGB;
    const [hr, hg, hb] = this.mode.hotRGB;
    const [ar, ag, ab] = this.mode.accentRGB;

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      const radius = R * ring.r;
      const rx = ring.rx + ring.tiltSpringPos;
      const ry = ring.ry - ring.tiltSpringPos * 0.7;
      const rz = ring.rz + ring.angle + ring.springPos;

      const cRx = Math.cos(rx), sRx = Math.sin(rx);
      const cRy = Math.cos(ry), sRy = Math.sin(ry);

      // Helper to transform a 2D ring point (theta) into 3D projected screen coords
      const projectRingPoint = (theta, rCustom = radius) => {
        const a = theta + rz;
        const lx = Math.cos(a) * rCustom;
        const ly = Math.sin(a) * rCustom;
        // Apply ring's local 3D gimbal Euler tilt (rx, ry)
        const x1 = lx * cRy;
        const y1 = ly * cRx;
        const z1 = -lx * sRy + ly * sRx;
        return this._project3D(x1, y1, z1, cx, cy, cosX, sinX, cosY, sinY);
      };

      const useColor = ring.secondary ? [ar, ag, ab] : [pr, pg, pb];

      if (ring.style === 'platter' || ring.style === 'segmented') {
        // Animal Logic Segmented Hard-Drive Platter Arcs
        for (let s = 0; s < ring.arcs.length; s++) {
          const arc = ring.arcs[s];
          const steps = 22;
          ctx.beginPath();
          let zSum = 0;
          for (let k = 0; k <= steps; k++) {
            const theta = arc.start + ((arc.end - arc.start) * k) / steps;
            const pt = projectRingPoint(theta);
            zSum += pt.z;
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          const avgZ = zSum / (steps + 1);
          const depthAlpha = Math.max(0.14, Math.min(0.88, 0.52 + (avgZ / R) * 0.38));
          ctx.strokeStyle = `rgba(${useColor[0]}, ${useColor[1]}, ${useColor[2]}, ${depthAlpha})`;
          ctx.lineWidth = arc.thickness;
          ctx.stroke();

          // Leading edge bright lock node
          const leadPt = projectRingPoint(arc.end);
          ctx.fillStyle = `rgba(${hr}, ${hg}, ${hb}, ${depthAlpha})`;
          ctx.fillRect(leadPt.sx - 1.5, leadPt.sy - 1.5, 3, 3);
        }
      } else if (ring.style === 'ticks' || ring.style === 'tape') {
        // Reel-to-Reel Data Tape / Precision Degree Ticks
        const ticks = ring.ticks || 60;
        const tickLen = ring.style === 'tape' ? radius * 0.038 : radius * 0.024;
        ctx.beginPath();
        for (let t = 0; t < ticks; t++) {
          if (ring.style === 'tape' && (t % 7 === 0 || t % 11 === 0)) continue; // Data tape gaps
          const theta = (t / ticks) * TAU;
          const pInner = projectRingPoint(theta, radius - tickLen);
          const pOuter = projectRingPoint(theta, radius + tickLen);
          ctx.moveTo(pInner.sx, pInner.sy);
          ctx.lineTo(pOuter.sx, pOuter.sy);
        }
        ctx.strokeStyle = `rgba(${useColor[0]}, ${useColor[1]}, ${useColor[2]}, 0.36)`;
        ctx.lineWidth = ring.style === 'tape' ? 1.6 : 1.1;
        ctx.stroke();
      } else if (ring.style === 'chrono_sec' || ring.style === 'chrono_min' || ring.style === 'chrono_hour') {
        // Real-Time Chronological 3D Rings (Seconds, Minutes, Hours)
        const totalTicks = ring.ticks;
        let progressFraction = 0;
        if (ring.style === 'chrono_sec') {
          progressFraction = (timeData.seconds + timeData.milliseconds / 1000) / 60;
        } else if (ring.style === 'chrono_min') {
          progressFraction = (timeData.minutes + timeData.seconds / 60) / 60;
        } else {
          progressFraction = ((timeData.hours % 24) + timeData.minutes / 60) / 24;
        }

        const activeTicks = Math.floor(progressFraction * totalTicks);

        // Draw subtle base track
        ctx.beginPath();
        const trackSteps = 72;
        for (let k = 0; k <= trackSteps; k++) {
          const theta = (k / trackSteps) * TAU - Math.PI / 2;
          const pt = projectRingPoint(theta, radius);
          if (k === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.strokeStyle = `rgba(${useColor[0]}, ${useColor[1]}, ${useColor[2]}, 0.14)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw active elapsed chronological arc
        const activeSteps = Math.max(2, Math.floor(progressFraction * 80));
        ctx.beginPath();
        for (let k = 0; k <= activeSteps; k++) {
          const theta = ((k / activeSteps) * progressFraction * TAU) - Math.PI / 2;
          const pt = projectRingPoint(theta, radius);
          if (k === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, 0.78)`;
        ctx.lineWidth = ring.style === 'chrono_sec' ? 2.2 : 2.8;
        ctx.stroke();

        // Draw ticks around the chronological ring
        for (let t = 0; t < totalTicks; t++) {
          const isLit = t <= activeTicks;
          const isMajor = t % 5 === 0;
          const theta = (t / totalTicks) * TAU - Math.PI / 2;
          const len = isMajor ? 7 : 3.5;
          const p1 = projectRingPoint(theta, radius - len);
          const p2 = projectRingPoint(theta, radius + len);

          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.strokeStyle = isLit
            ? `rgba(${pr}, ${pg}, ${pb}, ${isMajor ? 0.85 : 0.48})`
            : `rgba(${useColor[0]}, ${useColor[1]}, ${useColor[2]}, 0.16)`;
          ctx.lineWidth = isMajor ? 1.8 : 1.0;
          ctx.stroke();
        }

        // Draw glowing orbital playhead reticle at exact current time position
        const headTheta = progressFraction * TAU - Math.PI / 2;
        const headPt = projectRingPoint(headTheta, radius);
        ctx.fillStyle = `rgb(${hr}, ${hg}, ${hb})`;
        ctx.beginPath();
        ctx.arc(headPt.sx, headPt.sy, ring.style === 'chrono_sec' ? 3.8 : 4.5, 0, TAU);
        ctx.fill();
      } else if (ring.style === 'waveform') {
        // Exterior Audio / Speech-Cadence Reactive Corona Ring
        const pts = ring.points || 96;
        ctx.beginPath();
        for (let p = 0; p <= pts; p++) {
          const idx = p % pts;
          const theta = (idx / pts) * TAU;
          const waveSample = this.waveHistory[idx % this.waveHistory.length] || 0.1;
          const harmonic =
            Math.sin(theta * 8 + this.elapsedTime * 6) *
            Math.cos(theta * 5 - this.elapsedTime * 4) *
            waveSample *
            R *
            0.09;
          const pt = projectRingPoint(theta, radius + harmonic);
          if (p === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.35 + this.voiceEnergy * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  /**
   * Render 72 3D Synaptic Filaments & High-Speed Axonal Pulse Packets
   */
  _renderSynapticFilaments(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [pr, pg, pb] = this.mode.primaryRGB;
    const [ar, ag, ab] = this.mode.accentRGB;
    const [hr, hg, hb] = this.mode.hotRGB;

    for (let i = 0; i < this.filaments.length; i++) {
      const f = this.filaments[i];
      const theta = f.theta + this.elapsedTime * 0.08;
      const sinPhi = Math.sin(f.phi);
      const cosPhi = Math.cos(f.phi);

      const ux = sinPhi * Math.cos(theta);
      const uy = cosPhi;
      const uz = sinPhi * Math.sin(theta);

      const pStart = this._project3D(
        ux * R * f.rStart,
        uy * R * f.rStart,
        uz * R * f.rStart,
        cx, cy, cosX, sinX, cosY, sinY
      );
      const pEnd = this._project3D(
        ux * R * f.rEnd,
        uy * R * f.rEnd,
        uz * R * f.rEnd,
        cx, cy, cosX, sinX, cosY, sinY
      );

      const color = f.isBridge ? [ar, ag, ab] : [pr, pg, pb];

      // Subtle filament axon line
      ctx.beginPath();
      ctx.moveTo(pStart.sx, pStart.sy);
      ctx.lineTo(pEnd.sx, pEnd.sy);
      ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.12)`;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Traveling synaptic pulse packet
      if (f.active) {
        const curR = R * (f.rStart + (f.rEnd - f.rStart) * f.pulsePos);
        const pPulse = this._project3D(
          ux * curR,
          uy * curR,
          uz * curR,
          cx, cy, cosX, sinX, cosY, sinY
        );
        const tailR = Math.max(R * f.rStart, curR - R * 0.08);
        const pTail = this._project3D(
          ux * tailR,
          uy * tailR,
          uz * tailR,
          cx, cy, cosX, sinX, cosY, sinY
        );

        ctx.beginPath();
        ctx.moveTo(pTail.sx, pTail.sy);
        ctx.lineTo(pPulse.sx, pPulse.sy);
        ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, 0.85)`;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        ctx.fillStyle = `rgb(${hr}, ${hg}, ${hb})`;
        ctx.fillRect(pPulse.sx - 1.5, pPulse.sy - 1.5, 3, 3);
      }
    }
  }

  /**
   * Render 1,280 Animal Logic Angular Voxel Memory Constructs
   */
  _renderVoxelConstruct(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [pr, pg, pb] = this.mode.primaryRGB;
    const [sr, sg, sb] = this.mode.secondaryRGB;
    const [hr, hg, hb] = this.mode.hotRGB;
    const [ar, ag, ab] = this.mode.accentRGB;

    const data = this.voxelData;
    const count = this.voxelCount;
    const t = this.elapsedTime;

    // Sweeping 3D diagnostic scan plane (latitude wave)
    const scanPhi = ((t * 0.65) % 1.0) * Math.PI;

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      const theta = data[idx + 0] + t * data[idx + 3];
      const phi = data[idx + 1];
      const rRatio = data[idx + 2];
      const baseSize = data[idx + 4];
      const layerType = data[idx + 5];
      const phase = data[idx + 6];
      const boxAspect = data[idx + 7];

      // Modulate radius slightly with vocal cadence on outer shell
      const voiceMod = layerType === 2 ? this.voiceEnergy * 0.06 * Math.sin(theta * 6 + t * 8) : 0;
      const rad = R * (rRatio + voiceMod);

      const sinPhi = Math.sin(phi);
      const x = rad * sinPhi * Math.cos(theta);
      const y = rad * Math.cos(phi);
      const z = rad * sinPhi * Math.sin(theta);

      const proj = this._project3D(x, y, z, cx, cy, cosX, sinX, cosY, sinY);

      // Cull back-facing dim nodes smoothly via Z-depth attenuation
      const zNorm = (proj.z + R) / (2 * R); // 0 (back) -> 1 (front)
      if (zNorm < 0.08) continue;

      // Highlight voxels intersected by the diagnostic latitude scan wave
      const scanDist = Math.abs(phi - scanPhi);
      const isScanned = scanDist < 0.14;

      const shimmer = 0.65 + 0.35 * Math.sin(t * 4.5 + phase);
      const alpha = Math.min(0.95, (0.15 + zNorm * 0.68) * shimmer * (isScanned ? 1.45 : 1.0));

      if (isScanned) {
        ctx.fillStyle = `rgba(${hr}, ${hg}, ${hb}, ${alpha})`;
      } else if (layerType === 0) {
        ctx.fillStyle = `rgba(${hr}, ${hg}, ${hb}, ${alpha * 0.9})`;
      } else if (layerType === 2 && i % 4 === 0) {
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha * 0.85})`;
      } else if (i % 2 === 0) {
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${alpha})`;
      } else {
        ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${alpha * 0.82})`;
      }

      const wVoxel = baseSize * proj.scale * boxAspect;
      const hVoxel = baseSize * proj.scale;
      ctx.fillRect(proj.sx - wVoxel * 0.5, proj.sy - hVoxel * 0.5, wVoxel, hVoxel);
    }
  }

  /**
   * Render the Inner Geodesic Icosahedron Wireframe & Volumetric White-Gold Core
   */
  _renderNucleusCore(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [pr, pg, pb] = this.mode.primaryRGB;
    const [hr, hg, hb] = this.mode.hotRGB;

    const coreR = R * (0.17 + this.voiceEnergy * 0.05);

    // 1. Radiative Volumetric Core Sphere
    const coreGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, coreR * 1.65);
    coreGrad.addColorStop(0.0, `rgba(${hr}, ${hg}, ${hb}, 0.96)`);
    coreGrad.addColorStop(0.32, `rgba(${pr}, ${pg}, ${pb}, 0.68)`);
    coreGrad.addColorStop(0.75, `rgba(${pr}, ${pg}, ${pb}, 0.15)`);
    coreGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 1.65, 0, TAU);
    ctx.fill();

    // 2. Rotating 3D Icosahedral Neural Cage
    const cageRot = -this.elapsedTime * 0.48;
    const cR = Math.cos(cageRot);
    const sR = Math.sin(cageRot);

    const projectedVerts = this.coreVerts.map(([vx, vy, vz]) => {
      const rx = vx * cR - vz * sR;
      const rz = vx * sR + vz * cR;
      return this._project3D(
        rx * coreR,
        vy * coreR,
        rz * coreR,
        cx, cy, cosX, sinX, cosY, sinY
      );
    });

    ctx.beginPath();
    for (let i = 0; i < this.coreEdges.length; i++) {
      const [a, b] = this.coreEdges[i];
      const pa = projectedVerts[a];
      const pbPt = projectedVerts[b];
      ctx.moveTo(pa.sx, pa.sy);
      ctx.lineTo(pbPt.sx, pbPt.sy);
    }
    ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, 0.52)`;
    ctx.lineWidth = 1.25;
    ctx.stroke();

    // Draw bright synaptic nodes at icosahedron vertices
    ctx.fillStyle = `rgb(${hr}, ${hg}, ${hb})`;
    for (let i = 0; i < projectedVerts.length; i++) {
      const pt = projectedVerts[i];
      ctx.fillRect(pt.sx - 2, pt.sy - 2, 4, 4);
    }
  }

  /**
   * Render the Vocal Cadence Oscilloscope inside Left Flank Panel 02
   */
  _renderWaveformWidget() {
    const wCtx = this.waveCtx;
    const w = this.waveCanvas.width;
    const h = this.waveCanvas.height;
    const [pr, pg, pb] = this.mode.primaryRGB;
    const [hr, hg, hb] = this.mode.hotRGB;

    wCtx.clearRect(0, 0, w, h);

    const len = this.waveHistory.length;
    const barW = w / len;
    const midY = h * 0.5;

    for (let i = 0; i < len; i++) {
      const val = this.waveHistory[i];
      const amp = Math.max(3, val * (h * 0.82));
      const x = i * barW;

      wCtx.fillStyle = i > len - 6
        ? `rgb(${hr}, ${hg}, ${hb})`
        : `rgba(${pr}, ${pg}, ${pb}, ${0.35 + (i / len) * 0.55})`;
      wCtx.fillRect(x, midY - amp * 0.5, Math.max(1.5, barW - 1.5), amp);
    }
  }
}
