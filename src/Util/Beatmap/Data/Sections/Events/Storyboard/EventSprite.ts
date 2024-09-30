import {EventStoryboard} from "./EventStoryboard";
import {EventTypes} from "../EventTypes";
import * as PIXI from "pixi.js";

export class EventSprite extends EventStoryboard {
    public eventType = EventTypes.SPRITE;
    public sprite?: PIXI.Sprite;
    public texture?: PIXI.Texture;
}
