#version 300 es
/*========================================================================
 * vertShader   :  Default Vertex Shader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:07:21 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface variables
 *========================================================================
 */
in  vec3 position;

out vec2 pixPos ;
out vec2 pixelPosition ;
out vec2 cc ;

out vec3 pixCrd ;

/*=========================================================================
 * Main body of the vertex shader
 *=========================================================================
 */
void main()
{   
    cc = position.xy ;
    pixPos = position.xy ;
    pixelPosition = pixPos ;
    pixCrd = position.xyz ;
    gl_Position = vec4(position.xy*2.-vec2(1.),0.,1.0);
}

