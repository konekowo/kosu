import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {Ticker} from "pixi.js";
import {Main} from "../../main";
import {IntroScreen} from "../IntroScreen/IntroScreen";
import {ease} from 'pixi-ease';

export class InteractScreen extends Screen {

    private readonly text: PIXI.Text;
    private readonly text2: PIXI.Text;
    private readonly textContainer = new PIXI.Container();
    private readonly textContainerContainer = new PIXI.Container();

    private readonly introTrack: Blob;
    private clickSound: AudioBuffer;

    private readonly clickArea: PIXI.Graphics = new PIXI.Graphics();

    public constructor(introTrack: Blob, clickSound: AudioBuffer) {
        super();
        this.introTrack = introTrack;
        this.clickSound = clickSound;

        this.text = new PIXI.Text({
            text: "Click anywhere to play!",
            style: {
                fontFamily: 'TorusRegular',
                fontSize: 36,
                fill: "white"
            }
        });
        this.text2 = new PIXI.Text({
            text: "(this is for enabling audio because it's required by web-browsers\n to have interaction on this webpage before playing audio.)",
            style: {
                fontFamily: 'TorusRegular',
                fontSize: 26,
                fill: "gray",
                align: "center"
            }
        });
    }

    public start() {
        this.text.anchor.set(0.5, 0.5);
        this.text2.anchor.set(0.5, 0.5);
        this.text2.position.set(0, this.text.height + 15);
        this.textContainer.addChild(this.text);
        this.textContainer.addChild(this.text2);
        this.textContainer.scale.set(0.5);
        this.textContainer.alpha = 0;
        this.textContainerContainer.addChild(this.textContainer);
        this.textContainerContainer.scale = Screen.getScaleBasedOffScreenSize();
        this.textContainerContainer.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        this.addChild(this.textContainerContainer);

        this.clickArea.rect(0, 0, 1, 1);
        this.clickArea.fill("rgba(0,0,0,0)");
        this.clickArea.width = this.getScreenWidth();
        this.clickArea.height = this.getScreenHeight();
        this.clickArea.position.set(0, 0);
        this.addChild(this.clickArea);

        this.clickArea.eventMode = "static";
        this.clickArea.cursor = "pointer";

        const clicked = () => {
            this.clickArea.eventMode = "none";
            Main.AudioEngine.PlayEffect(this.clickSound);
            Main.switchScreen(new IntroScreen(this.introTrack));
            document.body.style.cursor = "none";
            Main.pointerLock();
        }

        this.clickArea.onclick = () => {
            clicked();

        }
        this.clickArea.ontap = () => {
            clicked();
        }
        ease.add(this.textContainer, {alpha: 1, scale: 1}, {duration: 400, ease: "easeOutQuad"});
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            ease.add(this.textContainer, {alpha: 0, scale: 0.5}, {duration: 200, ease: "easeInOutQuad"});
            setTimeout(() => {
                resolve(this);
            }, 200);
        });
    }

    public draw(deltaTime: Ticker) {

    }

    public onResize() {
        this.textContainerContainer.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        this.clickArea.width = this.getScreenWidth();
        this.clickArea.height = this.getScreenHeight();
        this.clickArea.position.set(0, 0);
        this.textContainerContainer.scale = Screen.getScaleBasedOffScreenSize();
    }
}
