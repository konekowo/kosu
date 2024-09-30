import {CommandType} from "./CommandType";
import {EasingFunction} from "../../../../../../TweenWrapper/EasingFunction";
import {EventStoryboard} from "../EventStoryboard";
import {Event} from "../../Event";

export abstract class StoryboardCommand extends Event{
    public abstract commandType: CommandType;

    public parentStoryboardObject!: EventStoryboard;

    /**
     * indicates if the command should "accelerate". See <a href="http://easings.net/">Easing Functions Cheat Sheet</a>.
     */
    public easing: (amount: number) => number = EasingFunction.None;

    public endTime: number = 0;

}
