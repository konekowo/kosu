import * as PIXI from "pixi.js";
import {Main} from "../../Main";
import {Loader} from "../../Loader";
import {MathUtil} from "../../Util/MathUtil";
import {Screen} from "../../Screens/Screen";
import {Ease} from "../../Util/TweenWrapper/Ease";
import * as TWEEN from "@tweenjs/tween.js";

export class MenuCursor extends PIXI.Container {
    private mouseCursor = PIXI.Sprite.from("menu.cursor");
    private mouseCursorAdditive = PIXI.Sprite.from("menu.cursor.additive");
    private mouseContainer = new PIXI.Container();
    private animContainer = new PIXI.Container();
    private animRotationContainer = new PIXI.Container();
    private dragRotationState: DragRotationState = DragRotationState.NotDragging;
    private lastDragRotationState: DragRotationState = DragRotationState.NotDragging;
    private mouseHideContainer = new PIXI.Container();
    private readonly elastic_const2 = 0.075;
    private readonly elastic_const = 20.943951023931955;
    private readonly elastic_offset_quarter = Math.pow(2, -10) * Math.sin((.25 - this.elastic_const2) * this.elastic_const);

    private posMouseDown: { x: number, y: number } = {x: 0, y: 0};

    private mouseIsDown = false;

    private cursorTapSample = Loader.GetAudio("menu.cursor.sample.tap");

    private mouseButtonClicked: number = -9999;

    public constructor(visible: boolean) {
        super();
        this.updateMouse();
        this.mouseContainer.scale.set(0.07 * Screen.getScaleBasedOffScreenSize());
        this.mouseCursorAdditive.alpha = 0;
        this.mouseCursorAdditive.blendMode = "add";
        this.mouseCursorAdditive.tint = "0xFF66AA"
        this.mouseContainer.addChild(this.mouseCursor);
        this.mouseContainer.addChild(this.mouseCursorAdditive);
        this.animContainer.addChild(this.mouseContainer);
        this.animRotationContainer.addChild(this.animContainer);
        this.mouseHideContainer.addChild(this.animRotationContainer);
        this.addChild(this.mouseHideContainer);
        if (!visible) {
            this.mouseHideContainer.scale.set(0.6);
            this.mouseHideContainer.alpha = 0;
            this.animRotationContainer.angle = 0;
        }
        this.zIndex = 999999;
        this.eventMode = "none";
        Main.app.stage.addChild(this);
        this.addEventListeners();
    }

    public addEventListeners() {
        Main.app.stage.addEventListener("mousedown", (e) => {
            this.mouseButtonClicked = e.button;
            if (this.visible) {
                this.posMouseDown = {x: Main.mousePos.x, y: Main.mousePos.y};
                this.mouseIsDown = true;
                this.dragRotationState = DragRotationState.DragStarted;
                Ease.getEase(this.animContainer).ClearEasings().ScaleTo(0.9, 800, TWEEN.Easing.Quintic.Out);
                Ease.getEase(this.mouseCursorAdditive).ClearEasings().FadeIn(800, TWEEN.Easing.Quintic.Out);
                Main.AudioEngine.PlayEffect(this.cursorTapSample);
            }
        });
        Main.app.stage.addEventListener("mouseup", (e) => {
            if (this.visible && e.button == this.mouseButtonClicked) {
                this.mouseIsDown = false;
                Ease.getEase(this.animContainer).ClearEasings().ScaleTo(1, 500, TWEEN.Easing.Elastic.Out);
                Ease.getEase(this.mouseCursorAdditive).ClearEasings().FadeOut(500, TWEEN.Easing.Quintic.Out);
                if (this.dragRotationState != DragRotationState.NotDragging) {
                    if (this.dragRotationState == DragRotationState.Rotating) {
                        Ease.getEase(this.animRotationContainer).ClearEasings().createTween({value: this.animRotationContainer.angle},
                            {value: 0}, true, "angle", 800 * (0.5 + Math.abs(this.animRotationContainer.angle / 960)), (time: number) => {
                                return Math.pow(2, -10 * time) * 
                                    Math.sin((.25 * time - this.elastic_const2) * this.elastic_const) + 1 - this.elastic_offset_quarter * time;
                            });
                    }
                    this.dragRotationState = DragRotationState.NotDragging;
                }
                Main.AudioEngine.PlayEffect(this.cursorTapSample, 0.8);
            }
        });
    }

    public PopIn() {
        Ease.getEase(this.animRotationContainer).ClearEasings();
        this.visible = true;
        Ease.getEase(this.mouseHideContainer).ClearEasings().FadeIn(250, TWEEN.Easing.Quintic.Out)
            .ScaleTo(1, 400, TWEEN.Easing.Quintic.Out);
        this.dragRotationState = DragRotationState.NotDragging
    }

    public PopOut() {
        Ease.getEase(this.mouseHideContainer).ClearEasings().FadeOut(250, TWEEN.Easing.Quintic.Out)
            .ScaleTo(0.6, 250, TWEEN.Easing.Quintic.Out);
        Ease.getEase(this.animRotationContainer).ClearEasings().createTween({value: this.animRotationContainer.angle},
            {value: 0}, true, "angle", 400, TWEEN.Easing.Quintic.Out);
        this.dragRotationState = DragRotationState.NotDragging;
    }

    public updateMouse() {
        this.mouseContainer.scale.set(0.07 * Screen.getScaleBasedOffScreenSize());
        this.position.set(Main.mousePos.x, Main.mousePos.y);
        if (this.dragRotationState != DragRotationState.NotDragging && this.visible) {
            let distance = Math.sqrt((((Math.abs(this.posMouseDown.x - Main.mousePos.x)) ^ 2) +
                ((Math.abs(this.posMouseDown.y - Main.mousePos.y)) ^ 2)));
            if (this.dragRotationState == DragRotationState.DragStarted && distance > 15) {
                this.dragRotationState = DragRotationState.Rotating;
                if (this.lastDragRotationState != this.dragRotationState) {
                    this.posMouseDown = {x: Main.mousePos.x, y: Main.mousePos.y};
                }
            }

            if (this.dragRotationState == DragRotationState.Rotating && distance > 0) {
                let offsetX = Main.mousePos.x - this.posMouseDown.x;
                let offsetY = Main.mousePos.y - this.posMouseDown.y;
                let degrees = MathUtil.RadiansToDegrees(Math.atan2(-offsetX, offsetY)) + 24.3;

                let diff = (degrees - this.animRotationContainer.angle) % 360;
                if (diff < -180) {
                    diff += 360;
                }
                if (diff > 180) {
                    diff -= 360;
                }
                degrees = this.animRotationContainer.angle + diff;
                this.animRotationContainer.angle = degrees
                Ease.getEase(this.animRotationContainer).createTween({value: this.animRotationContainer.angle},
                    {value: degrees}, true, "angle", 120, TWEEN.Easing.Quintic.Out);
            }
        }
        this.lastDragRotationState = this.dragRotationState;

    }


}

enum DragRotationState {
    NotDragging,
    DragStarted,
    Rotating
}
