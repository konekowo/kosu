import {BeatmapData} from "../Data/BeatmapData";
import {EventTypes} from "../Data/Sections/Events/EventTypes";
import {EventBackground} from "../Data/Sections/Events/EventBackground";
import {EventVideo} from "../Data/Sections/Events/EventVideo";
import {EventBreak} from "../Data/Sections/Events/EventBreak";
import {FFmpeg} from '@ffmpeg/ffmpeg';
import * as PIXI from "pixi.js";
import {Loader} from "../../../Loader";
import {EventSprite} from "../Data/Sections/Events/Storyboard/EventSprite";
import {convertToLayer} from "../Data/Sections/Events/Storyboard/Layer";
import {EventAnimation} from "../Data/Sections/Events/Storyboard/EventAnimation";
import {convertToOrigin} from "../Data/Sections/Events/Storyboard/Origin";
import {convertToLoopType, LoopType} from "../Data/Sections/Events/Storyboard/LoopType";
import {AudioEngine} from "../../../Audio/AudioEngine";
import {EventSample} from "../Data/Sections/Events/Storyboard/EventSample";
import {MathUtil} from "../../MathUtil";

export class EventsParser {
    public static aviTranscodedVideoCache: { beatmapSID: number, filePath: string, blob: Blob }[] = [];

    public static ParseEvents(beatmapData: BeatmapData, section: string[]) {
        console.log(section);
        let object;
        section.forEach((str) => {
            let values = str.split(",");
            let event;
            switch (values[0]) {
                case EventTypes.BACKGROUND:
                case "0":
                    event = new EventBackground();
                    event.filename = values[2].replaceAll('"', "").replaceAll("\\", "/");
                    event.xOffset = parseFloat(values[3]);
                    event.yOffset = parseFloat(values[4]);
                    if (isNaN(event.xOffset)) {
                        event.xOffset = 0;
                    }
                    if (isNaN(event.yOffset)) {
                        event.yOffset = 0;
                    }
                    object = event;
                    break;
                case EventTypes.VIDEO:
                case "1":
                    event = new EventVideo();
                    event.startTime = parseInt(values[1]);
                    event.filename = values[2].replaceAll('"', "").replaceAll("\\", "/");
                    event.xOffset = parseFloat(values[3]);
                    event.yOffset = parseFloat(values[4]);
                    if (isNaN(event.xOffset)) {
                        event.xOffset = 0;
                    }
                    if (isNaN(event.yOffset)) {
                        event.yOffset = 0;
                    }
                    object = event;
                    break;
                case EventTypes.BREAK:
                case "2":
                    event = new EventBreak();
                    event.startTime = parseInt(values[1]);
                    event.endTime = parseInt(values[2]);
                    object = event;
                    break;
                case EventTypes.COLOR:
                case "3":
                    object = undefined; //ignore event for now
                    break;
                case EventTypes.SPRITE:
                case "4":
                    event = new EventSprite();
                    event.layer = convertToLayer(values[1]);
                    event.origin = convertToOrigin(values[2]);
                    event.filepath = values[3].replaceAll('"', "").replaceAll("\\", "/");
                    event.x = parseFloat(values[4]);
                    event.y = parseFloat(values[5]);
                    if (isNaN(event.x)) {
                        event.x = 0;
                    }
                    if (isNaN(event.y)) {
                        event.y = 0;
                    }
                    object = event;
                    break;
                case EventTypes.SAMPLE:
                case "5":
                    event = new EventSample();
                    event.startTime = parseFloat(values[1]);
                    event.layer = convertToLayer(values[2]);
                    event.filepath = values[3].replaceAll('"', "").replaceAll("\\", "/");
                    event.volume = values.length > 4 ? MathUtil.clamp01(parseFloat(values[4])/100) : 1;
                    object = event;
                    break;
                case EventTypes.ANIMATION:
                case "6":
                    event = new EventAnimation();
                    event.layer = convertToLayer(values[1]);
                    event.origin = convertToOrigin(values[2]);
                    event.filepath = values[3].replaceAll('"', "").replaceAll("\\", "/");
                    let filePathWithNoFileExtension = event.filepath.substring(0, event.filepath.lastIndexOf("."));
                    for (let filePath of beatmapData.files.keys()) {
                        if (filePath.startsWith(filePathWithNoFileExtension)){
                            event.filepaths.push(filePath);
                        }
                    }
                    event.filepaths.sort((a, b) => {
                        //@ts-ignore
                        let noExtA = parseInt(a.substring(filePathWithNoFileExtension.length, a.lastIndexOf(".")));
                        //@ts-ignore
                        let noExtB = parseInt(b.substring(filePathWithNoFileExtension.length, b.lastIndexOf(".")));
                        return noExtA - noExtB;
                    });
                    event.x = parseFloat(values[4]);
                    event.y = parseFloat(values[5]);
                    if (isNaN(event.x)) {
                        event.x = 0;
                    }
                    if (isNaN(event.y)) {
                        event.y = 0;
                    }
                    event.frameCount = parseInt(values[6]);
                    event.frameDelay = parseFloat(values[7]);

                    if (beatmapData.formatVersion < 6) {
                        // i don't understand this at all, but looks like the developers behind osu! lazer don't either
                        // https://github.com/ppy/osu/blob/c46d787f1ef46827693dcfc334276e8b76b00d51/osu.Game/Beatmaps/Formats/LegacyStoryboardDecoder.cs#L145
                        event.frameDelay = Math.round(0.015 * event.frameDelay) * 1.186 * (1000 / 60);
                    }

                    event.loopType = values.length > 8 ? convertToLoopType(values[8]) : LoopType.LoopForever;
                    console.log(event);
                    object = event;
                    break;
            }
            if (event) {
                beatmapData.Events.Events.push(event);
            }
        });
    }

    public static async LoadFiles(beatmapData: BeatmapData, audioEngine: AudioEngine) {
        await new Promise<void>(async (resolve) => {
            let toLoad = beatmapData.Events.Events.filter((event) => {
                if (("filename" in event && event.filename) || ("filepath" in event && event.filepath)) {
                    return event;
                }
            });
            let loaded = 0;
            let check = () => {
                if (loaded == toLoad.length) {
                    resolve();
                    return;
                }
            }
            check(); // check because toLoad.length could be 0
            for (const event of toLoad) {
                for (let eventKey in event) {
                    if (eventKey == "filename" || eventKey == "filepath") {
                        // @ts-ignore
                        let file = beatmapData.files.get(event[eventKey]);
                        if (event instanceof EventAnimation) {
                            file = new Blob();
                        }
                        if (file) {
                            let url = URL.createObjectURL(file);
                            if (event instanceof EventBackground) {
                                PIXI.Assets.load({src: url, loadParser: "loadTextures"}).then((texture) => {
                                    event.texture = texture;
                                    loaded++;
                                    check();
                                }).catch((e) => {
                                    console.warn(e);
                                    loaded++;
                                    check();
                                });
                            }
                            if (event instanceof EventVideo) {
                                let failed = false;
                                // @ts-ignore
                                if (event[eventKey].endsWith(".avi")) {
                                    // @ts-ignore
                                    let cacheHit = this.aviTranscodedVideoCache.find(
                                        (cache) => {
                                            // @ts-ignore
                                            if (cache.beatmapSID == beatmapData.Metadata.BeatmapSetID && cache.filePath == event[eventKey]) {
                                                return cache;
                                            }
                                        }
                                    );
                                    try {
                                        if (!cacheHit) {
                                            console.warn("AVI video is not natively supported! Transcoding to .mp4, this may take a few minutes!");
                                            let ffmpeg = new FFmpeg();
                                            ffmpeg.on('progress', ({progress, time}) => {
                                                console.log(`.avi to .mp4 transcoding: ${Math.round(progress * 1000) / 10}% (transcoded time: ${Math.round(time / 100000) / 10}s)`);
                                            });
                                            console.log("FFmpeg initialized");
                                            const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
                                            let classWorker = Loader.Get("workers.ffmpeg");
                                            let core = Loader.Get("ffmpeg.core");
                                            let wasm = Loader.Get("ffmpeg.wasm");
                                            let worker = Loader.Get("ffmpeg.coreWorker");
                                            await ffmpeg.load({
                                                classWorkerURL: URL.createObjectURL(classWorker),
                                                coreURL: URL.createObjectURL(core),
                                                wasmURL: URL.createObjectURL(wasm),
                                                workerURL: URL.createObjectURL(worker)
                                            });
                                            console.log("FFmpeg loaded");
                                            await ffmpeg.writeFile('input.avi', new Uint8Array(await file.arrayBuffer()));
                                            console.log("Written file to FFmpeg's vfs");
                                            await ffmpeg.exec(["-i", "input.avi", "-c:v", "libx264", "-preset",
                                                "ultrafast", "-an", "-movflags", "faststart", "output.mp4"]);
                                            console.log("Transcoding done");
                                            const data = await ffmpeg.readFile("output.mp4");
                                            ffmpeg.terminate();
                                            console.log("FFmpeg terminated");
                                            let newFile = new Blob([data], {type: 'video/mp4'});
                                            this.aviTranscodedVideoCache.push({
                                                beatmapSID: beatmapData.Metadata.BeatmapSetID,
                                                // @ts-ignore
                                                filePath: event[eventKey],
                                                blob: newFile
                                            });
                                            // @ts-ignore
                                            beatmapData.files.delete(event[eventKey]);
                                            // @ts-ignore
                                            event[eventKey] = event[eventKey].substring(0, event[eventKey].length - 4) + ".mp4";
                                            // @ts-ignore
                                            beatmapData.files.set(event[eventKey], newFile);
                                            URL.revokeObjectURL(url);
                                            url = URL.createObjectURL(newFile);
                                            console.log("Successfully transcoded from .avi to .mp4!");
                                        } else {
                                            // @ts-ignore
                                            beatmapData.files.delete(event[eventKey]);
                                            // @ts-ignore
                                            event[eventKey] = event[eventKey].substring(0, event[eventKey].length - 4) + ".mp4";
                                            // @ts-ignore
                                            beatmapData.files.set(event[eventKey], cacheHit.blob);
                                            URL.revokeObjectURL(url);
                                            url = URL.createObjectURL(cacheHit.blob);
                                        }
                                    } catch (e) {
                                        console.warn(e);
                                        failed = true;
                                    }
                                }
                                if (!failed) {
                                    PIXI.Assets.load({src: url, loadParser: "loadVideo"}).then((texture) => {
                                        event.texture = texture;
                                        if (event.texture) {
                                            event.texture.source.resource.volume = 0;
                                            event.texture.source.resource.pause();
                                        }
                                        loaded++;
                                        check();
                                    }).catch((e) => {
                                        console.warn(e);
                                        loaded++;
                                        check();
                                    });
                                } else {
                                    loaded++;
                                    check();
                                }
                            }
                            if (event instanceof EventSprite) {
                                PIXI.Assets.load({src: url, loadParser: "loadTextures"}).then((texture) => {
                                    event.texture = texture;
                                    loaded++;
                                    check();
                                }).catch((e) => {
                                    console.warn(e);
                                    loaded++;
                                    check();
                                });
                            }
                            if (event instanceof EventSample) {
                                file.arrayBuffer().then((arrayBuffer) => {
                                    audioEngine.audioContext.decodeAudioData(arrayBuffer).then((audioBuffer) => {
                                       event.audioBuffer = audioBuffer;
                                       loaded++;
                                       check();
                                    }).catch((e) => {
                                        console.warn(e);
                                        loaded++;
                                        check();
                                    });
                                })
                            }
                            if (event instanceof EventAnimation) {
                                URL.revokeObjectURL(url);
                                let loadedTextures = 0;
                                let texturesNeededToLoad = event.filepaths.length;
                                let checkLoadedTextures = () => {
                                    if (loadedTextures == texturesNeededToLoad) {
                                        loaded++;
                                        check();
                                    }
                                }
                                event.filepaths.forEach((filePath, i) => {
                                   let file = beatmapData.files.get(filePath);
                                   if (file) {
                                       let url = URL.createObjectURL(file);
                                       PIXI.Assets.load({src: url, loadParser: "loadTextures"}).then((texture) => {
                                           event.textures[i] = texture;
                                           loadedTextures++
                                           checkLoadedTextures();
                                       }).catch((e) => {
                                           console.warn(e);
                                           loadedTextures++;
                                           checkLoadedTextures();
                                       });
                                   }
                                });
                            }
                        } else {
                            // @ts-ignore
                            console.warn("Could not find referenced file: " + event[eventKey]);
                        }
                    }
                }
            }
        });
    }
}