import {EventStoryboard} from "./EventStoryboard";
import {EventTypes} from "../EventTypes";

export class EventSample extends EventStoryboard {
    public eventType = EventTypes.SAMPLE;
    public volume: number = 1; // 0 to 1
    public audioBuffer?: AudioBuffer;
}
