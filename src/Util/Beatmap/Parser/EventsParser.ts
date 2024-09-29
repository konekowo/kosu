import {BeatmapData} from "../Data/BeatmapData";
import {EventTypes} from "../Data/Sections/Events/EventTypes";
import {EventBackground} from "../Data/Sections/Events/EventBackground";
import {EventVideo} from "../Data/Sections/Events/EventVideo";
import {EventBreak} from "../Data/Sections/Events/EventBreak";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import * as PIXI from "pixi.js";
import {Loader} from "../../../Loader";

export class EventsParser {
    public static aviTranscodedVideoCache: {beatmapSID: number, filePath: string, blob: Blob}[] = [];

    public static ParseEvents(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let values = str.split(",");
            let event;
            switch (values[0]) {
                case EventTypes.BACKGROUND:
                    event = new EventBackground();
                    event.filename = values[2].replaceAll('"', "");
                    event.xOffset = parseInt(values[3]);
                    event.yOffset = parseInt(values[4]);
                    if (isNaN(event.xOffset)) {
                        event.xOffset = 0;
                    }
                    if (isNaN(event.yOffset)) {
                        event.yOffset = 0;
                    }
                    break;
                case EventTypes.VIDEO:
                case "1":
                    event = new EventVideo();
                    event.startTime = parseInt(values[1]);
                    event.filename = values[2].replaceAll('"', "");
                    event.xOffset = parseInt(values[3]);
                    event.yOffset = parseInt(values[4]);
                    if (isNaN(event.xOffset)) {
                        event.xOffset = 0;
                    }
                    if (isNaN(event.yOffset)) {
                        event.yOffset = 0;
                    }
                    break;
                case EventTypes.BREAK:
                case "2":
                    event = new EventBreak();
                    event.startTime = parseInt(values[1]);
                    event.endTime = parseInt(values[2]);
                    break;
            }
            if (event) {
                beatmapData.Events.Events.push(event);
            }
        });
    }

    public static async LoadFiles(beatmapData: BeatmapData) {
        for (const event of beatmapData.Events.Events) {
            for (let eventKey in event) {
                if (eventKey == "filename" || eventKey == "filepath") {
                    // @ts-ignore
                    let file = beatmapData.files.get(event[eventKey]);
                    if (file) {
                        let url = URL.createObjectURL(file);
                        if (event instanceof EventBackground) {
                            try {
                                event.texture = await PIXI.Assets.load({src: url, loadParser: "loadTextures"});
                            } catch (e) {
                                console.warn(e);
                            }
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
                                try {
                                    event.texture = await PIXI.Assets.load({src: url, loadParser: "loadVideo"});
                                    if (event.texture) {
                                        event.texture.source.resource.volume = 0;
                                        event.texture.source.resource.pause();
                                    }
                                } catch (e) {
                                    console.warn(e);
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
    }
}