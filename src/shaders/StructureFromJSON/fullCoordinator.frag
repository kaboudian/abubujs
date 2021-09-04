#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * crdtShader   :   calculates the coordinate of each point in 3d
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Mon 14 Aug 2017 10:35:08 AM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl

/*------------------------------------------------------------------------
 * Interface Vars.
 *------------------------------------------------------------------------
 */
in      vec2        pixPos ;
uniform float       mx, my ;

/*------------------------------------------------------------------------
 * Output
 *------------------------------------------------------------------------
 */
layout (location = 0 ) out vec4  crdt ;

/*========================================================================
 * main body 
 *========================================================================
 */
void main(){
    crdt = vec4(1.0) ;

    crdt.x = (pixPos.x - floor(pixPos.x * mx)/mx ) * mx ;
    crdt.y = (pixPos.y - floor(pixPos.y * my)/my ) * my ;

    float sliceNo = floor(pixPos.x * mx) 
                +   ( ( my-1.0) - floor(pixPos.y * my) )*mx ;

    crdt.z = sliceNo/(mx*my) ;
    return ;
}
