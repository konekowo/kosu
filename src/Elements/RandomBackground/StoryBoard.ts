import * as PIXI from "pixi.js";
import {BackgroundContainer} from "./Background";
import {Main} from "../../main";
import {BeatmapData} from "../../Util/Beatmap/Data/BeatmapData";
import {DestroyOptions} from "pixi.js";
import {EventSprite} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/EventSprite";
import {StoryboardCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/StoryboardCommand";
import * as timers from "node:timers";
import {CommandType} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/CommandType";
import {FadeCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/FadeCommand";
import {ScaleCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/ScaleCommand";
import {VectorScaleCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/VectorScaleCommand";
import {MoveCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/MoveCommand";
import {MoveXCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/MoveXCommand";
import {MoveYCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/MoveYCommand";
import {RotateCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/RotateCommand";
import {ColorCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/ColorCommand";
import {ParameterCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/ParameterCommand";
import {LoopCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/LoopCommand";
import {StoryBoardUtil} from "../../Util/StoryBoardUtil";

export class StoryBoard extends BackgroundContainer {
    private beatmap: BeatmapData;
    private startTime = Date.now();

    public constructor(beatmap: BeatmapData) {
        super();
        this.interactiveChildren = false;
        this.interactive = false;
        this.beatmap = beatmap;
        Main.app.ticker.add(this.Update, this);
        for (let i = 0; i < beatmap.Events.Events.length; i++) {
            let event = beatmap.Events.Events[i];
            if (event instanceof EventSprite && event.texture){
                let sprite = PIXI.Sprite.from(event.texture);
                sprite.visible = false;
                sprite.cullable = true;
                event.sprite = sprite;
                this.addChild(sprite);
            }
        }
    }


    public Update() {
        let currentTime = Date.now() - this.startTime;
        for (let i = 0; i < this.beatmap.Events.Events.length; i++) {
            let event = this.beatmap.Events.Events[i];
            if (event instanceof StoryboardCommand) {
                if (currentTime > event.startTime && !(event instanceof LoopCommand) ? (currentTime <= event.endTime) : true) {
                    if (event.parentStoryboardObject instanceof EventSprite && event.parentStoryboardObject.sprite) {
                        this.applyCommand(currentTime, event.parentStoryboardObject.sprite, event);
                        if (event.parentStoryboardObject.sprite.alpha > 0) {
                            event.parentStoryboardObject.sprite.visible = true;
                        } else {
                            event.parentStoryboardObject.sprite.visible = false;
                        }
                    }
                }
            }
        }
    }

    private applyCommand(time: number, pixiObject: PIXI.Container, command: StoryboardCommand) {
        let animProgress = (command.endTime - time)/(command.endTime - command.startTime);
        switch (command.commandType) {
            case CommandType.Fade:
                let fadeCommand = command as FadeCommand;
                pixiObject.alpha = ((fadeCommand.endOpacity - fadeCommand.startOpacity) * command.easing(animProgress)) + fadeCommand.startOpacity;
                break;
            case CommandType.Scale:
                let scaleCommand = command as ScaleCommand;
                pixiObject.scale = ((scaleCommand.endScale - scaleCommand.startScale) * command.easing(animProgress)) + scaleCommand.startScale;
                break;
            case CommandType.VectorScale:
                let vectorScaleCommand = command as VectorScaleCommand;
                pixiObject.scale.x = ((vectorScaleCommand.endScale.x - vectorScaleCommand.startScale.x) * command.easing(animProgress)) + vectorScaleCommand.startScale.x;
                pixiObject.scale.y = ((vectorScaleCommand.endScale.y - vectorScaleCommand.startScale.y) * command.easing(animProgress)) + vectorScaleCommand.startScale.y;
                break;
            case CommandType.Move:
                let moveCommand = command as MoveCommand;
                pixiObject.position = StoryBoardUtil.ConvertOsuPixels(new PIXI.Point(
                    ((moveCommand.endPos.x - moveCommand.startPos.x) * command.easing(animProgress)) + moveCommand.startPos.x,
                        ((moveCommand.endPos.y - moveCommand.startPos.y) * command.easing(animProgress)) + moveCommand.startPos.y),
                    moveCommand.parentStoryboardObject.origin, this.beatmap.General.WidescreenStoryboard);
                break;
            case CommandType.MoveX:
                let moveXCommand = command as MoveXCommand;
                pixiObject.position.x = StoryBoardUtil.ConvertOsuPixels(new PIXI.Point(
                    ((moveXCommand.endX - moveXCommand.startX) * command.easing(animProgress)) + moveXCommand.startX, 0),
                    moveXCommand.parentStoryboardObject.origin, this.beatmap.General.WidescreenStoryboard).x;
                break;
            case CommandType.MoveY:
                let moveYCommand = command as MoveYCommand;
                pixiObject.position.y = StoryBoardUtil.ConvertOsuPixels(new PIXI.Point(
                    ((moveYCommand.endY - moveYCommand.startY) * command.easing(animProgress)) + moveYCommand.startY, 0),
                    moveYCommand.parentStoryboardObject.origin, this.beatmap.General.WidescreenStoryboard).y;
                break;
            case CommandType.Rotate:
                let rotateCommand = command as RotateCommand;
                pixiObject.rotation = ((rotateCommand.endRotation - rotateCommand.startRotation) * command.easing(animProgress)) + rotateCommand.startRotation;
                break;
            case CommandType.Color:
                let colorCommand = command as ColorCommand;
                let r = ((colorCommand.endColor.red - colorCommand.startColor.red) * command.easing(animProgress)) + colorCommand.startColor.red;
                let g = ((colorCommand.endColor.green - colorCommand.startColor.green) * command.easing(animProgress)) + colorCommand.startColor.green;
                let b = ((colorCommand.endColor.blue - colorCommand.startColor.blue) * command.easing(animProgress)) + colorCommand.startColor.blue;
                pixiObject.tint = new Float32Array([r, g, b]);
                break;
            case CommandType.Parameter:
                break; //skip for now
            case CommandType.Loop:
                let loopCommand = command as LoopCommand; // not sure if this works
                loopCommand.childCommands.forEach((command) => {
                    let relativeTime = (time - ((command.endTime - command.startTime)*command.timesLooped)) - loopCommand.startTime;
                    if (relativeTime > command.startTime && relativeTime <= command.endTime) {
                        this.applyCommand(relativeTime, pixiObject, command);
                    } else if (relativeTime > command.endTime) {
                        command.timesLooped++;
                    }
                });
                break;
            case CommandType.Trigger:
                break; //skip for now
        }
    }

    public destroy(options?: DestroyOptions) {
        Main.app.ticker.remove(this.Update, this);
        super.destroy(options);
    }
}