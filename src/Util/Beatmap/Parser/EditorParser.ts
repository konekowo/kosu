import {BeatmapData} from "../Data/BeatmapData";
import {BeatmapParser} from "./BeatmapParser";
import {EditorData} from "../Data/Sections/Editor/EditorData";

export class EditorParser {
    public static ParseEditor(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let propValue = str.split(":");
            if (propValue[1].startsWith(" ")){
                propValue[1] = propValue[1].substring(1, propValue[1].length);
            }
            if (propValue[0] != "Bookmarks") {
                BeatmapParser.AutoParse(EditorData, propValue, beatmapData.Editor);
            }
            else {
                propValue[1].split(",")
                    .forEach((num) => {beatmapData.Editor.Bookmarks.push(parseFloat(num));});
            }
        });
    }

}
