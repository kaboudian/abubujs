#version 300 es
/*========================================================================
 * lvtxShader   : Shader for Creating Plots
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:06:21 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*-------------------------------------------------------------------------
 * Varying variables must be defined here
 *-------------------------------------------------------------------------
 */
out     vec2        pixPos ;
uniform sampler2D   map ;
uniform float       minValue ;
uniform float       maxValue ;
in      vec4        position;

/*=========================================================================
 * Main body of the vertex shader
 *=========================================================================
 */
void main()
{
    float  amp = maxValue-minValue ;
    pixPos = position.xy ;   /* uv.x, uv.y is always in [0,1.0] */
    vec4 point = texture(map, position.xy ) ;
    vec2 pos ;
    pos.x  = point.a ;
    pos.y  = (point.r-minValue)/amp ;
    //pos.x = position.x ;
    gl_Position = vec4(pos.x*2.-1., pos.y*2.-1.,0., 1.0) ;
}

