in vec4 vColor;
in vec2 vUV;

uniform sampler2D uTexture;
uniform float progress;

void main() {
    vec4 color = texture2D(uTexture, vUV);
    float current = color.r;
    float alpha = color.g;
    gl_FragColor = current < progress ? vec4(vColor.rgb * alpha * alpha, alpha) : vec4(0);
}
