
import { decodeAudioData } from "@/utils/audio";

interface PlayOptions {
    volume?: number;
    loop?: boolean;
}

class AudioEngine {
    private static instance: AudioEngine;
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private compressor: DynamicsCompressorNode | null = null;
    private bufferCache: Map<string, AudioBuffer> = new Map();
    private isMuted: boolean = false;

    private constructor() { }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    private initContext(): void {
        if (this.context) return; // Already initialized

        try {
            const AudioContextClass =
                window.AudioContext || (window as any).webkitAudioContext;
            this.context = new AudioContextClass({
                latencyHint: "interactive",
                sampleRate: 44100,
            });

            // Master Channel: Source -> TrackGain -> MasterGain -> Compressor -> Destination
            // Note: Compressor at end to prevent clipping
            this.masterGain = this.context.createGain();
            this.compressor = this.context.createDynamicsCompressor();

            // Compressor settings for transparent limiting
            this.compressor.threshold.value = -1;
            this.compressor.knee.value = 10;
            this.compressor.ratio.value = 12;
            this.compressor.attack.value = 0.003;
            this.compressor.release.value = 0.25;

            this.masterGain.connect(this.compressor);
            this.compressor.connect(this.context.destination);

            this.updateMuteState();
        } catch (e) {
            console.error("AudioEngine initialization failed:", e);
        }
    }

    public async resume(): Promise<void> {
        if (!this.context) this.initContext();
        if (this.context && this.context.state === "suspended") {
            await this.context.resume();
        }
    }

    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        this.updateMuteState();
    }

    private updateMuteState(): void {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(
                this.isMuted ? 0 : 1,
                this.context?.currentTime || 0,
                0.1
            );
        }
    }

    public async preload(urls: string[]): Promise<void> {
        const promises = urls.map(async (url) => {
            if (this.bufferCache.has(url)) return;
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await decodeAudioData(arrayBuffer);
                this.bufferCache.set(url, audioBuffer);
            } catch (e) {
                console.error(`Failed to preload ${url}:`, e);
            }
        });
        await Promise.all(promises);
    }

    public play(url: string, options: PlayOptions = {}): void {
        if (!this.context) this.initContext();
        if (!this.context) return;

        if (this.context.state === "suspended") {
            // Attempt resume (might fail if no interaction, that's expected)
            this.context.resume().catch(() => { });
        }

        const buffer = this.bufferCache.get(url);
        if (!buffer) {
            // If not preloaded, try to load and play (fire and forget)
            this.preload([url]).then(() => {
                const loadedBuffer = this.bufferCache.get(url);
                if (loadedBuffer) this.playSoundBuffer(loadedBuffer, options);
            });
            return;
        }

        this.playSoundBuffer(buffer, options);
    }

    private playSoundBuffer(buffer: AudioBuffer, options: PlayOptions): void {
        if (!this.context || !this.masterGain) return;

        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = options.loop || false;

        const trackGain = this.context.createGain();
        trackGain.gain.value = options.volume ?? 1.0;

        source.connect(trackGain);
        trackGain.connect(this.masterGain);

        source.start();
    }
}

export default AudioEngine;
