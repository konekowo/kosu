import * as TWEEN from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";

export class Ease {
    private static previousEases: Ease[] = [];
    private easings: Easing[] = [];
    private readonly obj: PIXI.Container;
    private delay: TWEEN.Tween<any> | null = null;

    private constructor(obj: PIXI.Container, dontStore: boolean) {
        this.obj = obj;
        if (!dontStore) {
            Ease.previousEases.push(this);
        }
    }

    public static getEase(obj: PIXI.Container, dontStore?: boolean) {
        if (dontStore == null) {
            dontStore = false;
        }
        let checkIfEaseExists = Ease.previousEases.filter((ease) => {
            return ease.obj == obj;
        });
        if (checkIfEaseExists.length > 0) {
            return checkIfEaseExists[0];
        }
        return new Ease(obj, dontStore);
    }

    public createTween<T extends Record<string, any>>(value: T, newValue: T, isPrimitive: boolean, property: keyof PIXI.Container, duration: number, easingFunc: (ammount: number) => number) {
        const tweenValue = {value: 0}
        const tween = new TWEEN.Tween(isPrimitive ? tweenValue : value);
        const easing = new Easing(tween);
        tween.to(isPrimitive ? {value: 1} : newValue, duration);
        tween.easing(easingFunc);
        tween.onUpdate(() => {
            if (!this.obj.destroyed) {
                if (!isPrimitive) {
                    // @ts-ignore
                    this.obj[property] = value;
                } else {
                    // @ts-ignore
                    this.obj[property] = (tweenValue.value * (newValue.value - value.value)) + value.value;
                }
            }
            easing.onUpdate();
        });

        tween.onStart(() => {
            if (isPrimitive) {
                // @ts-ignore
                value.value = this.obj[property];
            }
        });


        if (this.delay == null) {

            tween.start();
        } else {
            this.delay.chain(tween);
            this.delay = null;
        }
        this.easings.push(easing);

        tween.onStop(() => {
            this.onDone(tween);
        });
        tween.onComplete(() => {
            this.onDone(tween);
        });
        return this;
    }

    public TransformTo(newPosition: PIXI.PointData, duration: number, easing: (ammount: number) => number) {
        this.createTween(this.obj.position, newPosition, false, "position", duration, easing);
        return this;
    }

    private onDone(tween: TWEEN.Tween<any>) {
        this.easings = this.easings.filter((tweenInArray) => {
            return tweenInArray.tween != tween
        })
    }

    public ScaleTo(newScale: PIXI.PointData | number, duration: number, easing: (ammount: number) => number) {
        let _newScale: PIXI.PointData = {x: 0, y: 0};
        if (typeof newScale == "number") {
            _newScale.x = newScale;
            _newScale.y = newScale;
        }
        this.createTween(this.obj.scale, _newScale, false, "scale", duration, easing);
        return this;
    }

    public FadeTo(newAlpha: number, duration: number, easing: (ammount: number) => number) {
        this.createTween({value: this.obj.alpha}, {value: newAlpha}, true, "alpha", duration, easing);
        return this;
    }

    public FadeOut(duration: number, easing: (ammount: number) => number) {
        this.FadeTo(0, duration, easing);
        return this;
    }

    public FadeIn(duration: number, easing: (ammount: number) => number) {
        this.FadeTo(1, duration, easing);
        return this;
    }

    public ClearEasings() {
        this.easings.forEach((tween) => {
            tween.tween.stop();
        });
        this.easings = [];
        return this;
    }

    public Then(cb?: () => void) {
        let largestDuration = this.easings.sort((a, b) => {
            return a.tween.getDuration() - b.tween.getDuration()
        });
        if (largestDuration.length > 0) {
            this.delay = largestDuration[0].tween;
            if (cb != undefined) {
                largestDuration[0].tween.onComplete(() => {this.onDone(largestDuration[0].tween); cb();});
                largestDuration[0].tween.onStop(() => {this.onDone(largestDuration[0].tween); cb();});
            }
        }
        return this;
    }

    public OnEach(cb: () => void) {
        let largestDuration = this.easings.sort((a, b) => {
            return a.tween.getDuration() - b.tween.getDuration()
        });
        if (largestDuration.length > 0) {
            largestDuration[0].registerOnUpdate(cb);
        }
    }
}

class Easing {
    public tween: TWEEN.Tween<any>;
    private updateEventListeners: (() => void)[] = [];
    public constructor(tween: TWEEN.Tween<any>) {
        this.tween = tween;
    }
    public onUpdate() {
        this.updateEventListeners.forEach((eventListener) => {
            eventListener();
        })
    }
    public registerOnUpdate(cb: () => void) {
        this.updateEventListeners.push(cb);
    }
    public unRegisterOnUpdate(cb: () => void) {
        this.updateEventListeners = this.updateEventListeners.filter((ev) => {return !(cb === ev);});
    }
}
