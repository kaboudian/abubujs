#version 300 es

#include precision.glsl 

in vec2 cc ;

uniform sampler2D  projectedColors ;

out vec4 color ;

void main(){
    color = texture( projectedColors , cc ) ;
    return ;
}
