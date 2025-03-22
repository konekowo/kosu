import {Main} from "../../Main";
import {MapAudio} from "../../Audio/Audio";
import * as PIXI from "pixi.js";
import {MathUtil} from "../../Util/MathUtil";
import {Effect} from "../../Util/Beatmap/Data/Sections/TimingPoints/Effect";
import {UnInheritedTimingPoint} from "../../Util/Beatmap/Data/Sections/TimingPoints/UnInheritedTimingPoint";

export class LogoVisualizer extends PIXI.Container {

    public static readonly size = 900;
    public frequencyAmplitudes: Float32Array = new Float32Array(256);
    protected audio!: MapAudio;
    protected temporalAmplitudes: Float32Array = new Float32Array(256);
    protected graphics: PIXI.Graphics = new PIXI.Graphics();
    // The number of bars to jump each update iteration.
    private readonly index_change = 5;
    // The maximum length of each bar in the visualiser. Will be reduced when kiai is not activated.
    private readonly bar_length = 600;
    // The number of bars in one rotation of the visualiser.
    private bars_per_visualiser = 200;
    // How many times we should stretch around the circumference (overlapping overselves).
    private readonly visualiser_rounds = 5;
    // How much should each bar go down each millisecond (based on a full bar).
    private readonly decay_per_millisecond = 0.0024;
    // Number of milliseconds between each amplitude update.
    private readonly time_between_updates = 50;
    // The minimum amplitude to show a bar.
    private readonly amplitude_dead_zone = 1 / this.bar_length;
    private indexOffset = 0;
    private firstDraw = true;

    public set alpha(number: number) {
        super.alpha = number * 0.2;
    }
    public get alpha() {
        return super.alpha * 5;
    }

    public constructor() {
        super();
        this.alpha = 1;
    }

    public start() {
        this.graphics.blendMode = "add";
        this.addChild(this.graphics);
        this.graphics.eventMode = "none";
        this.eventMode = "none";
        setInterval(() => {
            this.updateAmplitudes()
        }, this.time_between_updates);

    }

    public draw(ticker: PIXI.Ticker) {
        if (this.firstDraw) {
            for (let i = 0; i < this.frequencyAmplitudes.length; i++) {
                this.frequencyAmplitudes[i] = 0;
            }
        }
        this.graphics.clear();
        let decayFactor = ticker.deltaMS * this.decay_per_millisecond;
        for (let i = 0; i < this.bars_per_visualiser; i++) {
            //3% of extra bar length to make it a little faster when bar is almost at it's minimum
            this.frequencyAmplitudes[i] -= decayFactor * (this.frequencyAmplitudes[i] + 0.03);
            if (this.frequencyAmplitudes[i] < 0) {
                this.frequencyAmplitudes[i] = 0;
            }
        }

        for (let j = 0; j < this.visualiser_rounds; j++) {
            for (let i = 0; i < this.bars_per_visualiser; i++) {
                if (this.frequencyAmplitudes[i] < this.amplitude_dead_zone) {
                    continue;
                }

                let rotation = MathUtil.DegreesToRadians(i / this.bars_per_visualiser * 360 + j * 360 / this.visualiser_rounds);
                let rotationCos = Math.cos(rotation);
                let rotationSin = Math.sin(rotation);
                // taking the cos and sin to the 0..1 range
                let barPosition = {
                    x: (rotationCos / 2 + 0.5) * LogoVisualizer.size,
                    y: (rotationSin / 2 + 0.5) * LogoVisualizer.size
                };

                let barSize = {
                    x: LogoVisualizer.size * Math.sqrt(2 * (1 - Math.cos(MathUtil.DegreesToRadians(360 / this.bars_per_visualiser)))) / 2,
                    y: this.bar_length * this.frequencyAmplitudes[i]
                };
                // The distance between the bottom side of the bar and the top side.
                let amplitudeOffset = {x: rotationCos * barSize.y, y: rotationSin * barSize.y};

                this.graphics.moveTo(barPosition.x, barPosition.y);
                this.graphics.lineTo(barPosition.x + amplitudeOffset.x, barPosition.y + amplitudeOffset.y);
                this.graphics.stroke({color: "rgb(255, 255, 255)", width: 14});
            }
        }
        this.firstDraw = false;
    }

    private updateAmplitudes() {
        this.audio = Main.AudioEngine.GetCurrentPlayingMusic();
        for (let i = 0; i < this.audio.FrequencyAmplitudes.length; i++) {
            this.temporalAmplitudes[i] = this.audio.FrequencyAmplitudes[i];
        }
        let audioTime = this.audio.GetCurrentTime();
        let timingPoint = this.audio.beatmap.TimingPoints.GetCurrentTimingPoints(audioTime)[0];
        for (let i = 0; i < this.bars_per_visualiser; i++) {
            let targetAmplitude = (this.temporalAmplitudes[(i + this.indexOffset) % this.bars_per_visualiser]) *
                (timingPoint.effects == Effect.KiaiTime ? 1 : 0.5);
            if (targetAmplitude > this.frequencyAmplitudes[i]) {
                this.frequencyAmplitudes[i] = targetAmplitude;
            }
        }
        this.indexOffset = (this.indexOffset + this.index_change) % this.bars_per_visualiser;
    }
}
