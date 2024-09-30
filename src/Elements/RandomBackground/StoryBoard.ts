import * as PIXI from "pixi.js";
import {DestroyOptions} from "pixi.js";
import {BackgroundContainer} from "./Background";
import {Main} from "../../main";
import {BeatmapData} from "../../Util/Beatmap/Data/BeatmapData";
import {EventSprite} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/EventSprite";
import {StoryboardCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/StoryboardCommand";
import {CommandType} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/CommandType";
import {FadeCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/FadeCommand";
import {ScaleCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/ScaleCommand";
import {VectorScaleCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/VectorScaleCommand";
import {MoveCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/MoveCommand";
import {MoveXCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/MoveXCommand";
import {MoveYCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/MoveYCommand";
import {RotateCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/RotateCommand";
import {ColorCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/ColorCommand";
import {LoopCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/LoopCommand";
import {StoryBoardUtil} from "../../Util/StoryBoardUtil";
import {Layer} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Layer";

import {
    ParameterCommand,
    ParameterCommandType
} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/impl/ParameterCommand";
import {Audio} from "../../Audio/Audio";
import {MathUtil} from "../../Util/MathUtil";
import {EventStoryboard} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/EventStoryboard";

export class StoryBoard extends BackgroundContainer {
    private beatmap: BeatmapData;
    private audio: Audio;

    public constructor(beatmap: BeatmapData, audio: Audio) {
        super();
        this.interactiveChildren = false;
        this.interactive = false;
        this.beatmap = beatmap;
        this.audio = audio;
        Main.app.ticker.add(this.Update, this);
        for (let i = 0; i < beatmap.Events.Events.length; i++) {
            let event = beatmap.Events.Events[i];
            if (event instanceof EventSprite && event.texture){
                let sprite = PIXI.Sprite.from(event.texture);
                sprite.visible = false;
                sprite.cullable = true;
                switch (event.layer) {
                    case Layer.Background:
                        sprite.zIndex = 0;
                        break;
                    case Layer.Fail:
                        sprite.zIndex = 1;
                        break;
                    case Layer.Pass:
                        sprite.zIndex = 2;
                        break;
                    case Layer.Foreground:
                        sprite.zIndex = 3;
                        break;
                }
                sprite.anchor = StoryBoardUtil.ConvertOriginToAnchor(event.origin);
                sprite.position = StoryBoardUtil.ConvertOsuPixels(new PIXI.Point(event.x,event.y), beatmap.General.WidescreenStoryboard);
                sprite.label = event.filepath;
                event.sprite = sprite;
                this.addChild(sprite);
            }
        }
    }


    public Update() {
        let currentTime = this.audio.GetCurrentTime();
        for (let i = 0; i < this.beatmap.Events.Events.length; i++) {
            let event = this.beatmap.Events.Events[i];
            if (event instanceof EventSprite && event.sprite) {
                if (currentTime >= event.StartTime && currentTime <= event.EndTime) {
                    event.sprite.visible = true;
                    if (event.filepath.startsWith("sb/q.png")){
                        console.log(event);
                    }
                    for (let j = 0; j < event.Commands.length; j++) {
                        let command = event.Commands[j];
                        if (currentTime >= command.startTime) {
                            this.applyCommand(currentTime, event.sprite, command, event);
                        }
                    }
                } else if (currentTime > event.EndTime) {
                    event.sprite.destroy();
                }
            }
        }
    }

    private applyCommand(time: number, pixiObject: PIXI.Container, command: StoryboardCommand, event: EventStoryboard) {
        let animProgress = MathUtil.clamp01((command.endTime - time)/(command.endTime - command.startTime));
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
                    this.beatmap.General.WidescreenStoryboard);
                break;
            case CommandType.MoveX:
                let moveXCommand = command as MoveXCommand;
                pixiObject.position.x = StoryBoardUtil.ConvertOsuPixels(new PIXI.Point(
                    ((moveXCommand.endX - moveXCommand.startX) * command.easing(animProgress)) + moveXCommand.startX, 0),
                    this.beatmap.General.WidescreenStoryboard).x;
                break;
            case CommandType.MoveY:
                let moveYCommand = command as MoveYCommand;
                pixiObject.position.y = StoryBoardUtil.ConvertOsuPixels(new PIXI.Point(
                    0, ((moveYCommand.endY - moveYCommand.startY) * command.easing(animProgress)) + moveYCommand.startY),
                    this.beatmap.General.WidescreenStoryboard).y;
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
                pixiObject.tint = [r, g, b];
                break;
            case CommandType.Parameter:
                let parameterCommand = command as ParameterCommand;
                if (parameterCommand.parameter == ParameterCommandType.UseAdditiveBlending) {
                    pixiObject.blendMode = "add";
                }
                break;
            case CommandType.Loop:
                let loopCommand = command as LoopCommand; // not sure if this works
                loopCommand.childCommands.forEach((command) => {
                    let relativeTime = (time - ((command.endTime - command.startTime)*command.timesLooped)) - loopCommand.startTime;
                    if (relativeTime > command.startTime && relativeTime <= command.endTime && command.timesLooped <= loopCommand.loopCount) {
                        this.applyCommand(relativeTime, pixiObject, command, event);
                    } else if (relativeTime > command.endTime) {
                        command.timesLooped++;
                    }
                });
                break;
            case CommandType.Trigger:
                break; //skip for now
        }
        command.executedOnce = true;
    }

    public destroy(options?: DestroyOptions) {
        Main.app.ticker.remove(this.Update, this);
        super.destroy(options);
    }
}