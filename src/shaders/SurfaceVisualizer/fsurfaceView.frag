#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * fsurfaceView.frag : fragment shader for surface visualization
 *
 * PROGRAMMER   : ABOUZAR KABOUDIAN
 * DATE         : Fri 03 Sep 2021 17:37:47 (EDT)
 * PLACE        : Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl

/*------------------------------------------------------------------------
 * interfacial variables
 *------------------------------------------------------------------------
 */
uniform sampler2D icolor ;

uniform float       minValue ;
uniform float       maxValue ;
uniform vec4        channelMultiplier ;
uniform sampler2D   colormap ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;
uniform usampler2D  compressedTexelIndex ;

uniform float       shininess;
uniform vec4        lightColor;
uniform float       lightAmbientTerm;
uniform float       lightSpecularTerm;
uniform vec3        lightDirection;
uniform vec4        lightAmbientColor ;

uniform vec4        materialColor ;
uniform float       materialAmbientTerm;
uniform float       materialSpecularTerm;

/*------------------------------------------------------------------------
 * input from the vertex shader
 *------------------------------------------------------------------------
 */
in vec3 position ;
in vec4 color ;
in vec3 N ;
in vec3 E ;

/*------------------------------------------------------------------------
 * macros 
 *------------------------------------------------------------------------
 */
#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*------------------------------------------------------------------------
 * output of the shader
 *------------------------------------------------------------------------
 */
layout (location = 0 ) out vec4 projectedColors ;
layout (location = 1 ) out vec4 projectedCoordinates ;

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {

    float val =
        (dot(color,channelMultiplier)-minValue)/(maxValue-minValue) ;
   
    vec4 mcolor = val > 0. ? texture(colormap , vec2(val,0.5) ) :
        materialColor ;
   // vec4 materialColor = color.r < 0.1 ? 
   //     vec4(vec3(0.95),1.) : vec4(0.,color.r,0.1,1.) ;

    // light direction ...................................................
    vec3 L = normalize(lightDirection) ;

    // reflection direction ..............................................
    vec3 R = reflect(L,N) ;
    float lambertTerm = dot(N,-L) ;

    // AmbientTerm .......................................................
    vec4 Ia = v4(lightAmbientTerm) * v4(materialAmbientTerm);

    // Diffuse ...........................................................
    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);

    // SpecularTerm ......................................................
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    // calculating final color ...........................................
    if (lambertTerm > 0.0) {
      Id = lightColor * mcolor * lambertTerm;
      float specular = pow( max(dot(R, E), 0.0), shininess);
      Is = v4(lightSpecularTerm) *v4(materialSpecularTerm) 
          * specular ;
    }

    // Final fargment color takes into account all light values that
    // were computed within the fragment shader
    projectedColors         = vec4( vec3(Ia + Id + Is), 1.0     ) ;

    // position of the projected voxel used in picking the click positions
    projectedCoordinates    = vec4( position ,          1.0     ) ;
}
