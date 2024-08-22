import {Settings} from "./Settings";

export abstract class Setting {
    public constructor(SettingData: SettingInfo) {
        Settings.register({setting: this, info: SettingData});
    }

    public abstract getValue(): any;

    public abstract setValue(value: any): void;
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