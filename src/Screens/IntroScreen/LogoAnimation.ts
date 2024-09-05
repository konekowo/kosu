import * as PIXI from "pixi.js"
import glVertShader from "./logoAnimation.vert";
import glFragShader from "./logoAnimation.frag";
import gpuShader from "./logoAnimation.wgsl";

export class LogoAnimation extends PIXI.Container {
    private shader: PIXI.Shader;
    private texture: PIXI.Texture;

    public constructor(texture: PIXI.Texture, color: PIXI.Color) {
        super();
        this.texture = texture
        this.shader = PIXI.Shader.from({
            gl: {
                vertex: glVertShader,
                fragment: glFragShader,
            },
            gpu: {
                vertex: {
                    entryPoint: 'mainVert',
                    source: gpuShader
                },
                fragment: {
                    entryPoint: 'mainFrag',
                    source: gpuShader
                }
            },
            resources: {
                uTexture: this.texture.source,
                uSampler: this.texture.source.style,
                uProgress: {
                    progress: {value: 0.0, type: 'f32'},
                },
            },
        });
        const quadGeometry = new PIXI.Geometry({
            attributes: {
                aPosition: [
                    -this.texture.width / 2,
                    -this.texture.height / 2, // x, y
                    this.texture.width / 2,
                    -this.texture.height / 2, // x, y
                    this.texture.width / 2,
                    this.texture.width / 2, // x, y,
                    -this.texture.width / 2,
                    this.texture.width / 2, // x, y,
                ],
                aUV: [0, 0, 1, 0, 1, 1, 0, 1],
                aColor: [
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha,
                    color.red, color.green, color.blue, color.alpha
                ]
            },
            indexBuffer: [0, 1, 2, 0, 2, 3],
        });
        const quad = new PIXI.Mesh({
            geometry: quadGeometry,
            shader: this.shader,
        });
        this.addChild(quad);
    }

    public setProgress(progress: number) {
        this.shader.resources.uProgress.uniforms.progress = progress;
    }
}
