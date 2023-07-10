#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * fsurfaceViewComrpessedClickPosition.frag:
 *      This shader is designed to determine the position of the click on 
 *      a compressed data structure. This is useful for picking signals
 *      from a particular point on the data structure.
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Fri 03 Sep 2021 19:59:37 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl

/*------------------------------------------------------------------------
 * Interfacial Variables
 *------------------------------------------------------------------------
 */
uniform vec2        clickPosition ;
uniform sampler2D   projectedCoordinates ;
uniform usampler2D  compressedTexelIndex ;
uniform int         mx , my ;
uniform float       cwidth, cheight ;

/*------------------------------------------------------------------------
 * output colors
 *------------------------------------------------------------------------
 */
layout (location =0 ) out vec4 compressedClickPosition ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main(){
    // Read the coordinate of the click in the model 3D space ............
    vec3 crdt = texture( projectedCoordinates, clickPosition ).xyz ;

    // What is the size of the non-compressed texture ....................
    ivec2 fullSize = ivec2(textureSize( compressedTexelIndex, 0).xy) ;

    // resoltion of the 3D domain ........................................
    int  width = fullSize.x/mx ;
    int  height= fullSize.y/my ;
    int  depth = mx*my ;

    // figure out the index of the voxel that was picked in the three
    // dimensional space .................................................
    int i = int(floor(crdt.x*float(width  ))) ;
    int j = int(floor(crdt.y*float(height ))) ;
    int k = int(floor(crdt.z*float(depth  ))) ;

    // figure out the index of the corresponding pixel on the uncompressed
    // data structure ....................................................
    int si = k%mx ;
    int sj = k/mx ;

    int I = width*si+i ;
    int J = (my-1-sj)*height + j ;

    // determine the index of the voxel in the compressed data structure .
    uvec2 voxelCompressedIndex = texelFetch(compressedTexelIndex,
            ivec2(I,J) , 0 ).xy ;

    // determine the floating point pixel coordinate of the click point in
    // the compressed data structure .....................................
    compressedClickPosition = 
        vec4(voxelCompressedIndex.x,voxelCompressedIndex.y,0,0)/
        vec4(cwidth,cheight,cwidth,cheight) ;

    return ;
}
