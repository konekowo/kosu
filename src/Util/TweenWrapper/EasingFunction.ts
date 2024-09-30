export class EasingFunction {
    private static readonly elastic_const = 2 * Math.PI / .3;
    private static readonly elastic_const2 = .3 / 4;
    private static readonly back_const = 1.70158;
    private static readonly back_const2 = EasingFunction.back_const * 1.525;
    private static readonly bounce_const = 1 / 2.75;
    private static readonly expo_offset = Math.pow(2, -10);
    private static readonly elastic_offset_full = Math.pow(2, -11);
    private static readonly elastic_offset_half = Math.pow(2, -10) * Math.sin((.5 - EasingFunction.elastic_const2) * EasingFunction.elastic_const);
    private static readonly elastic_offset_quarter = Math.pow(2, -10) * Math.sin((.25 - EasingFunction.elastic_const2) * EasingFunction.elastic_const);
    private static readonly in_out_elastic_offset = Math.pow(2, -10) * Math.sin((1 - EasingFunction.elastic_const2 * 1.5) * EasingFunction.elastic_const / 1.5);

    public static readonly None = (time: number) => {
        return time;
    }
    public static readonly In = (time: number) => {
        return this.InQuad(time);
    }
    public static readonly InQuad = (time: number) => {
        return time * time;
    }
    public static readonly Out = (time: number) => {
        return this.OutQuad(time);
    }
    public static readonly OutQuad = (time: number) => {
        return time * (2 - time);
    }
    public static readonly InOutQuad = (time: number) => {
        if (time < .5) return time * time * 2;

        return --time * time * -2 + 1;
    }
    public static readonly InCubic = (time: number) => {
        return time * time * time;
    }
    public static readonly OutCubic = (time: number) => {
        return --time * time * time + 1;

    }
    public static readonly InOutCubic = (time: number) => {
        if (time < .5) return time * time * time * 4;

        return --time * time * time * 4 + 1;
    }
    public static readonly InQuart = (time: number) => {
        return time * time * time * time;
    }
    public static readonly OutQuart = (time: number) => {
        return 1 - --time * time * time * time;
    }
    public static readonly InOutQuart = (time: number) => {
        if (time < .5) return time * time * time * time * 8;

        return --time * time * time * time * -8 + 1;
    }
    public static readonly InQuint = (time: number) => {
        return time * time * time * time * time;
    }
    public static readonly OutQuint = (time: number) => {
        return --time * time * time * time * time + 1;
    }
    public static readonly InOutQuint = (time: number) => {
        if (time < .5) return time * time * time * time * time * 16;

        return --time * time * time * time * time * 16 + 1;
    }
    public static readonly InSine = (time: number) => {
        return 1 - Math.cos(time * Math.PI * .5);
    }
    public static readonly OutSine = (time: number) => {
        return Math.sin(time * Math.PI * .5);
    }
    public static readonly InOutSine = (time: number) => {
        return .5 - .5 * Math.cos(Math.PI * time);
    }
    public static readonly InExpo = (time: number) => {
        return Math.pow(2, 10 * (time - 1)) + EasingFunction.expo_offset * (time - 1);
    }
    public static readonly OutExpo = (time: number) => {
        return -Math.pow(2, -10 * time) + 1 + EasingFunction.expo_offset * time;
    }
    public static readonly InOutExpo = (time: number) => {
        if (time < .5) return .5 * (Math.pow(2, 20 * time - 10) + EasingFunction.expo_offset * (2 * time - 1));

        return 1 - .5 * (Math.pow(2, -20 * time + 10) + EasingFunction.expo_offset * (-2 * time + 1));
    }
    public static readonly InCirc = (time: number) => {
        return 1 - Math.sqrt(1 - time * time);
    }
    public static readonly OutCirc = (time: number) => {
        return Math.sqrt(1 - --time * time);
    }
    public static readonly InOutCirc = (time: number) => {
        if ((time *= 2) < 1) return .5 - .5 * Math.sqrt(1 - time * time);

        return .5 * Math.sqrt(1 - (time -= 2) * time) + .5;
    }
    public static readonly InElastic = (time: number) => {
        return -Math.pow(2, -10 + 10 * time) * Math.sin((1 - EasingFunction.elastic_const2 - time) * EasingFunction.elastic_const) + EasingFunction.elastic_offset_full * (1 - time);
    }
    public static readonly OutElastic = (time: number) => {
        return Math.pow(2, -10 * time) * Math.sin((time - EasingFunction.elastic_const2) * EasingFunction.elastic_const) + 1 - EasingFunction.elastic_offset_full * time;
    }
    public static readonly OutElasticHalf = (time: number) => {
        return Math.pow(2, -10 * time) * Math.sin((.5 * time - EasingFunction.elastic_const2) * EasingFunction.elastic_const) + 1 - EasingFunction.elastic_offset_half * time;
    }
    public static readonly OutElasticQuarter = (time: number) => {
        return Math.pow(2, -10 * time) * Math.sin((.25 * time - EasingFunction.elastic_const2) * EasingFunction.elastic_const) + 1 - EasingFunction.elastic_offset_quarter * time;
    }
    public static readonly InOutElastic = (time: number) => {
        if ((time *= 2) < 1) {
            return -.5 * (Math.pow(2, -10 + 10 * time) * Math.sin((1 - EasingFunction.elastic_const2 * 1.5 - time) * EasingFunction.elastic_const / 1.5)
                - EasingFunction.in_out_elastic_offset * (1 - time));
        }
        return .5 * (Math.pow(2, -10 * --time) * Math.sin((time - EasingFunction.elastic_const2 * 1.5) * EasingFunction.elastic_const / 1.5)
            - EasingFunction.in_out_elastic_offset * time) + 1;
    }
    public static readonly InBack = (time: number) => {
        return time * time * ((EasingFunction.back_const + 1) * time - EasingFunction.back_const);
    }
    public static readonly OutBack = (time: number) => {
        return --time * time * ((EasingFunction.back_const + 1) * time + EasingFunction.back_const) + 1;
    }
    public static readonly InOutBack = (time: number) => {
        if ((time *= 2) < 1) return .5 * time * time * ((EasingFunction.back_const2 + 1) * time - EasingFunction.back_const2);

        return .5 * ((time -= 2) * time * ((EasingFunction.back_const2 + 1) * time + EasingFunction.back_const2) + 2);
    }
    public static readonly InBounce = (time: number) => {
        time = 1 - time;
        if (time < EasingFunction.bounce_const)
            return 1 - 7.5625 * time * time;
        if (time < 2 * EasingFunction.bounce_const)
            return 1 - (7.5625 * (time -= 1.5 * EasingFunction.bounce_const) * time + .75);
        if (time < 2.5 * EasingFunction.bounce_const)
            return 1 - (7.5625 * (time -= 2.25 * EasingFunction.bounce_const) * time + .9375);

        return 1 - (7.5625 * (time -= 2.625 * EasingFunction.bounce_const) * time + .984375);
    }
    public static readonly OutBounce = (time: number) => {
        if (time < EasingFunction.bounce_const)
            return 7.5625 * time * time;
        if (time < 2 * EasingFunction.bounce_const)
            return 7.5625 * (time -= 1.5 * EasingFunction.bounce_const) * time + .75;
        if (time < 2.5 * EasingFunction.bounce_const)
            return 7.5625 * (time -= 2.25 * EasingFunction.bounce_const) * time + .9375;


        return 7.5625 * (time -= 2.625 * EasingFunction.bounce_const) * time + .984375;
    }
    public static readonly InOutBounce = (time: number) => {
        if (time < .5) return .5 - .5 * this.OutBounce(1 - time * 2);

        return this.OutBounce((time - .5) * 2) * .5 + .5;
    }
    public static readonly OutPow10 = (time: number) => {
        return --time * Math.pow(time, 10) + 1;
    }

    public static convertFromStoryBoardToEaseFunction(easing: number) {
        switch (easing) {
            case 0:
                return this.None;
            case 1:
                return this.Out;
            case 2:
                return this.In;
            case 3:
                return this.InQuad;
            case 4:
                return this.OutQuad;
            case 5:
                return this.InOutQuad;
            case 6:
                return this.InCubic;
            case 7:
                return this.OutCubic;
            case 8:
                return this.InOutCubic;
            case 9:
                return this.InQuart;
            case 10:
                return this.OutQuart;
            case 11:
                return this.InOutQuart;
            case 12:
                return this.InQuint;
            case 13:
                return this.OutQuint;
            case 14:
                return this.InOutQuint;
            case 15:
                return this.InSine;
            case 16:
                return this.OutSine;
            case 17:
                return this.InOutSine;
            case 18:
                return this.InExpo;
            case 19:
                return this.OutExpo;
            case 20:
                return this.InOutExpo;
            case 21:
                return this.InCirc;
            case 22:
                return this.OutCirc;
            case 23:
                return this.InOutCirc;
            case 24:
                return this.InElastic;
            case 25:
                return this.OutElastic;
            case 26:
                return this.OutElasticHalf;
            case 27:
                return this.OutElasticQuarter;
            case 28:
                return this.InOutElastic;
            case 29:
                return this.InBack;
            case 30:
                return this.OutBack;
            case 31:
                return this.InOutBack;
            case 32:
                return this.InBounce;
            case 33:
                return this.OutBounce;
            case 34:
                return this.InOutBounce;
            case 35:
                return this.OutPow10;
            default:
                return this.None;
        }
    }
}