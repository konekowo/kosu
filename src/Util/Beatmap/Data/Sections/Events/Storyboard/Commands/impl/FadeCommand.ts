import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

export class FadeCommand extends StoryboardCommand {
    public commandType = CommandType.Fade;
    /**
     * the value at starttime
     */
    public startOpacity = 1;
    /**
     * the value at endtime
     */
    public endOpacity = 1;

}