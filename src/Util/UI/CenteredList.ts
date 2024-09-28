import {List} from "@pixi/ui";
import {UIUtils} from "./UIUtils";

export class CenteredList extends List {
    public get elementsMargin() {
        return super.elementsMargin;
    }
    public set elementsMargin(margin: number) {
        super.elementsMargin = margin;
        UIUtils.centerPivotOfList(this);
    }


    public ReCenter() {
        UIUtils.centerPivotOfList(this);
    }
}
