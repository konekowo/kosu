import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {Ticker} from "pixi.js";
import {unzip} from 'unzipit';
import {Main} from "../../main";
import {GlitchingTriangles} from "./GlitchingTriangles";
import {MainMenu} from "../MainMenu/MainMenu";
import {LazerLogo} from "./LazerLogo";
import {BeatmapParser} from "../../Util/Beatmap/Parser/BeatmapParser";
import * as TWEEN from "@tweenjs/tween.js";
import {Ease} from "../../Util/TweenWrapper/Ease";
import {UIUtils} from "../../Util/UI/UIUtils";
import {CenteredList} from "../../Util/UI/CenteredList";
import {BeatmapData} from "../../Util/Beatmap/Data/BeatmapData";
import {LazerLogoChristmas} from "./LazerLogoChristmas";
import {EasingFunction} from "../../Util/TweenWrapper/EasingFunction";
import {GlitchingTrianglesChristmas} from "./GlitchingTrianglesChristmas";

export class IntroChristmas extends Screen {

    private readonly introTrackUrl: string;

    private doTextSpacingAnim = false;
    private triangles = new PIXI.Container();
    private ruleSetContainer = new PIXI.Container();
    private ruleSetList = new CenteredList({});
    private flash = new PIXI.Graphics();

    private logoContainerContainer = new PIXI.Container();

    private logoContainer = new PIXI.Container();

    private lazerLogo = new LazerLogoChristmas();

    private flashed = false;

    private standard = PIXI.Sprite.from('icon_ruleset_std');
    private taiko = PIXI.Sprite.from('icon_ruleset_taiko');
    private ctb = PIXI.Sprite.from('icon_ruleset_ctb');
    private mania = PIXI.Sprite.from('icon_ruleset_mania');

    private bg: PIXI.Graphics = new PIXI.Graphics();

    private completionPromise!: Promise<void>;

    private beatMap!: BeatmapData;

    private welcomeText: PIXI.Text = new PIXI.Text({
        text: "",
        style: {
            fontFamily: "TorusThin",
            fontSize: 42,
            fill: "white",
            letterSpacing: 5
        }
    });

    public constructor(introTrack: Blob) {
        super();
        this.introTrackUrl = URL.createObjectURL(introTrack);
        this.bg.rect(0, 0, 1, 1,);
        this.bg.fill("black");
    }

    public start() {
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.bg.x = 0;
        this.bg.y = 0;
        this.addChild(this.bg);
        this.lazerLogo.scale.set(Screen.getScaleBasedOffScreenSize());
        this.logoContainer.addChild(this.lazerLogo);
        this.logoContainer.scale.set(1.2);

        this.logoContainerContainer.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        this.logoContainerContainer.pivot.set(0.5, 0.5);
        this.logoContainerContainer.addChild(this.logoContainer);
        this.logoContainerContainer.alpha = 0;
        this.addChild(this.logoContainerContainer);

        this.flash.rect(0, 0, 1, 1);
        this.flash.fill("white");
        this.flash.position.set(0, 0);
        this.flash.width = this.getScreenWidth();
        this.flash.height = this.getScreenHeight();
        this.flash.blendMode = "add";
        this.welcomeText.anchor.set(0.5, 0.5);
        this.welcomeText.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        (async () => {
            const {entries} = await unzip(this.introTrackUrl);
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
                        this.beatMap = BeatmapParser.Parse(osuFile, beatmapData, SBFile);
                        await BeatmapParser.LoadFiles(beatmapData, Main.AudioEngine);
                        let audioFile = beatmapData.General.audioFile;
                        if (audioFile) {
                            let url = URL.createObjectURL(audioFile);
                            setTimeout(() => {
                                Main.AudioEngine.PlayMusicImmediately(url, beatmapData, () => {
                                    this.afterAudioPlay();
                                });
                            }, 200);
                        }
                        console.log(beatmapData);
                    });
                    break;
                }
            }
        })();
    }

    public afterAudioPlay() {
        this.completionPromise = new Promise((resolve) => {
            this.welcomeText.scale.set(Screen.getScaleBasedOffScreenSize());
            this.addChild(this.welcomeText);
            let beatLength = this.beatMap.TimingPoints.GetCurrentUninheritedTimingPoint(0).beatLength;
            setTimeout(() => {
                this.welcomeText.text = "welcome to kosu!";
                this.onResize();
            }, beatLength);
            setTimeout(() => {
                this.welcomeText.text = "";
                this.onResize();
            }, beatLength * 2);
            setTimeout(() => {
                this.welcomeText.text = "welcome to kosu!";
                this.onResize();
            }, beatLength * 3);
            setTimeout(() => {
                this.welcomeText.text = "";
            }, beatLength * 4);
            setTimeout(() => {
                this.welcomeText.text = "merry christmas!";
            }, beatLength * 5);
            setTimeout(() => {
                this.welcomeText.text = "";
            }, beatLength * 6);
            setTimeout(() => {
                this.welcomeText.text = "merry kosumas!";
            }, beatLength * 7);

            setTimeout(() => {
                this.onResize();
                this.welcomeText.destroy();
            }, beatLength * 8);

            setTimeout(() => {
                this.logoContainerContainer.alpha = 1;
                let mask = new PIXI.Graphics();
                mask.circle(0,0,475);
                mask.fill({color:"white"});
                mask.scale = 1;
                this.logoContainer.addChild(mask);
                this.triangles.mask = mask;
                this.logoContainer.addChild(this.triangles);

                this.logoContainer.scale = 0.2;
                this.triangles.position.set(0, -100);
                this.triangles.scale.set(Screen.getScaleBasedOffScreenSize());
            }, beatLength * 9);

            for (let i = 9; i < 17; i++) {
                let animI = i - 9;
                setTimeout(() => {
                    for (let j = 0; j < animI + 1; j++) {
                        let triangle = new GlitchingTrianglesChristmas({
                            x1: -475 * 2,
                            x2: 475 * 2,
                            y1: -475 * 2,
                            y2: 475 * 2
                        }, beatLength);
                        this.triangles.addChild(triangle);
                    }
                    Ease.getEase(this.logoContainer)
                        .ScaleTo(0.2 + (animI + 1) / 8 * 0.3, beatLength, EasingFunction.OutQuint)
                        .FadeTo((animI + 1) * 0.06, 0, EasingFunction.None);
                    this.lazerLogo.setProgress((animI + 1) / 10, 0, EasingFunction.None);
                }, beatLength * i);
            }


            setTimeout(() => {
                this.flash.alpha = 0;
                this.addChild(this.flash);
                this.flash.eventMode = "none";
                Ease.getEase(this.flash).FadeTo(0.5, beatLength * 2, EasingFunction.In).Then(() => {
                    this.flash.alpha = 1;
                    this.bg.destroy();
                    this.triangles.destroy();
                    this.flashed = true;
                    this.logoContainerContainer.visible = false;
                    Ease.getEase(this.flash).FadeOut(3000, EasingFunction.OutQuint).Then(() => {
                        resolve();
                    });
                    Main.cursor.PopIn();
                });
            }, beatLength * 15);
        });
        Main.switchScreen(new MainMenu());
    }

    public draw(deltaTime: Ticker) {
        if (this.doTextSpacingAnim) {
            this.welcomeText.style.letterSpacing += 0.15 * deltaTime.deltaTime;
            this.onResize();
        }
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            this.completionPromise.then(() => {
                resolve(this);
            })
        });
    }

    public onResize() {
        if (!this.bg.destroyed) {
            this.bg.width = window.innerWidth;
            this.bg.height = window.innerHeight;
            this.bg.x = 0;
            this.bg.y = 0;
        }
        if (!this.welcomeText.destroyed) {
            this.welcomeText.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        }
        if (!this.triangles.destroyed) {
            this.triangles.position.set(0, -100);
            this.triangles.scale.set(Screen.getScaleBasedOffScreenSize());
        }
        if (!this.ruleSetContainer.destroyed) {
            this.ruleSetContainer.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        }
        if (!this.flash.destroyed) {
            this.flash.position.set(0, 0);
            this.flash.width = this.getScreenWidth();
            this.flash.height = this.getScreenHeight();
        }
        if (!this.logoContainerContainer.destroyed) {
            this.logoContainerContainer.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        }
        if (!this.lazerLogo.destroyed) {
            this.lazerLogo.scale.set(Screen.getScaleBasedOffScreenSize());
        }
        if (!this.welcomeText.destroyed) {
            this.welcomeText.scale.set(Screen.getScaleBasedOffScreenSize());
        }
        if (!this.standard.destroyed) {
            this.standard.scale.set(0.5 * Screen.getScaleBasedOffScreenSize());
        }
        if (!this.mania.destroyed) {
            this.mania.scale.set(0.5 * Screen.getScaleBasedOffScreenSize());
        }
        if (!this.ctb.destroyed) {
            this.ctb.scale.set(0.5 * Screen.getScaleBasedOffScreenSize());
        }
        if (!this.taiko.destroyed) {
            this.taiko.scale.set(0.5 * Screen.getScaleBasedOffScreenSize());
        }
        if (!this.ruleSetList.destroyed) {
            this.ruleSetList.ReCenter();
        }
    }
}
