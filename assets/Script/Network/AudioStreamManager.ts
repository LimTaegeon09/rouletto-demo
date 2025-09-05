import { GameConstants } from "../Configs/GameConstants";
import { SoundManager } from "../managers/SoundManager";

export class AudioStreamManager {
    private static _instance: AudioStreamManager = null;

    public static get instance(): AudioStreamManager {
        if (this._instance === null) {
            this._instance = new AudioStreamManager();
        }
        return this._instance;
    }

    private constructor() { }

    private readonly sampleRate: number = 16000;
    private readonly numberOfChannels: number = 1;

    private reconnectTimer: any = null;

    private audioContext: AudioContext = null;
    private gainNode: GainNode = null;
    private webSocket: WebSocket = null;
    private scheduledTime: number = 0;
    private isInitialized: boolean = false;
    private isPlaying: boolean = false;

    /**
     * 플레이어를 초기화합니다. 게임 시작 시점에 한 번만 호출해야 합니다.
     */
    public initialize(): void {
        if (this.isInitialized) {
            console.warn('AudioStreamManager is already initialized.');
            return;
        }

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: this.sampleRate
            });

            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);

            this.isInitialized = true;
        }
        catch (e) {
            console.warn('Web Audio API is not supported in this browser.');
        }
    }

    public setVolume(volume: number): void {
        if (!this.isInitialized || !this.gainNode) {
            return;
        }

        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.gainNode.gain.value = clampedVolume;
    }

    /**
     * 스트리밍 재생을 시작하거나 일시 중지된 재생을 재개합니다.
     */
    public startStreaming(): void {
        if (!this.isInitialized || !this.audioContext) {
            console.warn('AudioStreamManager is not initialized. Call initialize() first.');
            return;
        }

        this.setVolume(SoundManager.instance.volume);

        this.isPlaying = true;
        this.resumeAudioContext();
        this.initWebSocket();
    }

    /**
     * 스트리밍 재생을 일시 중지합니다. 웹소켓 연결은 유지됩니다.
     */
    public stopStreaming(): void {
        if (!this.isPlaying || !this.audioContext) {
            return;
        }
        // 재연결 시도를 막기 위해 isPlaying 상태를 먼저 변경합니다.
        this.isPlaying = false;
        // 예약된 재연결 타이머가 있다면 취소합니다.
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.audioContext.suspend();
    }

    /**
     * 스트리밍을 완전히 중지하고 모든 자원을 해제합니다.
     */
    public destroy(): void {
        this.isPlaying = false;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.webSocket) {
            // 재연결 로직이 실행되지 않도록 이벤트 리스너를 먼저 제거합니다.
            this.webSocket.onclose = null;
            this.webSocket.onerror = null;
            this.webSocket.close();
            this.webSocket = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.gainNode = null;
        }
        this.isInitialized = false;
    }

    private resumeAudioContext(): void {
        if (this.audioContext && this.audioContext.state !== 'running') {
            this.audioContext.resume();
        }
    }

    private initWebSocket(): void {
        if (this.webSocket && this.webSocket.readyState < 2) {
            return; // 이미 연결 중이거나 열려있음
        }

        // 새로운 연결을 시도하기 전에 이전 타이머를 정리합니다.
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        this.webSocket = new WebSocket(GameConstants.AUDIO_WEBSOCKET_URL);
        this.webSocket.binaryType = 'arraybuffer';

        this.webSocket.onopen = (event) => { /* 연결 성공 */ };
        this.webSocket.onmessage = (event) => this.processAudioChunk(event.data);
        this.webSocket.onerror = (event) => console.warn('WebSocket error:', event);
        this.webSocket.onclose = (event) => {
            // 연결이 닫혔을 때 재연결을 시도합니다.
            this.scheduleReconnect();
        };
    }

    private scheduleReconnect(): void {
        // 사용자가 의도적으로 중단한 경우에는 재연결하지 않습니다.
        if (!this.isPlaying) {
            return;
        }

        // 중복된 타이머 생성을 방지합니다.
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        console.log(`WebSocket connection lost. Reconnecting in ${GameConstants.WS_RECONNECTION_TIME * 1000 / 1000} seconds...`);
        this.reconnectTimer = setTimeout(() => {
            this.initWebSocket();
        }, GameConstants.WS_RECONNECTION_TIME * 1000);
    }

    private processAudioChunk(audioData: ArrayBuffer): void {
        if (!this.audioContext || !this.isPlaying || !this.gainNode) return;

        const pcmData = new Int16Array(audioData);
        const frameCount = pcmData.length;
        const audioBuffer = this.audioContext.createBuffer(
            this.numberOfChannels,
            frameCount,
            this.sampleRate
        );
        const channelData = audioBuffer.getChannelData(0);

        for (let i = 0; i < frameCount; i++) {
            channelData[i] = pcmData[i] / 32768;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.gainNode);

        const currentTime = this.audioContext.currentTime;
        if (this.scheduledTime < currentTime) {
            this.scheduledTime = currentTime;
        }

        source.start(this.scheduledTime);
        this.scheduledTime += audioBuffer.duration;
    }
}

