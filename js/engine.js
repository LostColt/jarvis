/**
 * ============================================================================
 * J.A.R.V.I.S. — A QUIET INTELLIGENCE (AGE OF ULTRON HOLOGRAPHIC ENGINE)
 * ============================================================================
 * Directly modeled from the 4 Avengers: Age of Ultron Stark Lab reference
 * frames:
 *
 * 1. Hollow Toroidal "Iris / Eye" Core (Ref 1 & Ref 2):
 *    Dark hollow center ringed by 22 tightly bundled, shimmering golden
 *    micro-filaments and sweeping inner calligraphic arcs.
 * 2. Paired Radial Spoke Trusses & Traveling Pulses (Ref 2 & Ref 4):
 *    Delicate twin-strut radial spokes bridging the inner iris to the outer
 *    shells, with warm bioluminescent pulses gliding along the struts and
 *    circumferential tracks.
 * 3. 56 Woven Hairline Spherical Shells & Stippled Tracks (Image 2 & Ref 1):
 *    Hundreds of ultra-fine (0.45px - 1.1px) dashed golden arcs, micro-tick
 *    comb ladders, and meridian ribbons counter-rotating at a slow, hypnotic,
 *    meditative cadence.
 * 4. Asymmetric Terraced C-Arcs & Left Equatorial Protrusion (Ref 1, 3, 4):
 *    Stepped circuit-board terraces and radial ladder teeth extending along
 *    the lower-left and upper-left perimeter.
 * 5. Optical Bokeh Depth-of-Field (Ref 2):
 *    2,200 3D golden nodes that render as crisp 1px pinpoints near the focal
 *    plane and soft, out-of-focus amber bokeh discs in the near/far Z-planes.
 * ============================================================================
 */

const TAU = Math.PI * 2;

export const MATRIX_MODES = {
  jarvis: {
    id: 'jarvis',
    name: 'J.A.R.V.I.S. Champagne Gold',
    coreRGB: [255, 238, 185],    // #FFEEB9 Warm White-Gold Pinpoint
    goldRGB: [232, 178, 72],     // #E8B248 Champagne Gold
    amberRGB: [204, 128, 28],    // #CC801C Deep Film Amber
    bronzeRGB: [138, 84, 18]     // #8A5412 Muted Shadow Bronze
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

    // Meditative Pause & Time State
    this.isPaused = false;
    this.elapsedTime = 0;
    this.lastFrameTime = performance.now();
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsStamp = performance.now();

    // Camera & Subtle Interactive Orbit
    this.camRotX = 0.14;
    this.camRotY = -0.12;
    this.targetCamRotX = 0.14;
    this.targetCamRotY = -0.12;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Lissajous Figure-8 OLED Burn-In Drift
    this.driftEnabled = true;
    this.driftX = 0;
    this.driftY = 0;

    // Compatibility state fields for pressure-test suite
    this.voiceEnergy = 0.15;
    this.sectorLockState = 'NOMINAL';
    this.activePulseCount = 64;

    // Deterministic PRNG for organic sculptural repeatability
    this._seed = 4302015;

    // Initialize the 5 Film-Accurate Structural Layers
    this._initIrisCore();
    this._initWovenShells(58);
    this._initOuterTerraces();
    this._initRadialSpokeTrusses(28);
    this._initBokehNodes(2200);

    this.resize();
    this._bindInteractions();
  }

  _rand() {
    this._seed = (this._seed * 1664525 + 1013904223) % 4294967296;
    return this._seed / 4294967296;
  }

  /**
   * 1. Central Hollow Toroidal "Eye / Iris" Core (Ref 1 & Ref 2)
   * A hollow dark aperture wrapped by 22 fine golden filament loops and
   * inner sweeping crescent bands.
   */
  _initIrisCore() {
    this.irisRings = [];
    for (let i = 0; i < 22; i++) {
      const rNorm = 0.075 + (i / 22) * 0.105;
      this.irisRings.push({
        r: rNorm,
        rx: (this._rand() - 0.5) * 0.55,
        ry: (this._rand() - 0.5) * 0.55,
        rz: this._rand() * TAU,
        speed: (i % 2 === 0 ? 1 : -1) * (0.04 + this._rand() * 0.09),
        arcStart: this._rand() * TAU,
        arcSpan: Math.PI * (0.85 + this._rand() * 0.95),
        weight: i < 6 ? 1.15 : 0.65 + this._rand() * 0.45,
        alpha: i < 5 ? 0.72 : 0.28 + this._rand() * 0.35
      });
    }
  }

  /**
   * 2. 58 Woven Hairline Spherical Shells & Stippled Tracks (Image 2 + Ref 1-4)
   * Forms the dense, gossamer golden weave of the main sphere.
   */
  _initWovenShells(shellCount) {
    this.rings = [];
    for (let i = 0; i < shellCount; i++) {
      // Concentrate density in mid-inner shells (0.20..0.88) so core feels rich without a fake blob
      const t = i / (shellCount - 1);
      const rRatio = 0.19 + Math.pow(t, 0.88) * 0.73;

      // Distribute inclinations across all 3D angles, with bias toward the film's diagonal sweep
      const rx = (this._rand() - 0.5) * Math.PI * 0.95;
      const ry = (this._rand() - 0.5) * Math.PI * 0.95;
      const rz = this._rand() * TAU;

      // Slow, hypnotic counter-rotation speeds
      const dir = i % 2 === 0 ? 1 : -1;
      const baseVel = dir * (0.018 + this._rand() * 0.055) * (1.15 - rRatio * 0.4);

      // Each shell contains 3 to 7 delicate arc segments (some solid hairline, some micro-dashed, some comb-ticks)
      const segCount = 3 + Math.floor(this._rand() * 5);
      const arcs = [];
      for (let s = 0; s < segCount; s++) {
        const baseA = (s / segCount) * TAU + (this._rand() - 0.5) * 0.25;
        const span = (TAU / segCount) * (0.28 + this._rand() * 0.52);
        const kindRoll = this._rand();
        let kind = 'hairline';
        if (kindRoll < 0.36) kind = 'dashed';
        else if (kindRoll < 0.62) kind = 'ticks';

        arcs.push({
          start: baseA,
          end: baseA + span,
          kind,
          dashStride: 2 + Math.floor(this._rand() * 3),
          tickLen: 0.008 + this._rand() * 0.014,
          weight: 0.45 + this._rand() * 0.65,
          alphaMult: 0.45 + this._rand() * 0.55,
          // Traveling pulse along this arc segment
          hasPulse: this._rand() < 0.42,
          pulsePhase: this._rand(),
          pulseSpeed: 0.08 + this._rand() * 0.16
        });
      }

      this.rings.push({
        r: rRatio,
        rx,
        ry,
        rz,
        angle: this._rand() * TAU,
        baseVel,
        // Gentle harmonic spring breathing for pressure-test compatibility
        springPos: 0,
        springVel: 0,
        springTarget: 0,
        arcs
      });
    }
  }

  /**
   * 3. Asymmetric Outer Terraced C-Ribbons & Stepped Circuit Comb Ladders
   * Directly replicates the lower-left and upper-left stepped outer arcs in
   * Ref 1, Ref 3, Ref 4, and the outer whisper tracks in Image 2.
   */
  _initOuterTerraces() {
    this.terraces = [];

    // 10 Outer whisper & stepped C-arcs concentrated on the left/lower-left/upper-left hemisphere
    const terraceConfigs = [
      { r: 0.94, rx: 0.12, ry: -0.18, start: 1.65, span: 1.95, steps: 42, kind: 'comb', speed: 0.012 },
      { r: 0.97, rx: -0.08, ry: 0.15, start: 1.85, span: 2.10, steps: 54, kind: 'dashed', speed: -0.015 },
      { r: 1.01, rx: 0.18, ry: -0.09, start: 2.05, span: 1.65, steps: 36, kind: 'terrace', speed: 0.009 },
      { r: 1.05, rx: -0.14, ry: -0.12, start: 2.20, span: 1.45, steps: 32, kind: 'dashed', speed: -0.011 },
      { r: 1.09, rx: 0.06, ry: 0.08, start: 2.40, span: 1.15, steps: 28, kind: 'comb', speed: 0.008 },
      // Upper-right & lower counterweight whisper arcs
      { r: 0.95, rx: -0.22, ry: 0.24, start: -0.85, span: 1.40, steps: 38, kind: 'dashed', speed: -0.014 },
      { r: 0.99, rx: 0.25, ry: 0.18, start: -0.55, span: 1.15, steps: 30, kind: 'comb', speed: 0.011 },
      // Ref 4 Left Equatorial Astrolabe Lobe (tilted horizontal ring protruding on the left)
      { r: 1.06, rx: 1.32, ry: -0.28, start: 2.15, span: 1.55, steps: 40, kind: 'astrolabe', speed: 0.016 }
    ];

    for (const cfg of terraceConfigs) {
      this.terraces.push({
        ...cfg,
        angle: (this._rand() - 0.5) * 0.25,
        pulsePhase: this._rand()
      });
    }
  }

  /**
   * 4. Paired Radial Spoke Trusses & Axonal Pulses (Ref 2 & Ref 4)
   * Twin hairline struts radiating from the central iris ring (r = 0.12) out
   * to the mid/outer shells (r = 0.88..1.02) with traveling golden pulses.
   */
  _initRadialSpokeTrusses(count) {
    this.spokes = [];
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * TAU + (this._rand() - 0.5) * 0.14;
      const phi = Math.acos(2 * this._rand() - 1);
      const rInner = 0.11 + this._rand() * 0.06;
      const rOuter = 0.58 + this._rand() * 0.42;

      // Twin-strut angular spread (like the V-spokes in Ref 2)
      const spread = 0.018 + this._rand() * 0.025;

      this.spokes.push({
        theta,
        phi,
        rInner,
        rOuter,
        spread,
        driftSpeed: (this._rand() - 0.5) * 0.025,
        pulsePos: this._rand(),
        pulseSpeed: 0.14 + this._rand() * 0.22,
        pulseDir: i % 3 === 0 ? -1 : 1, // Both outward and inward synaptic flow
        alpha: 0.22 + this._rand() * 0.35
      });
    }
  }

  /**
   * 5. 2,200 3D Golden Pinpoint & Bokeh Nodes (Image 2 + Ref 2)
   * Stored in flat Float32Array [theta, phi, rRatio, angularVel, size, phase, shellLayer, bokehFactor]
   */
  _initBokehNodes(count) {
    this.voxelCount = count;
    this.voxelData = new Float32Array(count * 8);

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      // Distribute along quantized latitude rings so dots form coherent curved streams
      const ringBands = 44;
      const band = Math.floor(this._rand() * ringBands);
      const phi = ((band + 0.5) / ringBands) * Math.PI + (this._rand() - 0.5) * 0.035;
      const theta = this._rand() * TAU;

      // Radial distribution: hollow inside r < 0.08, dense between 0.14 and 0.94
      const u = this._rand();
      const rRatio = 0.11 + Math.pow(u, 0.78) * 0.85;
      const dir = band % 2 === 0 ? 1 : -1;
      const angularVel = dir * (0.015 + this._rand() * 0.065) * (1.1 - rRatio * 0.35);

      const size = 0.7 + this._rand() * 1.45;
      const phase = this._rand() * TAU;
      const isBokehCandidate = this._rand() < 0.14 ? 1 : 0;

      this.voxelData[idx + 0] = theta;
      this.voxelData[idx + 1] = phi;
      this.voxelData[idx + 2] = rRatio;
      this.voxelData[idx + 3] = angularVel;
      this.voxelData[idx + 4] = size;
      this.voxelData[idx + 5] = phase;
      this.voxelData[idx + 6] = band % 3;
      this.voxelData[idx + 7] = isBokehCandidate;
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
        // Gentle, barely-perceptible parallax response to mouse position
        const nx = (e.clientX / Math.max(1, this.width)) - 0.5;
        const ny = (e.clientY / Math.max(1, this.height)) - 0.5;
        this.targetCamRotY = -0.12 + nx * 0.16;
        this.targetCamRotX = 0.14 + ny * 0.14;
        return;
      }
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      this.targetCamRotY += dx * 0.0045;
      this.targetCamRotX = Math.max(-1.1, Math.min(1.1, this.targetCamRotX + dy * 0.0045));
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
    // Generous, commanding sphere scale matching Image 2
    this.baseRadius = Math.max(150, Math.min(390, minDim * 0.38));
    this.centerX = this.width * 0.5;
    this.centerY = this.height * 0.455;
  }

  cycleMode() {
    return this.mode;
  }

  triggerSectorIndexPulse(intensity = 1.0) {
    for (let i = 0; i < this.rings.length; i++) {
      if (i % 3 === 0) {
        this.rings[i].springTarget += (i % 2 === 0 ? 1 : -1) * 0.18 * intensity;
      }
    }
  }

  _project3D(x, y, z, cx, cy, cosX, sinX, cosY, sinY) {
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const fov = 980;
    const scale = fov / Math.max(160, fov - z2);
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

    // Smooth camera glide
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

    // 2. Meditative Breathing Envelope (slow 7-second harmonic wave)
    this.voiceEnergy =
      0.12 +
      0.06 * Math.sin(this.elapsedTime * 0.9) +
      0.04 * Math.cos(this.elapsedTime * 2.1) +
      externalPulse * 0.1;

    // 3. Update Woven Spherical Shells + Gentle Spring Glide
    const stiffness = 36;
    const damping = 8.5;
    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i];
      r.angle = (r.angle + r.baseVel * dt) % TAU;

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

    // 4. Update Central Iris Rings
    for (let i = 0; i < this.irisRings.length; i++) {
      this.irisRings[i].rz = (this.irisRings[i].rz + this.irisRings[i].speed * dt) % TAU;
    }

    // 5. Update Outer Terraces
    for (let i = 0; i < this.terraces.length; i++) {
      const tr = this.terraces[i];
      tr.angle += Math.sin(this.elapsedTime * 0.35 + i) * tr.speed * dt;
      tr.pulsePhase = (tr.pulsePhase + 0.12 * dt) % 1.0;
    }

    // 6. Update Radial Spoke Trusses & Traveling Synaptic Pulses
    for (let i = 0; i < this.spokes.length; i++) {
      const sp = this.spokes[i];
      sp.theta = (sp.theta + sp.driftSpeed * dt) % TAU;
      sp.pulsePos += sp.pulseSpeed * sp.pulseDir * dt;
      if (sp.pulsePos > 1.0) sp.pulsePos = 0.0;
      if (sp.pulsePos < 0.0) sp.pulsePos = 1.0;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // True obsidian void (#020203) — no muddy background gradient
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#020203';
    ctx.fillRect(0, 0, w, h);

    const cx = this.centerX + this.driftX;
    const cy = this.centerY + this.driftY;
    const breathScale = 1 + Math.sin(this.elapsedTime * 0.85) * 0.012;
    const R = this.baseRadius * breathScale;

    // Slow, hypnotic global precession
    const globalSpinY = this.camRotY + this.elapsedTime * 0.028;
    const globalSpinX = this.camRotX + Math.sin(this.elapsedTime * 0.18) * 0.04;

    const cosX = Math.cos(globalSpinX);
    const sinX = Math.sin(globalSpinX);
    const cosY = Math.cos(globalSpinY);
    const sinY = Math.sin(globalSpinY);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Subtle warm internal atmospheric veil (kept tight inside the sphere so outer black stays pure)
    const veil = ctx.createRadialGradient(cx, cy, R * 0.08, cx, cy, R * 0.92);
    veil.addColorStop(0.0, 'rgba(212, 148, 36, 0.03)');
    veil.addColorStop(0.22, 'rgba(218, 154, 42, 0.075)');
    veil.addColorStop(0.65, 'rgba(168, 102, 18, 0.035)');
    veil.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = veil;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.92, 0, TAU);
    ctx.fill();

    // LAYER 1: Paired Radial Spoke Trusses & Traveling Synaptic Pulses (Ref 2 & Ref 4)
    this._renderRadialSpokes(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // LAYER 2: 58 Woven Hairline Spherical Shells & Stippled Tracks (Image 2 & Ref 1)
    this._renderWovenShells(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // LAYER 3: Asymmetric Outer Terraced C-Ribbons & Circuit Comb Ladders (Ref 1, 3, 4)
    this._renderOuterTerraces(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // LAYER 4: 2,200 Pinpoint Sparks & Out-of-Focus Bokeh Dust (Ref 2 & Image 2)
    this._renderBokehAndPinpoints(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    // LAYER 5: Central Hollow Toroidal "Eye / Iris" Aperture (Ref 1 & Ref 2)
    this._renderHollowIrisCore(ctx, cx, cy, R, cosX, sinX, cosY, sinY);

    ctx.restore();
  }

  /**
   * Render Layer 1: Paired Radial Spoke Trusses & Traveling Synaptic Pulses
   */
  _renderRadialSpokes(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [cr, cg, cb] = this.mode.coreRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    for (let i = 0; i < this.spokes.length; i++) {
      const sp = this.spokes[i];
      const sinPhi = Math.sin(sp.phi);
      const cosPhi = Math.cos(sp.phi);

      // Primary strut vector
      const ux1 = sinPhi * Math.cos(sp.theta - sp.spread);
      const uy1 = cosPhi;
      const uz1 = sinPhi * Math.sin(sp.theta - sp.spread);

      // Twin convergence strut vector
      const ux2 = sinPhi * Math.cos(sp.theta + sp.spread);
      const uy2 = cosPhi;
      const uz2 = sinPhi * Math.sin(sp.theta + sp.spread);

      const pIn1 = this._project3D(ux1 * R * sp.rInner, uy1 * R * sp.rInner, uz1 * R * sp.rInner, cx, cy, cosX, sinX, cosY, sinY);
      const pIn2 = this._project3D(ux2 * R * sp.rInner, uy2 * R * sp.rInner, uz2 * R * sp.rInner, cx, cy, cosX, sinX, cosY, sinY);
      // Converge slightly at outer shell node like the suspension trusses in Ref 2
      const uxMid = (ux1 + ux2) * 0.5;
      const uyMid = (uy1 + uy2) * 0.5;
      const uzMid = (uz1 + uz2) * 0.5;
      const pOut = this._project3D(uxMid * R * sp.rOuter, uyMid * R * sp.rOuter, uzMid * R * sp.rOuter, cx, cy, cosX, sinX, cosY, sinY);

      const depthFactor = Math.max(0.12, Math.min(0.9, 0.5 + (pOut.z / R) * 0.4));
      const strokeAlpha = sp.alpha * depthFactor * 0.55;

      ctx.beginPath();
      ctx.moveTo(pIn1.sx, pIn1.sy);
      ctx.lineTo(pOut.sx, pOut.sy);
      ctx.moveTo(pIn2.sx, pIn2.sy);
      ctx.lineTo(pOut.sx, pOut.sy);
      ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${strokeAlpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Soft traveling pulse gliding along the radial spoke
      const pulseR = R * (sp.rInner + (sp.rOuter - sp.rInner) * sp.pulsePos);
      const tailR = R * (sp.rInner + (sp.rOuter - sp.rInner) * Math.max(0, sp.pulsePos - 0.11 * sp.pulseDir));

      const pHead = this._project3D(uxMid * pulseR, uyMid * pulseR, uzMid * pulseR, cx, cy, cosX, sinX, cosY, sinY);
      const pTail = this._project3D(uxMid * tailR, uyMid * tailR, uzMid * tailR, cx, cy, cosX, sinX, cosY, sinY);

      // Fade pulse smoothly at ends
      const env = Math.sin(sp.pulsePos * Math.PI);
      const pulseAlpha = env * depthFactor * 0.72;

      if (pulseAlpha > 0.04) {
        ctx.beginPath();
        ctx.moveTo(pTail.sx, pTail.sy);
        ctx.lineTo(pHead.sx, pHead.sy);
        ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${pulseAlpha})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();

        // Pinpoint spark at pulse tip
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${pulseAlpha * 1.1})`;
        ctx.fillRect(pHead.sx - 1, pHead.sy - 1, 2, 2);
      }
    }
  }

  /**
   * Render Layer 2: 58 Woven Hairline Spherical Shells & Stippled Meridian Tracks
   */
  _renderWovenShells(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [cr, cg, cb] = this.mode.coreRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      const radius = R * ring.r;
      const rz = ring.rz + ring.angle + ring.springPos;

      const cRx = Math.cos(ring.rx), sRx = Math.sin(ring.rx);
      const cRy = Math.cos(ring.ry), sRy = Math.sin(ring.ry);

      const projectPt = (theta, rad = radius) => {
        const a = theta + rz;
        const lx = Math.cos(a) * rad;
        const ly = Math.sin(a) * rad;
        const x1 = lx * cRy;
        const y1 = ly * cRx;
        const z1 = -lx * sRy + ly * sRx;
        return this._project3D(x1, y1, z1, cx, cy, cosX, sinX, cosY, sinY);
      };

      for (let s = 0; s < ring.arcs.length; s++) {
        const arc = ring.arcs[s];
        const midPt = projectPt((arc.start + arc.end) * 0.5);
        const zNorm = (midPt.z + R) / (2 * R); // 0 (back) -> 1 (front)
        const depthAlpha = Math.max(0.08, Math.min(0.68, (0.14 + zNorm * 0.48) * arc.alphaMult));

        if (arc.kind === 'hairline') {
          const steps = 20;
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const theta = arc.start + ((arc.end - arc.start) * k) / steps;
            const pt = projectPt(theta);
            if (k === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          }
          ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${depthAlpha * 0.72})`;
          ctx.lineWidth = arc.weight * 0.75;
          ctx.stroke();
        } else if (arc.kind === 'dashed') {
          // Fine stippled / dashed tracks (signature texture of Image 2)
          const steps = 28;
          ctx.beginPath();
          for (let k = 0; k < steps; k += arc.dashStride) {
            const t0 = arc.start + ((arc.end - arc.start) * k) / steps;
            const t1 = arc.start + ((arc.end - arc.start) * Math.min(steps, k + 1)) / steps;
            const p0 = projectPt(t0);
            const p1 = projectPt(t1);
            ctx.moveTo(p0.sx, p0.sy);
            ctx.lineTo(p1.sx, p1.sy);
          }
          ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${depthAlpha * 0.85})`;
          ctx.lineWidth = arc.weight * 0.85;
          ctx.stroke();
        } else if (arc.kind === 'ticks') {
          // Delicate micro-comb ticks perpendicular to the orbital path
          const ticks = 18;
          const tickRad = R * arc.tickLen;
          ctx.beginPath();
          for (let k = 0; k <= ticks; k++) {
            const theta = arc.start + ((arc.end - arc.start) * k) / ticks;
            const pIn = projectPt(theta, radius - tickRad);
            const pOut = projectPt(theta, radius + tickRad);
            ctx.moveTo(pIn.sx, pIn.sy);
            ctx.lineTo(pOut.sx, pOut.sy);
          }
          ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${depthAlpha * 0.78})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }

        // Render soft traveling pulse along the arc if enabled
        if (arc.hasPulse && zNorm > 0.25) {
          const pStartAngle = arc.start + (arc.end - arc.start) * arc.pulsePhase;
          const pEndAngle = Math.min(arc.end, pStartAngle + (arc.end - arc.start) * 0.14);
          const env = Math.sin(arc.pulsePhase * Math.PI);
          const pAlpha = env * depthAlpha * 1.15;

          if (pAlpha > 0.05) {
            ctx.beginPath();
            const segs = 5;
            for (let k = 0; k <= segs; k++) {
              const theta = pStartAngle + ((pEndAngle - pStartAngle) * k) / segs;
              const pt = projectPt(theta);
              if (k === 0) ctx.moveTo(pt.sx, pt.sy);
              else ctx.lineTo(pt.sx, pt.sy);
            }
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${pAlpha})`;
            ctx.lineWidth = 1.15;
            ctx.stroke();
          }
        }
      }
    }
  }

  /**
   * Render Layer 3: Asymmetric Outer Terraced C-Ribbons & Circuit Comb Ladders
   * (Direct match to the stepped outer silhouette of Ref 1, Ref 3, Ref 4 & Image 2)
   */
  _renderOuterTerraces(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [cr, cg, cb] = this.mode.coreRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    // Gentle camera dampening for outer perimeter so the left/lower-left terrace silhouette stays recognizable
    const cX = Math.cos(this.camRotX * 0.55);
    const sX = Math.sin(this.camRotX * 0.55);
    const cY = Math.cos(this.camRotY * 0.55 + Math.sin(this.elapsedTime * 0.22) * 0.08);
    const sY = Math.sin(this.camRotY * 0.55 + Math.sin(this.elapsedTime * 0.22) * 0.08);

    for (let i = 0; i < this.terraces.length; i++) {
      const tr = this.terraces[i];
      const radius = R * tr.r;
      const cRx = Math.cos(tr.rx), sRx = Math.sin(tr.rx);
      const cRy = Math.cos(tr.ry), sRy = Math.sin(tr.ry);

      const projectTerrace = (theta, rad = radius) => {
        const a = theta + tr.angle;
        const lx = Math.cos(a) * rad;
        const ly = Math.sin(a) * rad;
        const x1 = lx * cRy;
        const y1 = ly * cRx;
        const z1 = -lx * sRy + ly * sRx;
        return this._project3D(x1, y1, z1, cx, cy, cX, sX, cY, sY);
      };

      const steps = tr.steps;

      if (tr.kind === 'dashed') {
        // Outer broken dashed golden whisper tracks (as seen on the left of Image 2)
        ctx.beginPath();
        for (let k = 0; k < steps; k += 2) {
          const t0 = tr.start + (tr.span * k) / steps;
          const t1 = tr.start + (tr.span * (k + 0.9)) / steps;
          const p0 = projectTerrace(t0);
          const p1 = projectTerrace(t1);
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
        }
        ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, 0.42)`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      } else if (tr.kind === 'comb' || tr.kind === 'terrace') {
        // Stepped architectural circuit-board terrace & radial ladder teeth (Ref 1 & Ref 3 bottom-left)
        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const theta = tr.start + (tr.span * k) / steps;
          // Quantized stepped radius to create architectural rectangular circuit terraces
          const stepMod = tr.kind === 'terrace' ? ((Math.floor(k / 4) % 2) * R * 0.022) : 0;
          const pt = projectTerrace(theta, radius + stepMod);
          if (k === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);

          // Radial comb teeth extending outward like Ref 1 & Ref 3
          if (k % 3 === 0) {
            const toothLen = (k % 9 === 0 ? 0.042 : 0.018) * R;
            const pOuter = projectTerrace(theta, radius + stepMod + toothLen);
            ctx.moveTo(pt.sx, pt.sy);
            ctx.lineTo(pOuter.sx, pOuter.sy);
          }
        }
        ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, 0.38)`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Traveling pulse along the outer terrace
        const pulseTheta = tr.start + tr.span * tr.pulsePhase;
        const pPulse = projectTerrace(pulseTheta, radius);
        const env = Math.sin(tr.pulsePhase * Math.PI);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${env * 0.65})`;
        ctx.fillRect(pPulse.sx - 1.2, pPulse.sy - 1.2, 2.4, 2.4);
      } else if (tr.kind === 'astrolabe') {
        // Ref 4 Left Equatorial Protruding Ring Band
        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const theta = tr.start + (tr.span * k) / steps;
          const pt = projectTerrace(theta, radius);
          if (k === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, 0.34)`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Inner parallel rail with ladder rungs
        ctx.beginPath();
        for (let k = 0; k <= steps; k += 2) {
          const theta = tr.start + (tr.span * k) / steps;
          const p1 = projectTerrace(theta, radius * 0.96);
          const p2 = projectTerrace(theta, radius);
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
        }
        ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, 0.28)`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  /**
   * Render Layer 4: 2,200 3D Pinpoint Sparks & Out-of-Focus Bokeh Dust (Ref 2 & Image 2)
   */
  _renderBokehAndPinpoints(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [cr, cg, cb] = this.mode.coreRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    const data = this.voxelData;
    const count = this.voxelCount;
    const t = this.elapsedTime;

    // Slow spherical pulse wave (travels smoothly from inner iris outward every 5 seconds)
    const radialPulseWave = (t * 0.19) % 1.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 8;
      const theta = data[idx + 0] + t * data[idx + 3];
      const phi = data[idx + 1];
      const rRatio = data[idx + 2];
      const size = data[idx + 4];
      const phase = data[idx + 5];
      const colorTier = data[idx + 6];
      const isBokeh = data[idx + 7];

      const rad = R * rRatio;
      const sinPhi = Math.sin(phi);
      const x = rad * sinPhi * Math.cos(theta);
      const y = rad * Math.cos(phi);
      const z = rad * sinPhi * Math.sin(theta);

      const proj = this._project3D(x, y, z, cx, cy, cosX, sinX, cosY, sinY);
      const zNorm = (proj.z + R) / (2 * R);
      if (zNorm < 0.05) continue;

      // Gentle bioluminescent shimmer + radial wave boost
      const shimmer = 0.55 + 0.45 * Math.sin(t * 2.2 + phase);
      const waveDist = Math.abs(rRatio - radialPulseWave);
      const waveBoost = waveDist < 0.12 ? (1.0 - waveDist / 0.12) * 0.45 : 0;

      const alpha = Math.min(0.92, (0.12 + zNorm * 0.58) * shimmer + waveBoost);

      // Out-of-focus foreground/background bokeh discs (Ref 2 optical depth-of-field)
      const focalDist = Math.abs(zNorm - 0.52);
      if (isBokeh && focalDist > 0.24) {
        const bokehRadius = (2.2 + focalDist * 5.5) * size * 0.65;
        const bokehAlpha = alpha * 0.16;
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${bokehAlpha})`;
        ctx.beginPath();
        ctx.arc(proj.sx, proj.sy, bokehRadius, 0, TAU);
        ctx.fill();
        continue;
      }

      // Crisp pinpoint golden micro-nodes (Image 2 signature texture)
      if (waveBoost > 0.22 || colorTier === 0) {
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.95})`;
      } else if (colorTier === 1) {
        ctx.fillStyle = `rgba(${gr}, ${gg}, ${gb}, ${alpha * 0.85})`;
      } else {
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha * 0.75})`;
      }

      const ptSize = Math.max(0.9, size * proj.scale * 0.82);
      ctx.fillRect(proj.sx - ptSize * 0.5, proj.sy - ptSize * 0.5, ptSize, ptSize);
    }
  }

  /**
   * Render Layer 5: Central Hollow Toroidal "Eye / Iris" Core (Ref 1 & Ref 2)
   * Instead of a solid white blob, J.A.R.V.I.S. has a luminous golden toroidal
   * ring aperture with a darker center hole and sweeping inner crescents.
   */
  _renderHollowIrisCore(ctx, cx, cy, R, cosX, sinX, cosY, sinY) {
    const [cr, cg, cb] = this.mode.coreRGB;
    const [gr, gg, gb] = this.mode.goldRGB;
    const [ar, ag, ab] = this.mode.amberRGB;

    const irisInnerR = R * 0.068;
    const irisPeakR = R * 0.105;
    const irisOuterR = R * 0.21;

    // 1. Toroidal Ring Glow (dark inside r < irisInnerR, glowing golden rim at irisPeakR)
    const torusGrad = ctx.createRadialGradient(cx, cy, irisInnerR * 0.35, cx, cy, irisOuterR);
    torusGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    torusGrad.addColorStop(0.26, 'rgba(204, 128, 28, 0.04)');
    torusGrad.addColorStop(0.46, `rgba(${cr}, ${cg}, ${cb}, 0.26)`);
    torusGrad.addColorStop(0.58, `rgba(${gr}, ${gg}, ${gb}, 0.18)`);
    torusGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = torusGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, irisOuterR, 0, TAU);
    ctx.fill();

    // 2. 22 Tightly Bundled 3D Golden Filament Loops forming the hollow iris wall
    for (let i = 0; i < this.irisRings.length; i++) {
      const ir = this.irisRings[i];
      const rad = R * ir.r;
      const cRx = Math.cos(ir.rx), sRx = Math.sin(ir.rx);
      const cRy = Math.cos(ir.ry), sRy = Math.sin(ir.ry);

      const steps = 32;
      ctx.beginPath();
      for (let k = 0; k <= steps; k++) {
        const theta = ir.arcStart + (ir.arcSpan * k) / steps + ir.rz;
        const lx = Math.cos(theta) * rad;
        const ly = Math.sin(theta) * rad;
        const x1 = lx * cRy;
        const y1 = ly * cRx;
        const z1 = -lx * sRy + ly * sRx;
        const pt = this._project3D(x1, y1, z1, cx, cy, cosX, sinX, cosY, sinY);
        if (k === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      }

      const color = i < 6 ? [cr, cg, cb] : i < 14 ? [gr, gg, gb] : [ar, ag, ab];
      ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${ir.alpha * 0.65})`;
      ctx.lineWidth = ir.weight * 0.75;
      ctx.stroke();
    }
  }
}
