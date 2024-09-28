import {List} from "@pixi/ui";

export class UIUtils {
    public static centerPivotOfList(list: List) {
        let width = list.leftPadding;
        let height = list.topPadding;
        for (let i = 0; i < list.children.length; i++) {
            let isLast = i + 1 == list.children.length;
            switch (list.type) {
                case "horizontal":
                    width += list.children[i].width + (!isLast? list.elementsMargin : 0);
                    height += list.children[i].height;
                    break;
                case "vertical":
                    width += list.children[i].width;
                    height += list.children[i].height + (!isLast? list.elementsMargin : 0);
                    break;
                default:
                    width += list.children[i].width + (!isLast? list.elementsMargin : 0);
                    height += list.children[i].height + (!isLast? list.elementsMargin : 0);
                    break;
            }
        }
        switch (list.type) {
            case "horizontal":
                height /= list.children.length;
                break;
            case "vertical":
                width /= list.children.length;
                break;
        }
        width += list.rightPadding;
        height += list.bottomPadding;

        list.pivot.set(width/2, height/2);
    }
}
