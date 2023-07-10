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

uniform sampler2D   icolor ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;

uniform float       shininess;
uniform vec4        lightColor;
uniform float       lightAmbientTerm;
uniform float       lightSpecularTerm;
uniform vec3        lightDirection;

uniform float       materialAmbientTerm;
uniform float       materialSpecularTerm;

out vec4            ocolor ;

out float           shade ;

#define PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main() {
    vec3 vertCrds[36] ;
    #include cube.glsl

    int  vertId  = gl_VertexID % 36  ; 
    int  voxelId = gl_VertexID / 36 ;

    //shade = 1.0 ;

    ivec2 isize = textureSize(compressed3dCrdt,        0 ) ;
    ivec2 voxelIndex = ivec2( voxelId % isize.x , voxelId / isize.x ) ;
    
    vec4 pos4 = texelFetch(compressed3dCrdt, voxelIndex, 0 ) ;

    shade =  (pos4.a > 0.5) ? 1. : 0. ;

    vec3 pos =  (pos4.xyz - vec3(0.5))*2. ; 
    pos += voxelSize*0.005*2.*(vertCrds[vertId]-vec3(0.5)) ; 

    vec4  color   = texelFetch(  icolor, voxelIndex, 0 ) ; 
   
    vec4 materialColor = color.r < 0.1 ? 
        vec4(vec3(0.8),1.) : vec4(0.,color.r,0.1,1.) ;

    materialColor = mix(vec4(0.,0.,1.0,1.),vec4(1.,1.,0.,1.), color.r) ;

    if (color.r < 0.1){
         shade = shade*0. ;
    }
/*------------------------------------------------------------------------
 * Lighting and coloring
 *------------------------------------------------------------------------
 */
    // normal direction ..................................................
    vec3 N = normalize( 
            vec3( normalMatrix*texelFetch( normals, voxelIndex, 0 )  )) ;
    
    // eye vector ........................................................
    vec3 E = normalize(-(viewMatrix*modelMatrix*vec4(pos,1.)).xyz) ;

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
      Id = lightColor * materialColor * lambertTerm;
      float specular = pow( max(dot(R, E), 0.0), shininess);
      Is = v4(lightSpecularTerm) *v4(materialSpecularTerm) 
          * specular ;
    }

    // Final fargment color takes into account all light values that
    // were computed within the fragment shader
    ocolor = vec4(vec3(Ia + Id + Is), 1.0);

    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}
