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

export class IntroScreen extends Screen {

    private readonly introTrackUrl: string;

    private doTextSpacingAnim = false;
    private triangles = new PIXI.Container();
    private ruleSetContainer = new PIXI.Container();
    private ruleSetList = new CenteredList({});
    private flash = new PIXI.Graphics();

    private logoContainerContainer = new PIXI.Container();

    private logoContainer = new PIXI.Container();

    private lazerLogo = new LazerLogo();

    private flashed = false;

    private standard = PIXI.Sprite.from('icon_ruleset_std');
    private taiko = PIXI.Sprite.from('icon_ruleset_taiko');
    private ctb = PIXI.Sprite.from('icon_ruleset_ctb');
    private mania = PIXI.Sprite.from('icon_ruleset_mania');

    private bg: PIXI.Graphics = new PIXI.Graphics();

    private completionPromise!: Promise<void>;

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
                        let beatmapData = BeatmapParser.Parse(osuFile);
                        for (const [name, entry] of Object.entries(entries)) {
                            let blob = await entry.blob();
                            beatmapData.files.set(name, blob);
                        }
                        await BeatmapParser.LoadFiles(beatmapData);
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
            setTimeout(() => {
                this.welcomeText.text = "wel";
                this.onResize();
            }, 200);
            setTimeout(() => {
                this.welcomeText.text = "welcome";
                this.onResize();
            }, 400);
            setTimeout(() => {
                this.welcomeText.text = "welcome to";
                this.onResize();
            }, 700);
            let glitchingInterval: NodeJS.Timeout;

            this.triangles.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
            this.triangles.scale.set(Screen.getScaleBasedOffScreenSize());
            this.addChild(this.triangles);
            setTimeout(() => {
                this.welcomeText.text = "welcome to kosu!";
                this.doTextSpacingAnim = true;
                glitchingInterval = setInterval(() => {
                    let triangle = new GlitchingTriangles({
                        x1: -(this.welcomeText.width / 2) - 100,
                        x2: (this.welcomeText.width / 2) + 100,
                        y1: -(this.welcomeText.height / 2) - 150,
                        y2: (this.welcomeText.height / 2) + 100
                    });
                    this.triangles.addChild(triangle);
                }, 30);
                this.onResize();
            }, 900);

            this.standard.scale = 0.5 * Screen.getScaleBasedOffScreenSize();
            this.ctb.scale = 0.5 * Screen.getScaleBasedOffScreenSize();
            this.mania.scale = 0.5 * Screen.getScaleBasedOffScreenSize();
            this.taiko.scale = 0.5 * Screen.getScaleBasedOffScreenSize();


            this.ruleSetList.addChild(this.standard);
            this.ruleSetList.addChild(this.taiko);
            this.ruleSetList.addChild(this.ctb);
            this.ruleSetList.addChild(this.mania);
            this.ruleSetList.padding = 0;
            this.ruleSetList.elementsMargin = 200 * Screen.getScaleBasedOffScreenSize();
            this.ruleSetList.type = "horizontal";
            this.ruleSetList.scale = 1;
            this.ruleSetContainer.addChild(this.ruleSetList);

            setTimeout(() => {
                this.doTextSpacingAnim = false;
                this.onResize();
                clearInterval(glitchingInterval);
                this.welcomeText.destroy();
                this.triangles.destroy();
                this.ruleSetContainer.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
                this.addChild(this.ruleSetContainer);
                this.ruleSetList.elementsMargin = 200 * Screen.getScaleBasedOffScreenSize();
                Ease.getEase(this.ruleSetContainer).ScaleTo(0.8, 1000, TWEEN.Easing.Linear.None);
            }, 1450);

            setTimeout(() => {
                this.ruleSetList.elementsMargin = 30 * Screen.getScaleBasedOffScreenSize();
                this.ruleSetList.scale = 2;
                UIUtils.centerPivotOfList(this.ruleSetList);
            }, 1650);

            setTimeout(() => {
                this.ruleSetList.elementsMargin = 10 * Screen.getScaleBasedOffScreenSize();
                this.ruleSetList.scale = 4;
                Ease.getEase(this.ruleSetContainer).ScaleTo(1.3, 1000, TWEEN.Easing.Linear.None);
            }, 1850);

            setTimeout(() => {
                this.ruleSetContainer.destroy();
                this.lazerLogo.start();

                this.logoContainerContainer.alpha = 1;

                this.logoContainerContainer.scale.set(1.2);
                Ease.getEase(this.logoContainerContainer).ScaleTo(1.2 - 0.8 * 0.25, 920, TWEEN.Easing.Quadratic.In);

                setTimeout(() => {
                    Ease.getEase(this.logoContainer).ScaleTo(1.2 - 0.8, 920 * 0.3, TWEEN.Easing.Quintic.In);
                }, 920 * 0.7);
            }, 2080);

            setTimeout(() => {
                this.addChild(this.flash);
                this.bg.destroy();
                this.flash.eventMode = "none";
                this.flashed = true;
                this.logoContainerContainer.visible = false;
                Ease.getEase(this.flash).FadeOut(1000, TWEEN.Easing.Quadratic.Out).Then(() => {
                    resolve();
                });
                Main.cursor.PopIn();
            }, 3000);
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
            this.triangles.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
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
