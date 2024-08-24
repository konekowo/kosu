import {Setting} from "../Setting";
import {Settings} from "../Settings";
import {MathUtil} from "../../Util/MathUtil";

export abstract class RangeSetting extends Setting {
    public abstract readonly minValue: number;
    public abstract readonly maxValue: number;
    public abstract readonly increment: number;
    public abstract readonly defaultValue: number;
    protected value: number = 0;

    public getValue(): number {
        return this.value;
    }

    public getDefaultValue(): number {
        return this.defaultValue;
    }

    public setValue(value: number) {
        this.value = MathUtil.clamp(this.minValue, this.maxValue, value);
        Settings.save();
        this.onValueChanged();
    }

    public loadFromSaveValue(value: number) {
        this.value = MathUtil.clamp(this.minValue, this.maxValue, value);
        this.onValueChanged();
    }
}
