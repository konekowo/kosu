import * as PIXI from "pixi.js";
import {Main} from "../../../Main";
import glVertShader from "./osuCircleTriangles.vert";
import glFragShader from "./osuCircleTriangles.frag";
import gpuShader from "./osuCircleTriangles.wgsl";

export class Triangles extends PIXI.Container {

    public flash: PIXI.Sprite;
    public Velocity: number = 1;
    private readonly bgGradient: PIXI.FillGradient;
    private triangles: Triangle[] = [];
    private graphics: PIXI.Graphics = new PIXI.Graphics();
    private timeSinceLastSpawn = 0;
    private instancePositionBuffer;
    private readonly totalTriangles = 15;

    public constructor() {
        super();

        let colorStops = [0xff66ab, 0xcc5289];
        this.bgGradient = new PIXI.FillGradient(0, 0, 0, 1024);
        colorStops.forEach((number, index) => {
            const ratio = index / colorStops.length;
            this.bgGradient.addColorStop(ratio, number);
        });

        for (let i = 0; i < this.totalTriangles; i++) {
            this.triangles.push({x: this.random(0, 1024), y: this.random(0, 1024), velocity: this.randVelocity()});
        }
        this.timeSinceLastSpawn = Date.now();

        this.graphics.rect(0, 0, 1024, 1024);
        this.graphics.fill(this.bgGradient);
        this.addChild(this.graphics);

        this.flash = PIXI.Sprite.from("mainMenu.logoMask");
        //this.flash.anchor.set(0.5, 0.5);
        this.flash.alpha = 0;
        this.flash.blendMode = "add";

        this.instancePositionBuffer = new PIXI.Buffer({
            data: new Float32Array(this.totalTriangles * 2),
            usage: PIXI.BufferUsage.VERTEX | PIXI.BufferUsage.COPY_DST
        });
        const color = new PIXI.Color("rgb(182, 52, 111)");
        const size = 30;
        const geometry = new PIXI.Geometry({
            attributes: {
                aPosition: [
                    -10*size,
                    -10*size, // x, y
                    10*size,
                    -10*size, // x, y
                    10*size,
                    7.5*size, // x, y,
                    -10*size,
                    7.5*size, // x, y,
                ],
                aUV: [0, 0, 1, 0, 1, 1, 0, 1],
                aColorTint: [
                    color.red, color.green, color.blue, 1,
                    color.red, color.green, color.blue, 1,
                    color.red, color.green, color.blue, 1,
                    color.red, color.green, color.blue, 1
                ],
                aPositionOffset: {
                    buffer: this.instancePositionBuffer,
                    instance: true
                }
            },
            indexBuffer: [0, 1, 2, 0, 2, 3],
            instanceCount: this.totalTriangles
        });
        const gl = {
            vertex: glVertShader,
            fragment: glFragShader
        };

        const gpu = {
            vertex: {
                entryPoint: "mainVert",
                source: gpuShader
            },
            fragment: {
                entryPoint: "mainFrag",
                source: gpuShader
            }
        };

        const triangleGraphic = new PIXI.Graphics();
        triangleGraphic.moveTo(0, 0);
        triangleGraphic.lineTo(-256, 512);
        triangleGraphic.lineTo(256, 512);
        triangleGraphic.lineTo(0, 0);
        triangleGraphic.stroke({color: "white", width: 4});

        const triangleTexture = Main.app.renderer.generateTexture(triangleGraphic);

        const shader = PIXI.Shader.from({
            gl,
            gpu,
            resources: {
                uTexture: triangleTexture.source,
                uSampler: triangleTexture.source.style,
                waveUniforms: {
                    time: { value: 1, type: "f32" }
                }
            }
        });

        const triangleMesh = new PIXI.Mesh({
            geometry,
            shader
        });

        this.addChild(triangleMesh);



    }

    public destroy(options?: PIXI.DestroyOptions) {
        super.destroy(options);
    }

    public draw(ticker: PIXI.Ticker) {
        const data = this.instancePositionBuffer.data;
        let count = 0;

        for (let i = 0; i < this.totalTriangles; i++) {
            const triangle = this.triangles[i];

            triangle.y -= ((ticker.deltaTime * this.Velocity * triangle.velocity)*1.2);

            if (triangle.y + 100 < 0) {
                triangle.y = 1024 + 250;
            }

            data[count++] = triangle.x;
            data[count++] = triangle.y;
        }

        this.instancePositionBuffer.update();
    }

    private random(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    private randVelocity() {
        let u1 = 1 - this.random(0, 1);
        let u2 = 1 - this.random(0, 1);
        let randStdNormal = (Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2));
        return Math.max(0.5 + 0.16 * randStdNormal, 0.1);
    }
}

export interface Triangle {
    x: number;
    y: number;
    velocity: number;
}
