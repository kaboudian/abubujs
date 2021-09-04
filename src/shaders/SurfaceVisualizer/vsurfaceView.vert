#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * vsurfaceView.vert : vertex shader used in the surface visualizer
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Fri 03 Sep 2021 17:33:09 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl

/*------------------------------------------------------------------------
 * interface variables
 *------------------------------------------------------------------------
 */
in vec2             indices ;
uniform sampler2D   icolor ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform float       minValue ;
uniform float       maxValue ;
uniform vec4        channelMultiplier ;
uniform sampler2D   colormap ;
uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;
uniform usampler2D  compressedTexelIndex ;

uniform float       shininess;
uniform vec4        lightColor;
uniform float       lightAmbientTerm;
uniform float       lightSpecularTerm;
uniform vec3        lightDirection;

uniform float       materialAmbientTerm;
uniform float       materialSpecularTerm;

/*------------------------------------------------------------------------
 * macros 
 *------------------------------------------------------------------------
 */
#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*------------------------------------------------------------------------
 * outputs to the fragment shader 
 *------------------------------------------------------------------------
 */
out vec3 N ;
out vec3 E ;
out vec4 color ;
out vec3 position ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {
    ivec2 uncompSize = textureSize( compressedTexelIndex, 0 ) ;
    ivec2 voxelIndex = 
        ivec2(texelFetch(compressedTexelIndex, ivec2(indices), 0).xy) ;
    
    position = texelFetch(compressed3dCrdt , voxelIndex, 0 ).xyz ;
    
    vec3 pos = (position - vec3(0.5))*2. ; 
    color = texelFetch(  icolor, voxelIndex, 0 ) ; 

/*------------------------------------------------------------------------
 * Lighting and coloring
 *------------------------------------------------------------------------
 */
    // normal direction ..................................................
    N = normalize( 
            vec3( normalMatrix*texelFetch( normals, voxelIndex, 0 )  )) ;
    
    // eye vector ........................................................
    E = normalize(-(viewMatrix*modelMatrix*vec4(pos,1.)).xyz) ;

    
    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}
