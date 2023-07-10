#version 300 es
precision highp float;
precision highp int ;

in float red ;
out vec4 outColor;

in float shade ;
in vec4 ocolor ;
void main() {

    if (shade <0.5){
       discard ;
    }
    outColor = ocolor ;
}
