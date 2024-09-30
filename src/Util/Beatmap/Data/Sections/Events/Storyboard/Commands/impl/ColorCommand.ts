import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";
import * as PIXI from "pixi.js";

export class ColorCommand extends StoryboardCommand {
    public commandType = CommandType.Color;

    public startColor: PIXI.Color = new PIXI.Color("white");
    public endColor: PIXI.Color = new PIXI.Color("white");
}