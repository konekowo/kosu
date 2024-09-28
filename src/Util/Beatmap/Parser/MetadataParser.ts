import {BeatmapData} from "../Data/BeatmapData";
import {BeatmapParser} from "./BeatmapParser";
import {Metadata} from "../Data/Sections/Metadata/Metadata";

export class MetadataParser {
    public static ParseMetadata(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let propValue = str.split(":");
            if (propValue[1].startsWith(" ")){
                propValue[1] = propValue[1].substring(1, propValue[1].length);
            }

            BeatmapParser.AutoParse(Metadata, propValue, beatmapData.Metadata);
        });
    }

}
