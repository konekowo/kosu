import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import {OsuLogo} from "../OsuLogo";

export class LogoTrackingContainer extends PIXI.Container {
    protected Logo: OsuLogo | null = null;

    private easing!: (amount: number) => number;
    private startPosition: {x: number, y: number} | null = null;
    private startTime: number | null = null;
    private duration!: number;

    private readonly visual_box_size = 72;

    public StartTracking(logo: OsuLogo, duration: number = 0, easing: (amount: number) => number = TWEEN.Easing.Linear.None) {
        if (logo.IsTracking && this.Logo == null)
            throw new Error("Cannot track an instance of OsuLogo to multiple LogoTrackingContainers");

        if (this.Logo != logo && this.Logo != null)
        {
            // If we're replacing the logo to be tracked, the old one no longer has a tracking container
            this.Logo.IsTracking = false;
        }

        this.Logo = logo;
        this.Logo.IsTracking = true;

        this.duration = duration;
        this.easing = easing;

        this.startTime = null;
        this.startPosition = null;
    }

    public StopTracking() {
        if (this.Logo != null)
        {
            this.Logo.IsTracking = false;
            this.Logo = null;
        }
    }

    protected ComputeLogoTrackingPosition() {
        let pos = this.Logo!.position;
        pos.x = window.innerWidth/3;
        return pos;
    }

    public Update() {
        if (this.Logo == null)
            return;
    }

}
