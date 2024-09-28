import {List} from "@pixi/ui";

export class UIUtils {
    public static centerPivotOfList(list: List) {
        let childrenSortedWidth = list.children.sort((a, b) => {return a.width - b.width});
        let childrenSortedHeight = list.children.sort((a, b) => {return a.width - b.width});
        let biggestWidth = childrenSortedWidth.at(0)?.width;
        let biggestHeight = childrenSortedHeight.at(0)?.height;
        if (biggestWidth == undefined || biggestHeight == undefined) {
            return;
        }
        let stackHorizontally = list.type == "horizontal" || list.type == null;
        let stackVertically = list.type == "vertical" || list.type == null;

        let pivotX = ((biggestWidth * (stackHorizontally ? list.children.length : 1)) +
            (stackHorizontally ? (list.elementsMargin * Math.max(0, list.children.length - 1)) : 0) + list.horPadding)/2;
        let pivotY = ((biggestHeight * (stackVertically ? list.children.length : 1)) +
            (stackVertically ? (list.elementsMargin * Math.max(0, list.children.length - 1)) : 0) + list.vertPadding)/2;

        list.pivot.set(pivotX, pivotY);
    }
}
