import {Setting} from "../Setting";
import {Settings} from "../Settings";

export abstract class RangeSetting extends Setting {
    public abstract readonly minValue: number;
    public abstract readonly maxValue: number;
    public abstract readonly increment: number;
    public abstract readonly defaultValue: number;
    protected value: number = 0;

    public getValue(): number {
        return this.value;
    }
    public setValue(value: number) {
        this.value = value;
        Settings.save();
    }

    public loadFromSaveValue(value: number) {
        this.value = value;
    }
}
