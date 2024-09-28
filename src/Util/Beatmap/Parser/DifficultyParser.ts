import {BeatmapData} from "../Data/BeatmapData";
import {BeatmapParser} from "./BeatmapParser";
import {DifficultyData} from "../Data/Sections/Difficulty/DifficultyData";

export class DifficultyParser {
    public static ParseDifficulty(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let propValue = str.split(":");
            if (propValue[1].startsWith(" ")){
                propValue[1] = propValue[1].substring(1, propValue[1].length);
            }

            BeatmapParser.AutoParse(DifficultyData, propValue, beatmapData.Difficulty);
        });
    }

}
