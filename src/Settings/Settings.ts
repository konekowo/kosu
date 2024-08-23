import {Setting, SettingInfo} from "./Setting";
import {UIScale} from "./impl/Graphics/UIScale";
import {Renderer} from "./impl/Graphics/Renderer";

export class Settings {
    private static settingsList: SettingData[] = [];

    public static registerAll() {
        new UIScale();
        new Renderer();
    }

    public static load() {
        let settingSaveDataString = window.localStorage.getItem("settings");
        if (settingSaveDataString == null) {
            return;
        }
        let settings = this.getList();
        try {
            let settingSaveData: SettingSaveData[] = JSON.parse(settingSaveDataString) as SettingSaveData[];
            settingSaveData.forEach((setting) => {
                let corrupt = false;
                try {
                    if (!setting.value) {
                        console.warn("Setting '" + JSON.stringify(setting) + "' may be corrupted, skipping!");
                        corrupt = true;
                    }
                    if (setting.info) {
                        if (!setting.info.name) {
                            console.warn("Setting '" + JSON.stringify(setting) + "' may be corrupted, skipping!");
                            corrupt = true;
                        }
                        if (!setting.info.category) {
                            console.warn("Setting '" + JSON.stringify(setting) + "' may be corrupted, skipping!");
                            corrupt = true;
                        }
                    }
                    else {
                        console.warn("Setting '" + JSON.stringify(setting) + "' may be corrupted, skipping!");
                        corrupt = true;
                    }
                }
                catch (e) {
                    console.warn("Something went wrong when validating saved settings!", e);
                    console.warn("The setting may be REALLY corrupted, skipping!");
                    corrupt = true;
                }
                if (!corrupt) {
                    let settingObj = settings.filter((_settingObj) => (_settingObj.info.name == setting.info.name) &&
                        _settingObj.info.category == setting.info.category)[0];
                    if (settingObj) {
                        settingObj.setting.loadFromSaveValue(setting.value);
                    } else {
                        console.warn("Could not find setting object '" + setting.info.name + "', maybe it has been removed in this version of kosu?, skipping setting")
                    }
                }
            });
        }
        catch (e) {
            console.warn("Failed to load settings! Resetting Settings due to corrupted save!", e);
            this.reset();
        }
    }

    public static save() {
        let settings = this.getList();
        let settingSaveData: SettingSaveData[] = [];
        settings.forEach((setting: SettingData) => {
            settingSaveData.push({info: setting.info, value: setting.setting.getValue()});
        });
        window.localStorage.setItem("settings", JSON.stringify(settingSaveData));
    }

    public static reset() {
        console.warn("Resetting Settings!");
        window.localStorage.removeItem("settings");
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
