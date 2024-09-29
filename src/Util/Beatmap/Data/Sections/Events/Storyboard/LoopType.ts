export enum LoopType {
    LoopForever = "LoopForever",
    LoopOnce = "LoopOnce"
}

export function convertToLoopType(input: string) {
    let number = parseInt(input);
    if (isNaN(number)) {
        return input as LoopType
    }
    else {
        switch (number) {
            case 0:
                return LoopType.LoopForever;
            case 1:
                return LoopType.LoopOnce;
            default:
                return LoopType.LoopForever;
        }
    }
}