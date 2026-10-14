/**
 * Web Audio API synthesizer for meditative Persian Ney / Ambient Drone (Dastgah Shur scale)
 * Completely offline, zero external audio assets required.
 */
class PersianAmbiencePlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private intervals: number[] = [];

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 2.5);
      this.masterGain.connect(this.ctx.destination);

      // Persian Dastgah Shur / Dashti Root Frequencies (D3 / G3 / A3 / C4 / D4)
      const droneFreqs = [146.83, 220.0, 293.66, 440.0];

      // Create warm harmonic drone oscillators
      droneFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Gentle tremolo (LFO) for wind/breath flute realism
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        const baseGain = 0.08 / (idx + 1);
        oscGain.gain.setValueAtTime(baseGain, this.ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();

        this.oscillators.push(osc);
      });

      // Ambient Ney breath noise simulation
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter for bamboo flute whisper
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      whiteNoise.start();

      this.isPlaying = true;
    } catch {
      // Audio not permitted without gesture or not supported
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try { osc.stop(); } catch { /* ignore */ }
        });
        this.oscillators = [];
        this.intervals.forEach(clearInterval);
        this.intervals = [];
        if (this.ctx) {
          this.ctx.close();
          this.ctx = null;
        }
        this.isPlaying = false;
      }, 1300);
    } catch {
      this.isPlaying = false;
    }
  }
}

export const persianAmbience = new PersianAmbiencePlayer();
