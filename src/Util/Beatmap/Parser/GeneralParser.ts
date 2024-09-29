import {BeatmapData} from "../Data/BeatmapData";
import {GeneralData} from "../Data/Sections/General/GeneralData";
import {BeatmapParser} from "./BeatmapParser";

export class GeneralParser {
    public static ParseGeneral(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let propValue = str.split(":");
            if (propValue[1].startsWith(" ")) {
                propValue[1] = propValue[1].substring(1, propValue[1].length);
            }

            BeatmapParser.AutoParse(GeneralData, propValue, beatmapData.General);
        });
    }

    public static async LoadFiles(beatmapData: BeatmapData) {
        if (beatmapData.General.AudioFilename) {
            beatmapData.General.audioFile = beatmapData.files.get(beatmapData.General.AudioFilename);
        }
    }

}
