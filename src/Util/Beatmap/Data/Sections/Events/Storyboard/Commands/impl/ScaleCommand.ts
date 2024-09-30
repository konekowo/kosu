import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

export class ScaleCommand extends StoryboardCommand {
    public commandType = CommandType.Scale;

    public startScale: number = 1;
    public endScale: number = 1;
}