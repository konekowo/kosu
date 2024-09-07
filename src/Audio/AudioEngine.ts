import {PlayingAudios} from "./PlayingAudios";
import {Audio, MapAudio} from "./Audio";
import {BeatmapData} from "../Util/Beatmap/Data/BeatmapData";
import {Main} from "../main";
import {UnInheritedTimingPoint} from "../Util/Beatmap/Data/Sections/TimingPoints/UnInheritedTimingPoint";
import {Effect} from "../Util/Beatmap/Data/Sections/TimingPoints/Effect";

export class AudioEngine {
    public readonly audioContext: AudioContext;
    private readonly _playingAudios: PlayingAudios;
    private _musicQueue: MapAudio[] = [];
    private _audioIdTicker: number = 0;
    private _changeCallbacks: (() => void)[] = [];
    private silentMusic = this.createSilentMusic();
    public useSilentMusic = true;

    public constructor() {
        this.audioContext = new AudioContext();
        this._playingAudios = new PlayingAudios();
        Main.app.ticker.add(() => {
            this.update();
        });
    }

    public UpdateMusicQueue() {
        if (this._musicQueue[0]) {
            if (!this._musicQueue[0].fadingOut && this._musicQueue[0].timeStarted == 0) {
                this._play(this._musicQueue[0]);
                this._changeCallbacks.forEach((cb) => cb());
            }
            if (this._musicQueue[0].fadingOut && this._musicQueue[1]) {
                if (this._musicQueue[1]) {
                    this._play(this._musicQueue[1]);
                    this._changeCallbacks.forEach((cb) => cb());
                }
            }
        }
        if (!(this._musicQueue.length >= 1)) {
            this.silentMusic = this.createSilentMusic();
            this.useSilentMusic = true;
        }
        else {
            this.useSilentMusic = false;

        }
    }

    public createSilentMusic() {
        let mapAudio = new MapAudio();
        mapAudio.timeStarted = Date.now();
        mapAudio.beatmap = new BeatmapData();
        let timingPoint = new UnInheritedTimingPoint();
        timingPoint.time = 0;
        timingPoint.beatLength = 1000;
        timingPoint.effects = Effect.None;
        mapAudio.beatmap.TimingPoints.TimingPoints.push(timingPoint);
        return mapAudio;
    }

    public addMusicChangeEventListener(cb: () => void) {
        this._changeCallbacks.push(cb);
    }

    public removeMusicChangeEventListener(cb: () => void) {
        this._changeCallbacks = this._changeCallbacks.filter(callback => callback != cb);
    }

    public GetCurrentPlayingMusic(): MapAudio {
        return this.useSilentMusic ? this.silentMusic : this._musicQueue[0];
    }

    public PlayEffect(audio: AudioBuffer, pitch?: number) {
        let audioObj = new Audio();
        audioObj.audio = audio;
        audioObj.id = this._audioIdTicker;
        this._play(audioObj, pitch);
        this._audioIdTicker++;
    }

    public AddToMusicQueue(mapAudio: AudioBuffer, beatMapData: BeatmapData, musicPlayingCallback?: () => void) {
        let mapAudioObj = new MapAudio();
        mapAudioObj.audio = mapAudio;
        mapAudioObj.beatmap = beatMapData;
        mapAudioObj.id = this._audioIdTicker;
        if (musicPlayingCallback) {
            mapAudioObj.playingCallback = musicPlayingCallback;
        }
        this._musicQueue.push(mapAudioObj);
        this._audioIdTicker++;
        this.UpdateMusicQueue();
        return mapAudioObj.id;
    }

    public PlayMusicImmediately(mapAudio: AudioBuffer, beatMapData: BeatmapData, musicPlayingCallback?: () => void) {
        // clear queue
        this._musicQueue = [];
        this.AddToMusicQueue(mapAudio, beatMapData, musicPlayingCallback);
    }

    public update() {
        let currentPlaying = this.GetCurrentPlayingMusic();
        if (!this.useSilentMusic) {
            let analyzerMain = currentPlaying.GetNode(AnalyserNode)![0];
            let analyzerL = currentPlaying.GetNode(AnalyserNode)![1];
            let analyzerR = currentPlaying.GetNode(AnalyserNode)![2];

            analyzerMain.getFloatFrequencyData(currentPlaying.tempArrayMain);
            for (let i = 0; i < currentPlaying.FrequencyAmplitudes.length; i++) {
                currentPlaying.tempArrayMain[i] += 140;
                currentPlaying.tempArrayMain[i] /= 340;
                if (i < 3) {
                    currentPlaying.tempArrayMain[i] *= (12 * currentPlaying.tempArrayMain[i]);
                } else if (i < 6) {
                    currentPlaying.tempArrayMain[i] *= (9 * currentPlaying.tempArrayMain[i]);
                } else if (i < 100) {
                    currentPlaying.tempArrayMain[i] *= (6 * currentPlaying.tempArrayMain[i]);
                }
                currentPlaying.tempArrayMain[i] /= 2;
                if (currentPlaying.tempArrayMain[i] == Infinity || currentPlaying.tempArrayMain[i] == -Infinity) {
                    currentPlaying.FrequencyAmplitudes[i] = 0;
                }
                else {
                    currentPlaying.FrequencyAmplitudes[i] = currentPlaying.tempArrayMain[i];
                }
            }

            analyzerL.getFloatTimeDomainData(currentPlaying.tempArrayL);
            analyzerR.getFloatTimeDomainData(currentPlaying.tempArrayR);
            let avgL = 0;
            let avgR = 0;
            currentPlaying.tempArrayL.forEach((value) => {
               avgL += (value + 1)/2;
            });
            currentPlaying.tempArrayR.forEach((value) => {
                avgR += (value + 1)/2;
            });
            avgL /= currentPlaying.tempArrayL.length;
            avgR /= currentPlaying.tempArrayR.length;
            currentPlaying.LeftChannel = avgL;
            currentPlaying.RightChannel = avgR;
        }
    }

    private _play(audio: Audio | MapAudio, pitch?: number) {
        audio.Create(this.audioContext);
        // check if audio is type of MapAudio
        if ("beatmap" in audio && audio.beatmap) {
            this._playingAudios.audios.forEach((audio) => {
                if ("beatmap" in audio && audio.beatmap) {
                    clearTimeout(audio.fadeOutTimeout);
                    audio.fadingOut = true;
                    let gainNodes = audio.GetNode(GainNode);
                    if (gainNodes == null) {
                        throw new Error("Gain Node doesn't exist on Audio Object!");
                    }
                    let gain = gainNodes[0];
                    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4)
                    setTimeout(() => {
                        audio.Stop();
                    }, 400);
                }
            });
            let gain = this.audioContext.createGain();
            gain.gain.value = 0;
            let analyzer = this.audioContext.createAnalyser();
            analyzer.fftSize = 512;
            analyzer.smoothingTimeConstant = 0;
            let splitter = this.audioContext.createChannelSplitter(2);
            let analyzerL = this.audioContext.createAnalyser();
            analyzerL.smoothingTimeConstant = 0;
            analyzerL.fftSize = 128;
            let analyzerR = this.audioContext.createAnalyser();
            analyzerR.smoothingTimeConstant = 0;
            analyzerR.fftSize = 128;
            audio.AddAudioNode(gain);
            audio.AddAudioNode(analyzer);
            audio.AddAudioNode(analyzerL);
            audio.AddAudioNode(analyzerR);
            audio.ConnectToContext(this.audioContext, (nodes, source) => {
                source.connect(gain);
                gain.connect(this.audioContext.destination);
                source.connect(analyzer);
                source.connect(splitter);
                splitter.connect(analyzerL, 0);
                splitter.connect(analyzerR, 1);
            });
            audio.Play();
            this._playingAudios.audios.push(audio);
            if (audio.playingCallback) {
                audio.playingCallback();
            }
            gain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.4);
            audio.fadeOutTimeout = setTimeout(() => {
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4);
            }, (audio.audio.duration - 0.4) * 1000);
        } else {
            audio.ConnectToContext(this.audioContext);
            if (pitch) {
                if (audio.source) {
                    audio.source.playbackRate.value = pitch;
                }
            }
            audio.Play();
            this._playingAudios.audios.push(audio);
        }


        audio.RegisterEndCallBack(() => {
            audio.isPlaying = false;
            if ("beatmap" in audio && audio.beatmap) {
                if (this._musicQueue[0] == audio) {
                    this._musicQueue.splice(0, 1);
                }
            }
            this._playingAudios.audios.forEach((audioInArr, index) => {
                if (audioInArr === audio) {
                    this._playingAudios.audios.splice(index, 1);
                    return;
                }
            });
            this.UpdateMusicQueue();
        });
    }

}
