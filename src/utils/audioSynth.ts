// Web Audio API Synthesizer for Calming Flute Sound Cues and Ambient Background Sounds

export type AmbientSoundType = 'none' | 'rain' | 'waves' | 'nightingale' | 'flute' | 'zen-bowl' | 'brown-noise';

class CalmingAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private activeNoiseNodes: { stop: () => void }[] = [];
  private ambientTimers: number[] = [];
  private currentAmbientType: AmbientSoundType = 'none';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize a very gentle, warm, soothing acoustic chime tone for breathing phase transitions
  public playBreathingTone(phase: 'inhale' | 'hold' | 'exhale' | 'complete') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (phase === 'complete') {
        // Soothing, gentle 4-note chord cascade (C4, E4, G4, C5)
        this.playMelodicCascade([261.63, 329.63, 392.0, 523.25], 0.22);
        return;
      }

      if (phase === 'inhale') {
        // Soft rising two-note gentle chime (C4 -> G4)
        this.playMelodicCascade([261.63, 392.0], 0.35);
      } else if (phase === 'hold') {
        // Gentle warm sustained chime (E4)
        this.playSoothingChime(329.63, 2.5, now);
      } else if (phase === 'exhale') {
        // Soft descending two-note gentle chime (G4 -> C4)
        this.playMelodicCascade([392.0, 261.63], 0.35);
      }

    } catch {
      // Ignore audio errors if blocked by browser policy
    }
  }

  // Synthesize a velvet-soft, non-startling acoustic chime note
  private playSoothingChime(freq: number, duration: number, startTime: number) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Master gain with ultra-soft attack and long natural decay
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.045, startTime + 0.25); // Extremely soft, non-startling attack
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Warm pure fundamental sine oscillator
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Subtle 2nd harmonic for warm body
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    gain2.gain.value = 0.15;

    // Lowpass filter to ensure all harsh high frequencies are removed
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);

    osc1.connect(masterGain);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    masterGain.connect(filter);
    filter.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);

    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  private playMelodicCascade(freqs: number[], noteGap = 0.3) {
    if (!this.ctx) return;
    const startTime = this.ctx.currentTime;
    freqs.forEach((freq, idx) => {
      this.playSoothingChime(freq, 2.8, startTime + idx * noteGap);
    });
  }

  // Start or change Ambient Background Relaxation Sound
  public setAmbientSound(type: AmbientSoundType, volume = 0.3) {
    this.stopAmbient();
    if (type === 'none') return;

    this.initCtx();
    if (!this.ctx) return;

    this.currentAmbientType = type;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    if (type === 'nightingale') {
      this.startNightingaleSong();
    } else if (type === 'rain') {
      this.startRainSound();
    } else if (type === 'waves') {
      this.startOceanWaves();
    } else if (type === 'brown-noise') {
      this.startBrownNoise();
    } else if (type === 'flute' || type === 'zen-bowl') {
      this.startAmbientFluteSound();
    }
  }

  public setVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stopAmbient() {
    this.ambientTimers.forEach(id => window.clearTimeout(id));
    this.ambientTimers = [];
    this.activeNoiseNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // Safe catch
      }
    });
    this.activeNoiseNodes = [];
    this.currentAmbientType = 'none';
  }

  public getCurrentAmbient() {
    return this.currentAmbientType;
  }

  private startRainSound() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // Soft filtered pink noise
      lastOut = data[i];
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to sound like soft pattering rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.ambientGain);

    noiseSource.start();
    this.activeNoiseNodes.push({
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
        } catch {}
      }
    });
  }

  private startBrownNoise() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.ambientGain);

    noiseSource.start();
    this.activeNoiseNodes.push({
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
        } catch {}
      }
    });
  }

  private startOceanWaves() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    // LFO to modulate wave surge
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Wave cycle ~8 seconds

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(this.ambientGain);

    lfo.start();
    noiseSource.start();

    this.activeNoiseNodes.push({
      stop: () => {
        try {
          lfo.stop();
          noiseSource.stop();
          lfo.disconnect();
          noiseSource.disconnect();
        } catch {}
      }
    });
  }

  // Continuous Soothing Ambient Bamboo Flute Soundscape
  private startAmbientFluteSound() {
    if (!this.ctx || !this.ambientGain) return;

    // Harmonic pentatonic bamboo flute frequencies (G4, D5, A5)
    const fluteNotes = [392.0, 587.33, 880.0];
    
    fluteNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const ctx = this.ctx;

      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      // LFO for slow breath modulation & vibrato
      const vibratoLfo = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibratoLfo.frequency.setValueAtTime(5.0 + idx * 0.2, ctx.currentTime);
      vibratoGain.gain.setValueAtTime(2.5, ctx.currentTime);

      vibratoLfo.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      // Amplitude swell modulation (breath cycle ~6 seconds)
      const swellLfo = ctx.createOscillator();
      const swellGain = ctx.createGain();
      swellLfo.frequency.setValueAtTime(0.16 - idx * 0.03, ctx.currentTime);
      swellGain.gain.setValueAtTime(0.015 / (idx + 1), ctx.currentTime);

      swellLfo.connect(swellGain);
      swellGain.connect(gainNode.gain);

      gainNode.gain.setValueAtTime(0.02 / (idx + 1), ctx.currentTime);

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.value = 0.2;

      osc.connect(gainNode);
      oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(gainNode);

      gainNode.connect(this.ambientGain);

      osc.start();
      oscHarmonic.start();
      vibratoLfo.start();
      swellLfo.start();

      this.activeNoiseNodes.push({
        stop: () => {
          try {
            osc.stop();
            oscHarmonic.stop();
            vibratoLfo.stop();
            swellLfo.stop();
            osc.disconnect();
            oscHarmonic.disconnect();
            vibratoLfo.disconnect();
            swellLfo.disconnect();
          } catch {}
        }
      });
    });
  }

  // Synthesize a gentle, peaceful nightingale bird song with quiet forest breeze
  private startNightingaleSong() {
    if (!this.ctx || !this.ambientGain) return;
    const ctx = this.ctx;

    // 1. Soft whisper of forest leaves / gentle breeze (subtle lowpass noise)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.015 * white) / 1.015;
      lastOut = data[i];
    }

    const breezeSource = ctx.createBufferSource();
    breezeSource.buffer = buffer;
    breezeSource.loop = true;

    const breezeFilter = ctx.createBiquadFilter();
    breezeFilter.type = 'lowpass';
    breezeFilter.frequency.setValueAtTime(320, ctx.currentTime);

    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(0.01, ctx.currentTime);

    breezeSource.connect(breezeFilter);
    breezeFilter.connect(breezeGain);
    breezeGain.connect(this.ambientGain);
    breezeSource.start();

    this.activeNoiseNodes.push({
      stop: () => {
        try {
          breezeSource.stop();
          breezeSource.disconnect();
        } catch {}
      }
    });

    // Helper to play a crystal-clear, sweet nightingale bird chirp or trill
    const playChirp = (freq: number, duration: number, startDelay: number, glidetoFreq?: number, trill = false) => {
      if (!this.ctx || !this.ambientGain || this.currentAmbientType !== 'nightingale') return;
      const startTime = ctx.currentTime + startDelay;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      if (glidetoFreq) {
        osc.frequency.exponentialRampToValueAtTime(glidetoFreq, startTime + duration);
      }

      if (trill) {
        // Soft rapid pitch vibrato ("тьох-тьох")
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(16, startTime);
        lfoGain.gain.setValueAtTime(110, startTime);
        lfo.connect(osc.frequency);
        lfo.start(startTime);
        lfo.stop(startTime + duration);
      }

      // Bell-shaped smooth amplitude envelope
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.03, startTime + Math.min(0.03, duration * 0.3));
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    // Rhythmic song generator for nightingale motifs
    const playSongMotif = () => {
      if (this.currentAmbientType !== 'nightingale') return;

      const motifType = Math.floor(Math.random() * 3);

      if (motifType === 0) {
        // Motif A: Sweet rising whistle + gentle trill ("тьох-тьох-тьох")
        playChirp(2300, 0.16, 0.0, 2900);
        playChirp(2900, 0.14, 0.20, 3400);
        playChirp(3200, 0.32, 0.38, 2700, true);
        playChirp(3400, 0.22, 0.75, 2300);
      } else if (motifType === 1) {
        // Motif B: High-pitched melodious song sequence
        const notes = [2637, 3135, 3520, 2793, 3135];
        notes.forEach((f, idx) => {
          playChirp(f, 0.12, idx * 0.15);
        });
        playChirp(3520, 0.38, notes.length * 0.15 + 0.04, 2637, true);
      } else {
        // Motif C: Triple soft chirp & descending melodic glide
        playChirp(3100, 0.08, 0.0);
        playChirp(3100, 0.08, 0.12);
        playChirp(3100, 0.08, 0.24);
        playChirp(3300, 0.40, 0.38, 2200);
      }

      // Schedule next song motif in 2.5 - 4.5 seconds
      const nextDelay = 2500 + Math.random() * 2000;
      const timerId = window.setTimeout(() => {
        playSongMotif();
      }, nextDelay);
      this.ambientTimers.push(timerId);
    };

    // Start first song motif immediately
    playSongMotif();
  }
}

export const audioSynth = new CalmingAudioEngine();

