in vec2 vUV;
in vec2 vPositionOffset;
in vec2 vPosition;
in vec4 vColorTint;
uniform sampler2D uTexture;
uniform float time;

void main() {
    float a = ((vPositionOffset.y + vPosition.y)/800.0) - 0.1;
    vec4 color = texture(uTexture, vUV);
    if (a > 1.0) {
        a = 1.0;
    }
    gl_FragColor = (color*vColorTint)*a;
}