import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";
import * as PIXI from "pixi.js";

export class VectorScaleCommand extends StoryboardCommand {
    public commandType = CommandType.VectorScale;

    public startScale: PIXI.PointData = new PIXI.Point(1, 1);
    public endScale: PIXI.PointData = new PIXI.Point(1, 1);
}