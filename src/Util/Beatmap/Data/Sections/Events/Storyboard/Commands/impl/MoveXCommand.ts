import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

export class MoveXCommand extends StoryboardCommand {
    public commandType = CommandType.MoveX;

    public startX: number = 0;
    public endX: number = 0;
}