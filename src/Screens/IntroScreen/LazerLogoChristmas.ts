import * as PIXI from "pixi.js";
import {LogoAnimation} from "./LogoAnimation";
import * as TWEEN from "@tweenjs/tween.js";
import {Ease} from "../../Util/TweenWrapper/Ease";

export class LazerLogoChristmas extends PIXI.Container {
    private readonly highlight: LogoAnimation;
    private readonly background: LogoAnimation;
    private textureHighlight = PIXI.Texture.from("intro_triangles_osuLogo_anim_highlight");
    private textureBackground = PIXI.Texture.from("intro_triangles_osuLogo_anim_background");
    private dummy: PIXI.Container;

    public constructor() {
        super();
        this.highlight = new LogoAnimation(this.textureHighlight, new PIXI.Color("white"));
        this.background = new LogoAnimation(this.textureBackground, new PIXI.Color("rgb(128, 128, 128)"));
        this.dummy = new PIXI.Container();
        this.dummy.scale.set(0.0, 0.0);
        this.addChild(this.highlight);
        this.addChild(this.background);
    }

    public setProgress(progress: number, easeDuration: number, easing: (ammount: number) => number) {
        Ease.getEase(this.dummy).ScaleTo(progress, easeDuration, TWEEN.Easing.Linear.None).OnEach(() => {
            this.highlight.setProgress(this.dummy.scale.x);
            this.background.setProgress(this.dummy.scale.x);
        });
    }
}
