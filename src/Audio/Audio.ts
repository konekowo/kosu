import {BeatmapData} from "../Util/Beatmap/Data/BeatmapData";
import {Main} from "../Main";
import {EventTypes} from "../Util/Beatmap/Data/Sections/Events/EventTypes";
import {EventVideo} from "../Util/Beatmap/Data/Sections/Events/EventVideo";

export class Audio {
    public audio!: AudioBuffer;
    public source?: AudioBufferSourceNode;
    public mediaSource?: MediaElementAudioSourceNode;
    public mediaAudioElement!: HTMLAudioElement;
    public id!: number;
    public get isPaused() {
        return this._useMediaSource ? this.mediaAudioElement.paused : false;
    }
    public get isPlaying() {
        return this._useMediaSource ? !this.mediaAudioElement.paused : true;
    }
    public nodes: AudioNode[] = [];
    public tempArrayMain = new Float32Array(256);
    public tempArrayL = new Float32Array(64);
    public tempArrayR = new Float32Array(64);
    public LeftChannel: number = 0;
    public RightChannel: number = 0;
    public FrequencyAmplitudes = new Float32Array(256);
    protected _connectedToContext = false;
    protected _useMediaSource = false;
    protected _onEndCallback?: () => void;
    public timeStarted = 0; // only for silent audio when real music is paused
    protected paused = false; // used to check if music was paused outside of Audio class (i.e. pressing stop media button on the keyboard)
    public beatmap!: BeatmapData;

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
            this.mediaAudioElement.onpause = () => {
                if (!this.paused && !this.mediaAudioElement.ended) { // check if music was paused outside of Audio class
                    this.Play();
                }
            }
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
        this.paused = false;
        if (!this._useMediaSource) {
            this.source!.start();
        }
        else {
            this.mediaAudioElement!.play();
            let backgroundVideo = this.beatmap.Events.Events.find((e) => {
                if (e.eventType == EventTypes.VIDEO){
                    return e;
                }
            }) as EventVideo;
            if (backgroundVideo) {
                if (backgroundVideo.texture) {
                    if (backgroundVideo.texture.source.resource.startPromise) {
                        backgroundVideo.texture.source.resource.startPromise.then(() => {
                            let video = backgroundVideo.texture!.source.resource as HTMLVideoElement;
                            video.play();
                        });
                    }
                }
            }
        }
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
        this.paused = true;
        this.mediaAudioElement!.pause();
        let backgroundVideo = this.beatmap.Events.Events.find((e) => {
            if (e.eventType == EventTypes.VIDEO){
                return e;
            }
        }) as EventVideo;
        if (backgroundVideo) {
            if (backgroundVideo.texture) {
                if (backgroundVideo.texture.source.resource.startPromise) {
                    backgroundVideo.texture.source.resource.startPromise.then(() => {
                        let video = backgroundVideo.texture!.source.resource as HTMLVideoElement;
                        video.pause();
                    });
                }
            }
        }
    }

    public Stop() {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext) {
            throw new Error("Not connected to audio context yet!");
        }
        this.paused = true;
        if (!this._useMediaSource) {
            this.source!.stop();
        }
        else {
            this.mediaAudioElement!.pause();
            if (this._onEndCallback) {
                this._onEndCallback();
            }
            let backgroundVideo = this.beatmap.Events.Events.find((e) => {
                if (e.eventType == EventTypes.VIDEO){
                    return e;
                }
            }) as EventVideo;
            if (backgroundVideo) {
                if (backgroundVideo.texture) {
                    if (backgroundVideo.texture.source.resource.startPromise) {
                        backgroundVideo.texture.source.resource.startPromise.then(() => {
                            let video = backgroundVideo.texture!.source.resource as HTMLVideoElement;
                            video.pause();
                        });
                    }
                }
            }
        }
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
        let backgroundVideo = this.beatmap.Events.Events.find((e) => {
            if (e.eventType == EventTypes.VIDEO){
                return e;
            }
        }) as EventVideo;
        if (backgroundVideo) {
            if (backgroundVideo.texture) {
                if (backgroundVideo.texture.source.resource.startPromise) {
                    backgroundVideo.texture.source.resource.startPromise.then(() => {
                        let video = backgroundVideo.texture!.source.resource as HTMLVideoElement;
                        let time = timeMS/1000;
                        time += backgroundVideo.startTime;
                        if (time < 0) {
                            video.currentTime = 0;
                            video.pause();
                            backgroundVideo.texture!.source.resource.startPromise = new Promise<void>((resolve) => {
                                setTimeout(() => {
                                    video.play();
                                }, Math.abs(time));
                            });
                        } else {
                            video.currentTime = time;
                        }

                    });
                }
            }
        }
    }

    public GetDuration() {
        return (!this._useMediaSource ? this.audio.duration : this.mediaAudioElement.duration * 1000)
    }

    public GetCurrentTime() {
        return this._useMediaSource ? this.mediaAudioElement.currentTime * 1000 : (this.timeStarted != 0 ? Date.now() - this.timeStarted : 0);
    }

    public RegisterEndCallBack(callback: () => void) {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        this._onEndCallback = callback;
        if (!this._useMediaSource) {
            this.source!.onended = () => {
                if (!this.isPaused) {
                    this.paused = true;
                    callback();
                }
            }
        }
        else {
            this.mediaAudioElement.onended = () => {
                this.paused = true;
                callback();
            }
        }
    }

}

export class MapAudio extends Audio {
    public fadingOut: boolean = false;
    // @ts-ignore
    public fadeOutTimeout!: Timeout
    public playingCallback?: () => void;

    public FadeOut() {
        if (!(!this._useMediaSource ? this.source : this.mediaSource)) {
            throw new Error("Source not created yet!");
        }
        if (!this._connectedToContext) {
            throw new Error("Not connected to audio context yet!");
        }
        if (!this._useMediaSource) {
            throw new Error("FadeOut is not supported on AudioSourceBuffer!");
        }
        if (this.fadingOut) {
            return;
        }
        this.fadingOut = true;
        clearTimeout(this.fadeOutTimeout);
        let gainNodes = this.GetNode(GainNode);
        if (gainNodes == null) {
            throw new Error("Gain Node doesn't exist on Audio Object!");
        }
        let gain = gainNodes[0];
        gain.gain.linearRampToValueAtTime(0, Main.AudioEngine.audioContext.currentTime + 1)
        setTimeout(() => {
            this.Stop();
        }, 1000);
    }
}
