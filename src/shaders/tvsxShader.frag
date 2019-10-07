#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * tvsxShader   :   create a time vs x graph
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 26 Sep 2018 18:05:11 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;

in vec2             pixPos ;

uniform sampler2D   inText, inTvsx , ttex ;
uniform vec4        rgba0 ;
uniform float       timeWindow ;
uniform float       yLevel ;
layout  (location = 0) out vec4 outTvsx ;
uniform bool        refresh ;

void main(){
    outTvsx = texture( inTvsx , pixPos ) ;
    float   t       = texture( ttex, vec2(0.5) ).r/timeWindow ;
    float   dt      = 1./vec2(textureSize( inTvsx, 0 )).x ;
    
    if (abs(t-pixPos.y)<= dt ){
        outTvsx = texture(inText, vec2(pixPos.x,yLevel)) ;
    }
    if (t<dt && refresh){
        outTvsx = rgba0 ;
    }
    return ;
}
