# J.A.R.V.I.S. // Age of Ultron 3D Holographic Consciousness Screensaver

> **STARK LAB // AVENGERS TOWER — LEVEL 84**
> A real-time 3D holographic consciousness matrix, chronometer, and tactical FUI (Fantasy User Interface) screensaver modeled after J.A.R.V.I.S. in *Marvel's Avengers: Age of Ultron* (2015).

---

## 1. Visual Forensics & Film Authenticity

In *Avengers: Age of Ultron*, Tony Stark and Bruce Banner project J.A.R.V.I.S.'s holographic consciousness sphere in the Avengers Tower lab before comparing its architecture to the Mind Stone's neural net. Three studios defined that visual language:

1. **Animal Logic (*The Birth of Ultron* & Hologram Sphere):**
   - Designed J.A.R.V.I.S. in SideFX Houdini as a **warm golden-amber (`#FFB703` / `#FB8500` / `#FFF7D6`) modernist construct** built from **angular box-like voxel clusters, segmented hard-drive platter arcs, reel-to-reel data bands, and radial synaptic filaments**—contrasting with Ultron's chaotic blue/crimson web.
2. **Territory Studio (Stark Lab HUD & Chronological Telemetry):**
   - Engineered clinical military/avionics screen graphics with **hairline corner reticles, degree tick marks, tabular hexadecimal telemetry, Julian/Sidereal astronomical readouts**, and high-contrast amber/cyan diagnostic layers over deep obsidian glass (`#040508`).
3. **Cantina Creative (Mark XLIII HUD & Depth Compositing):**
   - Established multi-plane Z-space parallax, additive luminescence, and mechanical target-locking animations.

---

## 2. Motion Physics ("Moves As It Did in the Film")

Rather than rotating flat 2D circles at constant linear speeds, the [`JarvisMatrixEngine`](js/engine.js) simulates living 3D light-machinery:

- **Critically Damped Spring Sector Indexing ($\zeta = 0.72, \omega_n = 14$):**
  Every few seconds, memory platter rings rapidly accelerate, slightly overshoot with mechanical inertia, and lock into new azimuth sectors while firing axonal pulse packets into the core.
- **16 Multi-Axis 3D Gimbal Shells:**
  Concentric rings tilted across independent 3D Euler planes weave *through* and *around* one another under true perspective projection.
- **1,280 Angular Data-Construct Voxels:**
  Pre-allocated in `Float32Array` buffers across quantized spherical latitude bands, illuminating dynamically as 3D diagnostic scan waves sweep from pole to pole.
- **Chronological 3D Orbital Rings (Time & Date as Living Geometry):**
  - **Outer 60-Tick Second Ring:** Continuous sub-millisecond arc sweep (`seconds + ms/1000`) with orbital playhead.
  - **Middle 60-Tick Minute Ring:** Counter-tilted meridian ring encoding `minutes + seconds/60`.
  - **Inner 24-Sector Hour Ring:** Heavy segmented platter ring tracking solar/military hours.
- **3 Interactive *Age of Ultron* Modes:**
  1. `J.A.R.V.I.S. GOLD` — The signature Avengers Tower amber consciousness matrix.
  2. `MIND STONE SCAN` — Interleaves the Scepter's electric cyan-blue neural matrix alongside J.A.R.V.I.S.'s golden platters.
  3. `ULTRON BREACH` — Replicates the *Birth of Ultron* containment breach override in crimson and fractured amber.
- **Lissajous Figure-8 OLED Burn-In Protection:**
  The 3D camera origin and HUD stage slowly precess along an imperceptible figure-8 harmonic path ($\pm 22\text{px}$ X, $\pm 14\text{px}$ Y) so no pixel ever remains static during multi-hour screensaver operation.

---

## 3. Quick Start & Windows Screensaver Launch

### Option A: Instant Kiosk / Fullscreen Screensaver (Windows)
Double-click [`launch-screensaver.bat`](launch-screensaver.bat) to launch directly in borderless fullscreen kiosk mode via Microsoft Edge or Google Chrome.

### Option B: Browser / Local Server
Open [`index.html`](index.html) directly in any modern browser, or run:
```bash
npm start
```

### Option C: Run Automated Pressure-Test & Audit Suite
```bash
npm test
```

---

## 4. Interactive Controls & Keyboard Shortcuts

*(Controls automatically hide after 2.6 seconds of cursor inactivity, along with the mouse cursor.)*

| Shortcut | Action |
| :--- | :--- |
| **`M`** | Cycle Matrix Mode (`J.A.R.V.I.S. Gold` → `Mind Stone Dual-Scan` → `Ultron Breach`) |
| **`T`** | Toggle `24H Military` / `12H Standard (AM/PM)` Chronometer |
| **`V`** | Trigger **J.A.R.V.I.S. Vocal Time & Status Briefing** (Web Speech API + real-time waveform sync) |
| **`A`** | Toggle **Stark Lab Ambient Reactor Hum** (Web Audio API harmonic triad synth) |
| **`Space`** | Trigger manual **Memory Sector Re-Index Pulse** |
| **`H`** | Toggle between **Full Stark Lab HUD** and **Minimal Core + Chronometer View** |
| **`F`** / **Double-Click** | Toggle **Fullscreen Mode** |
| **Pointer Drag** | Orbit the 3D Holographic Sphere across X/Y gimbal axes |
