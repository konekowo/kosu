import {Setting} from "../Setting";
import {Settings} from "../Settings";

export abstract class DropdownSetting extends Setting {
    public abstract readonly list: DropDownOption[];
    public abstract readonly defaultValue: DropDownOption;
    protected value: DropDownOption | undefined;

    public getValue(): DropDownOption {
        if (!this.value)
            throw new Error("Value is undefined!");
        return this.value;
    }

    public setValue(value: DropDownOption) {
        this.value = value;
        Settings.save();
    }

    public loadFromSaveValue(value: DropDownOption) {
        this.value = value;
    }
}

export interface DropDownOption {
    displayName: string;
    value: string;
}
