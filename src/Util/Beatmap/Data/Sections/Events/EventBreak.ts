import {Event} from "./Event";
import {EventTypes} from "./EventTypes";

export class EventBreak extends Event {
    public eventType = EventTypes.BREAK;
    public endTime: number = 0;
}