import * as PIXI from "pixi.js";
import {Ease} from "../../Util/TweenWrapper/Ease";
import * as TWEEN from "@tweenjs/tween.js";
import {DestroyOptions} from "pixi.js";

export class Background extends PIXI.Sprite {
    public static readonly fadeOutDuration = 800;
    public destroying = false;

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
        this.destroying = true;
        Ease.getEase(this).FadeOut(Background.fadeOutDuration, TWEEN.Easing.Linear.None).Then(() => {
            this.visible = false;
            super.destroy(options);
            this.destroying = false;
        });
        this.zIndex = 1;
    }
}

export class BackgroundContainer extends PIXI.Container {
    public destroying = false;

    public constructor() {
        super();
        this.visible = false;
    }

    public show() {
        this.visible = true;
        for (let i = 0; i < this.children?.length; i++) {
            let child = this.children[i];
            if (child instanceof Background || child instanceof BackgroundContainer) {
                child.show();
            }
        }
    }

    public destroy(options?: DestroyOptions) {
        this.destroying = true;
        for (let i = 0; i < this.children?.length; i++) {
            let child = this.children[i];
            if (child instanceof Background || child instanceof BackgroundContainer) {
                if (!child.destroyed && !child.destroying) {
                    child.destroy(options);
                }
            }
        }
        setTimeout(() => {
            super.destroy(options);
            this.destroying = false;
        }, Background.fadeOutDuration);
        this.zIndex = 1;
    }
}