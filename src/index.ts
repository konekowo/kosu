import "./style.css";
import { Application } from "pixi.js";
import { Main } from "./main";

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const app = new Application();

window.onload = async (): Promise<void> => {
    app.init({
        backgroundColor: "black",
        width: gameWidth,
        height: gameHeight,
        antialias: true
    }).then(() => {
        new Main(app);
    });
};
