#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vrcClickCrdShader   :   shades the click coordinate
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 24 Aug 2017 11:49:46 AM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float; precision highp int;

/*========================================================================
 * interface variables
 *========================================================================
 */
uniform sampler2D   projectedCrds ;
uniform vec2        clickPosition ;
layout (location=0) out vec4 clickCoordinates ;

/*========================================================================
 * main body
 *========================================================================
 */
void main(){
    clickCoordinates = texture( projectedCrds , clickPosition ) ;
}
