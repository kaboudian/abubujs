#version 300 es
#include precision.glsl

uniform sampler2D uFrontColor;
uniform sampler2D uBackColor;

out vec4 fragColor;
void main() {
    ivec2   fragCoord   = ivec2(gl_FragCoord.xy);
    vec4    frontColor  = texelFetch(uFrontColor, fragCoord, 0);
    vec4    backColor   = texelFetch(uBackColor, fragCoord, 0);
    float   alphaMultiplier = 1.0 - frontColor.a;

    fragColor = vec4(
            frontColor.rgb + alphaMultiplier * backColor.rgb,
            frontColor.a + backColor.a
    ) ;
}
