import {BeatmapData} from "../Data/BeatmapData";
import {SampleSet} from "../Data/Sections/General/SampleSet";
import {OverlayPosition} from "../Data/Sections/General/OverlayPosition";

export class GeneralParser {
    public static ParseGeneral(beatmapData: BeatmapData, section: string[]) {
        section.forEach((str) => {
            let propValue = str.split(":");
            if (propValue[1].startsWith(" ")){
                propValue[1] = propValue[1].substring(1, propValue[1].length);
            }
            switch (propValue[0]) {
                case "AudioFilename":
                    beatmapData.General.AudioFileName = propValue[1];
                    break;
                case "AudioLeadIn":
                    beatmapData.General.AudioLeadIn = parseInt(propValue[1]);
                    break;
                case "AudioHash":
                    beatmapData.General.AudioHash = propValue[1];
                    break;
                case "PreviewTime":
                    beatmapData.General.PreviewTime = parseInt(propValue[1]);
                    break;
                case "Countdown":
                    beatmapData.General.Countdown = parseInt(propValue[1]);
                    break;
                case "SampleSet":
                    beatmapData.General.SampleSet = propValue[1] as SampleSet;
                    break;
                case "StackLeniency":
                    beatmapData.General.StackLeniency = parseFloat(propValue[1]);
                    break;
                case "Mode":
                    beatmapData.General.Mode = parseInt(propValue[1]);
                    break;
                case "LetterboxInBreaks":
                    beatmapData.General.LetterboxInBreaks = propValue[1] == "1";
                    break;
                case "StoryFireInFront":
                    beatmapData.General.StoryFireInFront = propValue[1] == "1";
                    break;
                case "UseSkinSprites":
                    beatmapData.General.UseSkinSprites = propValue[1] == "1";
                    break;
                case "AlwaysShowPlayfield":
                    beatmapData.General.AlwaysShowPlayfield = propValue[1] == "1";
                    break;
                case "OverlayPosition":
                    beatmapData.General.OverlayPosition = propValue[1] as OverlayPosition;
                    break;
                case "SkinPreference":
                    beatmapData.General.SkinPreference = propValue[1];
                    break;
                case "EpilepsyWarning":
                    beatmapData.General.EpilepsyWarning = propValue[1] == "1";
                    break;
                case "CountdownOffset":
                    beatmapData.General.CountdownOffset = parseInt(propValue[1]);
                    break;
                case "SpecialStyle":
                    beatmapData.General.SpecialStyle = propValue[1] == "1";
                    break;
                case "WidescreenStoryboard":
                    beatmapData.General.WidescreenStoryboard = propValue[1] == "1";
                    break;
                case "SamplesMatchPlaybackRate":
                    beatmapData.General.SamplesMatchPlaybackRate = propValue[1] == "1";
                    break;
            }
        })
    }

}
