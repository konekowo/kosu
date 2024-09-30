import {StoryboardCommand} from "../StoryboardCommand";
import {CommandType} from "../CommandType";

export class ParameterCommand extends StoryboardCommand {
    public commandType = CommandType.Parameter;
    public parameter!: ParameterCommandType;
}

export enum ParameterCommandType{
    HorizontalFlip = "H",
    VerticalFlip = "F",
    UseAdditiveBlending = "A"
}