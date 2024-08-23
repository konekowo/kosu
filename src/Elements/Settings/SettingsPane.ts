import * as PIXI from "pixi.js";
import {Ease} from "../../Util/TweenWrapper/Ease";
import * as TWEEN from "@tweenjs/tween.js";
import {Screen} from "../../Screens/Screen";

export class SettingsPane extends PIXI.Container {
    private bg: PIXI.Graphics = new PIXI.Graphics();
    private isOpen = false;

    public constructor() {
        super();
        this.bg.rect(0, 0, 1, 1);
        this.bg.fill({color: "rgb(20,20,20)"});
        this.addChild(this.bg);
        this.resize();
    }

    public open() {
        Ease.getEase(this).TransformTo({x: 0, y: 0}, 400, TWEEN.Easing.Cubic.Out);
        this.isOpen = true;
    }

    public toggle() {
        if (this.isOpen) {this.close()} else {this.open()}
    }

    public close() {
        Ease.getEase(this).TransformTo({x: -this.getWidth(), y: 0}, 400, TWEEN.Easing.Cubic.Out);
        this.isOpen = false;
    }

    private getWidth() {
        return 500 * Screen.getScaleBasedOffScreenSize();
    }

    public resize() {
        this.width = this.getWidth();
        this.height = window.innerHeight;
        this.x = this.isOpen ? 0 : -this.getWidth();
        this.y = 0;
    }
}