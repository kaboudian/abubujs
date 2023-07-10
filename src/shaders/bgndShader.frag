#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * bgndShader   :   COLOR BACGROUNDS
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:01 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*-------------------------------------------------------------------------
 * Varying variables
 *-------------------------------------------------------------------------
 */
in vec2        pixPos ;
uniform sampler2D   bgrnd ;
uniform vec3        color ;
out vec4 FragColor ;

/*=========================================================================
 * Main body
 *=========================================================================
 */
void main()
{    
    vec4    crvc = texture(bgrnd, pixPos ) ;

    FragColor = mix(vec4(color,1.0),crvc, crvc.a ) ;
}
