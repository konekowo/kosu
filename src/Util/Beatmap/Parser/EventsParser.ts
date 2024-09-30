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
import {CommandType} from "../Data/Sections/Events/Storyboard/Commands/CommandType";
import {LoopCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/LoopCommand";
import {Event} from "../Data/Sections/Events/Event";
import {EventStoryboard} from "../Data/Sections/Events/Storyboard/EventStoryboard";
import {StoryboardCommand} from "../Data/Sections/Events/Storyboard/Commands/StoryboardCommand";
import {EasingFunction} from "../../TweenWrapper/EasingFunction";
import {FadeCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/FadeCommand";
import {ScaleCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/ScaleCommand";
import {VectorScaleCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/VectorScaleCommand";
import {RotateCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/RotateCommand";
import {MoveCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/MoveCommand";
import {MoveXCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/MoveXCommand";
import {MoveYCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/MoveYCommand";
import {ColorCommand} from "../Data/Sections/Events/Storyboard/Commands/impl/ColorCommand";
import {
    ParameterCommand,
    ParameterCommandType
} from "../Data/Sections/Events/Storyboard/Commands/impl/ParameterCommand";

export class EventsParser {
    public static aviTranscodedVideoCache: { beatmapSID: number, filePath: string, blob: Blob }[] = [];

    public static ParseEvents(beatmapData: BeatmapData, section: string[]) {
        let object: EventStoryboard | undefined;
        let parentCommand: StoryboardCommand | undefined;
        section.forEach((str) => {
            let depth = 0;
            if (str.startsWith(" ") || str.startsWith("_")){
                depth = 1;
            }
            if (str.startsWith("  ") || str.startsWith("__")){
                depth = 2;
            }
            let values = str.split(",");
            let event;
            if (depth == 0) {
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
                        object = undefined;
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
                        object = undefined;
                        break;
                    case EventTypes.BREAK:
                    case "2":
                        event = new EventBreak();
                        event.startTime = parseInt(values[1]);
                        event.endTime = parseInt(values[2]);
                        object = undefined;
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
                        event.volume = values.length > 4 ? MathUtil.clamp01(parseFloat(values[4]) / 100) : 1;
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
                            if (filePath.startsWith(filePathWithNoFileExtension)) {
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
                        object = event;
                        break;
                }
            } else {
                if (object) {
                    switch (values[0].substring(depth, values[0].length)) {
                        case CommandType.Trigger: // skip trigger commands for now
                            if (depth == 2) break;
                            parentCommand = undefined;
                            break;
                        case CommandType.Loop:
                            if (depth == 2) break;
                            event = new LoopCommand();
                            event.parentStoryboardObject = object;
                            event.startTime = parseFloat(values[1]);
                            event.loopCount = Math.max(0, parseInt(values[2]) - 1);
                            parentCommand = event;
                            break;
                        default:
                            if (values[3] == "") {
                                values[3] = values[2];
                            }

                            let easing = EasingFunction.convertFromStoryBoardToEaseFunction(parseInt(values[1]));
                            let startTime = parseFloat(values[2]);
                            let endTime = parseFloat(values[3]);
                            let command;
                            switch (values[0].substring(depth, values[0].length)) {
                                case CommandType.Fade:
                                     command = new FadeCommand();
                                     command.startTime = startTime;
                                     command.endTime = endTime;
                                     command.easing = easing;
                                     command.startOpacity = MathUtil.clamp01(parseFloat(values[4]));
                                     command.endOpacity = values.length > 5 ? MathUtil.clamp01(parseFloat(values[5])) : command.startOpacity;
                                     command.parentStoryboardObject = object;
                                     break;
                                case CommandType.Scale:
                                    command = new ScaleCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    command.startScale = parseFloat(values[4]);
                                    command.endScale = values.length > 5 ? parseFloat(values[5]) : command.startScale;
                                    command.parentStoryboardObject = object;
                                    break;
                                case CommandType.VectorScale:
                                    command = new VectorScaleCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    command.startScale = new PIXI.Point(parseFloat(values[4]), parseFloat(values[5]));
                                    let endX = values.length > 6 ? parseFloat(values[6]) : command.startScale.x;
                                    let endY = values.length > 7 ? parseFloat(values[7]) : command.startScale.y;
                                    command.endScale = new PIXI.Point(endX, endY);
                                    command.parentStoryboardObject = object;
                                    break;
                                case CommandType.Rotate:
                                    command = new RotateCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    command.startRotation = parseFloat(values[4]);
                                    command.endRotation = values.length > 5 ? parseFloat(values[5]) : command.startRotation;
                                    command.parentStoryboardObject = object;
                                    break;
                                case CommandType.Move:
                                    command = new MoveCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    command.startPos = new PIXI.Point(parseFloat(values[4]), parseFloat(values[5]));
                                    let endX_ = values.length > 6 ? parseFloat(values[6]) : command.startPos.x;
                                    let endY_ = values.length > 7 ? parseFloat(values[7]) : command.startPos.y;
                                    command.endPos = new PIXI.Point(endX_, endY_);
                                    command.parentStoryboardObject = object;
                                    break;
                                case CommandType.MoveX:
                                    command = new MoveXCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    command.startX = parseFloat(values[4]);
                                    command.endX = values.length > 5 ? parseFloat(values[5]) : command.startX;
                                    command.parentStoryboardObject = object;
                                    break;
                                case CommandType.MoveY:
                                    command = new MoveYCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    command.startY = parseFloat(values[4]);
                                    command.endY = values.length > 5 ? parseFloat(values[5]) : command.startY;
                                    command.parentStoryboardObject = object;
                                    break;
                                case CommandType.Color:
                                    command = new ColorCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    let convertHexToNumber = (str: string) => {
                                        let num = parseInt(str);
                                        if (isNaN(num)) {
                                            return parseInt(str, 16);
                                        }
                                        else {
                                            return num;
                                        }
                                    }
                                    let startR = convertHexToNumber(values[4])/255;
                                    let startG = convertHexToNumber(values[5])/255;
                                    let startB = convertHexToNumber(values[6])/255;
                                    let endR = values.length > 7 ? (convertHexToNumber(values[7])/255) : (startR/255);
                                    let endG = values.length > 8 ? (convertHexToNumber(values[8])/255) : (startG/255);
                                    let endB = values.length > 9 ? (convertHexToNumber(values[9])/255) : (startB/255);
                                    startR = MathUtil.clamp01(startR);
                                    startG = MathUtil.clamp01(startG);
                                    startB = MathUtil.clamp01(startB);
                                    endR = MathUtil.clamp01(endR);
                                    endG = MathUtil.clamp01(endG);
                                    endB = MathUtil.clamp01(endB);
                                    command.startColor = new PIXI.Color(new Float32Array([startR, startG, startB]));
                                    command.endColor = new PIXI.Color(new Float32Array([endR, endG, endB]));
                                    command.parentStoryboardObject = object;
                                    break;
                                case CommandType.Parameter:
                                    command = new ParameterCommand();
                                    command.startTime = startTime;
                                    command.endTime = endTime;
                                    command.easing = easing;
                                    command.parameter = values[4] as ParameterCommandType;
                                    command.parentStoryboardObject = object;
                                    break;
                            }
                            if (command) {
                                if (depth == 2) {
                                    if (parentCommand) {
                                        if ("childCommands" in parentCommand && parentCommand.childCommands) {
                                            // @ts-ignore
                                            parentCommand.childCommands.push(command);
                                        }
                                    }
                                } else {
                                    event = command;
                                }
                            }
                            break;
                    }
                }
            }
            if (event) {
                beatmapData.Events.Events.push(event as Event);
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
            let textureCache: Map<string, PIXI.Texture> = new Map<string, PIXI.Texture>();
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
                                // @ts-ignore
                                if (!textureCache.has(event[eventKey])) {
                                    try {
                                        let texture = await PIXI.Assets.load({src: url, loadParser: "loadTextures"});
                                        event.texture = texture;
                                        // @ts-ignore
                                        textureCache.set(event[eventKey], texture);
                                        loaded++;
                                        check();
                                    } catch (e) {
                                        console.warn(e);
                                        loaded++;
                                        check();
                                    }
                                }
                                else {
                                    URL.revokeObjectURL(url);
                                    // @ts-ignore
                                    event.texture = textureCache.get(event[eventKey]);
                                    loaded++;
                                    check();
                                }
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
                                for (const filePath of event.filepaths) {
                                    const i = event.filepaths.indexOf(filePath);
                                    if (!textureCache.has(filePath)) {
                                        let file = beatmapData.files.get(filePath);
                                        if (file) {
                                            let url = URL.createObjectURL(file);
                                            try {
                                                let texture = await PIXI.Assets.load({
                                                    src: url,
                                                    loadParser: "loadTextures"
                                                });
                                                event.textures[i] = texture;
                                                // @ts-ignore
                                                textureCache.set(event[eventKey], texture);
                                                loadedTextures++;
                                                checkLoadedTextures();
                                            } catch (e) {
                                                console.warn(e);
                                                loadedTextures++;
                                                checkLoadedTextures();
                                            }
                                        }
                                    }
                                    else {
                                        event.textures[i] = textureCache.get(filePath)!;
                                        loadedTextures++;
                                        checkLoadedTextures();
                                    }
                                }
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