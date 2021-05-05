#version 300 es
/*========================================================================
 * lfgmShader   :  Fragmet Shader for Creating Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:06:02 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
uniform vec3        color ;
uniform float       visible ;
out     vec4        FragColor ;

/*=========================================================================
 * Main body
 *=========================================================================
 */
void main()
{
    FragColor = vec4(color,visible);
}
