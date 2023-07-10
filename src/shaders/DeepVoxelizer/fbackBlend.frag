#version 300 es
#include precision.glsl

uniform sampler2D uBackColor;

out vec4 fragColor;
void main() {
    fragColor = texelFetch(uBackColor, ivec2(gl_FragCoord.xy), 0);
    if (fragColor.a == 0.0) { 
        discard;
    }
}
