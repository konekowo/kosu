import {Setting, SettingInfo} from "./Setting";
import {UIScale} from "./impl/Graphics/UIScale";
import {Renderer} from "./impl/Graphics/Renderer";

export class Settings {
    private static settingsList: SettingData[] = [];

    public static registerAll() {
        new UIScale();
        new Renderer();

        this.save();
    }

    public static load() {
        let settingSaveData: SettingSaveData[] = window.localStorage.getItem("settings") as unknown as SettingSaveData[];
        
    }

    public static save() {
        let settings = this.getList();
        let settingSaveData: SettingSaveData[] = [];
        settings.forEach((setting: SettingData) => {
            settingSaveData.push({info: setting.info, value: setting.setting.getValue()});
        });
        window.localStorage.setItem("settings", JSON.stringify(settingSaveData));
    }

    public static register(setting: SettingData) {
        this.settingsList.push(setting);
    }

    public static getSetting<T extends Setting>(setting: new (...args: any[]) => T): T {
        return this.settingsList.filter((_setting) => {
            return _setting.setting instanceof setting
        })[0].setting as T;
    }

    public static getSettingData<T extends Setting>(setting: new (...args: any[]) => T): SettingData {
        return this.settingsList.filter((_setting) => {
            return _setting.setting instanceof setting
        })[0];
    }

    public static getList() {
        return this.settingsList;
    }
}

export interface SettingData {
    readonly setting: Setting;
    readonly info: SettingInfo;
}

export interface SettingSaveData {
    readonly info: SettingInfo;
    readonly value: any;
}