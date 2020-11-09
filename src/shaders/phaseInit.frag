#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * phaseInit.frag : initial the phase textures for the PhasePlot
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Mon 09 Nov 2020 12:31:13 (EST)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float ;
precision highp int ;

layout (location = 0) out vec4 ocolor1 ;
layout (location = 1) out vec4 ocolor2 ;

void main(){
    ocolor1 = vec4(0.) ;
    ocolor2 = vec4(0.) ;
    return ;
}
