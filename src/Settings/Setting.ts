import {Settings} from "./Settings";

export abstract class Setting {
    public readonly info: Settings;

    public constructor(SettingData: SettingInfo) {
        this.info = SettingData;
        Settings.register({setting: this, info: SettingData});
    }

    public abstract getValue(): any;

    public abstract getDefaultValue(): any;

    public abstract setValue(value: any): void;

    protected onValueChanged(): void {}

    /** When implementing this method, do <u>**NOT**</u> save the settings. This is so that loading won't reset most settings. */
    public abstract loadFromSaveValue(value: any): void;
}

export interface SettingInfo {
    name: string;
    category: SettingsCategory;
}

export enum SettingsCategory {
    General = "General",
    Skin = "Skin",
    Input = "Input",
    UserInterface = "User Interface",
    Gameplay = "Gameplay",
    Rulesets = "Rulesets",
    Audio = "Audio",
    Graphics = "Graphics",
    Online = "Online",
    Maintenance = "Maintenance",
    Debug = "Debug"
}
