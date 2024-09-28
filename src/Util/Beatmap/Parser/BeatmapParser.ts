import {BeatmapData} from "../Data/BeatmapData";
import {TimingPointsParser} from "./TimingPointsParser";
import {GeneralParser} from "./GeneralParser";
import {EditorParser} from "./EditorParser";
import {MetadataParser} from "./MetadataParser";
import {DifficultyParser} from "./DifficultyParser";
import {EventsParser} from "./EventsParser";

export class BeatmapParser {
    public static Parse(osuFileContent: string, storyBoardFileContent?: string): BeatmapData {
        const beatMapData = new BeatmapData();
        let osuFileContentLines = osuFileContent.split(/\r?\n|\r|\n/g);
        GeneralParser.ParseGeneral(beatMapData, BeatmapParser.GetSection("General", osuFileContentLines));
        EditorParser.ParseEditor(beatMapData, BeatmapParser.GetSection("Editor", osuFileContentLines));
        MetadataParser.ParseMetadata(beatMapData, BeatmapParser.GetSection("Metadata", osuFileContentLines));
        DifficultyParser.ParseDifficulty(beatMapData, BeatmapParser.GetSection("Difficulty", osuFileContentLines));
        EventsParser.ParseEvents(beatMapData, BeatmapParser.GetSection("Events", osuFileContentLines));
        TimingPointsParser.ParseTimingPoints(beatMapData, BeatmapParser.GetSection("TimingPoints", osuFileContentLines));
        return beatMapData
    }
    public static GetSection(sectionName: string, osuFileContentLines: string[]) {
        let section: string[] = [];
        osuFileContentLines.forEach((str, index) => {
            if (str == "["+sectionName+"]") {
                for (let i = index + 1; i < osuFileContentLines.length; i++) {
                    if (osuFileContentLines[i] == ""){
                        continue;
                    }
                    if (osuFileContentLines[i].startsWith("[")){
                        break;
                    }
                    section.push(osuFileContentLines[i]);
                }
            }
        });
        return section;
    }
    public static AutoParse<T>(sectionType: new (...args: any[]) => T, propValue: string[], beatmapDataSection: T) {
        let key = propValue[0] as keyof T;
        let keyExists = false;
        for (let sectionKey in beatmapDataSection) {
            if (sectionKey == key){
                keyExists = true;
            }
        }
        if (!keyExists) {
            console.warn(key.toString() + " does not exist on " + sectionType.name +"!");
            return;
        }
        let isNumber = /^[0-9]+$|^[0-9]+.+$|^-[0-9]+$|^-[0-9]+.+$/.test(propValue[1]);
        let isBoolean = typeof beatmapDataSection[key] == "boolean";
        let value;
        if (isBoolean) {
            value = propValue[1] == "1";
        }
        else if (isNumber) {
            value = parseFloat(propValue[1]);
        }
        else {
            value = propValue[1];
        }

        // @ts-ignore
        beatmapDataSection[key] = value;
    }
}
