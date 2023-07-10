#version 300 es
/*========================================================================
 * ipltShader   : Fragmet Shader for Initializing Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:05:50 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
in      vec2    pixPos ;
uniform float   restValue ;

layout (location = 0 ) out  vec4    FragColor1 ;
layout (location = 1 ) out  vec4    FragColor2 ;

/*=========================================================================
 * Main body of ipltShader
 *=========================================================================
 */
void main()
{
    float r = restValue ;
    FragColor1 = vec4(r,r,r,1.0) ;
    FragColor2 = vec4(r,r,r,1.0) ;
}
