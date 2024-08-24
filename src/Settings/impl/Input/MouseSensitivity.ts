import {RangeSetting} from "../../SettingType/RangeSetting";
import {SettingsCategory} from "../../Setting";
import {EventSystem} from "pixi.js";

export class MouseSensitivity extends RangeSetting{
    public readonly defaultValue: number = 1.0;
    public readonly increment: number = 0.01;
    public readonly maxValue: number = 10.0;
    public readonly minValue: number = 0.10;

    public constructor() {
        super({name: "Sensitivity", category: SettingsCategory.Input});
        this.value = this.defaultValue;
        this.onValueChanged();
    }

    public onValueChanged() {
        EventSystem.cursorSensitivity = this.getValue();
    }
}
