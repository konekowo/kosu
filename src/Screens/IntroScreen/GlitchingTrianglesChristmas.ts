import * as PIXI from "pixi.js";
import {Ease} from "../../Util/TweenWrapper/Ease";
import * as TWEEN from "@tweenjs/tween.js";
import {EasingFunction} from "../../Util/TweenWrapper/EasingFunction";

export class GlitchingTrianglesChristmas extends PIXI.Container {
    public constructor(bounds: GlitchingTrianglesBounds, beatLength: number) {
        super();
        let triangle = new PIXI.Graphics();
        let scale = random(3, 3.2);
        let angle = Math.random() * 2 * Math.PI;
        let randomRadius = Math.sqrt(Math.random());
        triangle.moveTo(0, 0);
        triangle.lineTo(-50 * scale, 100 * scale);
        triangle.lineTo(50 * scale, 100 * scale);
        triangle.lineTo(0, 0);
        if (Math.random() < 0.5) {
            triangle.fill("#D32F2F");
        } else {
            triangle.fill("#388E3C");
        }

        //triangle.anchor.set(0.5, 0.5)
        function random(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        let randX = 0.5 + 0.5 * randomRadius * Math.cos(angle);
        let randY = 0.5 + 0.5 * randomRadius * Math.sin(angle);


        triangle.position.set(randX * (bounds.x2 - bounds.x1) + bounds.x1, randY * (bounds.y2 - bounds.y1) + bounds.y1);

        triangle.alpha = 0;
        triangle.scale.set(0.9)

        this.addChild(triangle);

        Ease.getEase(triangle, true)
            .ScaleTo(1, beatLength / 2, EasingFunction.Out)
            .FadeIn(100, EasingFunction.OutQuint);
    }

}

export interface GlitchingTrianglesBounds {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
