import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

export class LoopCommand extends StoryboardCommand {
    public commandType = CommandType.Loop;

    public readonly endTime = -1;

    public loopCount: number = 1;

    public childCommands: StoryboardCommand[] = [];
}