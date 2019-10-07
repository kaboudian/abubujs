#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * tstpShader   :   time step shader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 26 Sep 2018 18:42:01 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;

uniform float       timeWindow, dt;
uniform sampler2D   inTtex ;

layout (location = 0 ) out vec4 outTtex ;

void main(){
    float t = texture( inTtex, vec2(0.5)).r ;
    t += dt ;
    if ( t>timeWindow ){
        t = 0. ;
    }
    outTtex = vec4(t) ;

    return ;
}
