import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import {Ease} from "../../../../Util/TweenWrapper/Ease";
import {OsuLogo} from "../OsuLogo";
import {Screen} from "../../../../Screens/Screen";
import {LogoTrackingContainer} from "./LogoTrackingContainer";

export class ButtonSystem extends PIXI.Container {

    private menuBG = new PIXI.Graphics();
    private isOpened = false;
    private logo: OsuLogo;
    private state = ButtonSystemState.Initial;
    private logoTrackingContainer = new LogoTrackingContainer();
    private readonly menuHeight = 150;

    private get State() {
        return this.state;
    }

    private set State(state: ButtonSystemState) {
        if (this.state == state) return;

        const lastState = this.state;
        this.state = state;

        this.updateLogoState(lastState);

        console.log(`${this.constructor.name}'s state changed from ${lastState} to ${state}`)
    }

    private updateLogoState(lastState = ButtonSystemState.Initial) {
        switch (this.state) {
            case ButtonSystemState.Exit:
            case ButtonSystemState.Initial:
                this.Close();
                break;
            case ButtonSystemState.TopLevel:
            case ButtonSystemState.Play:
                switch (lastState) {
                    case ButtonSystemState.TopLevel: // coming from toplevel to play
                        break;

                    case ButtonSystemState.Initial:
                        this.Open();
                        Ease.getEase(this.logo).ClearEasings().ScaleTo(Screen.getScaleBasedOffScreenSize() * 0.5, 200, TWEEN.Easing.Linear.In);
                        break;

                    default:
                        this.Open();
                        Ease.getEase(this.logo).ClearEasings().ScaleTo(Screen.getScaleBasedOffScreenSize() * 0.5, 200, TWEEN.Easing.Quintic.Out);
                        break;
                }
                break;
        }
    }

    public constructor(logo: OsuLogo) {
        super();
        this.logo = logo;
        this.drawMenuBG();
        this.scale.y = 0;
        this.alpha = 0;
        this.addChild(this.menuBG);
        this.addChild(this.logoTrackingContainer);
        this.logo.Action = () => {return this.onOsuLogo();};
    }

    private drawMenuBG() {
        this.menuBG.rect(0, Screen.getScaleBasedOffScreenSize() * -(this.menuHeight/2), 1, Screen.getScaleBasedOffScreenSize() * this.menuHeight);
        this.menuBG.fill({color: "rgb(50,50,50)"});
    }

    private onOsuLogo(): boolean {
        switch (this.state) {
            default:
                return false;

            case ButtonSystemState.Initial:
                this.State = ButtonSystemState.TopLevel;
                return true;

            case ButtonSystemState.TopLevel:

                return false;

            case ButtonSystemState.Play:

                return false;

            case ButtonSystemState.Edit:

                return false;
        }
    }

    private Open() {
        setTimeout(() => {
            this.isOpened = true;
            Ease.getEase(this).ScaleTo(1, 400, TWEEN.Easing.Quintic.Out)
                .FadeIn(400, TWEEN.Easing.Quintic.Out);
        }, 150);
    }

    private Close() {
        this.isOpened = false;
        Ease.getEase(this).ClearEasings().ScaleTo({x: 1, y: 0}, 300, TWEEN.Easing.Sinusoidal.In)
            .FadeOut(300, TWEEN.Easing.Sinusoidal.In);
    }

    public isOpen() {
        return this.isOpened;
    }

    public onResize() {
        this.menuBG.clear();
        this.drawMenuBG();
        this.position.set(0, window.innerHeight/2);
        this.menuBG.width = window.innerWidth;
    }
}

enum ButtonSystemState {
    Exit = "Exit",
    Initial = "Initial",
    TopLevel = "TopLevel",
    Play = "Play",
    Edit = "Edit",
    EnteringMode = "EnteringMode",
}
