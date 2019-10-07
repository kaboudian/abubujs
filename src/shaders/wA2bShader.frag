#version 300 es

/*========================================================================
 * wA2bShader   :  BUFFER SWAP FRAGMENT SHADER  
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:07:29 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
uniform sampler2D   map ;
in      vec2        pixPos ;
layout (location = 0 ) out     vec4        FragColor ;
/*=========================================================================
 * Main body of Buffer Swap Shader 
 *=========================================================================
 */
void main()
{
    FragColor = texture(map,pixPos) ;
}
