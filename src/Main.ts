import * as PIXI from "pixi.js";
import {Application} from "pixi.js";
import {Screen} from "./Screens/Screen";
import {LoadScreen} from "./Screens/LoadScreen/LoadScreen";
import {InteractScreen} from "./Screens/InteractScreen/InteractScreen";
import {Loader} from "./Loader";
import {MenuCursor} from "./Elements/MenuCursor/MenuCursor";
import {AudioEngine} from "./Audio/AudioEngine";
import * as TWEEN from "@tweenjs/tween.js";
import {SettingsPane} from "./Elements/Settings/SettingsPane";
import {unzip} from "unzipit";
import {BeatmapParser} from "./Util/Beatmap/Parser/BeatmapParser";
import {BeatmapData} from "./Util/Beatmap/Data/BeatmapData";
import {StoryBoardUtil} from "./Util/StoryBoardUtil";
import {Origin} from "./Util/Beatmap/Data/Sections/Events/Storyboard/Origin";

export class Main {
    public static app: Application;
    public static mousePos = {x: 0, y: 0};
    public static pointerLockExitTime: number;
    public static cursor: MenuCursor;
    public static AudioEngine: AudioEngine;
    private static currentScreen: Screen | null;
    private static allScreens: Screen[] = [];
    private static clickArea: PIXI.Graphics = new PIXI.Graphics();
    private static doPointerLock: boolean = false;
    private static settingsPane: SettingsPane;
    private static processingOsuFile: boolean = false;

    public constructor(app: Application) {
        Main.app = app;
        // for testing purposes
        Main.setDropEvents();

        document.body.appendChild(Main.app.canvas);

        Main.settingsPane = new SettingsPane();
        Main.settingsPane.zIndex = 999998;
        Main.app.stage.addChild(Main.settingsPane);

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code == "KeyO") {
                Main.settingsPane.toggle();
            }
        });

        this.doResize();
        window.addEventListener("resize", this.doResize);
        Main.app.ticker.add(() => {
            TWEEN.update();
        })
        Main.app.stage.eventMode = "static";
        Main.AudioEngine = new AudioEngine();
        Main.app.stage.addEventListener("mousemove", (e) => {
            Main.mousePos.x = e.clientX;
            Main.mousePos.y = e.clientY;
            if (Main.cursor) {
                Main.cursor.updateMouse();
            }
        });
        document.addEventListener("pointerlockchange", this.pointerLockChanged, false);
        Main.switchScreen(new LoadScreen());
        Loader.Load(Main.AudioEngine.audioContext).then(() => {
            Main.cursor = new MenuCursor(false);
            let dialogOk = Loader.GetAudio("sample_dialog_ok");
            let introTrack = Loader.Get("introTrianglesTrack");
            Main.switchScreen(new InteractScreen(introTrack, dialogOk));
        });
    }

    // for testing purposes
    private static setDropEvents() {
        Object.defineProperty(window, "onDropEvent", {
            value: (e: DragEvent) => {
                e.preventDefault();
                if (Main.processingOsuFile) {
                    alert("Another BeatMap is still processing. (Most likely transcoding a .avi file, check the console for progress) " +
                        "Please wait for it to process and start playing before processing another one!");
                    return;
                }
                Main.processingOsuFile = true;
                if (e.dataTransfer!.items) {
                    let item = [...e.dataTransfer!.items][0];
                    if (item.kind == "file") {

                        const file = item.getAsFile()!;
                        unzip(file).then(({entries}) => {
                            for (const [name, entry] of Object.entries(entries)) {
                                if (name.endsWith(".osu")) {
                                    entry.text().then(async (osuFile) => {
                                        let beatmapData = new BeatmapData();
                                        await new Promise<void>((resolve) => {
                                            for (const [name, entry] of Object.entries(entries)) {
                                                entry.blob().then((blob) => {
                                                    beatmapData.files.set(name, blob);
                                                    if (beatmapData.files.size == Object.entries(entries).length){
                                                        resolve();
                                                    }
                                                })
                                            }
                                        });
                                        let SBFile: string | undefined;
                                        for (const [name, entry] of beatmapData.files.entries()) {
                                            if (name.endsWith(".osb")){
                                                SBFile = await entry.text();
                                            }
                                        }
                                        BeatmapParser.Parse(osuFile, beatmapData, SBFile);
                                        await BeatmapParser.LoadFiles(beatmapData, Main.AudioEngine);
                                        let audioFile = beatmapData.General.audioFile;
                                        if (audioFile) {
                                            let url = URL.createObjectURL(audioFile);
                                            Main.AudioEngine.PlayMusicImmediately(url, beatmapData, () => {
                                                console.log("Now playing " + beatmapData.Metadata.TitleUnicode + " - " + beatmapData.Metadata.ArtistUnicode +
                                                    " (" + beatmapData.Metadata.Title + " - " + beatmapData.Metadata.Artist + ")");
                                            });
                                        }
                                        Main.processingOsuFile = false;
                                        console.log(beatmapData);
                                    });
                                    break;
                                }
                            }
                        });

                    }
                }
            }
        });

        Object.defineProperty(window, "onDragEvent", {
            value: (e: DragEvent) => {
                e.preventDefault();
            }
        });
        Main.app.canvas.setAttribute("ondrop", "window.onDropEvent(event);");
        Main.app.canvas.setAttribute("ondragover", "window.onDragEvent(event);");
    }

    public static lockKeyboard() {
        // @ts-ignore
        if (navigator.keyboard) {
            // @ts-ignore
            navigator.keyboard.lock([]).then(() => {
                console.log("Locked keyboard!");
                if (!document.fullscreenElement) {
                    console.warn("Keyboard lock won't work unless the user is in fullscreen (as requested by the game, not if the user just presses F11)!");
                }
            });
        }
    }

    public static pointerLock() {
        try {
            this.doPointerLock = true;
            // @ts-ignore
            Main.app.canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        } catch (e) {
            console.warn("Failed to lock cursor, error:", e);
            this.doPointerLock = false;
        }

    }

    public static exitPointerLock() {
        this.doPointerLock = false;
        // @ts-ignore
        Main.app.canvas.exitPointerLock();
    }

    public static switchScreen(screen: Screen) {
        if (this.currentScreen != null) {
            this.currentScreen.zIndex = 1;
            this.currentScreen.onClose().then((lastScreen) => {
                for (let i = 0; i < this.allScreens.length; i++) {
                    if (this.allScreens[i] == lastScreen) {
                        this.allScreens.splice(i, 1);
                    }
                }
                Main.app.ticker.remove(lastScreen.draw);
                Main.app.stage.removeChild(lastScreen);
                lastScreen.destroy();
            });
        }
        Main.app.stage.addChild(screen);
        this.allScreens.push(screen);
        this.currentScreen = screen;
        screen.start();
        screen.onResize();
        Main.app.ticker.add(screen.draw, screen);
    }

    public doResize(): void {
        Main.app.renderer.resize(window.innerWidth, window.innerHeight);
        Main.app.stage.scale.x = 1;
        Main.app.stage.scale.y = 1;
        if (!Main.clickArea.destroyed) {
            Main.clickArea.width = window.innerWidth;
            Main.clickArea.height = window.innerHeight;
            Main.clickArea.position.set(0, 0);
        }
        Main.allScreens.forEach((screen) => {
            screen.onResize();
        })
        Main.settingsPane.resize();
    }

    private pointerLockChanged(): void {
        if (!document.pointerLockElement && Main.doPointerLock) {
            PIXI.EventSystem.isPointerLocked = false;
            Main.pointerLockExitTime = Date.now();
            Main.clickArea = new PIXI.Graphics();
            Main.clickArea.rect(0, 0, 1, 1);
            Main.clickArea.fill("rgba(0,0,0,0.1)");
            Main.clickArea.width = window.innerWidth;
            Main.clickArea.height = window.innerHeight;
            Main.clickArea.position.set(0, 0);
            Main.app.stage.addChild(Main.clickArea);
            Main.clickArea.eventMode = "static";
            Main.clickArea.cursor = "pointer";
            Main.cursor.PopOut();
            Main.clickArea.zIndex = 9999999;
            Main.clickArea.onclick = () => {
                if (Date.now() - Main.pointerLockExitTime < 1500) {
                    return;
                }
                Main.clickArea.removeFromParent();
                Main.clickArea.destroy();
                Main.pointerLock();
                Main.cursor.PopIn();
            }
        } else {
            PIXI.EventSystem.isPointerLocked = true;
        }
    }

}
