import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

// will not be supported for now
export class TriggerCommand extends StoryboardCommand {
    public commandType = CommandType.Trigger;
    public childCommands: StoryboardCommand[] = [];
}