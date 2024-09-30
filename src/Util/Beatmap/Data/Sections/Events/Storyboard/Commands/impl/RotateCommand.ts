import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

export class RotateCommand extends StoryboardCommand {
    public commandType = CommandType.Rotate;

    /**
     * rotation in radians
     */
    public startRotation: number = 0;
    /**
     * rotation in radians
     */
    public endRotation: number = 0;
}