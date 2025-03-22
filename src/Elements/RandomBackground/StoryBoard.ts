import * as PIXI from "pixi.js";
import {DestroyOptions} from "pixi.js";
import {BackgroundContainer} from "./Background";
import {Main} from "../../Main";
import {BeatmapData} from "../../Util/Beatmap/Data/BeatmapData";
import {Audio} from "../../Audio/Audio";

export class StoryBoard extends BackgroundContainer {
    private beatmap: BeatmapData;
    private audio: Audio;

    public constructor(beatmap: BeatmapData, audio: Audio) {
        super();
        this.interactiveChildren = false;
        this.interactive = false;
        this.beatmap = beatmap;
        this.audio = audio;
        Main.app.ticker.add(this.Update, this);
    }
    
    public Update() {
        let currentTime = this.audio.GetCurrentTime();
    }

    public destroy(options?: DestroyOptions) {
        Main.app.ticker.remove(this.Update, this);
        super.destroy(options);
    }
}
