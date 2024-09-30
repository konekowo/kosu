import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

export class MoveYCommand extends StoryboardCommand {
    public commandType = CommandType.MoveY;

    public startY: number = 0;
    public endY: number = 0;
}