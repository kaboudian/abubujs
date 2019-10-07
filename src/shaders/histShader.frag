#version 300 es
/*========================================================================
 * histShader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:40 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
uniform vec2        probePosition ;
uniform sampler2D   surf ;
uniform sampler2D   curv ;
uniform float       shift ;
uniform vec4        channel ;

in      vec2        pixPos ;
layout (location = 0 ) out     vec4        FragColor ;
/*=========================================================================
 * Main body 
 *=========================================================================
 */
void main()
{
    float r ;
    vec4 probVal  = texture(surf , probePosition  ) ;
    vec4 pixlVal  = texture(curv , vec2(pixPos.x+shift, pixPos.y )) ;

    vec4 fragColor ;
    fragColor.a     = pixPos.x  ;
    fragColor.rgb   = pixlVal.rgb ;
    r =    dot( probVal,channel) ;
    
    if (pixPos.x >= (1. - shift)){
        fragColor.rgb = vec3(r,r,r) ;
    }

    FragColor = fragColor;
}

