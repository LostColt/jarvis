/**
 * ============================================================================
 * J.A.R.V.I.S. — A QUIET INTELLIGENCE (CHRONOMETER & AMBIENT CONTROLLER)
 * ============================================================================
 * Minimalist, distraction-free controller:
 * - Floating unboxed Time & Date ("8:42 PM" / "TUESDAY, OCTOBER 20")
 * - 4 circular bottom-right controls (Pause, 12H/24H Clock, Meditative Audio,
 *   Fullscreen) that fade out after 2.6s of inactivity
 * - Lissajous OLED burn-in drift protection
 * - Screen Wake Lock API for uninterrupted screensaver operation
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

export function computeChronoTelemetry(date = new Date(), use24Hour = false) {
  const year = date.getFullYear();
  const monthIdx = date.getMonth();
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  let displayHoursNum = hours24;
  let period = 'MIL';
  if (!use24Hour) {
    period = hours24 >= 12 ? 'PM' : 'AM';
    displayHoursNum = hours24 % 12 || 12;
  }

  const displayHours = use24Hour
    ? String(displayHoursNum).padStart(2, '0')
    : String(displayHoursNum).padStart(2, '0');
  const cleanHour = use24Hour ? String(displayHoursNum).padStart(2, '0') : String(displayHoursNum);
  const displayMinutes = String(minutes).padStart(2, '0');
  const displaySeconds = String(seconds).padStart(2, '0');

  // Day of Year (1 - 366)
  const startOfYear = new Date(year, 0, 0);
  const diffMs = date - startOfYear + ((startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
  const doy = Math.floor(diffMs / 86400000);

  return {
    year,
    monthName: MONTHS[monthIdx],
    day,
    weekday,
    hours: hours24,
    displayHours,
    displayMinutes,
    displaySeconds,
    milliseconds,
    displayMs: '.' + String(milliseconds).padStart(3, '0'),
    period,
    doy: String(doy).padStart(3, '0'),
    formattedTime: `${cleanHour}:${displayMinutes}`,
    formattedDate: `${weekday}, ${MONTHS[monthIdx]} ${day}`,
    hourFraction: (hours24 + minutes / 60) / 24,
    minFraction: (minutes + seconds / 60) / 60,
    secFraction: (seconds + milliseconds / 1000) / 60
  };
}

class MeditativeAudioDrone {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
  }

  toggle() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0;
      this.masterGain.connect(this.ctx.destination);

      // Warm, hypnotic low-pass harmonic chord (F#1 46.25Hz, C#2 69.30Hz, A#2 116.54Hz)
      const freqs = [46.25, 69.30, 116.54];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const oscGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = f;

        filter.type = 'lowpass';
        filter.frequency.value = 180;

        oscGain.gain.value = idx === 0 ? 0.5 : 0.22;

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
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.055, now, 0.8);
    return !this.isMuted;
  }
}

class JarvisScreensaverController {
  constructor() {
    this.canvas = document.getElementById('jarvis-canvas');
    this.engine = new JarvisMatrixEngine(this.canvas);
    this.audio = new MeditativeAudioDrone();

    // Default to calm 12-hour format ("8:42 PM") matching Image 2
    this.use24Hour = false;
    this.idleTimer = null;

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
      time: document.getElementById('chrono-time'),
      period: document.getElementById('chrono-period'),
      date: document.getElementById('chrono-date'),
      btnPause: document.getElementById('btn-pause'),
      iconPause: document.getElementById('icon-pause'),
      iconPlay: document.getElementById('icon-play'),
      btnFormat: document.getElementById('btn-format'),
      btnAudio: document.getElementById('btn-audio'),
      iconMuted: document.getElementById('icon-muted'),
      iconUnmuted: document.getElementById('icon-unmuted'),
      btnFullscreen: document.getElementById('btn-fullscreen')
    };
  }

  _bindControls() {
    this.els.btnPause?.addEventListener('click', () => this.togglePause());
    this.els.btnFormat?.addEventListener('click', () => this.toggleTimeFormat());
    this.els.btnAudio?.addEventListener('click', () => this.toggleAudio());
    this.els.btnFullscreen?.addEventListener('click', () => this.toggleFullscreen());
    this.canvas.addEventListener('dblclick', () => this.toggleFullscreen());

    window.addEventListener('keydown', (e) => {
      this._resetIdleTimer();
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePause();
      } else if (key === 'f') {
        this.toggleFullscreen();
      } else if (key === 't') {
        this.toggleTimeFormat();
      } else if (key === 'a' || key === 'm') {
        this.toggleAudio();
      }
    });

    ['pointermove', 'pointerdown', 'wheel', 'touchstart'].forEach((evt) => {
      window.addEventListener(evt, () => this._resetIdleTimer(), { passive: true });
    });

    document.addEventListener('fullscreenchange', () => {
      const isFs = Boolean(document.fullscreenElement);
      this.els.btnFullscreen?.classList.toggle('active', isFs);
    });
  }

  _resetIdleTimer() {
    document.body.classList.remove('is-idle');
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      document.body.classList.add('is-idle');
    }, 2800);
  }

  async _requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        await navigator.wakeLock.request('screen');
      }
    } catch {
      // Ignore if unsupported
    }
  }

  togglePause() {
    this.engine.isPaused = !this.engine.isPaused;
    const paused = this.engine.isPaused;
    this.els.btnPause?.classList.toggle('active', paused);
    if (this.els.iconPause) this.els.iconPause.style.display = paused ? 'none' : 'block';
    if (this.els.iconPlay) this.els.iconPlay.style.display = paused ? 'block' : 'none';
  }

  toggleTimeFormat() {
    this.use24Hour = !this.use24Hour;
    this.els.btnFormat?.classList.toggle('active', !this.use24Hour);
  }

  toggleAudio() {
    const isOn = this.audio.toggle();
    this.els.btnAudio?.classList.toggle('active', isOn);
    if (this.els.iconMuted) this.els.iconMuted.style.display = isOn ? 'none' : 'block';
    if (this.els.iconUnmuted) this.els.iconUnmuted.style.display = isOn ? 'block' : 'none';
  }

  async toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen permissions errors
    }
  }

  _loop(now) {
    const timeData = computeChronoTelemetry(new Date(), this.use24Hour);

    this.engine.update(now, timeData);
    this.engine.render(timeData);

    // Subtle Lissajous OLED burn-in drift on the floating typography
    if (this.els.hudStage) {
      this.els.hudStage.style.transform = `translate3d(${(this.engine.driftX * 0.35).toFixed(1)}px, ${(this.engine.driftY * 0.35).toFixed(1)}px, 0)`;
    }

    if (this.els.time) this.els.time.textContent = timeData.formattedTime;
    if (this.els.period) {
      this.els.period.textContent = this.use24Hour ? '' : timeData.period;
      this.els.period.style.display = this.use24Hour ? 'none' : 'inline';
    }
    if (this.els.date) this.els.date.textContent = timeData.formattedDate;

    requestAnimationFrame((t) => this._loop(t));
  }
}

if (typeof window !== 'undefined' && document.getElementById('jarvis-canvas')) {
  window.jarvisHud = new JarvisScreensaverController();
}
