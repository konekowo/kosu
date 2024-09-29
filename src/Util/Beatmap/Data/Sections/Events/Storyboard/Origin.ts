export enum Origin {
    TopLeft = "TopLeft",
    Center = "Centre",
    CenterLeft = "CentreLeft",
    TopRight = "TopRight",
    BottomCenter = "BottomCentre",
    TopCenter = "TopCentre",
    /**
     * (same effect as TopLeft, but should not be used)
     */
    Custom = "Custom",
    CenterRight = "CentreRight",
    BottomLeft = "BottomLeft",
    BottomRight = "BottomRight"
}

export function convertToOrigin(input: string) {
    let number = parseInt(input);
    if (isNaN(number)) {
        return input as Origin;
    } else {
        switch (number) {
            case 0:
                return Origin.TopLeft;
            case 1:
                return Origin.Center;
            case 2:
                return Origin.CenterLeft;
            case 3:
                return Origin.TopRight;
            case 4:
                return Origin.BottomCenter;
            case 5:
                return Origin.TopCenter;
            case 6:
                return Origin.Custom;
            case 7:
                return Origin.CenterRight;
            case 8:
                return Origin.BottomLeft;
            case 9:
                return Origin.BottomRight
            default:
                return Origin.TopLeft;
        }
    }
}
