import * as PIXI from "pixi.js";
import {BackgroundContainer} from "./Background";
import {Main} from "../../main";
import {BeatmapData} from "../../Util/Beatmap/Data/BeatmapData";
import {DestroyOptions} from "pixi.js";
import {EventSprite} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/EventSprite";
import {StoryboardCommand} from "../../Util/Beatmap/Data/Sections/Events/Storyboard/Commands/StoryboardCommand";

export class StoryBoard extends BackgroundContainer {
    private beatmap: BeatmapData;
    private startTime = Date.now();

    public constructor(beatmap: BeatmapData) {
        super();
        this.interactiveChildren = false;
        this.interactive = false;
        this.beatmap = beatmap;
        Main.app.ticker.add(this.Update, this);
        for (let i = 0; i < beatmap.Events.Events.length; i++) {
            let event = beatmap.Events.Events[i];
            if (event instanceof EventSprite && event.texture){
                let sprite = PIXI.Sprite.from(event.texture);
                sprite.visible = false;
                event.sprite = sprite;
                this.addChild(sprite);
            }
        }
    }


    public Update() {
        let currentTime = Date.now() - this.startTime;
        for (let i = 0; i < this.beatmap.Events.Events.length; i++) {
            let event = this.beatmap.Events.Events[i];
            if (event instanceof StoryboardCommand) {
                if (currentTime > event.startTime) {
                    
                }
            }
        }
    }

    public destroy(options?: DestroyOptions) {
        Main.app.ticker.remove(this.Update, this);
        super.destroy(options);
    }
}