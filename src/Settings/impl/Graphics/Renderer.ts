import {SettingsCategory} from "../../Setting";
import {DropDownOption, DropdownSetting} from "../../SettingType/DropdownSetting";

export class Renderer extends DropdownSetting {
    public readonly list: DropDownOption[] = [];

    public readonly webglOption: DropDownOption = {displayName: "WebGL", value: "webgl"}
    public readonly webGpuOption: DropDownOption = {displayName: "WebGPU", value: "webgpu"}
    public readonly defaultValue = this.webglOption;

    public constructor() {
        super({name: "Renderer", category: SettingsCategory.Graphics});
        this.list.push(this.webglOption, this.webGpuOption);
        this.value = this.defaultValue;
    }
}
