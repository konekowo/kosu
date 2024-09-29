export enum Layer {
    Background = "Background",
    Fail = "Fail",
    Pass = "Pass",
    Foreground = "Foreground",
}
export function convertToLayer(input: string) {
    let number = parseInt(input);
    if (isNaN(number)) {
        return input as Layer;
    } else {
        switch (number) {
            case 0:
                return Layer.Background;
            case 1:
                return Layer.Fail;
            case 2:
                return Layer.Pass;
            case 3:
                return Layer.Foreground;
            default:
                return Layer.Background;
        }
    }
}
