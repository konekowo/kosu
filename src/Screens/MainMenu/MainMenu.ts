import {Screen} from "../Screen";
import * as PIXI from "pixi.js";
import {RandomBackground} from "../../Elements/RandomBackground/RandomBackground";
import {OsuLogo} from "../../Elements/MainMenu/OsuCircle/OsuLogo";
import {ButtonSystem} from "../../Elements/MainMenu/OsuCircle/Menu/ButtonSystem";

export class MainMenu extends Screen {
    private bg = new RandomBackground();
    private osuCircle = new OsuLogo();
    private menu: ButtonSystem = new ButtonSystem(this.osuCircle);

    public start() {
        this.bg.start();
        this.addChild(this.bg);
        this.osuCircle.scale = Screen.getScaleBasedOffScreenSize();
        this.addChild(this.menu);
        this.menu.onResize();
        this.osuCircle.visible = false;
        this.menu.visible = false;
        this.addChild(this.osuCircle);
    }

    public draw(deltaTime: PIXI.Ticker) {
        this.bg.draw(deltaTime);
        this.osuCircle.draw(deltaTime);
    }

    public onClose(): Promise<Screen> {
        return new Promise((resolve) => {
            this.bg.onClose().then(() => {
                resolve(this);
            });
        })
    }

    public onResize() {
        this.osuCircle.position.set(this.getScreenWidth() / 2, this.getScreenHeight() / 2);
        this.bg.onResize();
        this.menu.onResize();
        this.osuCircle.scale = !this.menu.isOpen() ? Screen.getScaleBasedOffScreenSize() :
            Screen.getScaleBasedOffScreenSize() * 0.5;
    }
}
