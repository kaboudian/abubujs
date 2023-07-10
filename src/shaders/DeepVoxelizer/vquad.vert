#version 300 es
#include precision.glsl

layout(location=0) in vec4 aPosition;

void main() {
    gl_Position = aPosition;
}
