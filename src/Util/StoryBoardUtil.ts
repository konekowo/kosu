import * as PIXI from "pixi.js";
import {Origin} from "./Beatmap/Data/Sections/Events/Storyboard/Origin";
import {Screen} from "../Screens/Screen";

export class StoryBoardUtil {
    public static ConvertOsuPixels(position: PIXI.PointData, origin: Origin, wideScreen: boolean) {
        let screenWidth = Screen.getScreenWidth();
        let screenHeight = Screen.getScreenHeight();
        let osuWidth43 = 640;
        let osuWidth = wideScreen ? 854 : osuWidth43;
        let osuHeight = 480;
        let widthScaleFactor = screenWidth/osuWidth;
        let heightScaleFactor = screenHeight/osuHeight;
        let absolutePosition = new PIXI.Point(0, 0);
        switch (origin) {
            case Origin.Custom:
            case Origin.TopLeft:
                absolutePosition.set(position.x, position.y);
                break;
            case Origin.TopCenter:
                absolutePosition.set((osuWidth/2) + position.x, position.y);
                break;
            case Origin.TopRight:
                absolutePosition.set(osuWidth + position.x, position.y);
                break;
            case Origin.CenterLeft:
                absolutePosition.set(position.x, (osuHeight/2) + position.y);
                break;
            case Origin.Center:
                absolutePosition.set((osuWidth/2) + position.x, (osuHeight/2) + position.y);
                break;
            case Origin.CenterRight:
                absolutePosition.set(osuWidth + position.x, (osuHeight/2) + position.y);
                break;
            case Origin.BottomLeft:
                absolutePosition.set(position.x, osuHeight + position.y);
                break;
            case Origin.BottomCenter:
                absolutePosition.set((osuWidth/2) + position.x, osuHeight + position.y);
                break;
            case Origin.BottomRight:
                absolutePosition.set(osuWidth + position.x, osuHeight + position.y);
                break;
        }
        absolutePosition.x = (absolutePosition.x + (wideScreen? ((osuWidth - osuWidth43)/2) : 0)) * widthScaleFactor;
        absolutePosition.y *= heightScaleFactor;
        return absolutePosition;
    }
}