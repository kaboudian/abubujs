#version 300 es
#include precision.glsl

uniform float       voxelSize ;
uniform int         noVoxels;
uniform float       alpha ;

uniform sampler2D   icolor ;

uniform float       minValue ;
uniform float       maxValue ;
uniform vec4        channelMultiplier ;

uniform sampler2D   wnormals ;
uniform sampler2D   colormap ;

uniform mat4        projectionMatrix ;
uniform mat4        modelMatrix ;
uniform mat4        viewMatrix ;
uniform mat4        normalMatrix ;

uniform sampler2D   compressed3dCrdt ;
uniform sampler2D   normals ;
uniform usampler2D  compressedTexelIndex ;

uniform float       shininess ;
uniform vec4        lightColor ;
uniform float       lightAmbientTerm ;
uniform float       lightSpecularTerm ;
uniform vec3        lightDirection ;
uniform vec4        lightAmbientColor ;

uniform vec4        materialColor ;
uniform float       materialAmbientTerm ;
uniform float       materialSpecularTerm ;

uniform float cutX, cutY, cutZ, cutXDir, cutYDir, cutZDir ;

#define         PI radians(180.0)
#define v4(a)   vec4(a,a,a,1.)

out float shade ;

out vec4 color ;
void main() {
    #include cube.glsl

    int  vertId  = gl_VertexID % 36  ; 
    int  voxelId = gl_VertexID / 36 ;

    shade = 1.0 ;

    ivec2 isize = textureSize(compressed3dCrdt,        0 ) ;
    ivec2 voxelIndex = ivec2( voxelId % isize.x , voxelId / isize.x ) ;
    
    vec4 pos4 = texelFetch(compressed3dCrdt, voxelIndex, 0 ) ;

    shade =  (pos4.a > 0.5) ? 1. : 0. ;

    vec3 pos =  (pos4.xyz - vec3(0.5))*2. ; 
    vec3 ppp = pos ;

    pos += voxelSize*0.005*2.*(vertCrds[vertId]-vec3(0.5)) ; 
    

    vec4  colorin   = texelFetch(  icolor, voxelIndex, 0 ) ; 
  
    float val = dot(colorin,channelMultiplier) ;
    vec4 mcolor = val < minValue ? 
        materialColor : texture( colormap,
            vec2((val-minValue)/(maxValue-minValue),0.5) ) ;

    float trasparency = 1.0 ;
    
    vec3    surfaceNormal = texelFetch( normals, voxelIndex , 0).xyz ;

/*------------------------------------------------------------------------
 * processing cut-planes
 *------------------------------------------------------------------------
 */
   // if ( (ppp.x-cutX)*cutXDir > 0. ){
   //   shade = 0. ;
   //   surfaceNormal = max(vec3(cutXDir,0.,0.),surfaceNormal) ;
   // }
    shade = shade* ( (ppp.x-cutX)*cutXDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.y-cutY)*cutYDir<0. ? 1. : 0. ) ;
    shade = shade* ( (ppp.z-cutZ)*cutZDir<0. ? 1. : 0. ) ;

/*------------------------------------------------------------------------
 * Lighting and coloring
 *------------------------------------------------------------------------
 */
    // normal direction ..................................................
    vec3 N = normalize( 
            vec3( normalMatrix*texelFetch( wnormals, voxelIndex, 0 )  )) ;

    #define dist    (voxelSize*0.015)


    if ( length(ppp.x - cutX)<(dist)) {
        surfaceNormal = vec3(1,0.,0.)*cutXDir ;
        N = surfaceNormal ;
    }
    if ( length(ppp.y - cutY)<(dist) ){
        surfaceNormal = vec3(0.,1.,0.)*cutYDir ;
        N = surfaceNormal ;
    }
    if ( length(ppp.z - cutZ)<(dist) ){
        surfaceNormal = vec3(0.,0.,1.)*cutZDir ;
        N = surfaceNormal ;
    }

    if (val < minValue){
        if ( length(surfaceNormal)<0.99 ){
            trasparency = 0. ;
            shade = 0. ;
        }else{
            trasparency = alpha ;
            mcolor = materialColor ;
        }
    }

    N = (modelMatrix*vec4(N,1.)).xyz ;

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
      Id = lightColor * mcolor * lambertTerm;
      float specular = pow( max(dot(R, E), 0.0), shininess);
      Is = v4(lightSpecularTerm) *v4(materialSpecularTerm) 
          * specular ;
    }

    // Final fargment color takes into account all light values that
    // were computed within the fragment shader
    color = vec4(vec3(Ia + Id + Is), trasparency);

    // final vertex position .............................................
    gl_Position = projectionMatrix
        *viewMatrix
        *modelMatrix
        *vec4(pos , 1.0);
}
