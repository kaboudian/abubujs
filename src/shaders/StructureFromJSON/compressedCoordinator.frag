#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * compressedCoordinator : calculate the 3d coordinate on the compressed
 * structure.
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Sat 06 Mar 2021 18:15:05 (EST)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl 

/*------------------------------------------------------------------------
 * interface variables
 *------------------------------------------------------------------------
 */
in vec2 cc ;
uniform sampler2D   full3dCrdt ;
uniform usampler2D  fullTexelIndex ;

layout (location=0) out vec4 compressed3dCrdt ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main(){
    // calculate the current texels position
    ivec2 texelPos = ivec2(cc*vec2(textureSize( fullTexelIndex, 0 ))) ;

    // index of the current texel in the full domain
    ivec4 fullTexelIndex = ivec4(
        texelFetch( fullTexelIndex, texelPos, 0)
    ) ;

    if ( fullTexelIndex.a == 1){
        // extract the coorinate of the point from the full3dCrdt 
        compressed3dCrdt = texelFetch( full3dCrdt, fullTexelIndex.xy, 0 ) ;
        return ;
    }else{
        // value for extra-no domain points
        compressed3dCrdt = vec4(-1.) ;
        return ;
    }
}
