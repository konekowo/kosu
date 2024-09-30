import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";
import * as PIXI from "pixi.js";

export class MoveCommand extends StoryboardCommand {
    public commandType = CommandType.Move;

    public startPos: PIXI.PointData = new PIXI.Point(0, 0);
    public endPos: PIXI.PointData = new PIXI.Point(0, 0);
}