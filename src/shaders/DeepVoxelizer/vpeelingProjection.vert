#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * 
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Wed 31 Mar 2021 19:06:52 (EDT)
 * PLACE        : Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */

#include precision.glsl 

uniform float       voxelSize ;
uniform int         noVoxels ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform float       cutX, cutY, cutZ, cutXDir, cutYDir, cutZDir ;

uniform sampler2D   compressed3dCrdt ;

out vec3            ocolor ;

out float           shade ;

#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {
    #include cube.glsl

    int  vertId  = gl_VertexID % 36  ; 
    int  voxelId = gl_VertexID / 36 ;

    //shade = 1.0 ;

    ivec2 isize = textureSize(compressed3dCrdt,        0 ) ;
    ivec2 voxelIndex = ivec2( voxelId % isize.x , voxelId / isize.x ) ;
    
    vec4 pos4 = texelFetch(compressed3dCrdt, voxelIndex, 0 ) ;
    
    shade =  (pos4.a > 0.5) ? 1. : 0. ;

    vec3 pos =  (pos4.xyz - vec3(0.5))*2. ; 
    vec3 ppp = pos ;
    pos += voxelSize*0.005*2.*(vertCrds[vertId]-vec3(0.5)) ; 
    
    shade = shade* ( (ppp.x-cutX)*cutXDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.y-cutY)*cutYDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.z-cutZ)*cutZDir<0. ? 1. : 0. ) ;

    ocolor = pos4.xyz;

    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}

