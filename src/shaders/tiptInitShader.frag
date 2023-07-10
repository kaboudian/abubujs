#version 300 es

/*========================================================================
 * tiptInitShader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 03 Aug 2017 05:06:52 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
precision highp float; precision highp int;

/*========================================================================
 * Interface Variables
 *========================================================================
 */
in      vec2    pixPos ;
layout (location=0) out     vec4    ftipt ;
layout (location=1) out     vec4    stipt ;
/*=========================================================================
 * main
 *=========================================================================
 */
void main(){
    ftipt = vec4(0.,0.,0.,0.) ;
    stipt = vec4(0.,0.,0.,0.) ;
    return ;
}

