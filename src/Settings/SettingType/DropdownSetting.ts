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

    public getDefaultValue(): DropDownOption {
        return this.defaultValue;
    }

    public setValue(value: DropDownOption) {
        if (this.list.find((option) => option.value == value.value && option.displayName == value.displayName )) {
            this.value = value;
            Settings.save();
        } else {
            console.warn('The value provided to this DropDownSetting does not exist in the option list! Ignoring value provided.');
        }
    }

    public loadFromSaveValue(value: DropDownOption) {
        if (this.list.find((option) => option.value == value.value && option.displayName == value.displayName)) {
            this.value = value;
        } else {
            console.warn('The value provided to this DropDownSetting does not exist in the option list! Ignoring value provided.');
        }
    }
}

export interface DropDownOption {
    displayName: string;
    value: string;
}
