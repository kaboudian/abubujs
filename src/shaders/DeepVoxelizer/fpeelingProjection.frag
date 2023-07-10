#version 300 es

#include    precision.glsl

layout (location=0) out vec4    outColor;

in float    shade ;
in vec3     ocolor ;
void main() {
    if (shade <0.5){
       discard ;
    }
    outColor = vec4(ocolor,1.) ;
}
