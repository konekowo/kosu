in vec2 aPosition;
in vec2 aUV;
in vec2 aPositionOffset;
in vec4 aColorTint;

out vec2 vUV;
out vec2 vPositionOffset;
out vec2 vPosition;
out vec4 vColorTint;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;


void main() {

    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition + aPositionOffset, 1.0)).xy, 0.0, 1.0);
    vPositionOffset = aPositionOffset;
    vUV = aUV;
    vPosition = aPosition;
    vColorTint = aColorTint;
}