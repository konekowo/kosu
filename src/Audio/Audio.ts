import {BeatmapData} from "../Util/Beatmap/Data/BeatmapData";

export class Audio {
    public audio!: AudioBuffer;
    public timeStarted: number = 0;
    public source?: AudioBufferSourceNode;
    public mediaSource?: MediaElementAudioSourceNode;
    public mediaAudioElement!: HTMLAudioElement;
    public id!: number;
    public isPlaying: boolean = false;
    public isPaused: boolean = false;
    public pausedTime: number = 0;
    public nodes: AudioNode[] = [];
    public tempArrayMain = new Float32Array(256);
    public tempArrayL = new Float32Array(64);
    public tempArrayR = new Float32Array(64);
    public LeftChannel: number = 0;
    public RightChannel: number = 0;
    public FrequencyAmplitudes = new Float32Array(256);
    private _connectedToContext = false;
    private _useMediaSource = false;
    private _onEndCallback?: () => void;

    public GetMaximumAudioLevel() {
        return Math.max(this.LeftChannel, this.RightChannel);
    }

    public GetAverageAudioLevel() {
        return (this.LeftChannel + this.RightChannel) / 2;
    }

    public Create(audioContext: AudioContext, useMediaSource?: boolean) {
        this._useMediaSource = useMediaSource ? useMediaSource : false;
        if (!useMediaSource) {
            this.source = audioContext.createBufferSource();
            this.source.buffer = this.audio;
        }
        else {
            if (!this.mediaAudioElement) {
                throw new Error("HTML Audio Element was not initialized!")
            }
            this.mediaSource = audioContext.createMediaElementSource(this.mediaAudioElement);
        }
    }

    public AddAudioNode(node: AudioNode) {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        this.nodes.push(node);
    }

    public GetNode<T>(type: new (...args: any[]) => T): T[] | null {
        let nodes = this.nodes.filter(node => node instanceof type) as T[];
        if (nodes.length > 0) {
            return nodes;
        } else {
            return null;
        }
    }

    public ConnectToContext(audioContext: AudioContext, howToConnectFunction?: (nodes: AudioNode[], source: AudioBufferSourceNode | MediaElementAudioSourceNode) => void) {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        if (this._connectedToContext) {
            return;
        }
        this._connectedToContext = true;
        if (this.nodes.length > 0) {
            if (howToConnectFunction) {
                howToConnectFunction(this.nodes, (!this._useMediaSource ? this.source : this.mediaSource)!);
            } else {
                this.nodes.forEach((node, index) => {
                    this.source!.connect(node);
                    if (!(node instanceof AnalyserNode)) {
                        node.connect(audioContext.destination);
                    }
                });
            }
        } else {
            if (!this._useMediaSource) {
                this.source!.connect(audioContext.destination);
            }
            else {
                this.mediaSource!.connect(audioContext.destination);
            }
        }
    }

    public Play() {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext) {
            throw new Error("Not connected to audio context yet!");
        }
        if (!this._useMediaSource) {
            this.source!.start(0, this.pausedTime);
        }
        else {
            this.mediaAudioElement!.play();
        }
        this.isPlaying = true;
        this.isPaused = false;
        this.timeStarted = Date.now() - this.pausedTime;
        this.pausedTime = 0;
    }

    public Pause() {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext) {
            throw new Error("Not connected to audio context yet!");
        }
        if (!this._useMediaSource) {
            throw new Error("Pause is not supported on AudioSourceBuffer!");
        }
        this.pausedTime = Date.now() - this.timeStarted;
        this.mediaAudioElement!.pause();
        this.isPaused = true;
        this.isPlaying = false;
    }

    public Stop() {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext) {
            throw new Error("Not connected to audio context yet!");
        }
        if (!this._useMediaSource) {
            this.source!.stop(0);
        }
        else {
            this.mediaAudioElement!.pause();
            if (this._onEndCallback) {
                this._onEndCallback();
            }
        }
        this.isPlaying = false;
    }

    public SetTime(timeMS: number) {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext) {
            throw new Error("Not connected to audio context yet!");
        }
        if (!this._useMediaSource) {
            throw new Error("SetTime is not supported on AudioSourceBuffer!");
        }
        this.mediaAudioElement.currentTime = timeMS/1000;
    }

    public GetDuration() {
        return (!this._useMediaSource ? this.audio.duration : this.mediaAudioElement.duration * 1000)
    }

    public RegisterEndCallBack(callback: () => void) {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        this._onEndCallback = callback;
        if (!this._useMediaSource) {
            this.source!.onended = () => {
                if (!this.isPaused) {
                    callback();
                }
            }
        }
    }

}

export class MapAudio extends Audio {
    public beatmap!: BeatmapData;
    public fadingOut: boolean = false;
    // @ts-ignore
    public fadeOutTimeout!: Timeout
    public playingCallback?: () => void;

}
