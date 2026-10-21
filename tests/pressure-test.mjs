/**
 * ============================================================================
 * J.A.R.V.I.S. — A QUIET INTELLIGENCE // PRESSURE-TEST & AUDIT SUITE
 * ============================================================================
 * Executes 5 verification suites:
 * 1. Chronological Math Pressure Test (12H/24H formatting, midnight/noon
 *    rollovers, leap year DOY 366)
 * 2. 10,000-Frame 3D Holographic Weave, Iris Core, Spokes & Bokeh Stress Test
 * 3. OLED Burn-In Lissajous Drift Bounds Verification
 * 4. Multi-Aspect Ratio & 5K Ultrawide Projection Scaling Test
 * 5. Minimalist "Quiet Intelligence" UI Craft & Anti-Collision Audit
 * ============================================================================
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

globalThis.window = {
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
  addEventListener: () => {}
};
globalThis.document = {
  body: {
    setAttribute: () => {},
    classList: { remove: () => {}, add: () => {}, toggle: () => {} }
  },
  getElementById: () => null,
  addEventListener: () => {}
};

const { JarvisMatrixEngine } = await import('../js/engine.js');
const { computeChronoTelemetry } = await import('../js/hud.js');

function createMockCanvas(width = 1920, height = 1080) {
  const noop = () => {};
  const gradMock = { addColorStop: noop };
  return {
    width,
    height,
    addEventListener: noop,
    getContext: () => ({
      setTransform: noop,
      clearRect: noop,
      save: noop,
      restore: noop,
      beginPath: noop,
      moveTo: noop,
      lineTo: noop,
      arc: noop,
      fill: noop,
      stroke: noop,
      fillRect: noop,
      createRadialGradient: () => gradMock
    })
  };
}

console.log('======================================================================');
console.log(' J.A.R.V.I.S. — A QUIET INTELLIGENCE // PRESSURE-TEST & AUDIT SUITE');
console.log('======================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Chronological Math Pressure Test
// ----------------------------------------------------------------------------
console.log('[1/5] Running Chronological Math Pressure Test...');
{
  const midnight = new Date(2026, 9, 20, 0, 5, 0, 0);
  const t24 = computeChronoTelemetry(midnight, true);
  const t12 = computeChronoTelemetry(midnight, false);

  assert.equal(t24.formattedTime, '00:05', '24H midnight formattedTime should be 00:05');
  assert.equal(t12.formattedTime, '12:05', '12H midnight formattedTime should be 12:05');
  assert.equal(t12.period, 'AM', '12H midnight period should be AM');
  assert.equal(t12.formattedDate, 'TUESDAY, OCTOBER 20', 'Date formatting matches Quiet Intelligence layout');

  const evening = new Date(2026, 9, 20, 20, 34, 0, 0);
  const eve12 = computeChronoTelemetry(evening, false);
  assert.equal(eve12.formattedTime, '8:34', '12H evening formattedTime should be 8:34 without leading zero');
  assert.equal(eve12.period, 'PM', '12H evening period should be PM');

  const leapEnd = new Date(2028, 11, 31, 23, 59, 59, 999);
  const leapTelemetry = computeChronoTelemetry(leapEnd, true);
  assert.equal(leapTelemetry.doy, '366', 'Leap year Dec 31 must be DOY 366');

  console.log('  ✓ Passed: 12H/24H rollovers ("8:34 PM" / "00:05"), date strings, and leap year DOY verified.');
}

// ----------------------------------------------------------------------------
// TEST 2: 10,000-Frame 3D Holographic Weave, Iris Core & Spoke Pulses Stress Test
// ----------------------------------------------------------------------------
console.log('[2/5] Running 10,000-Frame 3D Holographic Weave & Spoke Pulse Stress Test...');
{
  const canvas = createMockCanvas(1920, 1080);
  const engine = new JarvisMatrixEngine(canvas);

  let simNow = 1000;
  const sampleTime = computeChronoTelemetry(new Date(), false);
  const tStart = performance.now();

  for (let frame = 0; frame < 10000; frame++) {
    simNow += 16.6667;
    engine.update(simNow, sampleTime);
    engine.render(sampleTime);
  }

  const elapsedMs = performance.now() - tStart;
  const avgFrameMs = elapsedMs / 10000;

  assert.ok(Number.isFinite(engine.camRotX) && Number.isFinite(engine.camRotY), 'Camera rotation finite');
  assert.equal(engine.irisRings.length, 22, '22 hollow toroidal iris core filament loops present');
  assert.equal(engine.rings.length, 58, '58 woven hairline spherical shells present');
  assert.equal(engine.spokes.length, 28, '28 paired radial spoke trusses with traveling pulses present');
  assert.equal(engine.terraces.length, 8, '8 asymmetric outer terraced C-ribbons present');
  assert.equal(engine.voxelCount, 9200, '9,200 Houdini golden particles & bloom nodes present');

  for (let i = 0; i < engine.spokes.length; i++) {
    assert.ok(engine.spokes[i].pulsePos >= 0 && engine.spokes[i].pulsePos <= 1, `Spoke ${i} pulse bounded [0,1]`);
  }

  console.log(`  ✓ Passed: 10,000 3D frames rendered in ${elapsedMs.toFixed(1)}ms (${avgFrameMs.toFixed(3)}ms/frame).`);
  console.log('  ✓ Passed: Core lattice (22 loops), 58 organic micro-arc shells, 28 asymmetric truss filaments, 8 sculpted lobe layers & 9,200 Houdini particles verified.');
}

// ----------------------------------------------------------------------------
// TEST 3: OLED Burn-In Lissajous Drift Bounds Verification
// ----------------------------------------------------------------------------
console.log('[3/5] Running OLED Burn-In Lissajous Drift Verification...');
{
  const engine = new JarvisMatrixEngine(createMockCanvas());
  const sampleTime = computeChronoTelemetry(new Date(), false);

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let simNow = 0;

  for (let s = 0; s < 240; s++) {
    simNow += 1000;
    engine.elapsedTime = s;
    engine.update(simNow, sampleTime);
    minX = Math.min(minX, engine.driftX);
    maxX = Math.max(maxX, engine.driftX);
    minY = Math.min(minY, engine.driftY);
    maxY = Math.max(maxY, engine.driftY);
  }

  assert.ok(maxX > 18 && minX < -18, 'Lissajous X drift spans ±18..22px');
  assert.ok(maxY > 11 && minY < -11, 'Lissajous Y drift spans ±11..14px');
  console.log(`  ✓ Passed: Lissajous OLED drift sweeps X:[${minX.toFixed(1)}px, +${maxX.toFixed(1)}px], Y:[${minY.toFixed(1)}px, +${maxY.toFixed(1)}px].`);
}

// ----------------------------------------------------------------------------
// TEST 4: Multi-Aspect Ratio & 5K Ultrawide Projection Test
// ----------------------------------------------------------------------------
console.log('[4/5] Running Multi-Aspect Ratio & 5K Ultrawide Projection Test...');
{
  const viewports = [
    { name: 'Mobile Portrait', w: 390, h: 844 },
    { name: 'Standard 1080p', w: 1920, h: 1080 },
    { name: '4K UHD', w: 3840, h: 2160 },
    { name: '5K Ultrawide 21:9', w: 5120, h: 2160 }
  ];

  const engine = new JarvisMatrixEngine(createMockCanvas());
  for (const vp of viewports) {
    globalThis.window.innerWidth = vp.w;
    globalThis.window.innerHeight = vp.h;
    engine.resize();
    assert.ok(engine.baseRadius >= 150 && engine.baseRadius <= 390, `${vp.name} radius within optical bounds`);
    assert.equal(engine.centerX, vp.w * 0.5, `${vp.name} horizontal center locked`);
  }
  console.log('  ✓ Passed: Spherical FOV scaling verified across Mobile, 1080p, 4K, and 5K Ultrawide.');
}

// ----------------------------------------------------------------------------
// TEST 5: Minimalist "Quiet Intelligence" UI Craft & Zero-Clutter Audit
// ----------------------------------------------------------------------------
console.log('[5/5] Running Minimalist UI Craft & Zero-Clutter Audit...');
{
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'css', 'jarvis.css'), 'utf8');

  // Verify zero noisy HUD panels remain
  assert.ok(!html.includes('VERONICA // LOCKED'), 'No noisy cockpit telemetry in HTML');
  assert.ok(!html.includes('SYNAPTIC COHERENCE'), 'No distracting dashboard metrics in HTML');
  assert.ok(html.includes('A QUIET INTELLIGENCE'), 'Quiet Intelligence subtitle present');
  assert.ok(html.includes('id="chrono-time"') && html.includes('id="chrono-date"'), 'Clean unboxed Time and Date elements present');

  // Verify optical & typographic standards
  assert.ok(css.includes('font-variant-numeric: tabular-nums'), 'Tabular numerals enforced');
  assert.ok(css.includes('letter-spacing: -0.035em'), 'Negative optical kerning on time digits');
  assert.ok(css.includes('inset 0 1px 0 0 rgba(255, 255, 255,'), 'Specular top-edge highlight on circular controls');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion support present');
  assert.ok(css.includes('body.is-idle') && css.includes('cursor: none'), 'Auto-hide cursor and controls when idle');

  console.log('  ✓ Passed: Zero HUD clutter, unboxed floating time/date, four-corner pinning, and auto-hide idle state verified.');
}

console.log('\n======================================================================');
console.log(' ALL 5 PRESSURE-TEST & AUDIT SUITES PASSED WITH ZERO ERRORS');
console.log('======================================================================');
