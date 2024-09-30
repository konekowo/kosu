import * as PIXI from "pixi.js";
import {Origin} from "./Beatmap/Data/Sections/Events/Storyboard/Origin";

export class StoryBoardUtil {
    public static ConvertOsuPixels(position: PIXI.PointData, wideScreen: boolean) {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        let osuWidth43 = 640;
        let osuWidth = wideScreen ? 854 : osuWidth43;
        let osuHeight = 480;
        let widthScaleFactor = screenWidth/osuWidth;
        let heightScaleFactor = screenHeight/osuHeight;
        let absolutePosition = new PIXI.Point(0, 0);
        absolutePosition.set(position.x, position.y);
        absolutePosition.x = (absolutePosition.x + (wideScreen? ((osuWidth - osuWidth43)/2) : 0)) * widthScaleFactor;
        absolutePosition.y *= heightScaleFactor;
        return absolutePosition;
    }

    public static ConvertOriginToAnchor(origin: Origin) {
        switch (origin) {
            case Origin.TopLeft:
                return new PIXI.Point(0, 0);
            case Origin.TopCenter:
                return new PIXI.Point(0.5, 0);
            case Origin.TopRight:
                return new PIXI.Point(1, 0);
            case Origin.CenterLeft:
                return new PIXI.Point(0, 0.5);
            case Origin.Center:
                return new PIXI.Point(0.5, 0.5);
            case Origin.CenterRight:
                return new PIXI.Point(1, 0.5);
            case Origin.BottomLeft:
                return new PIXI.Point(0, 1);
            case Origin.BottomCenter:
                return new PIXI.Point(0.5, 1);
            case Origin.BottomRight:
                return new PIXI.Point(1, 1);
            default:
                return new PIXI.Point(0, 0);
        }
    }
}