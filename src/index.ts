import "./style.css";
import {Application, EventSystem} from "pixi.js";
import {Main} from "./main";
import {Settings} from "./Settings/Settings";
import {Renderer} from "./Settings/impl/Graphics/Renderer";
Settings.registerAll();
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const app = new Application();
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
        EventSystem.cursorSensitivity = sensitivity;
}});
