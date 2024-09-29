import {BeatmapData} from "../Data/BeatmapData";
import {TimingPointsParser} from "./TimingPointsParser";
import {GeneralParser} from "./GeneralParser";
import {EditorParser} from "./EditorParser";
import {MetadataParser} from "./MetadataParser";
import {DifficultyParser} from "./DifficultyParser";
import {EventsParser} from "./EventsParser";
import {AudioEngine} from "../../../Audio/AudioEngine";

export class BeatmapParser {
    public static Parse(osuFileContent: string, beatMapData = new BeatmapData(), storyBoardFileContent?: string): BeatmapData {
        let osuFileContentLines = osuFileContent.split(/\r?\n|\r|\n/g);
        let osuSBFileContentLines = storyBoardFileContent?.split(/\r?\n|\r|\n/g);
        for (let i = 0; i < osuFileContentLines.length; i++) {
            if (osuFileContentLines[i].startsWith("osu file format")){
                let version = osuFileContentLines[i].split("v")[1];
                beatMapData.formatVersion = parseFloat(version);
            }
        }

        GeneralParser.ParseGeneral(beatMapData, BeatmapParser.GetSection("General", osuFileContentLines));
        EditorParser.ParseEditor(beatMapData, BeatmapParser.GetSection("Editor", osuFileContentLines));
        MetadataParser.ParseMetadata(beatMapData, BeatmapParser.GetSection("Metadata", osuFileContentLines));
        DifficultyParser.ParseDifficulty(beatMapData, BeatmapParser.GetSection("Difficulty", osuFileContentLines));
        EventsParser.ParseEvents(beatMapData, BeatmapParser.GetSection("Events", osuFileContentLines, osuSBFileContentLines));
        TimingPointsParser.ParseTimingPoints(beatMapData, BeatmapParser.GetSection("TimingPoints", osuFileContentLines));
        return beatMapData
    }

    public static async LoadFiles(beatMapData: BeatmapData, audioEngine: AudioEngine) {
        await new Promise<void>((resolve) => {
            let toLoad = 2;
            let loaded = 0;
            let check = () => {
                if (loaded == toLoad) {
                    resolve();
                }
            }
            GeneralParser.LoadFiles(beatMapData); // this is not async
            loaded++;
            check();
            EventsParser.LoadFiles(beatMapData, audioEngine).then(() => {
                loaded++;
                check();
            });
        });
    }

    public static GetSection(sectionName: string, osuFileContentLines: string[], osuStoryBoardFileContentLines?: string[]) {
        let section: string[] = [];
        let index = 0;
        osuFileContentLines.forEach((str, i) => {
            if (str == "[" + sectionName + "]") {
                index = i;
            }
        });
        for (let i = index + 1; i < osuFileContentLines.length; i++) {
            if (osuFileContentLines[i] == "") {
                continue;
            }
            if (osuFileContentLines[i].startsWith("//")) {
                continue;
            }
            if (osuFileContentLines[i].startsWith("[")) {
                break;
            }
            section.push(osuFileContentLines[i]);
        }
        if (osuStoryBoardFileContentLines) {
            for (let i = 0; i < osuStoryBoardFileContentLines.length; i++) {
                if (osuStoryBoardFileContentLines[i] == "") {
                    continue;
                }
                if (osuStoryBoardFileContentLines[i].startsWith("//")) {
                    continue;
                }
                if (osuStoryBoardFileContentLines[i].startsWith("[" + sectionName + "]")) {
                    continue;
                }
                section.push(osuStoryBoardFileContentLines[i]);
            }
        }
        return section;
    }

    public static AutoParse<T>(sectionType: new (...args: any[]) => T, propValue: string[], beatmapDataSection: T) {
        let key = propValue[0] as keyof T;
        let keyExists = false;
        for (let sectionKey in beatmapDataSection) {
            if (sectionKey == key) {
                keyExists = true;
            }
        }
        if (!keyExists) {
            console.warn(key.toString() + " does not exist on " + sectionType.name + "!");
            return;
        }
        let isNumber = /^[0-9]+$|^[0-9]+\.+[0-9]+$|^-[0-9]+$|^-[0-9]+\.+[0-9]+$/.test(propValue[1]);
        let isBoolean = typeof beatmapDataSection[key] == "boolean";
        let value;
        if (isBoolean) {
            value = propValue[1] == "1";
        } else if (isNumber) {
            value = parseFloat(propValue[1]);
        } else {
            value = propValue[1];
        }

        // @ts-ignore
        beatmapDataSection[key] = value;
    }
}
