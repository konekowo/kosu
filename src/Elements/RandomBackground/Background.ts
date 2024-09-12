import * as PIXI from "pixi.js";
import {Ease} from "../../Util/TweenWrapper/Ease";
import * as TWEEN from "@tweenjs/tween.js";

export class Background extends PIXI.Sprite {
    public constructor(texture: PIXI.Texture) {
        super();
        this.texture = texture;
        this.visible = false;
        this.anchor.set(0.5, 0.5);

    }

    public show() {
        this.visible = true;
    }

    public destroy(options?: PIXI.DestroyOptions) {
        Ease.getEase(this).FadeOut(800, TWEEN.Easing.Linear.None).Then(() => {
            this.visible = false;
            super.destroy(options);
        });
        this.zIndex = 1;
    }
}