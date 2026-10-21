/**
 * ============================================================================
 * J.A.R.V.I.S. // STARK LAB HUD, CHRONOMETER & TELEMETRY CONTROLLER
 * ============================================================================
 * Coordinates:
 * - Real-time Chronometer (12H/24H, sub-frame milliseconds, Day of Week, Date,
 *   Day-of-Year, Julian Date, Sidereal Angle, ISO-8601, Unix Hex)
 * - Web Audio API Stark Lab Ambient Reactor Hum + Harmonic Indexing Clicks
 * - SpeechSynthesis J.A.R.V.I.S. Vocal Time & Telemetry Briefing
 * - Screen Wake Lock API + 2.5s Cursor Auto-Hide for OLED Screensaver Operation
 * ============================================================================
 */

import { JarvisMatrixEngine } from './engine.js';

const WEEKDAYS = [
  'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
];

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const AOU_HEX_PREFIXES = [
  '0x4A415256', '0x554C5452', '0x4D4B584C', '0x53434550',
  '0x5645524F', '0x43524144', '0x4E455552', '0x53544152'
];

export function computeChronoTelemetry(date = new Date(), use24Hour = true) {
  const year = date.getFullYear();
  const monthIdx = date.getMonth();
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  let displayHours = hours24;
  let period = 'MIL';
  if (!use24Hour) {
    period = hours24 >= 12 ? 'PM' : 'AM';
    displayHours = hours24 % 12 || 12;
  }

  // Day of Year (1 - 366) & ISO Week
  const startOfYear = new Date(year, 0, 0);
  const diffMs = date - startOfYear + ((startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
  const doy = Math.floor(diffMs / 86400000);
  const weekNum = Math.max(1, Math.ceil(doy / 7));

  // Julian Date calculation
  const unixMs = date.getTime();
  const julianDate = (unixMs / 86400000) + 2440587.5;

  // Solar cycle elapsed percentage of current day
  const daySeconds = hours24 * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  const solarFraction = daySeconds / 86400;

  // Approximate Greenwich Mean Sidereal Angle
  const siderealTotalDeg = ((280.46061837 + 360.98564736629 * (julianDate - 2451545.0)) % 360 + 360) % 360;
  const sidDeg = Math.floor(siderealTotalDeg);
  const sidMin = Math.floor((siderealTotalDeg - sidDeg) * 60);
  const sidSec = Math.floor((((siderealTotalDeg - sidDeg) * 60) - sidMin) * 60);

  // Timezone Offset string
  const tzOffsetMin = -date.getTimezoneOffset();
  const tzSign = tzOffsetMin >= 0 ? '+' : '-';
  const tzAbs = Math.abs(tzOffsetMin);
  const tzH = String(Math.floor(tzAbs / 60)).padStart(2, '0');
  const tzM = String(tzAbs % 60).padStart(2, '0');
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'LOCAL';

  return {
    year,
    monthName: MONTHS[monthIdx],
    day,
    weekday,
    hours: hours24,
    displayHours: String(displayHours).padStart(2, '0'),
    minutes,
    displayMinutes: String(minutes).padStart(2, '0'),
    seconds,
    displaySeconds: String(seconds).padStart(2, '0'),
    milliseconds,
    displayMs: '.' + String(milliseconds).padStart(3, '0'),
    period,
    doy: String(doy).padStart(3, '0'),
    weekNum: String(weekNum).padStart(2, '0'),
    fullDateText: `${MONTHS[monthIdx]} ${String(day).padStart(2, '0')}, ${year}`,
    julianText: `JD ${julianDate.toFixed(3)}`,
    timezoneText: `UTC${tzSign}${tzH}:${tzM} // ${tzName.toUpperCase()}`,
    isoText: `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    epochHex: '0x' + Math.floor(unixMs / 1000).toString(16).toUpperCase(),
    siderealText: `${String(sidDeg).padStart(3, '0')}° ${String(sidMin).padStart(2, '0')}' ${String(sidSec).padStart(2, '0')}"`,
    solarProgressText: `${(solarFraction * 100).toFixed(2)}% ELAPSED`,
    hourFraction: (hours24 + minutes / 60) / 24,
    minFraction: (minutes + seconds / 60) / 60,
    secFraction: (seconds + milliseconds / 1000) / 60
  };
}

class StarkAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
  }

  toggleAmbientHum() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0;
      this.masterGain.connect(this.ctx.destination);

      // Warm harmonic triad drone (55Hz A1 + 110Hz A2 + 165Hz E3) filtered like Stark's lab hologram
      const freqs = [55, 110, 164.81];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const oscGain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;

        filter.type = 'lowpass';
        filter.frequency.value = 240;

        oscGain.gain.value = idx === 0 ? 0.45 : 0.18;

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();
      });
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.07, now, 0.35);
    return !this.isMuted;
  }

  playIndexChirp() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.065);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.085);
  }
}

class JarvisHudController {
  constructor() {
    this.canvas = document.getElementById('jarvis-canvas');
    this.waveCanvas = document.getElementById('waveform-canvas');
    this.engine = new JarvisMatrixEngine(this.canvas, this.waveCanvas);
    this.audio = new StarkAudioSynthesizer();

    this.use24Hour = true;
    this.isMinimalHud = false;
    this.idleTimer = null;
    this.wakeLock = null;
    this.hexLines = [
      '0x4A415256 :: CORE.INIT [OK] // 99.98%',
      '0x53434550 :: MIND_STONE_COMPARE // READY',
      '0x4D4B584C :: MARK_XLIII_HUD_SYNC // LOCKED',
      '0x5645524F :: VERONICA_SAT_LINK // AZ_142.8',
      '0x4E455552 :: PLATTER_INDEX_ζ0.72 // ACTIVE'
    ];
    this.lastTelemetryTick = 0;

    this._cacheElements();
    this._bindControls();
    this._resetIdleTimer();
    this._requestWakeLock();

    window.addEventListener('resize', () => this.engine.resize());
    requestAnimationFrame((t) => this._loop(t));
  }

  _cacheElements() {
    this.els = {
      hudStage: document.getElementById('hud-stage'),
      hours: document.getElementById('chrono-hours'),
      minutes: document.getElementById('chrono-minutes'),
      seconds: document.getElementById('chrono-seconds'),
      ms: document.getElementById('chrono-ms'),
      period: document.getElementById('chrono-period'),
      weekday: document.getElementById('chrono-weekday'),
      fullDate: document.getElementById('chrono-full-date'),
      doy: document.getElementById('chrono-doy'),
      timezone: document.getElementById('hud-timezone'),
      julian: document.getElementById('hud-julian'),
      iso: document.getElementById('hud-iso'),
      epochHex: document.getElementById('hud-epoch-hex'),
      sidereal: document.getElementById('hud-sidereal'),
      solarProgress: document.getElementById('hud-solar-progress'),
      meterHr: document.getElementById('meter-hr'),
      meterMin: document.getElementById('meter-min'),
      meterSec: document.getElementById('meter-sec'),
      fps: document.getElementById('hud-fps'),
      coherence: document.getElementById('hud-coherence'),
      protocolName: document.getElementById('hud-protocol-name'),
      matrixModeTag: document.getElementById('matrix-mode-tag'),
      sectorLockTag: document.getElementById('sector-lock-tag'),
      voiceStateTag: document.getElementById('voice-state-tag'),
      transcript: document.getElementById('hud-speech-transcript'),
      calloutNorth: document.getElementById('callout-north-text'),
      hexStream: document.getElementById('hex-stream'),
      barCore: document.getElementById('bar-core'),
      valCore: document.getElementById('val-core'),
      barRingA: document.getElementById('bar-ring-a'),
      valRingA: document.getElementById('val-ring-a'),
      barRingB: document.getElementById('bar-ring-b'),
      valRingB: document.getElementById('val-ring-b'),
      pulseCount: document.getElementById('hud-pulse-count'),
      // Buttons
      btnMode: document.getElementById('btn-mode'),
      labelMode: document.getElementById('label-mode'),
      btnFormat: document.getElementById('btn-format'),
      labelFormat: document.getElementById('label-format'),
      btnVoice: document.getElementById('btn-voice'),
      btnAudio: document.getElementById('btn-audio'),
      labelAudio: document.getElementById('label-audio'),
      btnPulse: document.getElementById('btn-pulse'),
      btnHud: document.getElementById('btn-hud'),
      labelHud: document.getElementById('label-hud'),
      btnFullscreen: document.getElementById('btn-fullscreen'),
      labelFullscreen: document.getElementById('label-fullscreen')
    };

    if (this.els.hexStream) {
      this.els.hexStream.innerHTML = this.hexLines.map((l) => `<div>${l}</div>`).join('');
    }
  }

  _bindControls() {
    // 1. Cycle Matrix Mode (M)
    this.els.btnMode?.addEventListener('click', () => this.cycleMatrixMode());

    // 2. Toggle 12H / 24H Time Format (T)
    this.els.btnFormat?.addEventListener('click', () => this.toggleTimeFormat());

    // 3. Vocal Briefing (V)
    this.els.btnVoice?.addEventListener('click', () => this.speakBriefing());

    // 4. Ambient Reactor Audio (A)
    this.els.btnAudio?.addEventListener('click', () => this.toggleAudio());

    // 5. Manual Sector Re-Index Pulse (Space)
    this.els.btnPulse?.addEventListener('click', () => {
      this.engine.triggerSectorIndexPulse(1.5);
      this.audio.playIndexChirp();
    });

    // 6. Minimal HUD Toggle (H)
    this.els.btnHud?.addEventListener('click', () => this.toggleMinimalHud());

    // 7. Fullscreen Toggle (F or Double-Click)
    this.els.btnFullscreen?.addEventListener('click', () => this.toggleFullscreen());
    this.canvas.addEventListener('dblclick', () => this.toggleFullscreen());

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      this._resetIdleTimer();
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === 'm') {
        this.cycleMatrixMode();
      } else if (key === 't') {
        this.toggleTimeFormat();
      } else if (key === 'v') {
        this.speakBriefing();
      } else if (key === 'a') {
        this.toggleAudio();
      } else if (key === 'h') {
        this.toggleMinimalHud();
      } else if (key === 'f') {
        this.toggleFullscreen();
      } else if (e.code === 'Space') {
        e.preventDefault();
        this.engine.triggerSectorIndexPulse(1.5);
        this.audio.playIndexChirp();
      }
    });

    // Wake dock on mouse movement
    ['pointermove', 'pointerdown', 'wheel', 'touchstart'].forEach((evt) => {
      window.addEventListener(evt, () => this._resetIdleTimer(), { passive: true });
    });

    document.addEventListener('fullscreenchange', () => {
      const isFs = Boolean(document.fullscreenElement);
      if (this.els.labelFullscreen) {
        this.els.labelFullscreen.textContent = isFs ? 'EXIT FULLSCREEN' : 'FULLSCREEN';
      }
    });
  }

  _resetIdleTimer() {
    document.body.classList.remove('is-idle');
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      document.body.classList.add('is-idle');
    }, 2600);
  }

  async _requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Gracefully ignore if WakeLock is unsupported or blocked by permissions
    }
  }

  cycleMatrixMode() {
    const mode = this.engine.cycleMode();
    if (this.els.protocolName) this.els.protocolName.textContent = mode.protocol;
    if (this.els.matrixModeTag) this.els.matrixModeTag.textContent = mode.tag;
    if (this.els.labelMode) this.els.labelMode.textContent = mode.buttonLabel;
    if (this.els.transcript) this.els.transcript.textContent = mode.transcript;
    this.audio.playIndexChirp();
  }

  toggleTimeFormat() {
    this.use24Hour = !this.use24Hour;
    if (this.els.labelFormat) {
      this.els.labelFormat.textContent = this.use24Hour ? '24H MILITARY' : '12H STANDARD';
    }
    this.els.btnFormat?.classList.toggle('active', !this.use24Hour);
  }

  toggleAudio() {
    const isOn = this.audio.toggleAmbientHum();
    if (this.els.labelAudio) {
      this.els.labelAudio.textContent = isOn ? 'AMBIENT HUM: ON' : 'AMBIENT HUM: OFF';
    }
    this.els.btnAudio?.classList.toggle('active', isOn);
  }

  toggleMinimalHud() {
    this.isMinimalHud = !this.isMinimalHud;
    document.body.classList.toggle('hud-minimal', this.isMinimalHud);
    if (this.els.labelHud) {
      this.els.labelHud.textContent = this.isMinimalHud ? 'HUD: CORE ONLY' : 'HUD: FULL LAB';
    }
    this.els.btnHud?.classList.toggle('active', this.isMinimalHud);
  }

  async toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen restriction errors
    }
  }

  speakBriefing() {
    const t = computeChronoTelemetry(new Date(), false);
    const greeting =
      t.hours < 12 ? 'Good morning, Sir.' : t.hours < 18 ? 'Good afternoon, Sir.' : 'Good evening, Sir.';
    const message = `${greeting} It is ${Number(t.displayHours)}:${t.displayMinutes} ${t.period}, ${t.weekday}, ${t.monthName} ${t.day}. All Avengers Tower neural matrices are operating at 99.94 percent synaptic coherence.`;

    if (this.els.transcript) {
      this.els.transcript.textContent = `"${message}"`;
    }
    if (this.els.voiceStateTag) {
      this.els.voiceStateTag.textContent = 'VOCALIZING';
    }

    this.engine.isSpeaking = true;
    this.engine.triggerSectorIndexPulse(1.4);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(message);
      const voices = window.speechSynthesis.getVoices();
      // Prefer a British English male voice (like Paul Bettany's J.A.R.V.I.S.)
      const britishVoice =
        voices.find((v) => /en-GB/i.test(v.lang) && /male|daniel|george|arthur|ryan/i.test(v.name)) ||
        voices.find((v) => /en-GB/i.test(v.lang)) ||
        voices[0];
      if (britishVoice) utter.voice = britishVoice;
      utter.pitch = 0.94;
      utter.rate = 1.02;

      utter.onend = () => {
        this.engine.isSpeaking = false;
        if (this.els.voiceStateTag) this.els.voiceStateTag.textContent = 'AUTONOMOUS';
      };
      utter.onerror = () => {
        this.engine.isSpeaking = false;
        if (this.els.voiceStateTag) this.els.voiceStateTag.textContent = 'AUTONOMOUS';
      };
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => {
        this.engine.isSpeaking = false;
        if (this.els.voiceStateTag) this.els.voiceStateTag.textContent = 'AUTONOMOUS';
      }, 4500);
    }
  }

  _loop(now) {
    const timeData = computeChronoTelemetry(new Date(), this.use24Hour);

    this.engine.update(now, timeData);
    this.engine.render(timeData);

    // Apply subtle Lissajous burn-in protection offset to the HUD Stage
    if (this.els.hudStage) {
      this.els.hudStage.style.transform = `translate3d(${(this.engine.driftX * 0.45).toFixed(1)}px, ${(this.engine.driftY * 0.45).toFixed(1)}px, 0)`;
    }

    // Update High-Frequency Chronometer Display
    if (this.els.hours) this.els.hours.textContent = timeData.displayHours;
    if (this.els.minutes) this.els.minutes.textContent = timeData.displayMinutes;
    if (this.els.seconds) this.els.seconds.textContent = timeData.displaySeconds;
    if (this.els.ms) this.els.ms.textContent = timeData.displayMs;
    if (this.els.period) this.els.period.textContent = timeData.period;

    if (this.els.meterHr) this.els.meterHr.style.width = `${(timeData.hourFraction * 100).toFixed(1)}%`;
    if (this.els.meterMin) this.els.meterMin.style.width = `${(timeData.minFraction * 100).toFixed(1)}%`;
    if (this.els.meterSec) this.els.meterSec.style.width = `${(timeData.secFraction * 100).toFixed(1)}%`;

    // Update Secondary Telemetry at ~5Hz to keep DOM super light
    if (now - this.lastTelemetryTick > 200) {
      this.lastTelemetryTick = now;

      if (this.els.weekday) this.els.weekday.textContent = timeData.weekday;
      if (this.els.fullDate) this.els.fullDate.textContent = timeData.fullDateText;
      if (this.els.doy) this.els.doy.textContent = `DOY ${timeData.doy} // WK ${timeData.weekNum}`;
      if (this.els.timezone) this.els.timezone.textContent = timeData.timezoneText;
      if (this.els.julian) this.els.julian.textContent = timeData.julianText;
      if (this.els.iso) this.els.iso.textContent = timeData.isoText;
      if (this.els.epochHex) this.els.epochHex.textContent = timeData.epochHex;
      if (this.els.sidereal) this.els.sidereal.textContent = timeData.siderealText;
      if (this.els.solarProgress) this.els.solarProgress.textContent = timeData.solarProgressText;
      if (this.els.fps) this.els.fps.textContent = `${this.engine.fps} FPS`;
      if (this.els.sectorLockTag) this.els.sectorLockTag.textContent = this.engine.sectorLockState;
      if (this.els.pulseCount) this.els.pulseCount.textContent = `${this.engine.activePulseCount} / SEC`;

      // Dynamic gimbal telemetry angles
      const rA = this.engine.rings[3];
      const rB = this.engine.rings[5];
      const degA = (((rA.angle + rA.springPos) * 180) / Math.PI) % 360;
      const degB = (((rB.angle + rB.springPos) * 180) / Math.PI) % 360;

      if (this.els.valRingA) this.els.valRingA.textContent = `${degA >= 0 ? '+' : ''}${degA.toFixed(1)}°`;
      if (this.els.barRingA) this.els.barRingA.style.width = `${Math.min(100, Math.abs(degA) / 3.6).toFixed(0)}%`;
      if (this.els.valRingB) this.els.valRingB.textContent = `${degB >= 0 ? '+' : ''}${degB.toFixed(1)}°`;
      if (this.els.barRingB) this.els.barRingB.style.width = `${Math.min(100, Math.abs(degB) / 3.6).toFixed(0)}%`;

      if (this.els.calloutNorth) {
        const az = (((this.engine.rings[11].angle * 180) / Math.PI + 360) % 360).toFixed(1);
        this.els.calloutNorth.textContent = `AZIMUTH LOCK // ${String(az).padStart(5, '0')}°`;
      }

      // Append live hex telemetry line every ~1.2s
      if (Math.random() < 0.18 && this.els.hexStream) {
        const prefix = AOU_HEX_PREFIXES[Math.floor(Math.random() * AOU_HEX_PREFIXES.length)];
        const addr = Math.floor(0x1000 + Math.random() * 0xEFFF).toString(16).toUpperCase();
        const coh = (99.85 + Math.random() * 0.14).toFixed(2);
        this.hexLines.push(`${prefix} :: SEC_${addr} // ${coh}%`);
        if (this.hexLines.length > 5) this.hexLines.shift();
        this.els.hexStream.innerHTML = this.hexLines.map((l) => `<div>${l}</div>`).join('');
        if (this.els.coherence) this.els.coherence.textContent = `${coh}%`;
      }
    }

    requestAnimationFrame((t) => this._loop(t));
  }
}

if (typeof window !== 'undefined' && document.getElementById('jarvis-canvas')) {
  window.jarvisHud = new JarvisHudController();
}
