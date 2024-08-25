import * as PIXI from "pixi.js";
import {LogoAnimation} from "./LogoAnimation";
import * as TWEEN from "@tweenjs/tween.js";
import {Ease} from "../../Util/TweenWrapper/Ease";

export class LazerLogo extends PIXI.Container {
    private readonly highlight: LogoAnimation;
    private readonly background: LogoAnimation;
    private textureHighlight = PIXI.Texture.from("intro_triangles_osuLogo_anim_highlight");
    private textureBackground = PIXI.Texture.from("intro_triangles_osuLogo_anim_background");

    public constructor() {
        super();
        this.highlight = new LogoAnimation(this.textureHighlight, new PIXI.Color("white"));
        this.background = new LogoAnimation(this.textureBackground, new PIXI.Color("rgb(128, 128, 128)"));
    }

    public start() {
        this.addChild(this.highlight);
        this.addChild(this.background);
        let dummy = new PIXI.Container();
        dummy.scale.set(0.0, 0.0);
        Ease.getEase(dummy).ScaleTo(1, 920, TWEEN.Easing.Linear.None).OnEach(() => {
            this.highlight.setProgress(dummy.scale.x);
            this.background.setProgress(dummy.scale.x);
        });
    }
}
