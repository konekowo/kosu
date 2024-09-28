import {BeatmapData} from "../Data/BeatmapData";
import {EventTypes} from "../Data/Sections/Events/EventTypes";
import {EventBackground} from "../Data/Sections/Events/EventBackground";

export class EventsParser {
    public static ParseEvents(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let values = str.split(",");
            let event;
            if (parseInt(values[0]) == EventTypes.BACKGROUND) {
                event = new EventBackground();
                event.filename = values[2].replaceAll('"', "");
                event.xOffset = parseInt(values[3]);
                event.yOffset = parseInt(values[3]);
                event.startTime = 0;
            }
            if (event) {
                beatmapData.Events.Events.push(event);
            }
        });
    }
}