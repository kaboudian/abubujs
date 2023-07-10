#version 300 es
/*========================================================================
 * lpvtShader   :   Vertex Shader for Creating Line/Curve Plots
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
uniform vec2        xrange ;
uniform vec2        yrange ;
uniform vec4        channelMultiplier ;

in      vec4        position;

/*=========================================================================
 * Main body of the vertex shader
 *=========================================================================
 */
void main()
{
    pixPos = position.xy ;   /* uv.x, uv.y is always in [0,1.0] */
    vec4 mapVal = texture(map, position.xy ) ;
    vec2 pos ;
    float   yval    = dot(mapVal, channelMultiplier) ;
    float   xval ;
    yval            = (yval-yrange.x)/(yrange.y - yrange.x) ;
    xval            = position.x*(xrange.y-xrange.x)+xrange.x ;
    gl_Position     = vec4(xval*2.-1., yval*2.-1.,0., 1.0) ;
    return ;
}
