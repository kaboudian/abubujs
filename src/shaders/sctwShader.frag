#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * sctwShader   :  scales the time window
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 02:07:45 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

in vec2     pixPos ;

uniform sampler2D   map ;
uniform float       oldWindow ;
uniform float       newWindow ;

layout (location =0 ) out vec4 FragColor ;

void main(){
    float   scale = newWindow/oldWindow ;
    float   x   = pixPos.x-(1.- 1./scale) ;
    x *= scale ;
    
    FragColor = texture( map, vec2(x,0.5)) ;
    return ;
}
