import "./style.css";
import {Application, EventSystem} from "pixi.js";
import {Main} from "./main";
import {Settings} from "./Settings/Settings";
import {Renderer} from "./Settings/impl/Graphics/Renderer";
import {MouseSensitivity} from "./Settings/impl/Input/MouseSensitivity";
import {UIScale} from "./Settings/impl/Graphics/UIScale";
Settings.registerAll();
Settings.load();
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const app = new Application();
// @ts-ignore
globalThis.__PIXI_APP__ = app;
window.onload = async (): Promise<void> => {
    // @ts-ignore
    const renderer = Settings.getSetting(Renderer).getValue().value as "webgl" | "webgpu";
    app.init({
        backgroundColor: "black",
        width: gameWidth,
        height: gameHeight,
        antialias: true,
        preference: renderer,
        resolution: window.devicePixelRatio,
        autoDensity: true
    }).then(() => {
        new Main(app);
    });
};

Object.defineProperty(window, "setSensitivity", {value: (sensitivity: number) => {
    Settings.getSetting(MouseSensitivity).setValue(sensitivity);
}});

Object.defineProperty(window, "setRenderer", {value: (renderer: string) => {
    let rendererSetting = Settings.getSetting(Renderer);
    rendererSetting.setValue(renderer == "webgl" ? rendererSetting.webglOption : rendererSetting.webGpuOption);
    window.location.reload();
}});

Object.defineProperty(window, "setUIScale", {value: (scale: number) => {
    Settings.getSetting(UIScale).setValue(scale);
    window.location.reload();
}});
