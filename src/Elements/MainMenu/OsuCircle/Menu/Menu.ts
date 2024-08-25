import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import {Ease} from "../../../../Util/TweenWrapper/Ease";

export class Menu extends PIXI.Container {

    private menuBG = new PIXI.Graphics();
    private isOpened = false;

    public constructor() {
        super();
        this.menuBG.rect(0, -62.5, 1, 125);
        this.menuBG.fill({color: "rgb(50,50,50)"});
        this.menuBG.scale.set(1, 0);
        this.menuBG.alpha = 0;
        this.addChild(this.menuBG);

    }

    public Open() {
        this.isOpened = true;
        Ease.getEase(this.menuBG).ScaleTo(1, 400, TWEEN.Easing.Quintic.Out)
            .FadeIn(400, TWEEN.Easing.Quintic.Out);
    }

    public Close() {
        this.isOpened = false;
        Ease.getEase(this.menuBG).ClearEasings().ScaleTo({x: 1, y: 0}, 300, TWEEN.Easing.Sinusoidal.In)
            .FadeOut(300, TWEEN.Easing.Sinusoidal.In);
    }

    public isOpen() {
        return this.isOpened;
    }

    public onResize() {
        this.position.set(-window.innerWidth, 0);
        this.menuBG.width = window.innerWidth * 2;
    }
}
