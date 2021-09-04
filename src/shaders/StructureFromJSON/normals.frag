#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * normals.frag : calculate the direction of outward normal to the full
 * structure
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Wed 31 Mar 2021 12:44:17 (EDT)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl

in vec2 cc ;
uniform usampler2D fullTexelIndex, compressedTexelIndex ;
uniform int mx, my ;

layout (location = 0) out vec4 normals ;

/*========================================================================
 * getIJ: return the IJ index on the full 2d-matrix
 *========================================================================
 */
ivec2 getIJ(ivec3 idx, ivec3 size){
    int si = idx.z % mx ;
    int sj = idx.z / mx ;

    return ivec2(size.x*si + idx.x, (my-1-sj)*size.y + idx.y) ;
}

/*========================================================================
 * getIdx: get the 3d index from the IJ indices
 *========================================================================
 */
ivec3 getIdx( ivec2 IJ, ivec3 size ){
    int si = IJ.x / size.x ;
    int sj = (my - 1) - (IJ.y/size.y) ;

    return ivec3( IJ.x % size.x, IJ.y % size.y , mx*sj + si ) ;
}

/*========================================================================
 * macros 
 *========================================================================
 */
#define isInBounds( v )     (all(greaterThanEqual(v,ivec3(0))) && \
        all(lessThan(v,size)))

#define texelInDomain(I)  ( texelFetch(compressedTexelIndex,(I),\
            0).a==uint(1) )
#define inDomain( v )   (texelInDomain( getIJ(v, size) )) 
#define isNotGood(v)   (!( inDomain(v) && isInBounds( v ) ))

// the flipped direction of U ensures that the normal points out of the
// domain
#define getU(v)         (isNotGood(v) ? 1. : 0.) 

#define firstDerivative(C,D)   (getU((C)+(D))-getU((C)-(D)))  


/*========================================================================
 * main
 *========================================================================
 */
void main(){
    // get the sizes of the compressed and the full domain ...............
    ivec2 compSize = textureSize(fullTexelIndex,        0 ) ;
    ivec2 fullSize = textureSize(compressedTexelIndex,  0 ) ;

    // calculate the resolution of the full domain .......................
    ivec3 size = ivec3( fullSize.x/mx , fullSize.y/my, mx*my ) ;

    // get the textel position and full texel index ......................
    ivec2 texelPos = ivec2( cc*vec2(compSize) ) ; 
    ivec4 fullTexelIndex = 
        ivec4( texelFetch(  fullTexelIndex, texelPos, 0) ) ;

    // if the texel is extra, just leave .................................
    if ( fullTexelIndex.a != 1 ){
        normals = vec4(0.,0.,0.,-1.) ;
        return ;
    }

    // 3-dimentional index of the of texel ...............................
    ivec3 cidx = getIdx( fullTexelIndex.xy , size ) ;

    // directional vectors ...............................................
    ivec3 ii  = ivec3(1,0,0) ;
    ivec3 jj  = ivec3(0,1,0) ;
    ivec3 kk  = ivec3(0,0,1) ;

    // secondary directions ..............................................
    ivec3 sij = jj+kk ;     ivec3 sik = kk-jj ;
    ivec3 sji = ii+kk ;     ivec3 sjk = kk-ii ;
    ivec3 ski = ii+jj ;     ivec3 skj = jj-ii ;

    float dii = firstDerivative(cidx, ii  ) ;
    float djj = firstDerivative(cidx, jj  ) ;
    float dkk = firstDerivative(cidx, kk  ) ;
    float dij = firstDerivative(cidx, sij ) ;
    float dik = firstDerivative(cidx, sik ) ;
    float dji = firstDerivative(cidx, sji ) ;
    float djk = firstDerivative(cidx, sjk ) ;
    float dki = firstDerivative(cidx, ski ) ;
    float dkj = firstDerivative(cidx, skj ) ;

    float omega = 0.586 ;
    
    #define f(a)    vec3(a)

    vec3 normDir = (2.*omega+1.)*(f(ii)*dii + f(jj)*djj + f(kk)*dkk) 
        + (1.-omega)*(  f(sij)*dij + f(sik)*dik 
                    +   f(sji)*dji + f(sjk)*djk
                    +   f(ski)*dki + f(skj)*dkj )/sqrt(2.) ;
    

    normals  = vec4( normalize(normDir), 1.) ;
    return ;
}
